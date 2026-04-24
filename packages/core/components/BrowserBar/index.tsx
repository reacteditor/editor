import { Globe, Monitor, Smartphone } from "lucide-react";
import { useMemo } from "react";
import { useAppStore } from "../../store";
import { usePropsContext } from "../Editor";
import { getClassNameFactory } from "../../lib";
import { IconButton } from "../IconButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../ui/Select";
import { Viewport } from "../../types";

import styles from "./styles.module.css";

const getClassName = getClassNameFactory("BrowserBar", styles);

type Device = "desktop" | "mobile";

const DEVICE_VIEWPORTS: Record<Device, Viewport> = {
  desktop: { width: "100%", height: "auto", icon: "Monitor", label: "Desktop" },
  mobile: { width: 360, height: "auto", icon: "Smartphone", label: "Mobile" },
};

export const BrowserBar = ({
  onViewportChange,
}: {
  onViewportChange?: (viewport: Viewport) => void;
}) => {
  const { routes, currentPath, onRouteChange } = usePropsContext();
  const viewports = useAppStore((s) => s.state.ui.viewports);

  // Mobile when current width is a number ≤ 640; everything else treated as desktop.
  const activeDevice: Device = useMemo(() => {
    const w = viewports.current.width;
    if (typeof w === "number" && w <= 640) return "mobile";
    return "desktop";
  }, [viewports.current.width]);

  const setDevice = (device: Device) => {
    onViewportChange?.(DEVICE_VIEWPORTS[device]);
  };

  const showRoutePicker =
    !!routes && currentPath !== undefined && !!onRouteChange;

  const selectedTitle = routes?.find((r) => r.path === currentPath)?.title;

  return (
    <div className={getClassName()}>
      {showRoutePicker ? (
        <Select
          value={currentPath}
          onValueChange={(next) => {
            void onRouteChange?.(next);
          }}
        >
          <SelectTrigger className={getClassName("urlTrigger")}>
            <Globe className={getClassName("urlIcon")} size={14} />
            <span className={getClassName("urlText")}>
              <span className={getClassName("urlPath")}>{currentPath}</span>
              {selectedTitle ? (
                <span className={getClassName("urlTitle")}>
                  {selectedTitle}
                </span>
              ) : null}
            </span>
          </SelectTrigger>
          <SelectContent>
            {routes!.some((r) => r.path === currentPath) ? null : (
              <SelectItem value={currentPath!}>{currentPath}</SelectItem>
            )}
            {routes!.map((route) => (
              <SelectItem key={route.path} value={route.path}>
                {route.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className={getClassName("urlTrigger")}>
          <Globe className={getClassName("urlIcon")} size={14} />
          <span className={getClassName("urlText")}>/</span>
        </div>
      )}
      <div className={getClassName("actions")}>
        <IconButton
          type="button"
          title={
            activeDevice === "desktop"
              ? "Switch to mobile viewport"
              : "Switch to desktop viewport"
          }
          onClick={() =>
            setDevice(activeDevice === "desktop" ? "mobile" : "desktop")
          }
        >
          <span className={getClassName("deviceIcon")}>
            {activeDevice === "desktop" ? (
              <Monitor size={16} />
            ) : (
              <Smartphone size={16} />
            )}
          </span>
        </IconButton>
      </div>
    </div>
  );
};
