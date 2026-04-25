import { ComponentConfig, Slot } from "@/core";
import { LayoutTemplate } from "lucide-react";
import { Features as FeaturesComponent } from "@/components/features";

export type FeaturesProps = {
  tagline: string;
  heading: string;
  subheading: string;
  columns: "2" | "3" | "4";
  items: Slot;
};

export const Features: ComponentConfig<FeaturesProps> = {
  label: "Features",
  icon: <LayoutTemplate size={16} />,
  category: "sections",
  defaultProps: {
    tagline: "Features",
    heading: "Primitives that mirror production",
    subheading:
      "Composable blocks, rich fields, and a live preview — all wired to your real components.",
    columns: "3",
    items: [
      {
        type: "FeatureCard",
        props: {
          id: "seed-feature-1",
          icon: "sparkles",
          title: "Drag-and-drop authoring",
          description:
            "Compose any UI from your own React components. Fields, validation, and rich text built in.",
          cta: { label: "", href: "" },
        },
      },
      {
        type: "FeatureCard",
        props: {
          id: "seed-feature-2",
          icon: "zap",
          title: "Own your stack",
          description:
            "No vendor runtime. Installs as a React package and stores data as plain JSON.",
          cta: { label: "", href: "" },
        },
      },
      {
        type: "FeatureCard",
        props: {
          id: "seed-feature-3",
          icon: "rocket",
          title: "Extensible end to end",
          description:
            "Plugins, custom fields, permission rules, and overrides for every editor surface.",
          cta: { label: "", href: "" },
        },
      },
    ],
  },
  fields: {
    tagline: { type: "text", contentEditable: true },
    heading: {
      type: "text",
      contentEditable: true,
    },
    subheading: {
      type: "textarea",
      contentEditable: true,
    },
    columns: {
      type: "radio",
      options: [
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
      ],
    },
    items: { type: "slot" },
  },
  render: ({ tagline, heading, subheading, columns, items }) => (
    <FeaturesComponent
      tagline={tagline}
      heading={heading}
      subheading={subheading}
      columns={columns}
      items={items}
    />
  ),
};
