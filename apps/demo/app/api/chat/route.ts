import { anthropic } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import {
  reactEditorTools,
  getEditorContext,
} from "@reacteditor/plugin-ai/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  messages: UIMessage[];
  editorContext?: Parameters<typeof getEditorContext>[0];
};

// Demo-only mock: server-side tool that returns a static image URL
// regardless of the prompt. The demo renders the result inline via renderTool.
const generateImage = tool({
  description: "Generate an image from a prompt and return its URL.",
  inputSchema: z.object({
    prompt: z.string().describe("Description of the image to generate."),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
  }),
  execute: async ({ width = 512, height = 512 }) => {
    return {
      url: `https://picsum.photos/${width}/${height}?random=${Math.floor(
        Math.random() * 1_000_000
      )}`,
    };
  },
});

export async function POST(req: Request) {
  const { messages, editorContext } = (await req.json()) as Body;

  const result = streamText({
    model: anthropic("claude-sonnet-4-5"),
    system: getEditorContext(editorContext),
    messages: await convertToModelMessages(messages),
    tools: { ...reactEditorTools, generateImage },
    // Lets the model loop through tool calls + their results in a single
    // request instead of stopping after the first tool call.
    stopWhen: stepCountIs(50),
  });

  return result.toUIMessageStreamResponse();
}
