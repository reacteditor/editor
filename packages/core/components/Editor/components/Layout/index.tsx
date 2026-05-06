import { ReactElement, ReactNode, useEffect, useMemo, useState } from "react";
import { getClassNameFactory } from "../../../../lib";
import { IframeConfig } from "../../../../types";
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
import { FrameProvider } from "../../../../lib/frame-context";
import { Sidebar } from "../Sidebar";
import { useDeleteHotkeys } from "../../../../lib/use-delete-hotkeys";
import { useClipboardHotkeys } from "../../../../lib/use-clipboard-hotkeys";
import { MenuItem, Nav } from "../Nav";
import { IconButton } from "../../../IconButton";
import {
  Maximize,
  Minimize,
  Monitor,
  Moon,
  Redo2Icon,
  Smartphone,
  Sun,
  Tablet,
  ToyBrick,
  Undo2Icon,
} from "lucide-react";
import { PluginInternal } from "../../../../types/Internal";
import { fieldsPlugin } from "../../../../plugins/fields";
import { Button } from "../../../Button";
import { BrowserBar } from "../../../BrowserBar";
import { ThemeContext } from "../../../../lib/theme-context";

const getClassName = getClassNameFactory("Editor", styles);
const getLayoutClassName = getClassNameFactory("EditorLayout", styles);
const getPluginTabClassName = getClassNameFactory("EditorPluginTab", styles);

/** Right-panel body — just fields now. Publish moved to the top header. */
const FieldSideBarBody = () => (
  <SidebarSection noBorderTop title={null}>
    <Fields />
  </SidebarSection>
);

/** Top-header publish button. Wired through `headerActions` override
 *  the same way the old right-panel toolbar was. */
const HeaderPublish = () => {
  const appStore = useAppStoreApi();
  const { onPublish, currentRoute } = usePropsContext();
  const CustomHeaderActions = useAppStore(
    (s) => s.overrides.headerActions || DefaultOverride
  );
  return (
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
  );
};

const HEADER_DEVICE_VIEWPORTS: Record<
  "desktop" | "tablet" | "mobile",
  { width: number | "100%"; height: "auto"; label: string }
> = {
  desktop: { width: "100%", height: "auto", label: "Desktop" },
  tablet: { width: 768, height: "auto", label: "Tablet" },
  mobile: { width: 360, height: "auto", label: "Mobile" },
};

const HEADER_DEVICE_ORDER: Array<"desktop" | "tablet" | "mobile"> = [
  "desktop",
  "tablet",
  "mobile",
];

const HEADER_DEVICE_ICONS: Record<
  "desktop" | "tablet" | "mobile",
  ReactNode
> = {
  desktop: <Monitor size={16} />,
  tablet: <Tablet size={16} />,
  mobile: <Smartphone size={16} />,
};

const HeaderDeviceToggle = () => {
  const setUi = useAppStore((s) => s.setUi);
  const viewports = useAppStore((s) => s.state.ui.viewports);
  const active = useMemo<"desktop" | "tablet" | "mobile">(() => {
    const w = viewports.current.width;
    if (w === "100%") return "desktop";
    if (typeof w === "number" && w <= 640) return "mobile";
    return "tablet";
  }, [viewports.current.width]);
  const next =
    HEADER_DEVICE_ORDER[
      (HEADER_DEVICE_ORDER.indexOf(active) + 1) % HEADER_DEVICE_ORDER.length
    ];
  return (
    <IconButton
      type="button"
      title={`Switch to ${HEADER_DEVICE_VIEWPORTS[next].label} viewport`}
      onClick={() => {
        const v = HEADER_DEVICE_VIEWPORTS[next];
        setUi({
          viewports: {
            ...viewports,
            current: { width: v.width, height: v.height },
          },
        });
      }}
    >
      {HEADER_DEVICE_ICONS[active]}
    </IconButton>
  );
};

const HeaderFullScreenToggle = () => {
  const setUi = useAppStore((s) => s.setUi);
  const isFullScreen = useAppStore(
    (s) => s.state.ui.canvasFullScreen ?? false
  );
  return (
    <IconButton
      type="button"
      title={isFullScreen ? "Exit full screen" : "Enter full screen"}
      onClick={() => setUi({ canvasFullScreen: !isFullScreen })}
    >
      {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
    </IconButton>
  );
};

const HeaderHistory = () => {
  const back = useAppStore((s) => s.history.back);
  const forward = useAppStore((s) => s.history.forward);
  const hasFuture = useAppStore((s) => s.history.hasFuture());
  const hasPast = useAppStore((s) => s.history.hasPast());
  return (
    <div className={getLayoutClassName("headerHistory")}>
      <IconButton type="button" title="Undo" disabled={!hasPast} onClick={back}>
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
    </div>
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

  const setUi = useAppStore((s) => s.setUi);
  const leftSideBarVisible = useAppStore((s) => s.state.ui.leftSideBarVisible);
  const rightSideBarVisible = useAppStore(
    (s) => s.state.ui.rightSideBarVisible
  );
  const chrome = useChromeConfig();
  const navBarVisible = chrome.showNavBar;

  const instanceId = useAppStore((s) => s.instanceId);

  const overrides = useAppStore((s) => s.overrides);

  const CustomEditor = useMemo(
    () => overrides.editor || DefaultOverride,
    [overrides]
  );

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

  const currentPlugin = useAppStore((s) => s.state.ui.plugin?.current);
  const appStoreApi = useAppStoreApi();

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

  const themeIcon = theme === "dark" ? <Sun size={18} /> : <Moon size={18} />;
  const themeLabel =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  const hasLegacySideBarPlugin = useMemo(
    () => !!plugins?.find((p) => p.name === "legacy-side-bar"),
    [plugins]
  );

  const pluginItems = useMemo(() => {
    const details: Record<string, MenuItem & { render: () => ReactElement }> =
      {};

    const isLegacy = (plugin: PluginInternal) =>
      plugin.name === "legacy-side-bar" ? -1 : 0;

    // blocksPlugin and outlinePlugin are both opt-in — consumers register
    // them explicitly via the `plugins` prop (see demo/client.tsx).
    // fieldsPlugin is auto-appended only when the consumer hasn't already
    // provided their own under the same name.
    const combinedPlugins: PluginInternal[] = [...(plugins ?? [])].sort(
      (a, b) => isLegacy(a) - isLegacy(b)
    );

    if (!plugins?.some((p) => p.name === "fields")) {
      combinedPlugins.push(fieldsPlugin());
    }

    combinedPlugins?.forEach((plugin) => {
      if (plugin.name && plugin.render) {
        if (details[plugin.name]) {
          delete details[plugin.name];
        }

        details[plugin.name] = {
          label: plugin.label ?? plugin.name,
          icon: plugin.icon ?? <ToyBrick />,
          onClick: () => {
            // Same plugin: toggle expansion of the left panel body.
            // Different plugin: switch to it and force-expand.
            if (plugin.name === currentPlugin) {
              setUi({ leftSideBarVisible: !leftSideBarVisible });
            } else if (plugin.name) {
              setUi({
                plugin: { current: plugin.name },
                leftSideBarVisible: true,
              });
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

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
                  rightSideBarVisible:
                    !hasDesktopFieldsPlugin && rightSideBarVisible,
                  navBarVisible,
                })}
                style={{ height }}
              >
                <div className={getLayoutClassName("inner")}>
                  {navBarVisible && (
                    <header className={getLayoutClassName("header")}>
                      <div className={getLayoutClassName("headerStart")}>
                        <Nav items={pluginItems} orientation="horizontal" />
                      </div>
                      <div className={getLayoutClassName("headerCenter")}>
                        {chrome.showUrlBar && <BrowserBar />}
                      </div>
                      <div className={getLayoutClassName("headerEnd")}>
                        {chrome.showHistoryControls && <HeaderHistory />}
                        <HeaderPublish />
                      </div>
                    </header>
                  )}
                  {leftSideBarVisible && (
                    <Sidebar position="left">
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
                    </Sidebar>
                  )}
                  <Canvas />
                  {!hasDesktopFieldsPlugin && rightSideBarVisible && (
                    <Sidebar position="right">
                      <FieldSideBarBody />
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
    </ThemeContext.Provider>
  );
};
