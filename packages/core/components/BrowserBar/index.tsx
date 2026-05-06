import { Globe, Maximize, Minimize, Monitor, Smartphone } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useAppStore } from "../../store";
import { useChromeConfig, usePropsContext } from "../Editor";
import { getClassNameFactory } from "../../lib";
import { IconButton } from "../IconButton";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/Combobox";
import { Viewport } from "../../types";

import styles from "./styles.module.css";

const normalizeRoute = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

const getClassName = getClassNameFactory("BrowserBar", styles);

type Device = "desktop" | "mobile";

const DEVICE_VIEWPORTS: Record<Device, Viewport> = {
  desktop: { width: "100%", height: "auto", icon: "Monitor", label: "Desktop" },
  mobile: { width: 360, height: "auto", icon: "Smartphone", label: "Mobile" },
};

export const UrlBar = () => {
  const { routes, currentRoute, onRouteChange } = usePropsContext();
  const chrome = useChromeConfig();

  const showRoutePicker =
    !!routes && currentRoute !== undefined && !!onRouteChange;

  const [inputValue, setInputValue] = useState(currentRoute ?? "");

  const lastSyncedPath = useRef(currentRoute);
  if (lastSyncedPath.current !== currentRoute) {
    lastSyncedPath.current = currentRoute;
    setInputValue(currentRoute ?? "");
  }

  const submit = (raw: string) => {
    const next = normalizeRoute(raw);
    if (!next || next === currentRoute) return;
    void onRouteChange?.(next);
  };

  if (!chrome.showUrlBar) return null;

  if (showRoutePicker) {
    return (
      <Combobox<string>
        items={routes!}
        value={currentRoute}
        onValueChange={(next) => {
          if (typeof next === "string") submit(next);
        }}
        inputValue={inputValue}
        onInputValueChange={(next) => setInputValue(next)}
        autoHighlight={false}
      >
        <form
          className={getClassName("urlTrigger")}
          onSubmit={(event) => {
            event.preventDefault();
            submit(inputValue);
          }}
        >
          <Globe className={getClassName("urlIcon")} size={14} />
          <ComboboxInput
            className={getClassName("urlInput")}
            placeholder="/"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
          />
        </form>
        <ComboboxContent>
          <ComboboxEmpty>Press Enter to go to this path</ComboboxEmpty>
          <ComboboxList>
            {(path: string) => (
              <ComboboxItem key={path} value={path}>
                <span className={getClassName("itemPath")}>{path}</span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  }

  return (
    <div className={getClassName("urlTrigger")}>
      <Globe className={getClassName("urlIcon")} size={14} />
      <span className={getClassName("urlText")}>/</span>
    </div>
  );
};

export const DeviceToggle = ({
  onViewportChange,
}: {
  onViewportChange?: (viewport: Viewport) => void;
}) => {
  const chrome = useChromeConfig();
  const viewports = useAppStore((s) => s.state.ui.viewports);

  const activeDevice: Device = useMemo(() => {
    const w = viewports.current.width;
    if (typeof w === "number" && w <= 640) return "mobile";
    return "desktop";
  }, [viewports.current.width]);

  if (!chrome.showDeviceToggle) return null;

  return (
    <IconButton
      type="button"
      title={
        activeDevice === "desktop"
          ? "Switch to mobile viewport"
          : "Switch to desktop viewport"
      }
      onClick={() =>
        onViewportChange?.(
          DEVICE_VIEWPORTS[activeDevice === "desktop" ? "mobile" : "desktop"]
        )
      }
    >
      <span className={getClassName("deviceIcon")}>
        {activeDevice === "desktop" ? (
          <Monitor size={14} />
        ) : (
          <Smartphone size={14} />
        )}
      </span>
    </IconButton>
  );
};

export const FullScreenToggle = () => {
  const chrome = useChromeConfig();
  const dispatch = useAppStore((s) => s.dispatch);
  const isFullScreen = useAppStore(
    (s) => s.state.ui.canvasFullScreen ?? false
  );

  if (!chrome.showFullScreenToggle) return null;

  return (
    <IconButton
      type="button"
      title={isFullScreen ? "Exit full screen" : "Enter full screen"}
      onClick={() =>
        dispatch({ type: "setUi", ui: { canvasFullScreen: !isFullScreen } })
      }
    >
      <span className={getClassName("deviceIcon")}>
        {isFullScreen ? <Minimize size={14} /> : <Maximize size={14} />}
      </span>
    </IconButton>
  );
};
