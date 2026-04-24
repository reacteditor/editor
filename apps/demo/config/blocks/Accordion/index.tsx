import * as React from "react";
import { ComponentConfig } from "@/core";
import {
  Accordion as UIAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type AccordionProps = {
  items: Array<{ question: string; answer: string }>;
  type: "single" | "multiple";
};

export const Accordion: ComponentConfig<AccordionProps> = {
  fields: {
    items: {
      type: "array",
      default: [
        {
          question: "How do I get started?",
          answer:
            "<p>Drag any block from the left sidebar onto the canvas.</p>",
        },
        {
          question: "Can I compose custom layouts?",
          answer:
            "<p>Yes — use Section, Container, Grid, Columns, Stack, and Row.</p>",
        },
      ],
      getItemSummary: (item, i) => item.question || `Item ${(i ?? 0) + 1}`,
      arrayFields: {
        question: { type: "text", contentEditable: true },
        answer: { type: "richtext", contentEditable: true },
      },
    },
    type: {
      type: "radio",
      default: "single",
      options: [
        { label: "Single", value: "single" },
        { label: "Multiple", value: "multiple" },
      ],
    },
  },
  render: ({ items, type }) =>
    type === "single" ? (
      <UIAccordion type="single" collapsible className="w-full">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              <div>{item.answer as unknown as React.ReactNode}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </UIAccordion>
    ) : (
      <UIAccordion type="multiple" className="w-full">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              <div>{item.answer as unknown as React.ReactNode}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </UIAccordion>
    ),
};
