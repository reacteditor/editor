import React from "react";
import getClassNameFactory from "../../../../lib/get-class-name-factory";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Sidebar", styles);

interface SidebarProps {
  position: "left" | "right";
  children: React.ReactNode;
}

/**
 * Fixed sidebar column anchored to the left or right of the editor.
 * Visibility is controlled by the parent — render the component only
 * when the consumer wants it visible (`leftSideBarVisible` /
 * `rightSideBarVisible` in app state).
 */
export const Sidebar: React.FC<SidebarProps> = ({ position, children }) => {
  return (
    <aside className={getClassName({ [position]: true })}>
      <div className={getClassName("body")}>{children}</div>
    </aside>
  );
};
