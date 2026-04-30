import { useCallback } from "react";
import { useHotkey } from "./use-hotkey";
import { useAppStoreApi } from "../store";
import { shouldBlockEditingHotkey } from "./should-block-editing-hotkey";
import { ComponentData } from "../types";

const CLIPBOARD_MARKER = "reacteditor/component";

type ClipboardPayload = {
  __reactEditor: typeof CLIPBOARD_MARKER;
  data: ComponentData;
};

const isComponentData = (value: unknown): value is ComponentData => {
  if (!value || typeof value !== "object") return false;
  const v = value as { type?: unknown; props?: { id?: unknown } };
  return typeof v.type === "string" && typeof v.props?.id === "string";
};

const parsePayload = (text: string): ComponentData | null => {
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      parsed.__reactEditor === CLIPBOARD_MARKER &&
      isComponentData(parsed.data)
    ) {
      return parsed.data;
    }
  } catch {
    // Not JSON or not our payload
  }
  return null;
};

export const useClipboardHotkeys = () => {
  const appStore = useAppStoreApi();

  const writeSelectionToClipboard = useCallback(() => {
    const { selectedItem } = appStore.getState();
    if (!selectedItem) return false;

    const payload: ClipboardPayload = {
      __reactEditor: CLIPBOARD_MARKER,
      data: selectedItem,
    };

    navigator.clipboard?.writeText(JSON.stringify(payload)).catch(() => {});
    return true;
  }, [appStore]);

  const copySelectedComponent = useCallback(
    (e?: KeyboardEvent) => {
      if (shouldBlockEditingHotkey(e)) return false;
      return writeSelectionToClipboard();
    },
    [writeSelectionToClipboard]
  );

  const cutSelectedComponent = useCallback(
    (e?: KeyboardEvent) => {
      if (shouldBlockEditingHotkey(e)) return false;

      const { state, dispatch, permissions, selectedItem } =
        appStore.getState();
      const sel = state.ui?.itemSelector;
      if (!sel?.zone || !selectedItem) return false;

      if (!permissions.getPermissions({ item: selectedItem }).delete)
        return true;

      if (!writeSelectionToClipboard()) return false;

      dispatch({
        type: "remove",
        index: sel.index,
        zone: sel.zone,
      });
      return true;
    },
    [appStore, writeSelectionToClipboard]
  );

  const pasteComponent = useCallback(
    (e?: KeyboardEvent) => {
      if (shouldBlockEditingHotkey(e)) return false;

      const { state, dispatch, config } = appStore.getState();
      const sel = state.ui?.itemSelector;
      if (!sel?.zone) return false;

      navigator.clipboard
        ?.readText()
        .then((text) => {
          const data = parsePayload(text);
          if (!data) return;
          if (!config.components[data.type]) return;

          dispatch({
            type: "insert",
            componentType: data.type,
            destinationIndex: sel.index + 1,
            destinationZone: sel.zone!,
            data,
          });
        })
        .catch(() => {});
      return true;
    },
    [appStore]
  );

  useHotkey({ meta: true, c: true }, copySelectedComponent);
  useHotkey({ ctrl: true, c: true }, copySelectedComponent);
  useHotkey({ meta: true, v: true }, pasteComponent);
  useHotkey({ ctrl: true, v: true }, pasteComponent);
  useHotkey({ meta: true, x: true }, cutSelectedComponent);
  useHotkey({ ctrl: true, x: true }, cutSelectedComponent);
};
