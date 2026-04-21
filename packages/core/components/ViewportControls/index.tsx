import { Expand, Monitor, Smartphone, Tablet, X } from "lucide-react";
import { IconButton } from "../IconButton";
import { useAppStore } from "../../store";
import { ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { getClassNameFactory } from "../../lib";

import styles from "./styles.module.css";
import { Viewport } from "../../types";

const icons = {
  Smartphone: <Smartphone size={16} />,
  Tablet: <Tablet size={16} />,
  Monitor: <Monitor size={16} />,
  FullWidth: <Expand size={16} />,
};

const getClassName = getClassNameFactory("ViewportControls", styles);
const getClassNameButton = getClassNameFactory("ViewportButton", styles);

const ActionButton = ({
  children,
  title,
  onClick,
  isActive,
  disabled,
}: {
  children: ReactNode;
  title: string;
  onClick: (e: SyntheticEvent) => void;
  isActive?: boolean;
  disabled?: boolean;
}) => {
  return (
    <span className={getClassNameButton({ isActive })} suppressHydrationWarning>
      <IconButton
        type="button"
        title={title}
        disabled={disabled || isActive}
        onClick={onClick}
        suppressHydrationWarning
      >
        <span className={getClassNameButton("inner")}>{children}</span>
      </IconButton>
    </span>
  );
};

export const ViewportControls = ({
  onViewportChange,
  fullScreen,
}: {
  onViewportChange: (viewport: Viewport) => void;
  fullScreen?: boolean;
}) => {
  const viewports = useAppStore((s) => s.viewports);
  const uiViewports = useAppStore((s) => s.state.ui.viewports);

  const [activeViewport, setActiveViewport] = useState(
    uiViewports.current.width
  );

  useEffect(() => {
    setActiveViewport(uiViewports.current.width);
  }, [uiViewports.current]);

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={getClassName({ isExpanded, fullScreen })}
      suppressHydrationWarning // Suppress hydration warning as frame is not visible until after load
    >
      <div className={getClassName("actions")}>
        <div className={getClassName("actionsInner")}>
          {viewports.map((viewport, i) => (
            <ActionButton
              key={i}
              title={
                viewport.label
                  ? `Switch to ${viewport.label} viewport`
                  : "Switch viewport"
              }
              onClick={() => {
                setActiveViewport(viewport.width);
                onViewportChange(viewport);
              }}
              isActive={activeViewport === viewport.width}
            >
              {typeof viewport.icon === "string"
                ? icons[viewport.icon as keyof typeof icons] || viewport.icon
                : viewport.icon || icons.Smartphone}
            </ActionButton>
          ))}
        </div>
      </div>

      <button
        className={getClassName("toggleButton")}
        title="Toggle viewport menu"
        onClick={() => setIsExpanded((s) => !s)}
      >
        {isExpanded ? <X size={16} /> : <Monitor size={16} />}
      </button>
    </div>
  );
};
