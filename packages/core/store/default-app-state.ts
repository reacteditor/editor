import { defaultViewports } from "../components/ViewportControls/default-viewports";
import { PrivateAppState } from "../types/Internal";

export const defaultAppState: PrivateAppState = {
  data: { content: [], root: {}, zones: {} },
  ui: {
    leftSideBarVisible: true,
    rightSideBarVisible: true,
    canvasFullScreen: false,
    arrayState: {},
    itemSelector: null,
    componentList: {},
    isDragging: false,
    previewMode: "edit",
    viewports: {
      // Default to the tablet viewport (the middle option) so the canvas
      // opens at a comfortable preview width on most screens.
      current: { width: 768, height: "auto" },
      options: [],
      controlsVisible: true,
    },
    field: { focus: null },
    plugin: { current: null },
  },
  indexes: {
    nodes: {},
    zones: {},
  },
};
