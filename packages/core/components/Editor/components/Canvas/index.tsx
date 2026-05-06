import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Maximize,
  Minimize,
  Minus,
  Monitor,
  Plus,
  Redo2Icon,
  RotateCcw,
  Smartphone,
  Tablet,
  Undo2Icon,
} from "lucide-react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
  useTransformComponent,
  useTransformEffect,
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
import { useChromeConfig, usePropsContext } from "../..";

const getClassName = getClassNameFactory("EditorCanvas", styles);

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;
const PREVIEW_MAX_WIDTH = 1200;

type Device = "desktop" | "tablet" | "mobile";

const DEVICE_VIEWPORTS: Record<
  Device,
  { width: number | "100%"; height: "auto"; label: string }
> = {
  desktop: { width: "100%", height: "auto", label: "Desktop" },
  tablet: { width: 768, height: "auto", label: "Tablet" },
  mobile: { width: 360, height: "auto", label: "Mobile" },
};

const DEVICE_ORDER: Device[] = ["desktop", "tablet", "mobile"];

const DEVICE_ICONS: Record<Device, ReactNode> = {
  desktop: <Monitor size={16} />,
  tablet: <Tablet size={16} />,
  mobile: <Smartphone size={16} />,
};

/**
 * Mirrors the react-zoom-pan-pinch transform scale into `zoomConfig.zoom`
 * on the editor store. `DraggableComponent` reads that field to
 * counter-scale its action-bar overlay so it stays at a constant pixel
 * size regardless of canvas zoom. Must be rendered inside <TransformWrapper>.
 */
const ZoomConfigSync = () => {
  const appStoreApi = useAppStoreApi();
  useTransformEffect((ref) => {
    const { zoomConfig, setZoomConfig } = appStoreApi.getState();
    if (zoomConfig.zoom !== ref.state.scale) {
      setZoomConfig({ ...zoomConfig, zoom: ref.state.scale });
    }
  });
  return null;
};

/**
 * Live zoom-percentage badge for the canvas toolbar. Re-renders only when
 * the library's transform scale actually changes (selector subscription),
 * not on every pan event.
 */
const ZoomLevel = ({ className }: { className?: string }) => {
  const scale = useTransformComponent((ctx) => ctx.state.scale);
  return (
    <span className={className}>{`${Math.round(scale * 100)}%`}</span>
  );
};

export const Canvas = () => {
  const { frameRef } = useCanvasFrame();

  const { disableZoomControls } = usePropsContext();

  const {
    dispatch,
    overrides,
    setUi,
    status,
    iframe,
    fullScreenCanvas,
  } = useAppStore(
    useShallow((s) => ({
      dispatch: s.dispatch,
      overrides: s.overrides,
      setUi: s.setUi,
      status: s.status,
      iframe: s.iframe,
      fullScreenCanvas: s.fullScreenCanvas,
    }))
  );
  const viewports = useAppStore((s) => s.state.ui.viewports);
  const canvasFullScreen = useAppStore(
    (s) => s.state.ui.canvasFullScreen ?? false
  );
  const back = useAppStore((s) => s.history.back);
  const forward = useAppStore((s) => s.history.forward);
  const hasFuture = useAppStore((s) => s.history.hasFuture());
  const hasPast = useAppStore((s) => s.history.hasPast());
  const chrome = useChromeConfig();

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

  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowLoader(true);
    }, 500);
  }, []);

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
      // Centering is handled by the centerFrame useEffect (keyed on
      // viewports.current.width). Do NOT call ref.resetTransform() here —
      // its default 200ms animation produces the visible "frame slides
      // to top-left" behaviour on every device toggle.
    },
    [setUi, viewports]
  );

  // Map current viewport width → device preset (for highlighting + cycling).
  const activeDevice: Device = useMemo(() => {
    const w = viewports.current.width;
    if (w === "100%") return "desktop";
    if (typeof w === "number" && w <= 640) return "mobile";
    return "tablet";
  }, [viewports.current.width]);

  const cycleDevice = useCallback(() => {
    const idx = DEVICE_ORDER.indexOf(activeDevice);
    const next = DEVICE_ORDER[(idx + 1) % DEVICE_ORDER.length];
    onBrowserBarViewportChange(DEVICE_VIEWPORTS[next]);
  }, [activeDevice, onBrowserBarViewportChange]);

  const toggleFullScreen = useCallback(() => {
    setUi({ canvasFullScreen: !canvasFullScreen });
  }, [setUi, canvasFullScreen]);

  const nextDeviceLabel =
    DEVICE_VIEWPORTS[
      DEVICE_ORDER[
        (DEVICE_ORDER.indexOf(activeDevice) + 1) % DEVICE_ORDER.length
      ]
    ].label;

  // Center the frame: horizontally aligned, anchored 16px from the top,
  // at scale 1. Deferred two frames so the wrapper has finished its
  // layout pass after the rootColumn width settles.
  const centerFrame = useCallback(() => {
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
      });
    });
    return () => {
      canceled = true;
    };
  }, []);

  // Run on mount and on every viewport change.
  useEffect(() => {
    return centerFrame();
  }, [centerFrame, viewports.current.width]);

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
        return;
      }

      ref.setTransform(
        ref.state.positionX - e.deltaX,
        ref.state.positionY - e.deltaY,
        ref.state.scale,
        0
      );
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
              // The library otherwise plays a smooth bounds-alignment
              // animation after pan-end and on content-size change. With
              // limitToBounds=false we want no auto-snap, so disable.
              alignmentAnimation={{ disabled: true } as never}
              autoAlignment={{ disabled: true, sizeX: 0, sizeY: 0 }}
            >
              <ZoomConfigSync />
              <div className={getClassName("toolbar")}>
                {chrome.showHistoryControls && (
                  <>
                    <IconButton
                      type="button"
                      title="Undo"
                      disabled={!hasPast}
                      onClick={back}
                    >
                      <Undo2Icon size={16} />
                    </IconButton>
                    <IconButton
                      type="button"
                      title="Redo"
                      disabled={!hasFuture}
                      onClick={forward}
                    >
                      <Redo2Icon size={16} />
                    </IconButton>
                    <div className={getClassName("toolbarDivider")} />
                  </>
                )}
                {(chrome.showDeviceToggle || chrome.showFullScreenToggle) && (
                  <>
                    {chrome.showDeviceToggle && (
                      <IconButton
                        type="button"
                        title={`Switch to ${nextDeviceLabel} viewport`}
                        onClick={cycleDevice}
                      >
                        {DEVICE_ICONS[activeDevice]}
                      </IconButton>
                    )}
                    {chrome.showFullScreenToggle && (
                      <IconButton
                        type="button"
                        title={
                          canvasFullScreen
                            ? "Exit full screen"
                            : "Enter full screen"
                        }
                        onClick={toggleFullScreen}
                      >
                        {canvasFullScreen ? (
                          <Minimize size={16} />
                        ) : (
                          <Maximize size={16} />
                        )}
                      </IconButton>
                    )}
                    <div className={getClassName("toolbarDivider")} />
                  </>
                )}
                <IconButton
                  type="button"
                  title="Zoom out"
                  onClick={handleZoomOut}
                >
                  <Minus size={14} />
                </IconButton>
                <ZoomLevel className={getClassName("zoomLevel")} />
                <IconButton
                  type="button"
                  title="Zoom in"
                  onClick={handleZoomIn}
                >
                  <Plus size={14} />
                </IconButton>
                <IconButton
                  type="button"
                  title="Reset zoom"
                  onClick={handleResetZoom}
                >
                  <RotateCcw size={14} />
                </IconButton>
              </div>
              <TransformComponent
                infinite
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
