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
  },
};
