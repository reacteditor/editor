import { ItemSelector } from "../lib/data/get-item";
import { Viewport } from "./API";
import { Data } from "./Data";

export type ItemWithId = {
  _arrayId: string;
  _originalIndex: number;
  _currentIndex: number;
};

export type ArrayState = { items: ItemWithId[]; openId: string };

/**
 * Static UI chrome flags. Mount-once: read when <Editor>/<App> mounts and
 * never re-evaluated. They decide whether a chrome element exists at all.
 * Distinct from runtime `*Visible` keys in `UiState`, which the user toggles
 * via the UI (sidebars, fullscreen). All default to `true`. If all three
 * BrowserBar flags (`showUrlBar`, `showDeviceToggle`, `showFullScreenToggle`)
 * are `false`, the browser bar collapses entirely.
 */
export type EditorChromeConfig = {
  showNavBar: boolean;
  showThemeToggle: boolean;
  showHistoryControls: boolean;
  showUrlBar: boolean;
  showDeviceToggle: boolean;
  showFullScreenToggle: boolean;
};

export type UiState = {
  leftSideBarVisible: boolean;
  rightSideBarVisible: boolean;
  leftSideBarWidth?: number | null;
  rightSideBarWidth?: number | null;
  /** Runtime: when true, the canvas overlays the entire editor area
   *  (sidebars stay mounted underneath). Toggled by the BrowserBar fullscreen
   *  button. Distinct from the static `fullScreenCanvas` Editor prop, which
   *  removes canvas padding for a chromeless render. */
  canvasFullScreen?: boolean;
  mobilePanelExpanded?: boolean;
  itemSelector: ItemSelector | null;
  arrayState: Record<string, ArrayState | undefined>;
  previewMode: "interactive" | "edit";
  componentList: Record<
    string,
    {
      components?: string[];
      title?: string;
      visible?: boolean;
      expanded?: boolean;
    }
  >;
  isDragging: boolean;
  viewports: {
    current: {
      width: number | "100%";
      height: number | "auto";
    };
    controlsVisible: boolean;
    options: Viewport[];
  };
  field: { focus?: string | null; metadata?: Record<string, any> };
  plugin: {
    current: string | null;
  };
};

export type AppState<UserData extends Data = Data> = {
  data: UserData;
  ui: UiState;
};
