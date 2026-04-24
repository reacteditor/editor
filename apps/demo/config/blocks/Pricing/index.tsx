import { ComponentConfig, Slot } from "@/core";

export type PricingProps = {
  eyebrow: string;
  heading: string;
  subheading: string;
  tiers: Slot;
};

export const Pricing: ComponentConfig<PricingProps> = {
  fields: {
    eyebrow: { type: "text", default: "Pricing", contentEditable: true },
    heading: {
      type: "text",
      default: "Simple, predictable pricing",
      contentEditable: true,
    },
    subheading: {
      type: "textarea",
      default:
        "Start free, upgrade when you need more seats, workspaces, or custom roles.",
      contentEditable: true,
    },
    tiers: { type: "slot" },
  },
  render: ({ eyebrow, heading, subheading, tiers: Tiers }) => (
    <section className="w-full bg-background py-24">
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
        <Tiers className="mt-16 grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3" />
      </div>
    </section>
  ),
};
