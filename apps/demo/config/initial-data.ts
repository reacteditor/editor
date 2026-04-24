import { UserData } from "./types";
import {
  defaultLogos,
  defaultNavLinks,
  defaultFooterColumns,
  defaultSocial,
  defaultFAQItems,
  seededFeatureCards,
  seededTestimonialCards,
  seededPriceCards,
  seededTeamCards,
} from "./seeds";

export const getInitialData = (path: string): Partial<UserData> =>
  initialData[path] ?? { content: [], root: { props: { title: "Untitled" } } };

export const initialData: Record<string, UserData> = {
  "/": {
    root: { props: { title: "React Editor — visual editing for React" } },
    content: [
      {
        type: "Navigation",
        props: {
          id: "nav-home",
          brand: "react-editor",
          links: defaultNavLinks,
          cta: { label: "Start building", href: "#" },
        },
      },
      {
        type: "Hero",
        props: {
          id: "hero-home",
          eyebrow: "v2 · Visual editing for React",
          title: "Ship pages at the speed of thought",
          subtitle:
            "A drag-and-drop editor for your own React components. Own your data, keep your stack, extend anything.",
          primaryCta: { label: "Start building", href: "#" },
          secondaryCta: { label: "See components", href: "#features" },
          align: "center",
          media: [],
        },
      },
      {
        type: "Logos",
        props: {
          id: "logos-home",
          eyebrow: "Trusted by teams shipping fast",
          logos: defaultLogos,
          grayscale: "yes",
        },
      },
      {
        type: "Features",
        props: {
          id: "features-home",
          eyebrow: "Features",
          heading: "Everything you need to ship a page",
          subheading:
            "Composable primitives, rich fields, and a preview that mirrors production.",
          columns: "3",
          items: seededFeatureCards,
        },
      },
      {
        type: "Testimonials",
        props: {
          id: "testimonials-home",
          eyebrow: "Testimonials",
          heading: "Loved by teams that ship",
          subheading:
            "Engineers and marketers building real products with the editor.",
          items: seededTestimonialCards,
        },
      },
      {
        type: "Pricing",
        props: {
          id: "pricing-home",
          eyebrow: "Pricing",
          heading: "Simple, predictable pricing",
          subheading:
            "Start free, upgrade when you need more seats, workspaces, or custom roles.",
          tiers: seededPriceCards,
        },
      },
      {
        type: "Team",
        props: {
          id: "team-home",
          eyebrow: "Team",
          heading: "Built by a small, focused team",
          subheading:
            "We come from editor, framework, and design-systems teams. This is the tool we always wanted.",
          members: seededTeamCards,
        },
      },
      {
        type: "FAQ",
        props: {
          id: "faq-home",
          eyebrow: "FAQ",
          heading: "Frequently asked questions",
          subheading: "Answers to common questions about the editor.",
          items: defaultFAQItems,
        },
      },
      {
        type: "CTA",
        props: {
          id: "cta-home",
          heading: "Start shipping pages today",
          subheading: "Free for open source and side projects.",
          variant: "gradient",
          buttons: [
            { label: "Start building", href: "#", variant: "secondary" },
            { label: "Read the docs", href: "#", variant: "outline" },
          ],
        },
      },
      {
        type: "Footer",
        props: {
          id: "footer-home",
          brand: "react-editor",
          tagline: "A visual editor for your React components.",
          columns: defaultFooterColumns,
          copyright: "© 2026 react-editor. All rights reserved.",
          social: defaultSocial,
        },
      },
    ],
  },
};
