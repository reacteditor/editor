import { ComponentConfig } from "@/core";
import { Sparkles } from "lucide-react";
import { FeatureCard as FeatureCardComponent } from "@/components/feature-card";
import { iconOptions } from "../../icons";

export type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
};

export const FeatureCard: ComponentConfig<FeatureCardProps> = {
  label: "Feature card",
  icon: <Sparkles size={16} />,
  category: "cards",
  defaultProps: {
    icon: "sparkles",
    title: "Feature title",
    description:
      "A short description of the feature, focusing on the user benefit.",
    cta: { label: "", href: "" },
  },
  fields: {
    icon: { type: "select", options: iconOptions },
    title: {
      type: "text",
      contentEditable: true,
    },
    description: {
      type: "textarea",
      contentEditable: true,
    },
    cta: {
      type: "object",
      objectFields: {
        label: { type: "text", contentEditable: true },
        href: { type: "text" },
      },
    },
  },
  render: ({ icon, title, description, cta }) => (
    <FeatureCardComponent
      icon={icon}
      title={title}
      description={description}
      cta={cta}
    />
  ),
};
