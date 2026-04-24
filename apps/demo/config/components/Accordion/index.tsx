import { ComponentConfig } from "@/core";
import { ListChecks } from "lucide-react";
import { Accordion as AccordionComponent } from "@/components/accordion";

export type AccordionProps = {
  items: Array<{ question: string; answer: string }>;
  type: "single" | "multiple";
};

export const Accordion: ComponentConfig<AccordionProps> = {
  label: "Accordion",
  icon: <ListChecks size={16} />,
  category: "elements",
  defaultProps: {
    items: [
      {
        question: "How do I get started?",
        answer: "<p>Drag any block from the left sidebar onto the canvas.</p>",
      },
      {
        question: "Can I compose custom layouts?",
        answer:
          "<p>Yes — use Section, Container, Grid, Columns, Stack, and Row.</p>",
      },
    ],
    type: "single",
  },
  fields: {
    items: {
      type: "array",
      getItemSummary: (item, i) => item.question || `Item ${(i ?? 0) + 1}`,
      arrayFields: {
        question: { type: "text", contentEditable: true },
        answer: { type: "richtext", contentEditable: true },
      },
    },
    type: {
      type: "radio",
      options: [
        { label: "Single", value: "single" },
        { label: "Multiple", value: "multiple" },
      ],
    },
  },
  render: ({ items, type }) => (
    <AccordionComponent items={items} type={type} />
  ),
};
