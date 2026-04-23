import { getBox } from "css-box-model";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppStore, useAppStoreApi } from "../../../../store";
import { ViewportControls } from "../../../ViewportControls";
import styles from "./styles.module.css";
import { getClassNameFactory } from "../../../../lib";
import { Preview } from "../Preview";
import { UiState } from "../../../../types";
import { Loader } from "../../../Loader";
import { useShallow } from "zustand/react/shallow";
import { useCanvasFrame } from "../../../../lib/frame-context";
import { usePropsContext } from "../..";
import { defaultViewports } from "../../../ViewportControls/default-viewports";

const getClassName = getClassNameFactory("EditorCanvas", styles);

const TRANSITION_DURATION = 150;

export const Canvas = () => {
  const { frameRef } = useCanvasFrame();

  const { viewports: viewportOptions = defaultViewports, ui: uiProp } =
    usePropsContext();

  const {
    dispatch,
    overrides,
    setUi,
    zoomConfig,
    setZoomConfig,
    status,
    iframe,
    _experimentalFullScreenCanvas,
  } = useAppStore(
    useShallow((s) => ({
      dispatch: s.dispatch,
      overrides: s.overrides,
      setUi: s.setUi,
      zoomConfig: s.zoomConfig,
      setZoomConfig: s.setZoomConfig,
      status: s.status,
      iframe: s.iframe,
      _experimentalFullScreenCanvas: s._experimentalFullScreenCanvas,
    }))
  );
  const viewports = useAppStore((s) => s.state.ui.viewports);

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

  // Select closest viewport on load
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Don't override if user has set a viewport
    if (uiProp?.viewports?.current) return;

    const viewportWidth = window.innerWidth;
    const frameWidth = frameRef.current?.getBoundingClientRect().width;

    if (!viewportWidth) return;
    if (!frameWidth) return;
    if (viewportOptions.length === 0) return;

    const fullWidthViewport = Object.values(viewportOptions).find(
      (v) => v.width === "100%"
    );

    const containsFullWidthViewport = !!fullWidthViewport;

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

    let closestViewport = viewportDifferences[0].value;

    // Select full width viewport if it exists, and the closest viewport is smaller than the window
    if (
      (closestViewport.width as number) < frameWidth &&
      containsFullWidthViewport
    ) {
      closestViewport = fullWidthViewport;
    }

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
    viewportOptions,
    frameRef.current,
    iframe,
    appStoreApi,
    uiProp?.viewports?.current,
  ]);

  return (
    <div
      className={getClassName({
        ready: status === "READY" || !iframe.enabled || !iframe.waitForStyles,
        showLoader,
        fullScreen: _experimentalFullScreenCanvas,
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
      {viewports.controlsVisible && iframe.enabled && (
        <div className={getClassName("controls")}>
          <ViewportControls
            fullScreen={_experimentalFullScreenCanvas}
            onViewportChange={(viewport) => {
              setShowTransition(true);
              isResizingRef.current = true;

              const uiViewport = {
                ...viewport,
                height: viewport.height || "auto",
                zoom: 1,
              };

              const newUi: Partial<UiState> = {
                viewports: { ...viewports, current: uiViewport },
              };

              setUi(newUi);
            }}
          />
        </div>
      )}
      <div className={getClassName("inner")} ref={frameRef}>
        <div
          className={getClassName("root")}
          style={{
            width: iframe.enabled ? viewports.current.width : "100%",
            height: zoomConfig.rootHeight,
            transform: iframe.enabled ? `scale(${zoomConfig.zoom})` : undefined,
            transition: showTransition
              ? `width ${TRANSITION_DURATION}ms ease-out, height ${TRANSITION_DURATION}ms ease-out, transform ${TRANSITION_DURATION}ms ease-out`
              : "",
            overflow: iframe.enabled ? undefined : "auto",
          }}
          suppressHydrationWarning // Suppress hydration warning as frame is not visible until after load
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
        <div className={getClassName("loader")}>
          <Loader size={24} />
        </div>
      </div>
    </div>
  );
};
