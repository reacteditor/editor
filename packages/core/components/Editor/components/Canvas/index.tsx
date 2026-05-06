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
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { useAppStore, useAppStoreApi } from "../../../../store";
import { BrowserBar } from "../../../BrowserBar";
import styles from "./styles.module.css";
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
const PREVIEW_MAX_WIDTH = 1200;

export const Canvas = () => {
  const { frameRef } = useCanvasFrame();

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

  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

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

  const onBrowserBarViewportChange = useCallback(
    (viewport: { width: number | "100%"; height?: number | "auto" }) => {
      setUi({
        viewports: {
          ...viewports,
          current: {
            ...viewport,
            height: viewport.height || "auto",
          },
        },
      });
      // Re-fit content after viewport change
      setTimeout(() => transformRef.current?.resetTransform(), 0);
    },
    [setUi, viewports]
  );

  // The user's intended transform — kept in sync via the library's
  // `onPanning`/`onZoom` callbacks (which fire on user interactions only)
  // and our own wheel handler. Read on viewport changes to restore the
  // transform after the library's ResizeObserver tries to recalibrate.
  const intendedTransformRef = useRef({
    positionX: 0,
    positionY: 16,
    scale: 1,
  });
  const trackUserTransform = useCallback(
    (ctx: { state: { positionX: number; positionY: number; scale: number } }) => {
      // eslint-disable-next-line no-console
      console.log("[Canvas] onPanning/onZoom →", {
        x: ctx.state.positionX,
        y: ctx.state.positionY,
        scale: ctx.state.scale,
      });
      intendedTransformRef.current = {
        positionX: ctx.state.positionX,
        positionY: ctx.state.positionY,
        scale: ctx.state.scale,
      };
    },
    []
  );

  // [DEBUG] Track viewport changes and snapshot the transform before/after.
  useEffect(() => {
    const ref = transformRef.current;
    if (!ref) return;
    // eslint-disable-next-line no-console
    console.log("[Canvas] viewport-change EFFECT (post-commit)", {
      width: viewports.current.width,
      stateAtEffect: { ...ref.state },
      contentW: ref.instance.contentComponent?.clientWidth,
      contentH: ref.instance.contentComponent?.clientHeight,
    });
    const r1 = requestAnimationFrame(() => {
      const cur = transformRef.current;
      if (!cur) return;
      // eslint-disable-next-line no-console
      console.log("[Canvas] viewport-change rAF1 (post-resize observer)", {
        width: viewports.current.width,
        stateAtRaf: { ...cur.state },
        contentW: cur.instance.contentComponent?.clientWidth,
        contentH: cur.instance.contentComponent?.clientHeight,
      });
    });
    return () => cancelAnimationFrame(r1);
  }, [viewports.current.width]);

  // Initial center on mount. The rootColumn is fixed at PREVIEW_MAX_WIDTH,
  // so this centering doesn't need to re-run on viewport changes.
  useEffect(() => {
    let canceled = false;
    requestAnimationFrame(() => {
      if (canceled) return;
      requestAnimationFrame(() => {
        if (canceled) return;
        const ref = transformRef.current;
        const wrapper = ref?.instance.wrapperComponent;
        if (!ref || !wrapper) return;
        const wrapperW = wrapper.clientWidth;
        const x = Math.max(0, (wrapperW - PREVIEW_MAX_WIDTH) / 2);
        ref.setTransform(x, 16, 1, 0);
        intendedTransformRef.current = { positionX: x, positionY: 16, scale: 1 };
      });
    });
    return () => {
      canceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleZoomIn = useCallback(
    () => transformRef.current?.zoomIn(),
    []
  );
  const handleZoomOut = useCallback(
    () => transformRef.current?.zoomOut(),
    []
  );
  const handleResetZoom = useCallback(
    () => transformRef.current?.resetTransform(),
    []
  );

  // Custom wheel handler: pinch (trackpad pinch / Cmd+wheel / Ctrl+wheel)
  // zooms; plain wheel pans. The library's own wheel handler is disabled
  // so this is the single source of truth, applied on both the canvas
  // viewport (cursor over chrome) and the iframe document (cursor over
  // preview content) — events on the iframe never bubble out.
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      // Always preventDefault — even if the transform ref isn't ready yet,
      // the browser must not run native page/visual zoom.
      e.preventDefault();

      const ref = transformRef.current;
      if (!ref) return;

      // Browser sets ctrlKey on trackpad pinch automatically; Cmd/Ctrl
      // held during wheel scroll also counts as a pinch intent.
      const isPinch = e.ctrlKey || e.metaKey;

      if (isPinch) {
        const wrapper = ref.instance.wrapperComponent;
        if (!wrapper) return;

        const factor = e.deltaY < 0 ? 1.05 : 1 / 1.05;
        const currentScale = ref.state.scale;
        const newScale = Math.max(
          MIN_ZOOM,
          Math.min(MAX_ZOOM, currentScale * factor)
        );
        if (newScale === currentScale) return;

        // Compute the cursor's position in wrapper-local coordinates.
        // Events from inside the iframe report clientX/Y in the iframe's
        // own (pre-transform) coordinate space, so we project them through
        // the iframe element's bounding rect and the current scale.
        const wrapperRect = wrapper.getBoundingClientRect();
        const isIframeEvent =
          (e.target as Node | null)?.ownerDocument !== document;

        let cursorX: number;
        let cursorY: number;
        if (isIframeEvent) {
          const iframeEl = document.getElementById(
            "preview-frame"
          ) as HTMLIFrameElement | null;
          const iframeRect = iframeEl?.getBoundingClientRect();
          if (!iframeRect) return;
          cursorX =
            iframeRect.left + e.clientX * currentScale - wrapperRect.left;
          cursorY =
            iframeRect.top + e.clientY * currentScale - wrapperRect.top;
        } else {
          cursorX = e.clientX - wrapperRect.left;
          cursorY = e.clientY - wrapperRect.top;
        }

        // Keep the point under the cursor fixed: solve for the new
        // position such that (cursor - position) / scale stays constant.
        const ratio = newScale / currentScale;
        const newPositionX =
          cursorX - (cursorX - ref.state.positionX) * ratio;
        const newPositionY =
          cursorY - (cursorY - ref.state.positionY) * ratio;

        ref.setTransform(newPositionX, newPositionY, newScale, 0);
        intendedTransformRef.current = {
          positionX: newPositionX,
          positionY: newPositionY,
          scale: newScale,
        };
        return;
      }

      const newPositionX = ref.state.positionX - e.deltaX;
      const newPositionY = ref.state.positionY - e.deltaY;
      ref.setTransform(newPositionX, newPositionY, ref.state.scale, 0);
      intendedTransformRef.current = {
        positionX: newPositionX,
        positionY: newPositionY,
        scale: ref.state.scale,
      };
    };

    const cleanups: Array<() => void> = [];

    // Window-level: stop Chrome's native page zoom on pinch. Pinch arrives
    // as `wheel + ctrlKey` regardless of cursor location, so calling
    // preventDefault here neutralizes browser zoom even when the cursor is
    // over a sidebar or the plugin rail (outside the canvas's own
    // listeners).  Our canvas-scoped handlers below run first via element
    // listeners and still drive the canvas zoom.
    const onWindowWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    };
    window.addEventListener("wheel", onWindowWheel, { passive: false });
    cleanups.push(() =>
      window.removeEventListener("wheel", onWindowWheel)
    );

    // Canvas viewport (cursor over canvas chrome). The first child of
    // .EditorCanvas-inner is .EditorCanvas-zoomViewport.
    const viewportEl = frameRef.current
      ?.firstElementChild as HTMLElement | null;
    if (viewportEl) {
      viewportEl.addEventListener("wheel", handler, { passive: false });
      cleanups.push(() =>
        viewportEl.removeEventListener("wheel", handler)
      );
    }

    // Iframe document + window (cursor over preview content). Attach on
    // both contentDocument and contentWindow with `capture: true` so we
    // run before any browser-internal pinch-zoom path can fire.
    if (iframe.enabled) {
      const tryAttach = () => {
        const el = document.getElementById(
          "preview-frame"
        ) as HTMLIFrameElement | null;
        const doc = el?.contentDocument;
        const win = el?.contentWindow;
        if (!doc || !win) return false;
        const opts = { passive: false, capture: true } as AddEventListenerOptions;
        doc.addEventListener("wheel", handler, opts);
        win.addEventListener("wheel", handler, opts);
        cleanups.push(() => {
          doc.removeEventListener("wheel", handler, opts);
          win.removeEventListener("wheel", handler, opts);
        });
        return true;
      };

      if (!tryAttach()) {
        const interval = window.setInterval(() => {
          if (tryAttach()) window.clearInterval(interval);
        }, 100);
        cleanups.push(() => window.clearInterval(interval));
      }
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [iframe.enabled, frameRef]);

  // Frame contents: BrowserBar + width-bounded preview column. Both live
  // inside the TransformWrapper so they zoom/pan together as one frame
  // (Figma-style). Full-width viewport ("100%") resolves to a fixed
  // 1440px column — `100%` inside TransformComponent has no concrete
  // ancestor width to resolve against (the library sizes its component
  // to its content), so an explicit pixel width is required.
  // The rootColumn is held at a fixed PREVIEW_MAX_WIDTH so the library's
  // ResizeObserver doesn't fire on device-toggle (which would snap
  // position back toward 0,0). The inner .frame element carries the
  // *actual* viewport width and is centered horizontally via margin auto.
  const previewWidth = !iframe.enabled
    ? "100%"
    : viewports.current.width === "100%"
      ? PREVIEW_MAX_WIDTH
      : viewports.current.width;
  const frameContents = (
    <div
      className={getClassName("rootColumn")}
      style={{ width: PREVIEW_MAX_WIDTH }}
    >
      <div
        className={getClassName("frame")}
        style={{ width: previewWidth, margin: "0 auto" }}
      >
        {iframe.enabled && (
          <div className={getClassName("browserBar")}>
            <BrowserBar onViewportChange={onBrowserBarViewportChange} />
          </div>
        )}
        <div
          className={getClassName("root")}
          suppressHydrationWarning
          id="editor-canvas-root"
        >
          <CustomPreview>
            <Preview />
          </CustomPreview>
        </div>
      </div>
    </div>
  );

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
        <div className={getClassName("zoomViewport")}>
          {disableZoomControls ? (
            frameContents
          ) : (
            <TransformWrapper
              ref={transformRef}
              minScale={MIN_ZOOM}
              maxScale={MAX_ZOOM}
              initialScale={1}
              doubleClick={{ disabled: true }}
              limitToBounds={false}
              // The library's wheel handler is disabled — a custom handler
              // (see useEffect below) runs on both the iframe document and
              // the canvas viewport so pinch-only zoom + wheel-pan behave
              // consistently regardless of cursor location.
              // Click-drag panning + native trackPadPanning stay enabled.
              wheel={{ disabled: true }}
              pinch={{ step: 5 }}
              panning={{ velocityDisabled: true }}
              trackPadPanning={{ velocityDisabled: true }}
              onPanning={trackUserTransform}
              onZoom={trackUserTransform}
              onInit={(ref) => {
                // eslint-disable-next-line no-console
                console.log("[Canvas] TransformWrapper onInit", {
                  state: { ...ref.state },
                  wrapperW: ref.instance.wrapperComponent?.clientWidth,
                  contentW: ref.instance.contentComponent?.clientWidth,
                });
              }}
              onTransform={(_ref, state) => {
                // eslint-disable-next-line no-console
                console.log("[Canvas] onTransform (ALL, incl. library)", {
                  x: state.positionX,
                  y: state.positionY,
                  scale: state.scale,
                });
              }}
            >
              <div className={getClassName("zoomControls")}>
                <IconButton
                  type="button"
                  title="Zoom out"
                  onClick={handleZoomOut}
                >
                  <Minus size={14} />
                </IconButton>
                <IconButton
                  type="button"
                  title="Reset zoom"
                  onClick={handleResetZoom}
                >
                  <RotateCcw size={14} />
                </IconButton>
                <IconButton
                  type="button"
                  title="Zoom in"
                  onClick={handleZoomIn}
                >
                  <Plus size={14} />
                </IconButton>
              </div>
              <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%" }}
              >
                {frameContents}
              </TransformComponent>
            </TransformWrapper>
          )}
        </div>
        <div className={getClassName("loader")}>
          <Loader size={24} />
        </div>
      </div>
    </div>
  );
};
