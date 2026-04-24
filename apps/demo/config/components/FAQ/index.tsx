import { ComponentConfig } from "@/core";
import { HelpCircle } from "lucide-react";
import { FAQ as FAQComponent } from "@/components/faq";
import { defaultFAQItems } from "../../seeds";

export type FAQProps = {
  eyebrow: string;
  heading: string;
  subheading: string;
  items: Array<{ question: string; answer: string }>;
};

export const FAQ: ComponentConfig<FAQProps> = {
  label: "FAQ",
  icon: <HelpCircle size={16} />,
  category: "sections",
  defaultProps: {
    eyebrow: "FAQ",
    heading: "Frequently asked questions",
    subheading: "Answers to common questions about the editor.",
    items: defaultFAQItems,
  },
  fields: {
    eyebrow: { type: "text", contentEditable: true },
    heading: {
      type: "text",
      contentEditable: true,
    },
    subheading: {
      type: "textarea",
      contentEditable: true,
    },
    items: {
      type: "array",
      defaultItemProps: { question: "New question", answer: "" },
      getItemSummary: (item, i) => item.question || `Question ${(i ?? 0) + 1}`,
      arrayFields: {
        question: { type: "text", contentEditable: true },
        answer: { type: "richtext", contentEditable: true },
      },
    },
  },
  render: ({ eyebrow, heading, subheading, items }) => (
    <FAQComponent
      eyebrow={eyebrow}
      heading={heading}
      subheading={subheading}
      items={items}
    />
  ),
};
