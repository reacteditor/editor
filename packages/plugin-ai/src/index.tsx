import type { Plugin } from "@reacteditor/core";
import type { AiPluginOptions } from "./types";
import { ChatPanel } from "./panel/ChatPanel";
import { ChatAiIcon } from "./panel/ChatAiIcon";

export type { AiPluginOptions, RenderToolParams, ToolRenderState } from "./types";
export { DEFAULT_LABELS, labelFor, humanize } from "./tools/labels";

export const aiPlugin = (options: AiPluginOptions): Plugin => ({
  name: "ai",
  label: "AI",
  icon: <ChatAiIcon />,
  render: () => <ChatPanel options={options} />,
});

export default aiPlugin;
