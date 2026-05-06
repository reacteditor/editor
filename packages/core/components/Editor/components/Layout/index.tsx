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
import { Moon, Sun, ToyBrick } from "lucide-react";
import { PluginInternal } from "../../../../types/Internal";
import { blocksPlugin } from "../../../../plugins/blocks";
import { fieldsPlugin } from "../../../../plugins/fields";
import { Button } from "../../../Button";

const getClassName = getClassNameFactory("Editor", styles);
const getLayoutClassName = getClassNameFactory("EditorLayout", styles);
const getPluginTabClassName = getClassNameFactory("EditorPluginTab", styles);

const FieldSideBarToolbar = () => {
  const appStore = useAppStoreApi();
  const { onPublish, currentRoute } = usePropsContext();

  const CustomHeaderActions = useAppStore(
    (s) => s.overrides.headerActions || DefaultOverride
  );

  return (
    <div className={getClassName("fieldSideBarToolbar")}>
      <div className={getClassName("fieldSideBarActions")}>
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
    </div>
  );
};

const FieldSideBarBody = () => (
  <>
    <FieldSideBarToolbar />
    <SidebarSection noBorderTop showBreadcrumbs title={null}>
      <Fields />
    </SidebarSection>
  </>
);

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

    const defaultPlugins: PluginInternal[] = [blocksPlugin()];

    const isLegacy = (plugin: PluginInternal) =>
      plugin.name === "legacy-side-bar" ? -1 : 0;

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

  // Header titles for the floating panels.
  const leftPanelTitle = useMemo(() => {
    if (currentPlugin && pluginItems[currentPlugin]) {
      return pluginItems[currentPlugin].label;
    }
    return "Editor";
  }, [currentPlugin, pluginItems]);

  const rightPanelTitle = useAppStore((s) =>
    s.selectedItem
      ? s.config.components[s.selectedItem.type]?.["label"] ??
        s.selectedItem.type.toString()
      : s.config.root?.label || "Page"
  );

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
                  rightSideBarVisible:
                    !hasDesktopFieldsPlugin && rightSideBarVisible,
                  navBarVisible,
                })}
                style={{ height }}
              >
                <div className={getLayoutClassName("inner")}>
                  {navBarVisible && (
                    <div className={getLayoutClassName("nav")}>
                      <Nav
                        items={pluginItems}
                        footer={
                          chrome.showThemeToggle ? (
                            <IconButton
                              type="button"
                              title={themeLabel}
                              onClick={toggleTheme}
                            >
                              {themeIcon}
                            </IconButton>
                          ) : undefined
                        }
                      />
                    </div>
                  )}
                  <Canvas />
                  <Sidebar
                    position="left"
                    expanded={leftSideBarVisible}
                    onToggle={() =>
                      setUi({ leftSideBarVisible: !leftSideBarVisible })
                    }
                    title={leftPanelTitle}
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
                  </Sidebar>
                  {!hasDesktopFieldsPlugin && (
                    <Sidebar
                      position="right"
                      expanded={rightSideBarVisible}
                      onToggle={() =>
                        setUi({ rightSideBarVisible: !rightSideBarVisible })
                      }
                      title={rightPanelTitle}
                    >
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
  );
};
