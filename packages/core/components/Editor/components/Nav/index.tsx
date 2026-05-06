import styles from "./styles.module.css";
import { ReactNode } from "react";
import { getClassNameFactory } from "../../../../lib";

const getClassName = getClassNameFactory("Nav", styles);
const getClassNameItem = getClassNameFactory("NavItem", styles);

export type MenuItem = {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
  isActive?: boolean;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
};

export const MenuItem = ({
  label,
  icon,
  onClick,
  isActive,
  mobileOnly,
  desktopOnly,
}: MenuItem) => {
  return (
    <li
      className={getClassNameItem({
        active: isActive,
        mobileOnly,
        desktopOnly,
      })}
    >
      {onClick && (
        <div className={getClassNameItem("link")} onClick={onClick}>
          {icon && <span className={getClassNameItem("linkIcon")}>{icon}</span>}
          <span className={getClassNameItem("linkLabel")}>{label}</span>
        </div>
      )}
    </li>
  );
};

export const Nav = ({
  items,
  footer,
  orientation = "vertical",
}: {
  items: Record<string, MenuItem>;
  footer?: ReactNode;
  orientation?: "vertical" | "horizontal";
}) => {
  return (
    <nav className={getClassName({ horizontal: orientation === "horizontal" })}>
      <ul className={getClassName("list")}>
        {Object.entries(items).map(([key, item]) => (
          <MenuItem key={key} {...item} />
        ))}
      </ul>
      {footer && <div className={getClassName("footer")}>{footer}</div>}
    </nav>
  );
};
