import { ComponentConfig } from "@/core";
import { Tag } from "lucide-react";
import { Logos as LogosComponent } from "@/components/logos";

export type LogosProps = {
  tagline: string;
  logos: Array<{ alt: string; src: string }>;
  grayscale: "yes" | "no";
};

export const Logos: ComponentConfig<LogosProps> = {
  label: "Logos",
  icon: <Tag size={16} />,
  category: "sections",
  defaultProps: {
    tagline: "Powering products at fast-moving teams",
    logos: [
      { alt: "Vercel", src: "https://cdn.simpleicons.org/vercel" },
      { alt: "Next.js", src: "https://cdn.simpleicons.org/nextdotjs" },
      { alt: "React", src: "https://cdn.simpleicons.org/react" },
      { alt: "TypeScript", src: "https://cdn.simpleicons.org/typescript" },
      { alt: "Tailwind", src: "https://cdn.simpleicons.org/tailwindcss" },
      { alt: "Radix", src: "https://cdn.simpleicons.org/radixui" },
    ],
    grayscale: "yes",
  },
  fields: {
    tagline: {
      type: "text",
      contentEditable: true,
    },
    logos: {
      type: "array",
      defaultItemProps: { alt: "Logo", src: "" },
      getItemSummary: (l, i) => l.alt || `Logo ${(i ?? 0) + 1}`,
      arrayFields: {
        alt: { type: "text" },
        src: { type: "text" },
      },
    },
    grayscale: {
      type: "radio",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
    },
  },
  render: ({ tagline, logos, grayscale }) => (
    <LogosComponent tagline={tagline} logos={logos} grayscale={grayscale} />
  ),
};
