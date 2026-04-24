import * as React from "react";
import { ComponentConfig } from "@/core";
import { cn } from "@/lib/utils";

export type TypographyProps = {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1" | "body2";
  content: string;
  align: "left" | "center" | "right";
};

const variantClasses: Record<TypographyProps["variant"], string> = {
  h1: "text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]",
  h2: "text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]",
  h3: "text-3xl md:text-4xl font-semibold tracking-tight leading-tight",
  h4: "text-2xl md:text-3xl font-semibold tracking-tight leading-snug",
  h5: "text-xl md:text-2xl font-semibold leading-snug",
  h6: "text-lg md:text-xl font-semibold leading-snug",
  body1: "text-lg leading-relaxed text-muted-foreground",
  body2: "text-base leading-relaxed text-muted-foreground",
};

const alignClasses: Record<TypographyProps["align"], string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const Typography: ComponentConfig<TypographyProps> = {
  fields: {
    variant: {
      type: "select",
      default: "h2",
      options: [
        { label: "Heading 1", value: "h1" },
        { label: "Heading 2", value: "h2" },
        { label: "Heading 3", value: "h3" },
        { label: "Heading 4", value: "h4" },
        { label: "Heading 5", value: "h5" },
        { label: "Heading 6", value: "h6" },
        { label: "Body 1", value: "body1" },
        { label: "Body 2", value: "body2" },
      ],
    },
    content: { type: "richtext" },
    align: {
      type: "radio",
      default: "left",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
  },
  render: ({ variant, content, align }) => {
    const Tag = (variant.startsWith("h") ? variant : "p") as
      | "h1"
      | "h2"
      | "h3"
      | "h4"
      | "h5"
      | "h6"
      | "p";
    return (
      <Tag
        className={cn(
          "text-foreground",
          variantClasses[variant],
          alignClasses[align]
        )}
      >
        {content as unknown as React.ReactNode}
      </Tag>
    );
  },
};
