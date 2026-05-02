/* eslint-disable @next/next/no-img-element */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  Fragment,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  type UIMessage,
} from "ai";
import { ArrowDown, CornerDownLeft, Plus, X } from "lucide-react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { useGetEditor } from "@reacteditor/core";
import type {
  AiPluginOptions,
  EditorContextPayload,
  ToolRenderState,
} from "../types";
import { callBuiltin } from "../tools/handlers";
import { labelFor } from "../tools/labels";
import { ChatAiIcon } from "./ChatAiIcon";
import { Loader } from "./Loader";
import { LoadingDots } from "./LoadingDots";
import { Markdown } from "./Markdown";
import styles from "./styles.module.css";

const collectEditorContext = (
  getEditor: ReturnType<typeof useGetEditor>,
  currentRoute: { path?: string; title?: string } | null
): EditorContextPayload => {
  const editor = getEditor();
  return {
    currentRoute,
    selectedComponentId: editor.selectedItem?.props?.id ?? null,
    componentTypes: Object.keys(editor.config.components ?? {}),
  };
};

export const ChatPanel = ({ options }: { options: AiPluginOptions }) => {
  const getEditor = useGetEditor();

  const transport = useMemo(() => {
    if (options.transport) return options.transport;
    return new DefaultChatTransport({
      api: options.api ?? "/api/chat",
      credentials: options.credentials,
      headers: options.headers,
      // body is a function of the message list — re-evaluated each request,
      // so editorContext always reflects the current editor state.
      body: () => {
        const route = options.getCurrentRoute?.() ?? null;
        const editorContext = collectEditorContext(getEditor, route);
        return { editorContext, ...(options.body ?? {}) };
      },
    });
  }, [options, getEditor]);

  const {
    messages,
    sendMessage,
    addToolOutput,
    status,
    error,
    stop,
  } = useChat({
    transport,
    messages: options.messages,
    // Re-issues the request once every client tool call on the last
    // assistant message has its output. Without this the model stops after
    // emitting tool calls and never sees the results. Pairs with stopWhen
    // on the server (which controls the per-request loop ceiling).
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onFinish: options.onFinish,
    onError: options.onError,
    onToolCall: async ({ toolCall }) => {
      // Stage 1: user-supplied interceptor wins if it returns a defined value.
      if (options.onToolCall) {
        const result = await options.onToolCall({ toolCall, getEditor });
        if (result !== undefined) {
          // The AI SDK explicitly recommends calling addToolOutput without
          // await here to avoid a deadlock with the streaming loop.
          addToolOutput({
            tool: toolCall.toolName,
            toolCallId: toolCall.toolCallId,
            output: result,
          });
          return;
        }
      }

      // Stage 2: built-in handlers run inside the editor store.
      const editor = getEditor();
      const output = await callBuiltin(
        toolCall.toolName,
        toolCall.input,
        { getEditor, dispatch: editor.dispatch }
      );
      if (output !== undefined) {
        addToolOutput({
          tool: toolCall.toolName,
          toolCallId: toolCall.toolCallId,
          output,
        });
      }
    },
  });

  const [input, setInput] = useState("");

  // Local image attachments. Each gets a blob URL for preview; revoked on
  // remove and on unmount to avoid leaks.
  const [attached, setAttached] = useState<
    { id: string; file: File; url: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(
    () => () => {
      attached.forEach((a) => URL.revokeObjectURL(a.url));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const addFiles = useCallback((files: FileList | File[]) => {
    const incoming = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!incoming.length) return;
    setAttached((prev) => [
      ...prev,
      ...incoming.map((file) => ({
        id: `${file.name}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setAttached((prev) => {
      const found = prev.find((f) => f.id === id);
      if (found) URL.revokeObjectURL(found.url);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || status === "streaming") return;
      // sendMessage expects a FileList; build one from our File[] via
      // DataTransfer so the AI SDK can base64-encode them for transit.
      let files: FileList | undefined;
      if (attached.length) {
        const dt = new DataTransfer();
        attached.forEach((a) => dt.items.add(a.file));
        files = dt.files;
      }
      sendMessage({ text: trimmed, files });
      setInput("");
      attached.forEach((a) => URL.revokeObjectURL(a.url));
      setAttached([]);
    },
    [sendMessage, status, input, attached]
  );

  const onFilesPicked = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget.files?.length) addFiles(e.currentTarget.files);
      e.currentTarget.value = "";
    },
    [addFiles]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Enter submits, Shift+Enter inserts a newline.
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        e.currentTarget.form?.requestSubmit();
      }
    },
    []
  );

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className={styles.AiPanel}>
      <StickToBottom
        className={styles["AiPanel-messages"]}
        initial="smooth"
        resize="smooth"
        role="log"
      >
        <StickToBottom.Content className={styles["AiPanel-messagesContent"]}>
          {messages.length === 0 ? (
            <div className={styles["AiPanel-empty"]}>
              <div className={styles["AiPanel-empty-icon"]}>
                <ChatAiIcon size={28} />
              </div>
              <div className={styles["AiPanel-empty-text"]}>
                Ask AI to update your site
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <Message key={m.id} message={m} renderTool={options.renderTool} />
            ))
          )}

          {isLoading && needsThinkingHint(messages) && (
            <div className={styles["AiPanel-toolCall"]}>Thinking...</div>
          )}
        </StickToBottom.Content>

        <ScrollToBottomButton />
      </StickToBottom>

      {error && (
        <div className={styles["AiPanel-error"]}>
          {error.message ?? "Something went wrong."}
        </div>
      )}

      {isLoading && <LoadingDots />}

      <form className={styles["AiPanel-form"]} onSubmit={onSubmit}>
        <div className={styles["AiPanel-inputGroup"]}>
          {attached.length > 0 && (
            <div className={styles["AiPanel-attachments"]}>
              {attached.map((a) => (
                <div key={a.id} className={styles["AiPanel-attachment"]}>
                  <img
                    src={a.url}
                    alt={a.file.name}
                    className={styles["AiPanel-attachment-img"]}
                  />
                  <button
                    type="button"
                    aria-label={`Remove ${a.file.name}`}
                    className={styles["AiPanel-attachment-remove"]}
                    onClick={() => removeFile(a.id)}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <textarea
            className={styles["AiPanel-input"]}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Message…"
            rows={2}
            disabled={isLoading}
          />
          <div className={styles["AiPanel-inputGroup-actions"]}>
            <div className={styles["AiPanel-inputGroup-actions-left"]}>
              {options.attachments && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className={styles["AiPanel-fileInput"]}
                    onChange={onFilesPicked}
                  />
                  <button
                    type="button"
                    aria-label="Attach images"
                    className={styles["AiPanel-attach"]}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <Plus size={16} />
                  </button>
                </>
              )}
            </div>
            <button
              className={styles["AiPanel-send"]}
              type={isLoading ? "button" : "submit"}
              aria-label={isLoading ? "Stop" : "Send"}
              onClick={isLoading ? () => stop() : undefined}
              disabled={!isLoading && !input.trim() && attached.length === 0}
            >
              {isLoading ? <Loader size={14} /> : <CornerDownLeft />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const Message = ({
  message,
  renderTool,
}: {
  message: UIMessage;
  renderTool: AiPluginOptions["renderTool"];
}) => {
  const isUser = message.role === "user";
  return (
    <div
      className={`${styles["AiPanel-message"]} ${
        isUser ? styles["AiPanel-message--user"] : ""
      }`}
    >
      {/* Text + tool parts first... */}
      {message.parts.map((part, i) => {
        if (part.type === "text") {
          return (
            <div key={i} className={styles["AiPanel-message-bubble"]}>
              <Markdown text={part.text} />
            </div>
          );
        }
        if (part.type.startsWith("tool-")) {
          const toolName = part.type.slice("tool-".length);
          const partAny = part as {
            input?: unknown;
            state?: string;
            output?: unknown;
          };
          const args = partAny.input;
          const isActive = partAny.state !== "output-available";

          // Consumer escape hatch — overrides default rendering for any
          // tool name + state. Returning undefined falls through.
          const custom = renderTool?.({
            name: toolName,
            state: (partAny.state ?? "input-streaming") as ToolRenderState,
            input: args,
            output: partAny.output,
          });
          if (custom !== undefined) {
            return <Fragment key={i}>{custom}</Fragment>;
          }

          // Default: shimmer while in flight, static muted line once done.
          return (
            <div
              key={i}
              className={
                isActive
                  ? styles["AiPanel-toolCall"]
                  : styles["AiPanel-toolCall-done"]
              }
            >
              {labelFor(toolName, args, !isActive)}
            </div>
          );
        }
        return null;
      })}

      {/* ...then file parts: image attachments render below the bubble. */}
      {message.parts.map((part, i) => {
        const p = part as {
          type: string;
          mediaType?: string;
          url?: string;
          filename?: string;
        };
        if (p.type !== "file") return null;
        if (!p.mediaType?.startsWith("image/") || !p.url) return null;
        return (
          <img
            key={`file-${i}`}
            src={p.url}
            alt={p.filename ?? "Attachment"}
            className={styles["AiPanel-userImage"]}
          />
        );
      })}
    </div>
  );
};

const ScrollToBottomButton = () => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();
  if (isAtBottom) return null;
  return (
    <button
      type="button"
      aria-label="Scroll to bottom"
      className={styles["AiPanel-scrollDown"]}
      onClick={() => scrollToBottom()}
    >
      <ArrowDown size={14} />
    </button>
  );
};

// True when no tool/text parts are present yet on the latest assistant
// message — i.e. the brief gap between submit and the first stream chunk.
// Once any part lands (a text token or a tool call), the inline shimmer
// already conveys activity and a separate "Thinking..." line would dupe it.
const needsThinkingHint = (messages: UIMessage[]) => {
  const last = messages[messages.length - 1];
  if (!last || last.role !== "assistant") return true;
  return (last.parts ?? []).every(
    (p) => p.type !== "text" && !p.type.startsWith("tool-")
  );
};
