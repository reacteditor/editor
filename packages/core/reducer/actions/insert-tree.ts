import { ComponentData, Data } from "../../types";
import { insert } from "../../lib/data/insert";
import { InsertTreeAction } from "../actions";
import { PrivateAppState } from "../../types/Internal";
import { walkAppState } from "../../lib/data/walk-app-state";
import { getIdsForParent } from "../../lib/data/get-ids-for-parent";
import { AppStore } from "../../store";

function collectIds(node: ComponentData, acc: Set<string>) {
  if (node.props?.id) acc.add(node.props.id);

  for (const value of Object.values(node.props ?? {})) {
    if (Array.isArray(value)) {
      for (const child of value) {
        if (child && typeof child === "object" && "type" in child && "props" in child) {
          collectIds(child as ComponentData, acc);
        }
      }
    }
  }
}

export function insertTreeAction<UserData extends Data>(
  state: PrivateAppState<UserData>,
  action: InsertTreeAction,
  appStore: AppStore
): PrivateAppState<UserData> {
  const { destinationZone, destinationIndex, nodes } = action;

  const insertedIds = new Set<string>();
  nodes.forEach((node) => collectIds(node, insertedIds));

  const [parentId] = destinationZone.split(":");
  const idsInPath = getIdsForParent(destinationZone, state);

  return walkAppState<UserData>(
    state,
    appStore.config,
    (content, zoneCompound) => {
      if (zoneCompound === destinationZone) {
        return nodes.reduce(
          (acc, node, offset) => insert(acc, destinationIndex + offset, node),
          content || []
        );
      }
      return content;
    },
    (childItem, path) => {
      if (insertedIds.has(childItem.props.id) || childItem.props.id === parentId) {
        return childItem;
      } else if (idsInPath.includes(childItem.props.id)) {
        return childItem;
      } else if (path.includes(destinationZone)) {
        return childItem;
      }
      return null;
    }
  );
}
