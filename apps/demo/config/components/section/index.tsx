import { ComponentConfig, Slot } from "@/core";
import { Minus } from "lucide-react";
import { Section as SectionComponent } from "@/components/section";

export type SectionProps = {
  background: "default" | "muted" | "primary" | "gradient";
  paddingY: "none" | "sm" | "md" | "lg" | "xl";
  content: Slot;
};

export const Section: ComponentConfig<SectionProps> = {
  label: "Section",
  icon: <Minus size={16} />,
  category: "layout",
  defaultProps: {
    background: "default",
    paddingY: "lg",
    content: [],
  },
  fields: {
    background: {
      type: "select",
      options: [
        { label: "Default", value: "default" },
        { label: "Muted", value: "muted" },
        { label: "Primary", value: "primary" },
        { label: "Gradient", value: "gradient" },
      ],
    },
    paddingY: {
      type: "select",
      options: [
        { label: "None", value: "none" },
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra large", value: "xl" },
      ],
    },
    content: { type: "slot" },
  },
  render: ({ background, paddingY, content }) => (
    <SectionComponent
      background={background}
      paddingY={paddingY}
      content={content}
    />
  ),
};
