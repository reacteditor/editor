import { ComponentConfig } from "@/core";
import { Type } from "lucide-react";
import { Typography as TypographyComponent } from "@/components/typography";

export type TypographyProps = {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1" | "body2";
  content: string;
  align: "left" | "center" | "right";
};

export const Typography: ComponentConfig<TypographyProps> = {
  label: "Typography",
  icon: <Type size={16} />,
  category: "elements",
  defaultProps: {
    variant: "h2",
    content: "",
    align: "left",
  },
  fields: {
    variant: {
      type: "select",
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
    content: { type: "richtext", contentEditable: true },
    align: {
      type: "radio",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
  },
  render: ({ variant, content, align }) => (
    <TypographyComponent variant={variant} content={content} align={align} />
  ),
};
