import {
  Config,
  UserGenerics,
  ResolveDataTrigger,
  ComponentData,
} from "../types";
import { createContext, useContext, useEffect, useState } from "react";
import { AppStore, useAppStoreApi } from "../store";
import {
  GetPermissions,
  RefreshPermissions,
} from "../store/slices/permissions";
import { HistorySlice } from "../store/slices/history";
import { createStore, StoreApi, useStore } from "zustand";
import { makeStatePublic } from "./data/make-state-public";
import { getItem, ItemSelector } from "./data/get-item";
import { resolveDataById } from "./data/resolve-data-by-id";
import { resolveDataBySelector } from "./data/resolve-data-by-selector";
import { getSelectorForId } from "./get-selector-for-id";
import { EditorCommands, createEditorCommands } from "./editor-commands";

export type UseEditorData<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
> = EditorCommands & {
  appState: G["UserPublicAppState"];
  config: UserConfig;
  dispatch: AppStore["dispatch"];
  getPermissions: GetPermissions<UserConfig>;
  refreshPermissions: RefreshPermissions<UserConfig>;
  resolveDataById: (id: string, trigger?: ResolveDataTrigger) => void;
  resolveDataBySelector: (
    selector: ItemSelector,
    trigger?: ResolveDataTrigger
  ) => void;
  selectedItem: G["UserComponentData"] | null;
  getItemBySelector: (
    selector: ItemSelector
  ) => G["UserComponentData"] | undefined;
  getItemById: (id: string) => G["UserComponentData"] | undefined;
  getSelectorForId: (id: string) => Required<ItemSelector> | undefined;
  getParentById: (id: string) => ComponentData | undefined;
  history: {
    back: HistorySlice["back"];
    forward: HistorySlice["forward"];
    setHistories: HistorySlice["setHistories"];
    setHistoryIndex: HistorySlice["setHistoryIndex"];
    histories: HistorySlice["histories"];
    index: HistorySlice["index"];
    hasPast: boolean;
    hasFuture: boolean;
  };
};

export type EditorApi<UserConfig extends Config = Config> =
  UseEditorData<UserConfig>;

type UseEditorStore<UserConfig extends Config = Config> = EditorApi<UserConfig>;

type PickedStore = Pick<
  AppStore,
  "config" | "dispatch" | "selectedItem" | "permissions" | "history" | "state"
>;

export const generateUseEditor = (
  store: PickedStore,
  getState: ReturnType<typeof useAppStoreApi>["getState"],
  commands: EditorCommands
): UseEditorStore => {
  const history: UseEditorStore["history"] = {
    back: store.history.back,
    forward: store.history.forward,
    setHistories: store.history.setHistories,
    setHistoryIndex: store.history.setHistoryIndex,
    hasPast: store.history.hasPast(),
    hasFuture: store.history.hasFuture(),
    histories: store.history.histories,
    index: store.history.index,
  };

  const storeData: EditorApi = {
    ...commands,
    appState: makeStatePublic(store.state),
    config: store.config,
    dispatch: store.dispatch,
    getPermissions: store.permissions.getPermissions,
    refreshPermissions: store.permissions.refreshPermissions,
    resolveDataById: (id, trigger) => resolveDataById(id, getState, trigger),
    resolveDataBySelector: (selector, trigger) =>
      resolveDataBySelector(selector, getState, trigger),
    history,
    selectedItem: store.selectedItem || null,
    getItemBySelector: (selector) => getItem(selector, store.state),
    getItemById: (id) => store.state.indexes.nodes[id].data,
    getSelectorForId: (id) => getSelectorForId(store.state, id),
    getParentById: (id) => {
      const node = store.state.indexes.nodes[id];
      const parentId = node.parentId;
      if (parentId === null) return;
      const parentNode = store.state.indexes.nodes[parentId];
      if (!parentNode) return;
      return parentNode.data;
    },
  };

  (storeData as any).__private = {
    appState: store.state,
  };

  return storeData;
};

export const UseEditorStoreContext = createContext<StoreApi<UseEditorStore> | null>(
  null
);

const convertToPickedStore = (store: AppStore): PickedStore => {
  return {
    state: store.state,
    config: store.config,
    dispatch: store.dispatch,
    permissions: store.permissions,
    history: store.history,
    selectedItem: store.selectedItem,
  };
};

/**
 * Mirror changes in appStore to useEditorStore
 */
export const useRegisterUseEditorStore = (
  appStore: ReturnType<typeof useAppStoreApi>
) => {
  const [commands] = useState(() => createEditorCommands(appStore));

  const [useEditorStore] = useState(() =>
    createStore(() =>
      generateUseEditor(
        convertToPickedStore(appStore.getState()),
        appStore.getState,
        commands
      )
    )
  );

  useEffect(() => {
    // Subscribe here isn't doing anything as selection isn't shallow
    return appStore.subscribe(
      (store) => convertToPickedStore(store),
      (pickedStore) => {
        useEditorStore.setState(
          generateUseEditor(pickedStore, appStore.getState, commands)
        );
      }
    );
  }, [commands]);

  return useEditorStore;
};

/**
 * createUseEditor
 *
 * Create a typed useEditor hook, which is necessary because the user may provide a generic type but not
 * a selector type, and TS does not currently support partial inference.
 * Related: https://github.com/microsoft/TypeScript/issues/26242
 *
 * @returns a typed useEditor function
 */
export function createUseEditor<UserConfig extends Config = Config>() {
  return function useEditor<T = EditorApi<UserConfig>>(
    selector: (state: UseEditorStore<UserConfig>) => T
  ): T {
    const useEditorApi = useContext(UseEditorStoreContext);

    if (!useEditorApi) {
      throw new Error("useEditor must be used inside <Editor>.");
    }

    const result = useStore(
      useEditorApi as unknown as StoreApi<UseEditorStore<UserConfig>>,
      selector ?? ((s) => s as T)
    );

    return result;
  };
}

export function useEditor<UserConfig extends Config = Config>() {
  useEffect(() => {
    console.warn(
      "You're using the `useEditor` method without a selector, which may cause unnecessary re-renders. Replace with `createUseEditor` and provide a selector for improved performance."
    );
  }, []);

  return createUseEditor<UserConfig>()((s) => s);
}

/**
 * Get the latest state without relying on a render
 *
 * @returns EditorApi
 */
export function useGetEditor() {
  const useEditorApi = useContext(UseEditorStoreContext);

  if (!useEditorApi) {
    throw new Error("useEditorGet must be used inside <Editor>.");
  }

  return useEditorApi.getState;
}
