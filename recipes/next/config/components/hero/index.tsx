import type { ComponentConfig } from "@reacteditor/core";
import { Rocket } from "lucide-react";
import { Hero as HeroComponent } from "@/components/hero";

export type HeroProps = {
  tagline: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  align: "left" | "center";
};

export const Hero: ComponentConfig<HeroProps> = {
  label: "Hero",
  icon: <Rocket size={16} />,
  defaultProps: {
    tagline: "v1 · Visual editing for React",
    title: "Ship pages at the speed of thought",
    subtitle:
      "A drag-and-drop editor for your own React components. Own your data, keep your stack, extend anything.",
    primaryCta: { label: "Start building", href: "#" },
    secondaryCta: { label: "See components", href: "#" },
    align: "center",
  },
  fields: {
    tagline: {
      type: "text",
      contentEditable: true,
    },
    title: {
      type: "text",
      contentEditable: true,
    },
    subtitle: {
      type: "textarea",
      contentEditable: true,
    },
    primaryCta: {
      type: "object",
      objectFields: {
        label: { type: "text", contentEditable: true },
        href: { type: "text" },
      },
    },
    secondaryCta: {
      type: "object",
      objectFields: {
        label: { type: "text", contentEditable: true },
        href: { type: "text" },
      },
    },
    align: {
      type: "radio",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
      ],
    },
  },
  render: ({
    tagline,
    title,
    subtitle,
    primaryCta,
    secondaryCta,
    align,
  }) => (
    <HeroComponent
      tagline={tagline}
      title={title}
      subtitle={subtitle}
      primaryCta={primaryCta}
      secondaryCta={secondaryCta}
      align={align}
    />
  ),
};
