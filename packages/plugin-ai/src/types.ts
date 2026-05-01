import type { ReactNode } from "react";
import type { UIMessage, ChatTransport, ChatOnToolCallCallback } from "ai";

type OnToolCallEvent = Parameters<ChatOnToolCallCallback<UIMessage>>[0];

export type ToolRenderState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error";

export type RenderToolParams = {
  name: string;
  state: ToolRenderState;
  input: unknown;
  output: unknown;
};

export type AiPluginOptions = {
  api: string;
  headers?:
    | Record<string, string>
    | (() => Record<string, string> | Promise<Record<string, string>>);
  body?:
    | Record<string, unknown>
    | ((messages: UIMessage[]) => Record<string, unknown>);
  transport?: ChatTransport<UIMessage>;
  onFinish?: (event: { message: UIMessage }) => void;
  onError?: (error: Error) => void;
  onToolCall?: (
    event: OnToolCallEvent
  ) => unknown | Promise<unknown> | undefined;
  messages?: UIMessage[];

  /**
   * Enable file attachments on the chat input. When `true`, a paperclip
   * button is shown next to the textarea that opens an image-only file
   * picker. Selected files are sent with the next message via the AI SDK's
   * sendMessage({ files }) API. Default: `false`.
   */
  attachments?: boolean;

  /**
   * Optional renderer for tool-call parts. Called for every `tool-*` part
   * the model emits. Return a ReactNode to override the default rendering
   * (shimmer "<name>..." while in flight, muted "<name>" once done) for a
   * specific tool name + state. Return undefined to fall through to the
   * default rendering.
   *
   * Receives the tool name (without the `tool-` prefix), the current state
   * ("input-streaming", "input-available", "output-available",
   * "output-error"), the model's `input` arguments, and the tool's `output`
   * once available.
   */
  renderTool?: (params: RenderToolParams) => ReactNode | undefined;

  /**
   * Optional callback resolving the editor's current route. Invoked on each
   * outgoing request and forwarded to the server as `editorContext.currentRoute`,
   * which the default system prompt uses to ground responses. Return `null`
   * (or omit the callback) to send no route info.
   */
  getCurrentRoute?: () =>
    | { path?: string; title?: string }
    | null
    | undefined;
};

export type EditorContextPayload = {
  currentRoute: { path?: string; title?: string } | null;
  selectedComponentId: string | null;
  componentTypes: string[];
};
