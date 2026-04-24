import { ComponentConfig, Slot } from "@/core";

export type TestimonialsProps = {
  eyebrow: string;
  heading: string;
  subheading: string;
  items: Slot;
};

export const Testimonials: ComponentConfig<TestimonialsProps> = {
  fields: {
    eyebrow: { type: "text", contentEditable: true },
    heading: { type: "text", contentEditable: true },
    subheading: { type: "textarea", contentEditable: true },
    items: { type: "slot" },
  },
  render: ({ eyebrow, heading, subheading, items: Items }) => (
    <section className="w-full bg-muted/40 py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
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
        <Items className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" />
      </div>
    </section>
  ),
};
