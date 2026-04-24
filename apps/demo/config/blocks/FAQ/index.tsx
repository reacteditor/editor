import * as React from "react";
import { ComponentConfig } from "@/core";
import {
  Accordion as UIAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { defaultFAQItems } from "../../seeds";

export type FAQProps = {
  eyebrow: string;
  heading: string;
  subheading: string;
  items: Array<{ question: string; answer: string }>;
};

export const FAQ: ComponentConfig<FAQProps> = {
  fields: {
    eyebrow: { type: "text", default: "FAQ", contentEditable: true },
    heading: {
      type: "text",
      default: "Frequently asked questions",
      contentEditable: true,
    },
    subheading: {
      type: "textarea",
      default: "Answers to common questions about the editor.",
      contentEditable: true,
    },
    items: {
      type: "array",
      default: defaultFAQItems,
      getItemSummary: (item, i) => item.question || `Question ${(i ?? 0) + 1}`,
      arrayFields: {
        question: { type: "text", contentEditable: true },
        answer: { type: "richtext", contentEditable: true },
      },
    },
  },
  render: ({ eyebrow, heading, subheading, items }) => (
    <section className="w-full bg-background py-24">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <div className="text-center">
          {eyebrow ? (
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {heading}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{subheading}</p>
        </div>
        <div className="mt-12">
          <UIAccordion type="single" collapsible className="w-full">
            {(items ?? []).map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-base font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground">
                    {item.answer as unknown as React.ReactNode}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </UIAccordion>
        </div>
      </div>
    </section>
  ),
};
