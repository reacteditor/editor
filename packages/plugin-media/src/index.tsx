import type { Plugin } from "@reacteditor/core";
import type { MediaPluginOptions } from "./types";
import { MediaPanel } from "./panel/MediaPanel";
import { MediaIcon } from "./panel/MediaIcon";

export type {
  MediaAdapter,
  MediaItem,
  MediaPage,
  MediaPluginOptions,
} from "./types";

export const mediaPlugin = (options: MediaPluginOptions): Plugin => ({
  name: "media",
  label: "Media",
  icon: <MediaIcon />,
  render: () => <MediaPanel options={options} />,
});

export default mediaPlugin;
