import { ComponentConfig, Slot } from "@/core";
import { cn } from "@/lib/utils";

export type GridProps = {
  columns: "1" | "2" | "3" | "4" | "5" | "6";
  gap: "sm" | "md" | "lg" | "xl";
  responsive: "on" | "off";
  content: Slot;
};

const columnsClasses: Record<
  GridProps["columns"],
  { responsive: string; fixed: string }
> = {
  "1": { responsive: "grid-cols-1", fixed: "grid-cols-1" },
  "2": { responsive: "grid-cols-1 md:grid-cols-2", fixed: "grid-cols-2" },
  "3": {
    responsive: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    fixed: "grid-cols-3",
  },
  "4": {
    responsive: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    fixed: "grid-cols-4",
  },
  "5": {
    responsive: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    fixed: "grid-cols-5",
  },
  "6": {
    responsive: "grid-cols-2 md:grid-cols-4 lg:grid-cols-6",
    fixed: "grid-cols-6",
  },
};

const gapClasses: Record<GridProps["gap"], string> = {
  sm: "gap-3",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
};

export const Grid: ComponentConfig<GridProps> = {
  fields: {
    columns: {
      type: "select",
      default: "3",
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
      default: "md",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra large", value: "xl" },
      ],
    },
    responsive: {
      type: "radio",
      default: "on",
      options: [
        { label: "On", value: "on" },
        { label: "Off", value: "off" },
      ],
    },
    content: { type: "slot" },
  },
  render: ({ columns, gap, responsive, content: Content }) => (
    <Content
      className={cn(
        "grid w-full",
        responsive === "on"
          ? columnsClasses[columns].responsive
          : columnsClasses[columns].fixed,
        gapClasses[gap]
      )}
    />
  ),
};
