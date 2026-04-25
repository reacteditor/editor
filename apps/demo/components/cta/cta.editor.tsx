import { ComponentConfig } from "@/core";
import { Rocket } from "lucide-react";
import { CTA } from "./cta";

export type CTAProps = {
  heading: string;
  subheading: string;
  variant: "solid" | "gradient" | "outline";
  buttons: Array<{
    label: string;
    href: string;
    variant: "default" | "outline" | "secondary";
  }>;
};

export const ctaEditor: ComponentConfig<CTAProps> = {
  label: "CTA",
  icon: <Rocket size={16} />,
  category: "sections",
  defaultProps: {
    heading: "Bring visual editing to your stack",
    subheading: "Open source and ready for production.",
    variant: "gradient",
    buttons: [
      { label: "Start building", href: "#", variant: "secondary" },
      { label: "Read the docs", href: "#", variant: "outline" },
    ],
  },
  fields: {
    heading: {
      type: "text",
      contentEditable: true,
    },
    subheading: {
      type: "textarea",
      contentEditable: true,
    },
    variant: {
      type: "radio",
      options: [
        { label: "Solid", value: "solid" },
        { label: "Gradient", value: "gradient" },
        { label: "Outline", value: "outline" },
      ],
    },
    buttons: {
      type: "array",
      defaultItemProps: { label: "Learn more", href: "#", variant: "default" },
      getItemSummary: (b, i) => b.label || `Button ${(i ?? 0) + 1}`,
      arrayFields: {
        label: { type: "text", contentEditable: true },
        href: { type: "text" },
        variant: {
          type: "select",
          options: [
            { label: "Primary", value: "default" },
            { label: "Outline", value: "outline" },
            { label: "Secondary", value: "secondary" },
          ],
        },
      },
      max: 3,
    },
  },
  render: ({ heading, subheading, variant, buttons }) => (
    <CTA
      heading={heading}
      subheading={subheading}
      variant={variant}
      buttons={buttons}
    />
  ),
};
