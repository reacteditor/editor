import { ComponentConfig, Slot } from "@/core";
import { ArrowDownUp } from "lucide-react";
import { Stack as StackComponent } from "@/components/stack";

export type StackProps = {
  gap: "none" | "sm" | "md" | "lg" | "xl";
  align: "start" | "center" | "end" | "stretch";
  content: Slot;
};

export const Stack: ComponentConfig<StackProps> = {
  label: "Stack",
  icon: <ArrowDownUp size={16} />,
  category: "layout",
  defaultProps: {
    gap: "md",
    align: "stretch",
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
    align: {
      type: "radio",
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
        { label: "Stretch", value: "stretch" },
      ],
    },
    content: { type: "slot" },
  },
  render: ({ gap, align, content }) => (
    <StackComponent gap={gap} align={align} content={content} />
  ),
};
