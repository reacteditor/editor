import { ComponentConfig, Slot } from "@/core";
import { cn } from "@/lib/utils";

export type ContainerProps = {
  maxWidth: "sm" | "md" | "lg" | "xl" | "prose" | "full";
  paddingX: "none" | "sm" | "md" | "lg";
  content: Slot;
};

const maxWidthClasses: Record<ContainerProps["maxWidth"], string> = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  prose: "max-w-prose",
  full: "max-w-none",
};

const paddingXClasses: Record<ContainerProps["paddingX"], string> = {
  none: "px-0",
  sm: "px-4",
  md: "px-6 md:px-8",
  lg: "px-6 md:px-10 lg:px-12",
};

export const Container: ComponentConfig<ContainerProps> = {
  fields: {
    maxWidth: {
      type: "select",
      default: "xl",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra large", value: "xl" },
        { label: "Prose", value: "prose" },
        { label: "Full", value: "full" },
      ],
    },
    paddingX: {
      type: "select",
      default: "md",
      options: [
        { label: "None", value: "none" },
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    content: { type: "slot" },
  },
  render: ({ maxWidth, paddingX, content: Content }) => (
    <Content
      className={cn(
        "mx-auto w-full",
        maxWidthClasses[maxWidth],
        paddingXClasses[paddingX]
      )}
    />
  ),
};
