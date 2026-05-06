import { Globe } from "lucide-react";
import { useRef, useState } from "react";
import { useChromeConfig, usePropsContext } from "../Editor";
import { getClassNameFactory } from "../../lib";
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

/**
 * URL bar shown above the canvas frame. Device + fullscreen toggles used
 * to live here too — they were moved into the canvas toolbar (see
 * Canvas/index.tsx). The `onViewportChange` prop is now unused and kept
 * for backward compat with consumer overrides.
 */
export const BrowserBar = ({}: {
  onViewportChange?: (viewport: Viewport) => void;
}) => {
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

  return (
    <div className={getClassName()}>
      {showRoutePicker ? (
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
      ) : (
        <div className={getClassName("urlTrigger")}>
          <Globe className={getClassName("urlIcon")} size={14} />
          <span className={getClassName("urlText")}>/</span>
        </div>
      )}
    </div>
  );
};
