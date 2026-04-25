import { ComponentConfig } from "@/core";
import { Quote } from "lucide-react";
import { TestimonialCard as TestimonialCardComponent } from "@/components/testimonial-card";

export type TestimonialCardProps = {
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
};

export const TestimonialCard: ComponentConfig<TestimonialCardProps> = {
  label: "Testimonial card",
  icon: <Quote size={16} />,
  category: "cards",
  defaultProps: {
    quote:
      "<p>This tool changed how our team builds product surfaces. Fast to set up, delightful to use.</p>",
    author: "Jane Doe",
    role: "Head of Marketing, Acme",
    avatarUrl: "",
  },
  fields: {
    quote: { type: "richtext", contentEditable: true },
    author: { type: "text", contentEditable: true },
    role: {
      type: "text",
      contentEditable: true,
    },
    avatarUrl: { type: "text" },
  },
  render: ({ quote, author, role, avatarUrl }) => (
    <TestimonialCardComponent
      quote={quote}
      author={author}
      role={role}
      avatarUrl={avatarUrl}
    />
  ),
};
