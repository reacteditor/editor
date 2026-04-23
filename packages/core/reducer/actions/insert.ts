import { Data } from "../../types";
import { insert } from "../../lib/data/insert";
import { generateId } from "../../lib/generate-id";
import { InsertAction } from "../actions";
import { PrivateAppState } from "../../types/Internal";
import { walkAppState } from "../../lib/data/walk-app-state";
import { getIdsForParent } from "../../lib/data/get-ids-for-parent";
import { AppStore } from "../../store";
import { populateIds } from "../../lib/data/populate-ids";
import { resolveFieldDefaults } from "../../lib/resolve-field-defaults";

export function insertAction<UserData extends Data>(
  state: PrivateAppState<UserData>,
  action: InsertAction,
  appStore: AppStore
): PrivateAppState<UserData> {
  const id = action.id || generateId(action.componentType);
  const componentConfig =
    appStore.config.components[action.componentType];
  const emptyComponentData = populateIds(
    {
      type: action.componentType,
      props: {
        ...resolveFieldDefaults(componentConfig?.fields),
        id,
      },
    },
    appStore.config
  );

  const [parentId] = action.destinationZone.split(":");
  const idsInPath = getIdsForParent(action.destinationZone, state);

  return walkAppState<UserData>(
    state,
    appStore.config,
    (content, zoneCompound) => {
      if (zoneCompound === action.destinationZone) {
        return insert(
          content || [],
          action.destinationIndex,
          emptyComponentData
        );
      }

      return content;
    },
    (childItem, path) => {
      if (childItem.props.id === id || childItem.props.id === parentId) {
        return childItem;
      } else if (idsInPath.includes(childItem.props.id)) {
        return childItem;
      } else if (path.includes(action.destinationZone)) {
        return childItem;
      }

      return null;
    }
  );
}
