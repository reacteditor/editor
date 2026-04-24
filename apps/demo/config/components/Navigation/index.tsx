import { ComponentConfig } from "@/core";
import { PanelTop } from "lucide-react";
import { Navigation as NavigationComponent } from "@/components/navigation";

export type NavigationProps = {
  brand: string;
  links: Array<{ label: string; href: string }>;
  cta: { label: string; href: string };
};

export const Navigation: ComponentConfig<NavigationProps> = {
  label: "Navigation",
  icon: <PanelTop size={16} />,
  category: "navigation",
  global: true,
  defaultProps: {
    brand: "react-editor",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Team", href: "#team" },
      { label: "Docs", href: "#docs" },
    ],
    cta: { label: "Start building", href: "#" },
  },
  fields: {
    brand: { type: "text", contentEditable: true },
    links: {
      type: "array",
      defaultItemProps: { label: "Link", href: "#" },
      getItemSummary: (l) => l.label,
      arrayFields: {
        label: { type: "text", contentEditable: true },
        href: { type: "text" },
      },
    },
    cta: {
      type: "object",
      objectFields: {
        label: { type: "text", contentEditable: true },
        href: { type: "text" },
      },
    },
  },
  render: ({ brand, links, cta }) => (
    <NavigationComponent brand={brand} links={links} cta={cta} />
  ),
};
