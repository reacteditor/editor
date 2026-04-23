import { ComponentData, ComponentDataOptionalId } from "../types";
import { InsertTreeAction } from "../reducer";
import { useAppStoreApi } from "../store";
import { generateId } from "./generate-id";
import { populateIds } from "./data/populate-ids";
import { resolveFieldDefaults } from "./resolve-field-defaults";

function toRoots(
  content: ComponentDataOptionalId | ComponentDataOptionalId[]
): ComponentDataOptionalId[] {
  return Array.isArray(content) ? content : [content];
}

export const insertBlock = async (
  blockName: string,
  zone: string,
  index: number,
  appStore: ReturnType<typeof useAppStoreApi>
) => {
  const { getState } = appStore;
  const state = getState();
  const config = state.config;

  const block = config.blocks?.[blockName];
  if (!block) {
    console.warn(`insertBlock: no block named "${blockName}" in config.blocks`);
    return;
  }

  // Normalize shorthand → composite. Shorthand merges field defaults under
  // the block's explicit props.
  let roots: ComponentDataOptionalId[];
  if ("component" in block && block.component) {
    const componentConfig = config.components[block.component as string];
    const fieldDefaults = resolveFieldDefaults(componentConfig?.fields);
    roots = [
      {
        type: block.component as string,
        props: { ...fieldDefaults, ...(block.props ?? {}) },
      },
    ];
  } else if ("content" in block && block.content) {
    roots = toRoots(block.content);
  } else {
    return;
  }

  // Regenerate every id in each root (including nested slot children). Each
  // drop produces a fresh instance — ids from the block template never leak.
  const prepared: ComponentData[] = roots.map((root) => {
    const withId = {
      ...root,
      props: { ...root.props, id: generateId(root.type) },
    } as ComponentData;
    return populateIds(withId, config, true);
  });

  const insertActionData: InsertTreeAction = {
    type: "insertTree",
    destinationIndex: index,
    destinationZone: zone,
    nodes: prepared,
  };

  const dispatch = getState().dispatch;
  dispatch({ ...insertActionData, recordHistory: true });

  // Select the first inserted root.
  dispatch({ type: "setUi", ui: { itemSelector: { index, zone } } });
};
