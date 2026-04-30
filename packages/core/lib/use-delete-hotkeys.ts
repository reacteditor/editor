import { useCallback } from "react";
import { useHotkey } from "./use-hotkey";
import { useAppStoreApi } from "../store";
import { shouldBlockEditingHotkey } from "./should-block-editing-hotkey";

export const useDeleteHotkeys = () => {
  const appStore = useAppStoreApi();

  const deleteSelectedComponent = useCallback(
    (e?: KeyboardEvent) => {
      if (shouldBlockEditingHotkey(e)) {
        return false;
      }

      const { state, dispatch, permissions, selectedItem } =
        appStore.getState();
      const sel = state.ui?.itemSelector;

      // Swallow key in canvas context to avoid browser back navigation.
      if (!sel?.zone || !selectedItem) return true;

      if (!permissions.getPermissions({ item: selectedItem }).delete)
        return true;

      dispatch({
        type: "remove",
        index: sel.index,
        zone: sel.zone,
      });
      return true;
    },
    [appStore]
  );

  useHotkey({ delete: true }, deleteSelectedComponent);
  useHotkey({ backspace: true }, deleteSelectedComponent);
};
