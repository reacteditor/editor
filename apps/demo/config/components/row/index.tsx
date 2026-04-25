import { ComponentConfig, Slot } from "@/core";
import { AlignHorizontalJustifyStart } from "lucide-react";
import { Row as RowComponent } from "@/components/row";

export type RowProps = {
  gap: "none" | "sm" | "md" | "lg" | "xl";
  justify: "start" | "center" | "end" | "between" | "around";
  align: "start" | "center" | "end" | "stretch" | "baseline";
  wrap: "wrap" | "nowrap";
  content: Slot;
};

export const Row: ComponentConfig<RowProps> = {
  label: "Row",
  icon: <AlignHorizontalJustifyStart size={16} />,
  category: "layout",
  defaultProps: {
    gap: "md",
    justify: "start",
    align: "center",
    wrap: "wrap",
    content: [],
  },
  fields: {
    gap: {
      type: "select",
      options: [
        { label: "None", value: "none" },
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra large", value: "xl" },
      ],
    },
    justify: {
      type: "select",
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
        { label: "Between", value: "between" },
        { label: "Around", value: "around" },
      ],
    },
    align: {
      type: "select",
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
        { label: "Stretch", value: "stretch" },
        { label: "Baseline", value: "baseline" },
      ],
    },
    wrap: {
      type: "radio",
      options: [
        { label: "Wrap", value: "wrap" },
        { label: "No wrap", value: "nowrap" },
      ],
    },
    content: { type: "slot" },
  },
  render: ({ gap, justify, align, wrap, content }) => (
    <RowComponent
      gap={gap}
      justify={justify}
      align={align}
      wrap={wrap}
      content={content}
    />
  ),
};
