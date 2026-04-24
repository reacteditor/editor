import { ComponentConfig } from "@/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type PriceCardProps = {
  name: string;
  price: string;
  cadence: "month" | "year" | "once";
  features: Array<{ text: string }>;
  highlighted: "yes" | "no";
  badge: string;
  cta: {
    label: string;
    href: string;
    variant: "default" | "outline" | "secondary";
  };
};

const cadenceLabel: Record<PriceCardProps["cadence"], string> = {
  month: "/ month",
  year: "/ year",
  once: "one-time",
};

export const PriceCard: ComponentConfig<PriceCardProps> = {
  fields: {
    name: { type: "text", default: "Pro", contentEditable: true },
    price: { type: "text", default: "$49", contentEditable: true },
    cadence: {
      type: "radio",
      default: "month",
      options: [
        { label: "Per month", value: "month" },
        { label: "Per year", value: "year" },
        { label: "One-time", value: "once" },
      ],
    },
    features: {
      type: "array",
      getItemSummary: (f, i) => f.text || `Feature ${(i ?? 0) + 1}`,
      arrayFields: { text: { type: "text", contentEditable: true } },
    },
    highlighted: {
      type: "radio",
      default: "no",
      options: [
        { label: "No", value: "no" },
        { label: "Yes", value: "yes" },
      ],
    },
    badge: { type: "text", placeholder: "Most popular", contentEditable: true },
    cta: {
      type: "object",
      objectFields: {
        label: { type: "text", contentEditable: true },
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
    },
  },
  resolveFields: (data, { fields }) => ({
    ...fields,
    badge: { ...fields.badge, visible: data.props.highlighted === "yes" },
  }),
  render: ({ name, price, cadence, features, highlighted, badge, cta }) => {
    const isHighlighted = highlighted === "yes";
    return (
      <Card
        className={cn(
          "relative h-full gap-6 p-6",
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
              <a href={cta.href || "#"}>{cta.label}</a>
            </Button>
          </div>
        ) : null}
      </Card>
    );
  },
};
