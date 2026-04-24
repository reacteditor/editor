import { ComponentConfig, Slot } from "@/core";
import { cn } from "@/lib/utils";

export type StackProps = {
  gap: "none" | "sm" | "md" | "lg" | "xl";
  align: "start" | "center" | "end" | "stretch";
  content: Slot;
};

const gapClasses: Record<StackProps["gap"], string> = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-10",
};

const alignClasses: Record<StackProps["align"], string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export const Stack: ComponentConfig<StackProps> = {
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
    align: {
      type: "radio",
      default: "stretch",
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
        { label: "Stretch", value: "stretch" },
      ],
    },
    content: { type: "slot" },
  },
  render: ({ gap, align, content: Content }) => (
    <Content
      className={cn(
        "flex w-full flex-col",
        gapClasses[gap],
        alignClasses[align]
      )}
    />
  ),
};
