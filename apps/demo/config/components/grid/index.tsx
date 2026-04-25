import { ComponentConfig, Slot } from "@/core";
import { LayoutGrid } from "lucide-react";
import { Grid as GridComponent } from "@/components/grid";

export type GridProps = {
  columns: "1" | "2" | "3" | "4" | "5" | "6";
  gap: "sm" | "md" | "lg" | "xl";
  responsive: "on" | "off";
  content: Slot;
};

export const Grid: ComponentConfig<GridProps> = {
  label: "Grid",
  icon: <LayoutGrid size={16} />,
  category: "layout",
  defaultProps: {
    columns: "3",
    gap: "md",
    responsive: "on",
    content: [],
  },
  fields: {
    columns: {
      type: "select",
      options: [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
      ],
    },
    gap: {
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra large", value: "xl" },
      ],
    },
    responsive: {
      type: "radio",
      options: [
        { label: "On", value: "on" },
        { label: "Off", value: "off" },
      ],
    },
    content: { type: "slot" },
  },
  render: ({ columns, gap, responsive, content }) => (
    <GridComponent
      columns={columns}
      gap={gap}
      responsive={responsive}
      content={content}
    />
  ),
};
