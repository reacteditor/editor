"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

type Variant = "solid" | "gradient" | "outline";
type ButtonVariant = "default" | "outline" | "secondary";

type Props = {
  heading: string;
  subheading: string;
  variant: Variant;
  buttons: Array<{ label: string; href: string; variant: ButtonVariant }>;
};

const variantClasses: Record<Variant, string> = {
  solid: "bg-primary text-primary-foreground",
  gradient:
    "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground",
  outline: "border border-border bg-background text-foreground",
};

export function CTA({ heading, subheading, variant, buttons }: Props) {
  return (
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
                <Link to={b.href || "#"}>{b.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
