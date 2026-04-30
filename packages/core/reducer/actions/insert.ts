import { Data } from "../../types";
import { insert } from "../../lib/data/insert";
import { generateId } from "../../lib/generate-id";
import { InsertAction } from "../actions";
import { PrivateAppState } from "../../types/Internal";
import { walkAppState } from "../../lib/data/walk-app-state";
import { getIdsForParent } from "../../lib/data/get-ids-for-parent";
import { AppStore } from "../../store";
import { populateIds } from "../../lib/data/populate-ids";

export function insertAction<UserData extends Data>(
  state: PrivateAppState<UserData>,
  action: InsertAction,
  appStore: AppStore
): PrivateAppState<UserData> {
  const id = action.id || generateId(action.componentType);
  const componentConfig = appStore.config.components[action.componentType];
  const isGlobalType = (componentConfig as any)?.global === true;
  const defaultProps = (componentConfig?.defaultProps || {}) as Record<
    string,
    any
  >;

  const sourceData = action.data
    ? { ...action.data, props: { ...action.data.props, id } }
    : {
        type: action.componentType,
        props: { ...defaultProps, id },
        ...(isGlobalType ? { synced: true } : {}),
      };

  const emptyComponentData = populateIds(
    sourceData,
    appStore.config,
    !!action.data
  );

  const [parentId] = action.destinationZone.split(":");
  const idsInPath = getIdsForParent(action.destinationZone, state);

  // Seed data.globals[type] from defaultProps the first time a global-marked
  // component lands on the page, so resolveGlobals has something to overlay.
  let nextData = state.data;
  if (
    isGlobalType &&
    !((nextData as Data).globals ?? {})[action.componentType]
  ) {
    nextData = {
      ...nextData,
      globals: {
        ...((nextData as Data).globals ?? {}),
        [action.componentType]: { props: { ...defaultProps } },
      },
    } as UserData;
  }

  const seededState =
    nextData === state.data ? state : { ...state, data: nextData };

  return walkAppState<UserData>(
    seededState,
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
