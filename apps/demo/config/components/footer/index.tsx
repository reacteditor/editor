import { ComponentConfig } from "@/core";
import { PanelBottom } from "lucide-react";
import { Footer as FooterComponent } from "@/components/footer";
import { defaultFooterColumns, defaultSocial } from "../../seeds";

const socialOptions = [
  { label: "Twitter", value: "twitter" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "GitHub", value: "github" },
] as const;

export type FooterProps = {
  brand: string;
  tagline: string;
  columns: Array<{
    heading: string;
    links: Array<{ label: string; href: string }>;
  }>;
  copyright: string;
  social: Array<{ platform: "twitter" | "linkedin" | "github"; href: string }>;
};

export const Footer: ComponentConfig<FooterProps> = {
  label: "Footer",
  icon: <PanelBottom size={16} />,
  category: "navigation",
  global: true,
  defaultProps: {
    brand: "react-editor",
    tagline: "A visual editor for your React components.",
    columns: defaultFooterColumns,
    copyright: "© 2026 react-editor. All rights reserved.",
    social: defaultSocial,
  },
  fields: {
    brand: { type: "text", contentEditable: true },
    tagline: {
      type: "textarea",
      contentEditable: true,
    },
    columns: {
      type: "array",
      defaultItemProps: { heading: "New column", links: [] },
      getItemSummary: (c) => c.heading,
      arrayFields: {
        heading: { type: "text", contentEditable: true },
        links: {
          type: "array",
          defaultItemProps: { label: "Link", href: "#" },
          getItemSummary: (l) => l.label,
          arrayFields: {
            label: { type: "text", contentEditable: true },
            href: { type: "text" },
          },
        },
      },
    },
    copyright: {
      type: "text",
      contentEditable: true,
    },
    social: {
      type: "array",
      defaultItemProps: { platform: "twitter", href: "#" },
      getItemSummary: (s) => s.platform,
      arrayFields: {
        platform: {
          type: "select",
          options: [...socialOptions],
        },
        href: { type: "text" },
      },
    },
  },
  render: ({ brand, tagline, columns, copyright, social }) => (
    <FooterComponent
      brand={brand}
      tagline={tagline}
      columns={columns}
      copyright={copyright}
      social={social}
    />
  ),
};
