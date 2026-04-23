import styles from "./styles.module.css";
import getClassNameFactory from "../../lib/get-class-name-factory";
import { GripVertical } from "lucide-react";
import { ReactElement, ReactNode, Ref, useMemo, useState } from "react";
import { generateId } from "../../lib/generate-id";
import { useDragListener } from "../DragDropContext";
import { useSafeId } from "../../lib/use-safe-id";
import { useDraggable, useDroppable } from "@dnd-kit/react";

const getClassName = getClassNameFactory("Drawer", styles);
const getClassNameItem = getClassNameFactory("DrawerItem", styles);

export const DrawerItemInner = ({
  children,
  name,
  label,
  icon,
  dragRef,
  isDragDisabled,
}: {
  children?: (props: { children: ReactNode; name: string }) => ReactElement;
  name: string;
  label?: string;
  icon?: ReactNode;
  dragRef?: Ref<any>;
  isDragDisabled?: boolean;
}) => {
  const CustomInner = useMemo(
    () =>
      children ||
      (({ children }: { children: ReactNode; name: string }) => (
        <div className={getClassNameItem("default")}>{children}</div>
      )),
    [children]
  );

  return (
    <div
      className={getClassNameItem({ disabled: isDragDisabled })}
      ref={dragRef}
      onMouseDown={(e) => e.preventDefault()}
      data-testid={dragRef ? `drawer-item:${name}` : ""}
      data-editor-drawer-item
    >
      <CustomInner name={name}>
        <div className={getClassNameItem("draggableWrapper")}>
          <div className={getClassNameItem("draggable")}>
            <div className={getClassNameItem("icon")}>
              {icon ?? <GripVertical size={14} />}
            </div>
            <div className={getClassNameItem("name")}>{label ?? name}</div>
          </div>
        </div>
      </CustomInner>
    </div>
  );
};

/**
 * Wrap `useDraggable`, remounting it when the `id` changes.
 *
 * Could be removed by remounting `useDraggable` upstream in dndkit on `id` changes.
 */
const DrawerItemDraggable = ({
  children,
  name,
  label,
  icon,
  id,
  isDragDisabled,
  data,
}: {
  children?: (props: { children: ReactNode; name: string }) => ReactElement;
  name: string;
  label?: string;
  icon?: ReactNode;
  id: string;
  isDragDisabled?: boolean;
  data?: Record<string, any>;
}) => {
  const { ref } = useDraggable({
    id,
    data: { componentType: name, ...(data ?? {}) },
    disabled: isDragDisabled,
    type: "drawer",
  });

  return (
    <div className={getClassName("draggable")}>
      <div className={getClassName("draggableBg")}>
        <DrawerItemInner name={name} label={label} icon={icon}>
          {children}
        </DrawerItemInner>
      </div>
      <div className={getClassName("draggableFg")}>
        <DrawerItemInner
          name={name}
          label={label}
          icon={icon}
          dragRef={ref}
          isDragDisabled={isDragDisabled}
        >
          {children}
        </DrawerItemInner>
      </div>
    </div>
  );
};

const DrawerItem = ({
  name,
  children,
  id,
  label,
  icon,
  index,
  isDragDisabled,
  data,
}: {
  name: string;
  children?: (props: { children: ReactNode; name: string }) => ReactElement;
  id?: string;
  label?: string;
  icon?: ReactNode;
  index?: number; // TODO deprecate
  isDragDisabled?: boolean;
  data?: Record<string, any>;
}) => {
  const resolvedId = id || name;
  const [dynamicId, setDynamicId] = useState(generateId(resolvedId));

  if (typeof index !== "undefined") {
    console.error(
      "Warning: The `index` prop on Drawer.Item is deprecated and no longer required."
    );
  }

  useDragListener(
    "dragend",
    () => {
      setDynamicId(generateId(resolvedId));
    },
    [resolvedId]
  );

  return (
    <div key={dynamicId}>
      <DrawerItemDraggable
        name={name}
        label={label}
        icon={icon}
        id={dynamicId}
        isDragDisabled={isDragDisabled}
        data={data}
      >
        {children}
      </DrawerItemDraggable>
    </div>
  );
};

export const Drawer = ({
  children,
  droppableId,
  direction,
  variant = "list",
}: {
  children: ReactNode;
  droppableId?: string; // TODO deprecate
  direction?: "vertical" | "horizontal"; // TODO deprecate
  variant?: "list" | "tile";
}) => {
  if (droppableId) {
    console.error(
      "Warning: The `droppableId` prop on Drawer is deprecated and no longer required."
    );
  }

  if (direction) {
    console.error(
      "Warning: The `direction` prop on Drawer is deprecated and no longer required to achieve multi-directional dragging."
    );
  }

  const id = useSafeId();

  const { ref } = useDroppable({
    id,
    type: "void",
    collisionPriority: 0, // Never collide with this, but we use it so NestedDroppablePlugin respects the Drawer
  });

  return (
    <div
      className={getClassName({ [variant]: variant })}
      ref={ref}
      data-editor-dnd={id}
      data-editor-drawer
      data-editor-dnd-void
    >
      {children}
    </div>
  );
};

Drawer.Item = DrawerItem;
