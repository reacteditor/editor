import styles from "./styles.module.css";
import getClassNameFactory from "../../lib/get-class-name-factory";
import { ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAppStore } from "../../store";
import { Drawer } from "../Drawer";
import { Block } from "../../types";

const getClassName = getClassNameFactory("BlockList", styles);

function rootComponentType(block: Block): string | null {
  if ("component" in block && block.component) return block.component as string;
  if ("content" in block && block.content) {
    const first = Array.isArray(block.content) ? block.content[0] : block.content;
    return first?.type ?? null;
  }
  return null;
}

const BlockListItem = ({
  blockName,
  block,
}: {
  blockName: string;
  block: Block;
}) => {
  const componentType = rootComponentType(block);
  const canInsert = useAppStore((s) =>
    componentType
      ? s.permissions.getPermissions({ type: componentType }).insert
      : true
  );

  return (
    <Drawer.Item
      name={componentType ?? blockName}
      label={block.label}
      icon={block.icon}
      isDragDisabled={!canInsert}
      data={{ blockName }}
    />
  );
};

type BlockListProps = {
  id: string;
  children?: ReactNode;
  title?: string;
};

const BlockList = ({ children, title, id }: BlockListProps) => {
  const blocks = useAppStore((s) => s.config.blocks);
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
          <div>{title}</div>
          <div className={getClassName("titleIcon")}>
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
        </button>
      )}
      <div className={getClassName("content")}>
        <Drawer>
          {children ??
            Object.entries(blocks ?? {}).map(([blockName, block]) => (
              <BlockListItem
                key={blockName}
                blockName={blockName}
                block={block}
              />
            ))}
        </Drawer>
      </div>
    </div>
  );
};

BlockList.Item = BlockListItem;

export { BlockList };
