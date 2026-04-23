import React from "react";

import { ComponentConfig } from "@/core";
import { spacingOptions } from "../../options";
import { getClassNameFactory } from "@/core/lib";

import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Space", styles);

export type SpaceProps = {
  direction?: "" | "vertical" | "horizontal";
  size: string;
};

export const Space: ComponentConfig<SpaceProps> = {
  label: "Space",
  fields: {
    size: {
      type: "select",
      options: spacingOptions,
      default: "24px",
    },
    direction: {
      type: "radio",
      options: [
        { value: "vertical", label: "Vertical" },
        { value: "horizontal", label: "Horizontal" },
        { value: "", label: "Both" },
      ],
      default: "",
    },
  },
  inline: true,
  render: ({ direction, size, editor }) => {
    return (
      <div
        ref={editor.dragRef}
        className={getClassName(direction ? { [direction]: direction } : {})}
        style={{ "--size": size } as any}
      />
    );
  },
};
