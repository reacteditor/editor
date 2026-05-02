import { ComponentData } from "../types";
import { DefaultComponentProps, DefaultRootFieldProps } from "../types/Props";
import { useAppStoreApi } from "../store";
import { getItem } from "./data/get-item";
import { getSelectorForId } from "./get-selector-for-id";
import { generateId } from "./generate-id";
import { rootDroppableId } from "./root-droppable-id";

export type Parent = { id: string; slot: string };

export type InsertComponentArgs = {
  type: string;
  parent?: Parent;
  index?: number;
  data?: ComponentData;
  select?: boolean;
};

export type MoveDestination = {
  parent?: Parent;
  index: number;
};

export type EditorCommands = {
  insertComponent: (args: InsertComponentArgs) => { id: string };
  removeComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  moveComponent: (id: string, to: MoveDestination) => void;
  replaceComponent: (id: string, data: ComponentData) => void;
  updateProps: (
    id: string,
    updater:
      | Partial<DefaultComponentProps>
      | ((prev: DefaultComponentProps) => Partial<DefaultComponentProps>)
  ) => void;
  updateRoot: (
    updater:
      | Partial<DefaultRootFieldProps>
      | ((prev: DefaultRootFieldProps) => Partial<DefaultRootFieldProps>)
  ) => void;
  selectComponent: (id: string | null) => void;
  scrollToComponent: (id: string) => void;
};

const parentToZone = (parent?: Parent): string =>
  parent ? `${parent.id}:${parent.slot}` : rootDroppableId;

export const createEditorCommands = (
  appStore: ReturnType<typeof useAppStoreApi>
): EditorCommands => {
  const { getState } = appStore;

  const getZoneLength = (zone: string): number =>
    getState().state.indexes.zones[zone]?.contentIds.length ?? 0;

  const insertComponent: EditorCommands["insertComponent"] = ({
    type,
    parent,
    index,
    data,
    select = true,
  }) => {
    const id = data?.props.id ?? generateId(type);
    const zone = parentToZone(parent);
    const destIndex = index ?? getZoneLength(zone);
    const dispatch = getState().dispatch;

    dispatch({
      type: "insert",
      componentType: type,
      destinationIndex: destIndex,
      destinationZone: zone,
      id,
      ...(data ? { data: { ...data, props: { ...data.props, id } } } : {}),
    });

    if (select) {
      dispatch({
        type: "setUi",
        ui: { itemSelector: { index: destIndex, zone } },
      });
    }

    return { id };
  };

  const removeComponent: EditorCommands["removeComponent"] = (id) => {
    const sel = getSelectorForId(getState().state, id);
    if (!sel?.zone) return;
    getState().dispatch({ type: "remove", index: sel.index, zone: sel.zone });
  };

  const duplicateComponent: EditorCommands["duplicateComponent"] = (id) => {
    const sel = getSelectorForId(getState().state, id);
    if (!sel?.zone) return;
    getState().dispatch({
      type: "duplicate",
      sourceIndex: sel.index,
      sourceZone: sel.zone,
    });
  };

  const moveComponent: EditorCommands["moveComponent"] = (id, to) => {
    const sel = getSelectorForId(getState().state, id);
    if (!sel?.zone) return;
    getState().dispatch({
      type: "move",
      sourceIndex: sel.index,
      sourceZone: sel.zone,
      destinationIndex: to.index,
      destinationZone: parentToZone(to.parent),
    });
  };

  const replaceComponent: EditorCommands["replaceComponent"] = (id, data) => {
    const sel = getSelectorForId(getState().state, id);
    if (!sel?.zone) return;
    const existing = getItem(sel, getState().state);
    if (!existing) return;
    getState().dispatch({
      type: "replace",
      destinationIndex: sel.index,
      destinationZone: sel.zone,
      data: { ...data, props: { ...data.props, id: existing.props.id } },
    });
  };

  const updateProps: EditorCommands["updateProps"] = (id, updater) => {
    const sel = getSelectorForId(getState().state, id);
    if (!sel) return;
    const existing = getItem(sel, getState().state);
    if (!existing) return;
    const patch =
      typeof updater === "function" ? updater(existing.props) : updater;
    getState().dispatch({
      type: "replace",
      destinationIndex: sel.index,
      destinationZone: sel.zone,
      data: {
        ...existing,
        props: { ...existing.props, ...patch, id: existing.props.id },
      },
    });
  };

  const updateRoot: EditorCommands["updateRoot"] = (updater) => {
    const root = getState().state.data.root ?? { props: {} };
    const prevProps = (root as { props?: DefaultRootFieldProps }).props ?? {};
    const patch = typeof updater === "function" ? updater(prevProps) : updater;
    getState().dispatch({
      type: "replaceRoot",
      root: { ...root, props: { ...prevProps, ...patch } },
    });
  };

  const scrollToComponent: EditorCommands["scrollToComponent"] = (id) => {
    getState().scrollToComponent(id);
  };

  const selectComponent: EditorCommands["selectComponent"] = (id) => {
    const dispatch = getState().dispatch;
    if (id === null) {
      dispatch({ type: "setUi", ui: { itemSelector: null } });
      return;
    }
    const sel = getSelectorForId(getState().state, id);
    if (!sel?.zone) return;
    dispatch({
      type: "setUi",
      ui: { itemSelector: { index: sel.index, zone: sel.zone } },
    });
  };

  return {
    insertComponent,
    removeComponent,
    duplicateComponent,
    moveComponent,
    replaceComponent,
    updateProps,
    updateRoot,
    selectComponent,
    scrollToComponent,
  };
};
