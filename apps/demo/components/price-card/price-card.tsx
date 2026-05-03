"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Link } from "react-router";

type Cadence = "month" | "year" | "once";
type Highlighted = "yes" | "no";
type CtaVariant = "default" | "outline" | "secondary";

type Props = {
  name: string;
  price: string;
  cadence: Cadence;
  features: Array<{ text: string }>;
  highlighted: Highlighted;
  badge: string;
  cta: { label: string; href: string; variant: CtaVariant };
};

const cadenceLabel: Record<Cadence, string> = {
  month: "/ month",
  year: "/ year",
  once: "one-time",
};

export function PriceCard({
  name,
  price,
  cadence,
  features,
  highlighted,
  badge,
  cta,
}: Props) {
  const isHighlighted = highlighted === "yes";
  return (
    <Card
      className={cn(
        "relative h-full min-w-[280px] gap-6 p-6",
        isHighlighted && "border-primary shadow-lg ring-1 ring-primary/20"
      )}
    >
      {isHighlighted && badge ? (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          {badge}
        </Badge>
      ) : null}
      <CardHeader className="gap-1 px-0">
        <CardTitle className="text-base font-medium text-muted-foreground">
          {name}
        </CardTitle>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-semibold tracking-tight text-foreground">
            {price}
          </span>
          <span className="text-sm text-muted-foreground">
            {cadenceLabel[cadence]}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-0">
        <ul className="space-y-2.5 text-sm">
          {(features ?? []).map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className="text-foreground">{f.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      {cta?.label ? (
        <div className="px-0">
          <Button
            asChild
            variant={isHighlighted ? "default" : cta.variant}
            className="w-full"
          >
            <Link to={cta.href || "#"}>{cta.label}</Link>
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
