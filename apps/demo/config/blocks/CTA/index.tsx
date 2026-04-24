import { ComponentConfig } from "@/core";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CTAProps = {
  heading: string;
  subheading: string;
  variant: "solid" | "gradient" | "outline";
  buttons: Array<{
    label: string;
    href: string;
    variant: "default" | "outline" | "secondary";
  }>;
};

const variantClasses: Record<CTAProps["variant"], string> = {
  solid: "bg-primary text-primary-foreground",
  gradient:
    "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground",
  outline: "border border-border bg-background text-foreground",
};

export const CTA: ComponentConfig<CTAProps> = {
  fields: {
    heading: { type: "text" },
    subheading: { type: "textarea" },
    variant: {
      type: "radio",
      default: "gradient",
      options: [
        { label: "Solid", value: "solid" },
        { label: "Gradient", value: "gradient" },
        { label: "Outline", value: "outline" },
      ],
    },
    buttons: {
      type: "array",
      getItemSummary: (b, i) => b.label || `Button ${(i ?? 0) + 1}`,
      arrayFields: {
        label: { type: "text" },
        href: { type: "text" },
        variant: {
          type: "select",
          default: "default",
          options: [
            { label: "Primary", value: "default" },
            { label: "Outline", value: "outline" },
            { label: "Secondary", value: "secondary" },
          ],
        },
      },
      max: 3,
    },
  },
  render: ({ heading, subheading, variant, buttons }) => (
    <section className="w-full bg-background py-24">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div
          className={cn(
            "flex flex-col items-center gap-6 rounded-3xl px-8 py-16 text-center",
            variantClasses[variant]
          )}
        >
          <h2 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
            {heading}
          </h2>
          <p className="max-w-xl text-lg opacity-90">{subheading}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {(buttons ?? []).map((b, i) => (
              <Button key={i} asChild variant={b.variant} size="lg">
                <a href={b.href || "#"}>{b.label}</a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  ),
};
