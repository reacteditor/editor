import { ComponentConfig, Slot } from "@/core";
import { cn } from "@/lib/utils";

export type RowProps = {
  gap: "none" | "sm" | "md" | "lg" | "xl";
  justify: "start" | "center" | "end" | "between" | "around";
  align: "start" | "center" | "end" | "stretch" | "baseline";
  wrap: "wrap" | "nowrap";
  content: Slot;
};

const gapClasses: Record<RowProps["gap"], string> = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-10",
};

const justifyClasses: Record<RowProps["justify"], string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

const alignClasses: Record<RowProps["align"], string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

export const Row: ComponentConfig<RowProps> = {
  fields: {
    gap: {
      type: "select",
      default: "md",
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
      default: "start",
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
      default: "center",
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
      default: "wrap",
      options: [
        { label: "Wrap", value: "wrap" },
        { label: "No wrap", value: "nowrap" },
      ],
    },
    content: { type: "slot" },
  },
  render: ({ gap, justify, align, wrap, content: Content }) => (
    <Content
      className={cn(
        "flex w-full",
        gapClasses[gap],
        justifyClasses[justify],
        alignClasses[align],
        wrap === "wrap" ? "flex-wrap" : "flex-nowrap"
      )}
    />
  ),
};
