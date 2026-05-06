import { getBox } from "css-box-model";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { useAppStore, useAppStoreApi } from "../../../../store";
import { DeviceToggle, FullScreenToggle } from "../../../BrowserBar";
import styles from "./styles.module.css";
import { useChromeConfig } from "../..";
import { getClassNameFactory } from "../../../../lib";
import { Preview } from "../Preview";
import { Loader } from "../../../Loader";
import { IconButton } from "../../../IconButton";
import { useShallow } from "zustand/react/shallow";
import { useCanvasFrame } from "../../../../lib/frame-context";
import { usePropsContext } from "../..";
import { defaultViewports } from "../../../ViewportControls/default-viewports";

const getClassName = getClassNameFactory("EditorCanvas", styles);

const ZOOM_STEP = 0.15;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;

const TRANSITION_DURATION = 150;

type CanvasProps = {
  theme?: "light" | "dark";
  themeIcon?: ReactNode;
  themeLabel?: string;
  onToggleTheme?: () => void;
};

export const Canvas = ({
  themeIcon,
  themeLabel,
  onToggleTheme,
}: CanvasProps = {}) => {
  const { frameRef } = useCanvasFrame();
  const chrome = useChromeConfig();

  const {
    viewports: viewportOptions = defaultViewports,
    ui: uiProp,
    disableZoomControls,
  } = usePropsContext();

  const {
    dispatch,
    overrides,
    setUi,
    zoomConfig,
    setZoomConfig,
    status,
    iframe,
    fullScreenCanvas,
  } = useAppStore(
    useShallow((s) => ({
      dispatch: s.dispatch,
      overrides: s.overrides,
      setUi: s.setUi,
      zoomConfig: s.zoomConfig,
      setZoomConfig: s.setZoomConfig,
      status: s.status,
      iframe: s.iframe,
      fullScreenCanvas: s.fullScreenCanvas,
    }))
  );
  const viewports = useAppStore((s) => s.state.ui.viewports);
  const canvasFullScreen = useAppStore(
    (s) => s.state.ui.canvasFullScreen ?? false
  );

  const [canvasZoom, setCanvasZoom] = useState(1);

  const zoomIn = () => setCanvasZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM));
  const zoomOut = () =>
    setCanvasZoom((z) => Math.max(z - ZOOM_STEP, MIN_ZOOM));
  const resetZoom = () => setCanvasZoom(1);

  const [showTransition, setShowTransition] = useState(false);
  const isResizingRef = useRef(false);

  const defaultRender = useMemo<
    React.FunctionComponent<{ children?: ReactNode }>
  >(() => {
    const EditorDefault = ({ children }: { children?: ReactNode }) => (
      <>{children}</>
    );

    return EditorDefault;
  }, []);

  const CustomPreview = useMemo(
    () => overrides.preview || defaultRender,
    [overrides]
  );

  const getFrameDimensions = useCallback(() => {
    if (frameRef.current) {
      const frame = frameRef.current;

      const box = getBox(frame);

      return { width: box.contentBox.width, height: box.contentBox.height };
    }

    return { width: 0, height: 0 };
  }, [frameRef]);

  // Keep zoom at 100% and constrain root height to frame
  useEffect(() => {
    const { height: frameHeight } = getFrameDimensions();

    if (viewports.current.height === "auto") {
      setZoomConfig({ ...zoomConfig, zoom: 1, rootHeight: frameHeight });
    }
  }, [getFrameDimensions, setZoomConfig, viewports.current.height]);

  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowLoader(true);
    }, 500);
  }, []);

  const appStoreApi = useAppStoreApi();

  // Cleared once the user explicitly picks a viewport, so resize-driven
  // auto-detection won't override their choice.
  const autoSelectingRef = useRef(true);

  const pickClosestViewport = useCallback(() => {
    if (typeof window === "undefined") return null;

    const viewportWidth = window.innerWidth;
    const frameWidth = frameRef.current?.getBoundingClientRect().width;

    if (!viewportWidth) return null;
    if (!frameWidth) return null;
    if (viewportOptions.length === 0) return null;

    const fullWidthViewport = Object.values(viewportOptions).find(
      (v) => v.width === "100%"
    );

    const viewportDifferences = Object.entries(viewportOptions)
      .filter(([_, value]) => value.width !== "100%")
      .map(([key, value]) => ({
        key,
        diff: Math.abs(
          viewportWidth -
            (typeof value.width === "string" ? viewportWidth : value.width)
        ),
        value,
      }))
      .sort((a, b) => (a.diff > b.diff ? 1 : -1));

    let closestViewport = viewportDifferences[0]?.value;
    if (!closestViewport) return null;

    // Select full width viewport if it exists, and the closest viewport is smaller than the window
    if (
      (closestViewport.width as number) < frameWidth &&
      fullWidthViewport
    ) {
      closestViewport = fullWidthViewport;
    }

    return closestViewport;
  }, [viewportOptions, frameRef]);

  // Select closest viewport on load
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Don't override if user has set a viewport
    if (uiProp?.viewports?.current) return;

    const closestViewport = pickClosestViewport();
    if (!closestViewport) return;

    if (iframe.enabled) {
      const s = appStoreApi.getState();

      const appState = {
        state: {
          ...s.state,
          ui: {
            ...s.state.ui,
            viewports: {
              ...s.state.ui.viewports,

              current: {
                ...s.state.ui.viewports.current,
                height: closestViewport?.height || "auto",
                width: closestViewport?.width,
              },
            },
          },
        },
      };

      let history = s.history;

      if (s.history.histories.length === 1) {
        history = { ...history, histories: [appState] };
      }

      appStoreApi.setState({ ...appState, history });
    }
  }, [
    pickClosestViewport,
    frameRef.current,
    iframe,
    appStoreApi,
    uiProp?.viewports?.current,
  ]);

  // Re-run auto-detection when the canvas frame resizes (e.g. sidebar
  // toggle), so the preview expands into newly available space.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!iframe.enabled) return;
    if (uiProp?.viewports?.current) return;
    const target = frameRef.current;
    if (!target) return;

    const observer = new ResizeObserver(() => {
      if (!autoSelectingRef.current) return;

      const closestViewport = pickClosestViewport();
      if (!closestViewport) return;

      const s = appStoreApi.getState();
      const current = s.state.ui.viewports.current;

      if (
        current.width === closestViewport.width &&
        current.height === (closestViewport.height || "auto")
      ) {
        return;
      }

      setUi({
        viewports: {
          ...s.state.ui.viewports,
          current: {
            ...current,
            width: closestViewport.width,
            height: closestViewport.height || "auto",
          },
        },
      });
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [
    pickClosestViewport,
    frameRef,
    iframe.enabled,
    uiProp?.viewports?.current,
    appStoreApi,
    setUi,
  ]);

  return (
    <div
      className={getClassName({
        ready: status === "READY" || !iframe.enabled || !iframe.waitForStyles,
        showLoader,
        fullScreen: fullScreenCanvas,
        canvasFullScreen,
      })}
      onClick={(e) => {
        const el = e.target as Element;

        if (
          !el.hasAttribute("data-editor-component") &&
          !el.hasAttribute("data-editor-dropzone")
        ) {
          dispatch({
            type: "setUi",
            ui: { itemSelector: null },
            recordHistory: false,
          });
        }
      }}
    >
      <div className={getClassName("inner")} ref={frameRef}>
        <div
          className={getClassName("rootColumn")}
          style={{
            width: iframe.enabled ? viewports.current.width : "100%",
            transform: disableZoomControls ? undefined : `scale(${canvasZoom})`,
            transformOrigin: disableZoomControls ? undefined : "center center",
            transition: showTransition
              ? `width ${TRANSITION_DURATION}ms ease-out, transform ${TRANSITION_DURATION}ms ease-out`
              : disableZoomControls
                ? undefined
                : "transform 150ms ease-out",
          }}
        >
          <div
            className={getClassName("root")}
            suppressHydrationWarning
            id="editor-canvas-root"
            onTransitionEnd={() => {
              setShowTransition(false);
              isResizingRef.current = false;
            }}
          >
            <CustomPreview>
              <Preview />
            </CustomPreview>
          </div>
        </div>
        <div className={getClassName("bottomBar")}>
          <div className={getClassName("bottomBarPill")}>
            {chrome.showThemeToggle && onToggleTheme && (
              <IconButton
                type="button"
                title={themeLabel ?? "Toggle theme"}
                onClick={onToggleTheme}
              >
                {themeIcon}
              </IconButton>
            )}
            <DeviceToggle
              onViewportChange={(viewport) => {
                autoSelectingRef.current = false;
                setShowTransition(true);
                isResizingRef.current = true;

                const uiViewport = {
                  ...viewport,
                  height: viewport.height || "auto",
                  zoom: 1,
                };

                setUi({
                  viewports: { ...viewports, current: uiViewport },
                });
              }}
            />
            <FullScreenToggle />
            {!disableZoomControls && (
              <>
                <span className={getClassName("bottomBarDivider")} />
                <IconButton
                  type="button"
                  title="Zoom out"
                  onClick={zoomOut}
                >
                  <Minus size={14} />
                </IconButton>
                <span className={getClassName("zoomLevel")}>
                  {Math.round(canvasZoom * 100)}%
                </span>
                <IconButton type="button" title="Zoom in" onClick={zoomIn}>
                  <Plus size={14} />
                </IconButton>
                <IconButton
                  type="button"
                  title="Reset zoom"
                  onClick={resetZoom}
                >
                  <RotateCcw size={14} />
                </IconButton>
              </>
            )}
          </div>
        </div>
        <div className={getClassName("loader")}>
          <Loader size={24} />
        </div>
      </div>
    </div>
  );
};
