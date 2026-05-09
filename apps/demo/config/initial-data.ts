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
  path === "/pricing" ? initialPricingData : initialData;

export const initialData: UserData = {
  root: { props: { title: "React Editor — visual editing for React" } },
  content: [
    {
      type: "navigation",
      props: {
        id: "nav-home",
        brand: "react-editor",
        links: defaultNavLinks,
        cta: { label: "Start building", href: "#" },
      },
    },
    {
      type: "hero",
      props: {
        id: "hero-home",
        tagline: "v2 · Visual editing for React",
        title: "Visual editing for your entire React app",
        subtitle:
          "A drag-and-drop editor for your own React components. Own your data, keep your stack, extend anything.",
        primaryCta: { label: "Start building", href: "#" },
        secondaryCta: { label: "See components", href: "#features" },
        align: "center",
      },
    },
    {
      type: "logos",
      props: {
        id: "logos-home",
        tagline: "Powering products at fast-moving teams",
        logos: defaultLogos,
        grayscale: "yes",
      },
    },
    {
      type: "features",
      props: {
        id: "features-home",
        tagline: "Features",
        heading: "Primitives that mirror production",
        subheading:
          "Composable blocks, rich fields, and a live preview — all wired to your real components.",
        columns: "3",
        items: seededFeatureCards,
      },
    },
    {
      type: "testimonials",
      props: {
        id: "testimonials-home",
        tagline: "Testimonials",
        heading: "Built for developers, designers, and marketers",
        subheading:
          "Teams across every role use the editor to move faster without giving up control.",
        items: seededTestimonialCards,
      },
    },
    {
      type: "pricing",
      props: {
        id: "pricing-home",
        tagline: "Pricing",
        heading: "Simple, predictable pricing",
        subheading:
          "Start free, upgrade when you need more seats, workspaces, or custom roles.",
        tiers: seededPriceCards,
      },
    },
    {
      type: "team",
      props: {
        id: "team-home",
        tagline: "Team",
        heading: "Built by a small, focused team",
        subheading:
          "We come from editor, framework, and design-systems teams. This is the tool we always wanted.",
        members: seededTeamCards,
      },
    },
    {
      type: "faq",
      props: {
        id: "faq-home",
        tagline: "FAQ",
        heading: "Frequently asked questions",
        subheading: "Answers to common questions about the editor.",
        items: defaultFAQItems,
      },
    },
    {
      type: "cta",
      props: {
        id: "cta-home",
        heading: "Bring visual editing to your stack",
        subheading: "Open source and ready for production.",
        variant: "gradient",
        buttons: [
          { label: "Start building", href: "#", variant: "secondary" },
          { label: "Read the docs", href: "#", variant: "outline" },
        ],
      },
    },
    {
      type: "footer",
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
};

export const initialPricingData: UserData = {
  root: { props: { title: "Pricing — React Editor" } },
  content: [
    {
      type: "navigation",
      props: {
        id: "nav-pricing",
        brand: "react-editor",
        links: defaultNavLinks,
        cta: { label: "Start building", href: "#" },
      },
    },
    {
      type: "hero",
      props: {
        id: "hero-pricing",
        tagline: "Pricing",
        title: "Pricing built for teams of every size",
        subtitle:
          "Start free, scale as you grow. Predictable plans, no surprise fees.",
        primaryCta: { label: "Start free", href: "#" },
        secondaryCta: { label: "Talk to sales", href: "#" },
        align: "center",
      },
    },
    {
      type: "pricing",
      props: {
        id: "pricing-plans",
        tagline: "Plans",
        heading: "Pick the plan that fits",
        subheading:
          "Every plan ships with the full editor — upgrade for seats, workspaces, and roles.",
        tiers: seededPriceCards,
      },
    },
    {
      type: "faq",
      props: {
        id: "faq-pricing",
        tagline: "FAQ",
        heading: "Pricing FAQ",
        subheading: "Common questions about billing and plans.",
        items: defaultFAQItems,
      },
    },
    {
      type: "footer",
      props: {
        id: "footer-pricing",
        brand: "react-editor",
        tagline: "A visual editor for your React components.",
        columns: defaultFooterColumns,
        copyright: "© 2026 react-editor. All rights reserved.",
        social: defaultSocial,
      },
    },
  ],
};
