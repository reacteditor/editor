import { ComponentConfig, Slot } from "@/core";
import { CreditCard } from "lucide-react";
import { Pricing as PricingComponent } from "@/components/pricing";

export type PricingProps = {
  tagline: string;
  heading: string;
  subheading: string;
  tiers: Slot;
};

export const Pricing: ComponentConfig<PricingProps> = {
  label: "Pricing",
  icon: <CreditCard size={16} />,
  category: "sections",
  defaultProps: {
    tagline: "Pricing",
    heading: "Simple, predictable pricing",
    subheading:
      "Start free, upgrade when you need more seats, workspaces, or custom roles.",
    tiers: [
      {
        type: "PriceCard",
        props: {
          id: "seed-tier-starter",
          name: "Starter",
          price: "$0",
          cadence: "month",
          features: [
            { text: "Up to 3 editors" },
            { text: "Unlimited pages" },
            { text: "Community support" },
          ],
          highlighted: "no",
          badge: "",
          cta: {
            label: "Start free",
            href: "#",
            variant: "outline",
          },
        },
      },
      {
        type: "PriceCard",
        props: {
          id: "seed-tier-team",
          name: "Team",
          price: "$49",
          cadence: "month",
          features: [
            { text: "Unlimited editors" },
            { text: "Role-based permissions" },
            { text: "Custom plugins" },
            { text: "Priority support" },
          ],
          highlighted: "yes",
          badge: "Most popular",
          cta: {
            label: "Start 14-day trial",
            href: "#",
            variant: "default",
          },
        },
      },
      {
        type: "PriceCard",
        props: {
          id: "seed-tier-enterprise",
          name: "Enterprise",
          price: "Custom",
          cadence: "year",
          features: [
            { text: "SSO, audit logs, SLA" },
            { text: "Dedicated cluster" },
            { text: "Custom onboarding" },
          ],
          highlighted: "no",
          badge: "",
          cta: {
            label: "Contact sales",
            href: "#",
            variant: "outline",
          },
        },
      },
    ],
  },
  fields: {
    tagline: { type: "text", contentEditable: true },
    heading: {
      type: "text",
      contentEditable: true,
    },
    subheading: {
      type: "textarea",
      contentEditable: true,
    },
    tiers: { type: "slot" },
  },
  render: ({ tagline, heading, subheading, tiers }) => (
    <PricingComponent
      tagline={tagline}
      heading={heading}
      subheading={subheading}
      tiers={tiers}
    />
  ),
};
