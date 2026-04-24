import { ComponentConfig, Slot } from "@/core";
import { cn } from "@/lib/utils";

export type SectionProps = {
  background: "default" | "muted" | "primary" | "gradient";
  paddingY: "none" | "sm" | "md" | "lg" | "xl";
  content: Slot;
};

const backgroundClasses: Record<SectionProps["background"], string> = {
  default: "bg-background text-foreground",
  muted: "bg-muted text-foreground",
  primary: "bg-primary text-primary-foreground",
  gradient:
    "bg-gradient-to-b from-background via-background to-muted text-foreground",
};

const paddingYClasses: Record<SectionProps["paddingY"], string> = {
  none: "py-0",
  sm: "py-8",
  md: "py-16",
  lg: "py-24",
  xl: "py-32 md:py-40",
};

export const Section: ComponentConfig<SectionProps> = {
  fields: {
    background: {
      type: "select",
      default: "default",
      options: [
        { label: "Default", value: "default" },
        { label: "Muted", value: "muted" },
        { label: "Primary", value: "primary" },
        { label: "Gradient", value: "gradient" },
      ],
    },
    paddingY: {
      type: "select",
      default: "lg",
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
  render: ({ background, paddingY, content: Content }) => (
    <Content
      className={cn(
        "relative block w-full",
        backgroundClasses[background],
        paddingYClasses[paddingY]
      )}
    />
  ),
};
