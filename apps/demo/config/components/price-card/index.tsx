import { ComponentConfig } from "@/core";
import { CreditCard } from "lucide-react";
import { PriceCard as PriceCardComponent } from "@/components/price-card";

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

export const PriceCard: ComponentConfig<PriceCardProps> = {
  label: "Price card",
  icon: <CreditCard size={16} />,
  category: "cards",
  defaultProps: {
    name: "Pro",
    price: "$49",
    cadence: "month",
    features: [
      { text: "Unlimited pages" },
      { text: "Role-based permissions" },
      { text: "Priority support" },
    ],
    highlighted: "no",
    badge: "Most popular",
    cta: { label: "Get started", href: "#", variant: "default" },
  },
  fields: {
    name: { type: "text", contentEditable: true },
    price: { type: "text", contentEditable: true },
    cadence: {
      type: "radio",
      options: [
        { label: "Per month", value: "month" },
        { label: "Per year", value: "year" },
        { label: "One-time", value: "once" },
      ],
    },
    features: {
      type: "array",
      defaultItemProps: { text: "New feature" },
      getItemSummary: (f, i) => f.text || `Feature ${(i ?? 0) + 1}`,
      arrayFields: { text: { type: "text", contentEditable: true } },
    },
    highlighted: {
      type: "radio",
      options: [
        { label: "No", value: "no" },
        { label: "Yes", value: "yes" },
      ],
    },
    badge: {
      type: "text",
      placeholder: "Most popular",
      contentEditable: true,
    },
    cta: {
      type: "object",
      objectFields: {
        label: { type: "text", contentEditable: true },
        href: { type: "text" },
        variant: {
          type: "select",
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
  render: ({ name, price, cadence, features, highlighted, badge, cta }) => (
    <PriceCardComponent
      name={name}
      price={price}
      cadence={cadence}
      features={features}
      highlighted={highlighted}
      badge={badge}
      cta={cta}
    />
  ),
};
