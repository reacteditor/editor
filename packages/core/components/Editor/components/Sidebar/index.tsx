import React, { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import getClassNameFactory from "../../../../lib/get-class-name-factory";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Sidebar", styles);

interface SidebarProps {
  position: "left" | "right";
  expanded: boolean;
  onToggle: () => void;
  title: ReactNode;
  /** Optional content rendered in the header to the right of the title. */
  headerActions?: ReactNode;
  children: React.ReactNode;
}

/**
 * Floating, collapsible panel positioned over the canvas. The header pill
 * (title + chevron) is always rendered; clicking it toggles `expanded`,
 * which mounts/unmounts the body.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  position,
  expanded,
  onToggle,
  title,
  headerActions,
  children,
}) => {
  return (
    <aside
      className={getClassName({ [position]: true, expanded })}
      aria-expanded={expanded}
    >
      <button
        type="button"
        className={getClassName("header")}
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <ChevronRight size={14} className={getClassName("chevron")} />
        <span className={getClassName("title")}>{title}</span>
        {headerActions}
      </button>
      {expanded && <div className={getClassName("body")}>{children}</div>}
    </aside>
  );
};
