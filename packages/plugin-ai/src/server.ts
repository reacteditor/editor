import { tool } from "ai";
import { schemas, descriptions, BUILTIN_NAMES } from "./tools/definitions";
import type { EditorContextPayload } from "./types";

// Tool definitions registered with the model. Intentionally no `execute`
// here — they are client-side tools, executed by the plugin in the browser
// via useChat's onToolCall handler. Each entry is constructed individually
// so its `inputSchema` keeps its concrete zod type (Object.fromEntries
// otherwise widens the union and trips tool()'s overload resolution).
export const reactEditorTools = BUILTIN_NAMES.reduce(
  (acc, name) => {
    acc[name] = tool({
      description: descriptions[name],
      inputSchema: schemas[name] as never,
    });
    return acc;
  },
  {} as Record<string, ReturnType<typeof tool>>
);

// Formats the auto-injected editorContext payload into a compact system
// prompt block. Use as `system: getEditorContext(editorContext)`, optionally
// concatenating with your own prompt.
export const getEditorContext = (
  ctx: EditorContextPayload | undefined
): string => {
  if (!ctx) return "";
  const lines: string[] = ["You are an assistant embedded in a visual page editor."];
  if (ctx.currentRoute?.path) {
    lines.push(
      `Current route: ${ctx.currentRoute.path}${
        ctx.currentRoute.title ? ` ("${ctx.currentRoute.title}")` : ""
      }`
    );
  }
  if (ctx.selectedComponentId) {
    lines.push(`Selected component id: ${ctx.selectedComponentId}`);
  }
  if (ctx.componentTypes?.length) {
    lines.push(`Available component types: ${ctx.componentTypes.join(", ")}`);
  }
  lines.push(
    "Call getConfig() before adding or updating components so you write valid props.",
    "Call getSchema() to read the current document.",
    "Mutations (updateComponent, addComponent, etc.) commit one undo step each."
  );
  return lines.join("\n");
};
