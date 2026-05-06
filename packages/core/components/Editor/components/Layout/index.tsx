import {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getClassNameFactory } from "../../../../lib";
import { IframeConfig, UiState } from "../../../../types";
import { useChromeConfig, usePropsContext } from "../..";
import styles from "./styles.module.css";
import { useInjectGlobalCss } from "../../../../lib/use-inject-css";
import { useAppStore, useAppStoreApi } from "../../../../store";
import { DefaultOverride } from "../../../DefaultOverride";
import { monitorHotkeys, useMonitorHotkeys } from "../../../../lib/use-hotkey";
import { getFrame } from "../../../../lib/get-frame";
import { usePreviewModeHotkeys } from "../../../../lib/use-preview-mode-hotkeys";
import { DragDropContext } from "../../../DragDropContext";
import { SidebarSection } from "../../../SidebarSection";
import { Canvas } from "../Canvas";
import { Fields } from "../Fields";
import { useSidebarResize } from "../../../../lib/use-sidebar-resize";
import { FrameProvider } from "../../../../lib/frame-context";
import { Sidebar } from "../Sidebar";
import { useDeleteHotkeys } from "../../../../lib/use-delete-hotkeys";
import { useClipboardHotkeys } from "../../../../lib/use-clipboard-hotkeys";
import { MenuItem } from "../Nav";
import { IconButton } from "../../../IconButton";
import {
  Moon,
  Redo2Icon,
  Sun,
  ToyBrick,
  Undo2Icon,
} from "lucide-react";
import { PluginInternal } from "../../../../types/Internal";
import { blocksPlugin } from "../../../../plugins/blocks";
import { fieldsPlugin } from "../../../../plugins/fields";
import { Button } from "../../../Button";
import { UrlBar } from "../../../BrowserBar";

const getClassName = getClassNameFactory("Editor", styles);
const getLayoutClassName = getClassNameFactory("EditorLayout", styles);
const getPluginTabClassName = getClassNameFactory("EditorPluginTab", styles);

const getHeaderClassName = getClassNameFactory("EditorHeader", styles);

const TopHeader = ({
  pluginItems,
}: {
  pluginItems: Record<string, MenuItem>;
}) => {
  const appStore = useAppStoreApi();
  const { onPublish, currentRoute } = usePropsContext();
  const chrome = useChromeConfig();

  const back = useAppStore((s) => s.history.back);
  const forward = useAppStore((s) => s.history.forward);
  const hasFuture = useAppStore((s) => s.history.hasFuture());
  const hasPast = useAppStore((s) => s.history.hasPast());

  const CustomHeaderActions = useAppStore(
    (s) => s.overrides.headerActions || DefaultOverride
  );

  const pluginEntries = Object.entries(pluginItems).filter(
    ([, item]) => !item.mobileOnly
  );

  return (
    <header className={getHeaderClassName()}>
      <div className={getHeaderClassName("plugins")}>
        {pluginEntries.map(([key, item]) => (
          <IconButton
            key={key}
            type="button"
            title={item.label}
            onClick={item.onClick}
            active={item.isActive}
          >
            {item.icon}
          </IconButton>
        ))}
      </div>
      <div className={getHeaderClassName("urlBarSlot")}>
        <UrlBar />
      </div>
      <div className={getHeaderClassName("actions")}>
        {chrome.showHistoryControls && (
          <div className={getHeaderClassName("history")}>
            <IconButton
              type="button"
              title="undo"
              disabled={!hasPast}
              onClick={back}
            >
              <Undo2Icon size={18} />
            </IconButton>
            <IconButton
              type="button"
              title="redo"
              disabled={!hasFuture}
              onClick={forward}
            >
              <Redo2Icon size={18} />
            </IconButton>
          </div>
        )}
        <CustomHeaderActions>
          <Button
            onClick={() => {
              const data = appStore.getState().state.data;
              onPublish && onPublish(data, currentRoute);
            }}
          >
            Publish
          </Button>
        </CustomHeaderActions>
      </div>
    </header>
  );
};

const FieldSideBar = () => {
  const title = useAppStore((s) =>
    s.selectedItem
      ? s.config.components[s.selectedItem.type]?.["label"] ??
        s.selectedItem.type.toString()
      : s.config.root?.label || "Page"
  );

  return (
    <SidebarSection noBorderTop showBreadcrumbs title={title}>
      <Fields />
    </SidebarSection>
  );
};

const PluginTab = ({
  children,
  visible,
  mobileOnly,
}: {
  children: ReactNode;
  visible: boolean;
  mobileOnly?: boolean;
}) => {
  return (
    <div className={getPluginTabClassName({ visible, mobileOnly })}>
      <div className={getPluginTabClassName("body")}>{children}</div>
    </div>
  );
};

export const Layout = ({ children }: { children?: ReactNode }) => {
  const {
    iframe: _iframe,
    dnd,
    initialHistory: _initialHistory,
    plugins,
    height,
  } = usePropsContext();

  const iframe: IframeConfig = useMemo(
    () => ({
      enabled: true,
      waitForStyles: true,
      ..._iframe,
    }),
    [_iframe]
  );

  useInjectGlobalCss(iframe.enabled);

  const dispatch = useAppStore((s) => s.dispatch);
  const leftSideBarVisible = useAppStore((s) => s.state.ui.leftSideBarVisible);
  const rightSideBarVisible = useAppStore(
    (s) => s.state.ui.rightSideBarVisible
  );
  const chrome = useChromeConfig();
  const navBarVisible = chrome.showNavBar;

  const instanceId = useAppStore((s) => s.instanceId);

  const {
    width: leftWidth,
    setWidth: setLeftWidth,
    sidebarRef: leftSidebarRef,
    handleResizeEnd: handleLeftSidebarResizeEnd,
  } = useSidebarResize("left", dispatch);

  const {
    width: rightWidth,
    setWidth: setRightWidth,
    sidebarRef: rightSidebarRef,
    handleResizeEnd: handleRightSidebarResizeEnd,
  } = useSidebarResize("right", dispatch);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 638px)").matches) {
      dispatch({
        type: "setUi",
        ui: {
          leftSideBarVisible: false,
          rightSideBarVisible: false,
        },
      });
    }

    const handleResize = () => {
      if (!window.matchMedia("(min-width: 638px)").matches) {
        dispatch({
          type: "setUi",
          ui: (ui: UiState) => ({
            ...ui,
            ...(ui.rightSideBarVisible ? { leftSideBarVisible: false } : {}),
          }),
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const overrides = useAppStore((s) => s.overrides);

  const CustomEditor = useMemo(
    () => overrides.editor || DefaultOverride,
    [overrides]
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ready = useAppStore((s) => s.status === "READY");

  useMonitorHotkeys();

  useEffect(() => {
    if (ready && iframe.enabled) {
      const frameDoc = getFrame();

      if (frameDoc) {
        return monitorHotkeys(frameDoc);
      }
    }
  }, [ready, iframe.enabled]);

  usePreviewModeHotkeys();
  useDeleteHotkeys();
  useClipboardHotkeys();

  const layoutOptions: Record<string, any> = {};

  if (leftWidth) {
    layoutOptions["--editor-user-left-side-bar-width"] = `${leftWidth}px`;
  }

  if (rightWidth) {
    layoutOptions["--editor-user-right-side-bar-width"] = `${rightWidth}px`;
  }

  const setUi = useAppStore((s) => s.setUi);
  const currentPlugin = useAppStore((s) => s.state.ui.plugin?.current);
  const appStoreApi = useAppStoreApi();

  const [mobilePanelHeightMode, setMobilePanelHeightMode] = useState<
    "toggle" | "min-content"
  >("toggle");

  const [mobilePanelHeight, setMobilePanelHeight] = useState<number | null>(
    null
  );
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const isDraggingMobile = useRef(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);

  const handleMobileDragStart = useCallback(
    (clientY: number) => {
      isDraggingMobile.current = true;
      dragStartY.current = clientY;
      const panel = mobilePanelRef.current;
      dragStartHeight.current = panel
        ? panel.getBoundingClientRect().height
        : 0;
      document.body.style.userSelect = "none";
      document.body.style.touchAction = "none";
    },
    []
  );

  const handleMobileDragMove = useCallback((clientY: number) => {
    if (!isDraggingMobile.current) return;
    const delta = dragStartY.current - clientY;
    const viewportHeight = window.innerHeight;
    const minH = viewportHeight * 0.15;
    const maxH = viewportHeight * 0.75;
    const newH = Math.min(maxH, Math.max(minH, dragStartHeight.current + delta));
    setMobilePanelHeight(newH);
  }, []);

  const handleMobileDragEnd = useCallback(() => {
    if (!isDraggingMobile.current) return;
    isDraggingMobile.current = false;
    document.body.style.userSelect = "";
    document.body.style.touchAction = "";
  }, []);

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (isDraggingMobile.current) {
        e.preventDefault();
        handleMobileDragMove(e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => handleMobileDragEnd();
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingMobile.current) {
        e.preventDefault();
        handleMobileDragMove(e.clientY);
      }
    };
    const onMouseUp = () => handleMobileDragEnd();

    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [handleMobileDragMove, handleMobileDragEnd]);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("editor-theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("editor-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  const themeIcon =
    theme === "dark" ? <Sun size={14} /> : <Moon size={14} />;

  const themeLabel =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  const hasLegacySideBarPlugin = useMemo(
    () => !!plugins?.find((p) => p.name === "legacy-side-bar"),
    [plugins]
  );

  const pluginItems = useMemo(() => {
    const details: Record<string, MenuItem & { render: () => ReactElement }> =
      {};

    const defaultPlugins: PluginInternal[] = [blocksPlugin()];

    const isLegacy = (plugin: PluginInternal) =>
      plugin.name === "legacy-side-bar" ? -1 : 0;

    // Always place legacy-side-bar first
    // Stable tie-break ensures consistent order for non-legacy plugins
    const combinedPlugins: PluginInternal[] = [
      ...defaultPlugins,
      ...(plugins ?? []),
    ].sort((a, b) => isLegacy(a) - isLegacy(b));

    if (!plugins?.some((p) => p.name === "fields")) {
      combinedPlugins.push(fieldsPlugin());
    }

    combinedPlugins?.forEach((plugin) => {
      if (plugin.name && plugin.render) {
        if (details[plugin.name]) {
          // Delete existing plugins with this name to enable user sorting
          delete details[plugin.name];
        }

        details[plugin.name] = {
          label: plugin.label ?? plugin.name,
          icon: plugin.icon ?? <ToyBrick />,
          onClick: () => {
            setMobilePanelHeightMode(plugin.mobilePanelHeight ?? "toggle");

            if (plugin.name === currentPlugin) {
              if (leftSideBarVisible) {
                setUi({ leftSideBarVisible: false });
              } else {
                setUi({ leftSideBarVisible: true });
              }
            } else {
              if (plugin.name) {
                setUi({
                  plugin: { current: plugin.name },
                  leftSideBarVisible: true,
                });
              }
            }
          },
          isActive: leftSideBarVisible && currentPlugin === plugin.name,
          render: plugin.render,
          mobileOnly: hasLegacySideBarPlugin || plugin.mobileOnly,
          desktopOnly: plugin.name === "legacy-side-bar" || plugin.desktopOnly,
        };
      }
    });

    return details;
  }, [plugins, currentPlugin, appStoreApi, leftSideBarVisible]);

  useEffect(() => {
    if (!currentPlugin) {
      const names = Object.keys(pluginItems);

      setUi({ plugin: { current: names[0] } });
    }
  }, [pluginItems, currentPlugin]);

  const hasDesktopFieldsPlugin =
    pluginItems["fields"] && pluginItems["fields"].mobileOnly === false;

  const mobilePanelStyle: Record<string, string> = {};
  if (mobilePanelHeight && leftSideBarVisible) {
    mobilePanelStyle["--editor-mobile-panel-height"] = `${mobilePanelHeight}px`;
  }

  return (
    <div
      className={`Editor ${getClassName({
        hidePlugins: hasLegacySideBarPlugin,
      })}`}
      id={instanceId}
      data-theme={theme}
      style={{ height }}
    >
      <DragDropContext disableAutoScroll={dnd?.disableAutoScroll}>
        <CustomEditor>
          {children || (
            <FrameProvider>
              <div
                className={getLayoutClassName({
                  leftSideBarVisible,
                  mounted,
                  rightSideBarVisible:
                    !hasDesktopFieldsPlugin && rightSideBarVisible,
                  navBarVisible,
                  mobilePanelHeightToggle: mobilePanelHeightMode === "toggle",
                  mobilePanelHeightMinContent:
                    mobilePanelHeightMode === "min-content",
                  mobilePanelCustomHeight:
                    mobilePanelHeight !== null && leftSideBarVisible,
                })}
                style={{ height }}
              >
                <div
                  className={getLayoutClassName("inner")}
                  style={{ ...layoutOptions, ...mobilePanelStyle }}
                >
                  {navBarVisible && (
                    <div className={getLayoutClassName("header")}>
                      <TopHeader pluginItems={pluginItems} />
                    </div>
                  )}
                  <div
                    ref={mobilePanelRef}
                    className={getLayoutClassName("mobilePanel")}
                  >
                    <div
                      className={getLayoutClassName("mobileDragHandle")}
                      onTouchStart={(e) =>
                        handleMobileDragStart(e.touches[0].clientY)
                      }
                      onMouseDown={(e) => handleMobileDragStart(e.clientY)}
                    >
                      <div
                        className={getLayoutClassName("mobileDragHandlePill")}
                      />
                    </div>
                    <div
                      className={getLayoutClassName("mobilePanelContent")}
                    >
                      {Object.entries(pluginItems).map(
                        ([id, { mobileOnly, render: Render }]) => (
                          <PluginTab
                            key={id}
                            visible={currentPlugin === id}
                            mobileOnly={mobileOnly}
                          >
                            <Render />
                          </PluginTab>
                        )
                      )}
                    </div>
                  </div>
                  <Sidebar
                    position="left"
                    sidebarRef={leftSidebarRef}
                    isVisible={leftSideBarVisible}
                    onResize={setLeftWidth}
                    onResizeEnd={handleLeftSidebarResizeEnd}
                  >
                    {Object.entries(pluginItems).map(
                      ([id, { mobileOnly, render: Render, label }]) => (
                        <PluginTab
                          key={id}
                          visible={currentPlugin === id}
                          mobileOnly={mobileOnly}
                        >
                          <Render />
                        </PluginTab>
                      )
                    )}
                  </Sidebar>
                  <Canvas
                    theme={theme}
                    themeIcon={themeIcon}
                    themeLabel={themeLabel}
                    onToggleTheme={toggleTheme}
                  />
                  {!hasDesktopFieldsPlugin && (
                    <Sidebar
                      position="right"
                      sidebarRef={rightSidebarRef}
                      isVisible={rightSideBarVisible}
                      onResize={setRightWidth}
                      onResizeEnd={handleRightSidebarResizeEnd}
                    >
                      <FieldSideBar />
                    </Sidebar>
                  )}
                </div>
              </div>
            </FrameProvider>
          )}
        </CustomEditor>
      </DragDropContext>
      <div id="editor-portal-root" className={getClassName("portal")} />
    </div>
  );
};
