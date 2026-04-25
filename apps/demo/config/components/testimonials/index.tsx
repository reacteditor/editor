import { ComponentConfig, Slot } from "@/core";
import { MessageSquareQuote } from "lucide-react";
import { Testimonials as TestimonialsComponent } from "@/components/testimonials";

export type TestimonialsProps = {
  tagline: string;
  heading: string;
  subheading: string;
  items: Slot;
};

export const Testimonials: ComponentConfig<TestimonialsProps> = {
  label: "Testimonials",
  icon: <MessageSquareQuote size={16} />,
  category: "sections",
  defaultProps: {
    tagline: "Testimonials",
    heading: "Built for developers, designers, and marketers",
    subheading:
      "Teams across every role use the editor to move faster without giving up control.",
    items: [
      {
        type: "TestimonialCard",
        props: {
          id: "seed-testimonial-1",
          quote:
            "<p>We replaced a homegrown CMS with this in a weekend. Authoring feels like Figma, output is just JSON.</p>",
          author: "Priya Raman",
          role: "Staff engineer, Lumos",
          avatarUrl: "",
        },
      },
      {
        type: "TestimonialCard",
        props: {
          id: "seed-testimonial-2",
          quote:
            "<p>Marketing edits the site without our help now. The primitives map 1:1 to our design system.</p>",
          author: "Marcus Cole",
          role: "Design systems lead, Tessera",
          avatarUrl: "",
        },
      },
      {
        type: "TestimonialCard",
        props: {
          id: "seed-testimonial-3",
          quote:
            "<p>The slot model makes it trivial to mix custom blocks with stock layout primitives. Extensibility that actually scales.</p>",
          author: "Ada Okonkwo",
          role: "Engineering manager, Northwind",
          avatarUrl: "",
        },
      },
    ],
  },
  fields: {
    tagline: {
      type: "text",
      contentEditable: true,
    },
    heading: {
      type: "text",
      contentEditable: true,
    },
    subheading: {
      type: "textarea",
      contentEditable: true,
    },
    items: { type: "slot" },
  },
  render: ({ tagline, heading, subheading, items }) => (
    <TestimonialsComponent
      tagline={tagline}
      heading={heading}
      subheading={subheading}
      items={items}
    />
  ),
};
