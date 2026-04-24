import styles from "./styles.module.css";
import getClassNameFactory from "../../lib/get-class-name-factory";
import { ReactNode, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useAppStore } from "../../store";
import { Drawer } from "../Drawer";

const getClassName = getClassNameFactory("ComponentList", styles);

const ComponentListItem = ({
  name,
  label,
  icon,
}: {
  name: string;
  label?: string;
  icon?: ReactNode;
  index?: number; // TODO deprecate
}) => {
  const overrides = useAppStore((s) => s.overrides);
  const canInsert = useAppStore(
    (s) =>
      s.permissions.getPermissions({
        type: name,
      }).insert
  );

  // DEPRECATED
  useEffect(() => {
    if (overrides.componentItem) {
      console.warn(
        "The `componentItem` override has been deprecated and renamed to `drawerItem`"
      );
    }
  }, [overrides]);

  return (
    <Drawer.Item label={label} name={name} icon={icon} isDragDisabled={!canInsert}>
      {overrides.componentItem ?? overrides.drawerItem}
    </Drawer.Item>
  );
};

const ComponentList = ({
  children,
  title,
  id,
}: {
  id: string;
  children?: ReactNode;
  title?: string;
}) => {
  const config = useAppStore((s) => s.config);
  const setUi = useAppStore((s) => s.setUi);
  const componentList = useAppStore((s) => s.state.ui.componentList);

  const { expanded = true } = componentList[id] || {};

  return (
    <div className={getClassName({ isExpanded: expanded })}>
      {title && (
        <button
          type="button"
          className={getClassName("title")}
          onClick={() =>
            setUi({
              componentList: {
                ...componentList,
                [id]: {
                  ...componentList[id],
                  expanded: !expanded,
                },
              },
            })
          }
          title={
            expanded
              ? `Collapse${title ? ` ${title}` : ""}`
              : `Expand${title ? ` ${title}` : ""}`
          }
        >
          <div className={getClassName("titleIcon")}>
            <ChevronRight size={12} />
          </div>
          <div>{title}</div>
        </button>
      )}
      <div className={getClassName("content")}>
        <Drawer variant="tile">
          {children ||
            Object.keys(config.components).map((componentKey) => {
              const componentConf = config.components[componentKey] || {};
              return (
                <ComponentListItem
                  key={componentKey}
                  label={(componentConf["label"] ?? componentKey) as string}
                  icon={(componentConf as { icon?: ReactNode })["icon"]}
                  name={componentKey}
                />
              );
            })}
        </Drawer>
      </div>
    </div>
  );
};

ComponentList.Item = ComponentListItem;

export { ComponentList };
