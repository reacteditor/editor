import {
  AlignHorizontalJustifyStart,
  ArrowDownUp,
  Columns as ColumnsIcon,
  Container as ContainerIcon,
  CreditCard,
  HelpCircle,
  Image as ImageIcon,
  LayoutGrid,
  LayoutTemplate,
  ListChecks,
  MessageSquareQuote,
  Minus,
  MousePointerClick,
  PanelBottom,
  PanelTop,
  Quote,
  Rocket,
  Sparkles,
  Square,
  Tag,
  Type,
  Users,
} from "lucide-react";

import { Typography } from "./blocks/Typography";
import { Image } from "./blocks/Image";
import { Button } from "./blocks/Button";
import { Section } from "./blocks/Section";
import { Container } from "./blocks/Container";
import { Grid } from "./blocks/Grid";
import { Stack } from "./blocks/Stack";
import { Row } from "./blocks/Row";
import { Columns } from "./blocks/Columns";
import { Accordion } from "./blocks/Accordion";
import { FeatureCard } from "./blocks/FeatureCard";
import { TestimonialCard } from "./blocks/TestimonialCard";
import { PriceCard } from "./blocks/PriceCard";
import { TeamCard } from "./blocks/TeamCard";
import { Hero } from "./blocks/Hero";
import { Logos } from "./blocks/Logos";
import { Features } from "./blocks/Features";
import { Testimonials } from "./blocks/Testimonials";
import { Pricing } from "./blocks/Pricing";
import { Team } from "./blocks/Team";
import { CTA } from "./blocks/CTA";
import { FAQ } from "./blocks/FAQ";
import { Navigation } from "./blocks/Navigation";
import { NavBar } from "./blocks/NavBar";
import { Footer } from "./blocks/Footer";
import { FooterLinks } from "./blocks/FooterLinks";

import Root from "./root";
import { UserConfig } from "./types";
import { initialData } from "./initial-data";
import {
  seededFeatureCards,
  seededTestimonialCards,
  seededPriceCards,
  seededTeamCards,
  defaultLogos,
  defaultNavLinks,
  defaultFooterColumns,
  defaultSocial,
  defaultFAQItems,
} from "./seeds";

export const conf: UserConfig = {
  root: Root,
  categories: {
    typography: { title: "Typography" },
    media: { title: "Media" },
    actions: { title: "Actions" },
    layout: { title: "Layout" },
    interactive: { title: "Interactive" },
    cards: { title: "Cards" },
    sections: { title: "Sections" },
    site: { title: "Site" },
  },
  components: {
    Typography,
    Image,
    Button,
    Section,
    Container,
    Grid,
    Stack,
    Row,
    Columns,
    Accordion,
    FeatureCard,
    TestimonialCard,
    PriceCard,
    TeamCard,
    Hero,
    Logos,
    Features,
    Testimonials,
    Pricing,
    Team,
    CTA,
    FAQ,
    Navigation,
    NavBar,
    Footer,
    FooterLinks,
  },
  blocks: {
    Typography: {
      label: "Typography",
      icon: <Type size={16} />,
      category: "typography",
      component: "Typography",
    },
    Image: {
      label: "Image",
      icon: <ImageIcon size={16} />,
      category: "media",
      component: "Image",
      props: {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
        alt: "Placeholder image",
      },
    },
    Button: {
      label: "Button",
      icon: <MousePointerClick size={16} />,
      category: "actions",
      component: "Button",
    },
    Section: {
      label: "Section",
      icon: <Minus size={16} />,
      category: "layout",
      component: "Section",
    },
    Container: {
      label: "Container",
      icon: <ContainerIcon size={16} />,
      category: "layout",
      component: "Container",
    },
    Grid: {
      label: "Grid",
      icon: <LayoutGrid size={16} />,
      category: "layout",
      component: "Grid",
    },
    Stack: {
      label: "Stack",
      icon: <ArrowDownUp size={16} />,
      category: "layout",
      component: "Stack",
    },
    Row: {
      label: "Row",
      icon: <AlignHorizontalJustifyStart size={16} />,
      category: "layout",
      component: "Row",
    },
    Columns: {
      label: "Columns",
      icon: <ColumnsIcon size={16} />,
      category: "layout",
      component: "Columns",
      props: {
        items: [
          { span: "6", content: [] },
          { span: "6", content: [] },
        ],
        gap: "md",
      },
    },
    Accordion: {
      label: "Accordion",
      icon: <ListChecks size={16} />,
      category: "interactive",
      component: "Accordion",
      props: {
        items: [
          {
            question: "How do I get started?",
            answer:
              "<p>Drag any block from the left sidebar onto the canvas.</p>",
          },
          {
            question: "Can I compose custom layouts?",
            answer:
              "<p>Yes — use Section, Container, Grid, Columns, Stack, and Row.</p>",
          },
        ],
        type: "single",
      },
    },
    FeatureCard: {
      label: "Feature card",
      icon: <Sparkles size={16} />,
      category: "cards",
      component: "FeatureCard",
    },
    TestimonialCard: {
      label: "Testimonial card",
      icon: <Quote size={16} />,
      category: "cards",
      component: "TestimonialCard",
    },
    PriceCard: {
      label: "Price card",
      icon: <CreditCard size={16} />,
      category: "cards",
      component: "PriceCard",
    },
    TeamCard: {
      label: "Team card",
      icon: <Users size={16} />,
      category: "cards",
      component: "TeamCard",
    },
    Hero: {
      label: "Hero",
      icon: <Rocket size={16} />,
      category: "sections",
      component: "Hero",
      props: {
        eyebrow: "v2 · Visual editing for React",
        title: "Ship pages at the speed of thought",
        subtitle:
          "A drag-and-drop editor for your own React components. Own your data, keep your stack, extend anything.",
        primaryCta: { label: "Start building", href: "#" },
        secondaryCta: { label: "See components", href: "#" },
        align: "center",
        media: [],
      },
    },
    Logos: {
      label: "Logos",
      icon: <Tag size={16} />,
      category: "sections",
      component: "Logos",
      props: {
        eyebrow: "Trusted by teams shipping fast",
        logos: defaultLogos,
        grayscale: "yes",
      },
    },
    Features: {
      label: "Features",
      icon: <LayoutTemplate size={16} />,
      category: "sections",
      content: {
        type: "Features",
        props: {
          eyebrow: "Features",
          heading: "Everything you need to ship a page",
          subheading:
            "Composable primitives, rich fields, and a preview that mirrors production.",
          columns: "3",
          items: seededFeatureCards,
        },
      },
    },
    Testimonials: {
      label: "Testimonials",
      icon: <MessageSquareQuote size={16} />,
      category: "sections",
      content: {
        type: "Testimonials",
        props: {
          eyebrow: "Testimonials",
          heading: "Loved by teams that ship",
          subheading:
            "Engineers and marketers building real products with the editor.",
          items: seededTestimonialCards,
        },
      },
    },
    Pricing: {
      label: "Pricing",
      icon: <CreditCard size={16} />,
      category: "sections",
      content: {
        type: "Pricing",
        props: {
          eyebrow: "Pricing",
          heading: "Simple, predictable pricing",
          subheading:
            "Start free, upgrade when you need more seats, workspaces, or custom roles.",
          tiers: seededPriceCards,
        },
      },
    },
    Team: {
      label: "Team",
      icon: <Users size={16} />,
      category: "sections",
      content: {
        type: "Team",
        props: {
          eyebrow: "Team",
          heading: "Built by a small, focused team",
          subheading:
            "We come from editor, framework, and design-systems teams. This is the tool we always wanted.",
          members: seededTeamCards,
        },
      },
    },
    CTA: {
      label: "CTA",
      icon: <Rocket size={16} />,
      category: "sections",
      component: "CTA",
      props: {
        heading: "Start shipping pages today",
        subheading: "Free for open source and side projects.",
        variant: "gradient",
        buttons: [
          { label: "Start building", href: "#", variant: "secondary" },
          { label: "Read the docs", href: "#", variant: "outline" },
        ],
      },
    },
    FAQ: {
      label: "FAQ",
      icon: <HelpCircle size={16} />,
      category: "sections",
      component: "FAQ",
      props: {
        eyebrow: "FAQ",
        heading: "Frequently asked questions",
        subheading: "Answers to common questions about the editor.",
        items: defaultFAQItems,
      },
    },
    Navigation: {
      label: "Navigation",
      icon: <PanelTop size={16} />,
      category: "site",
      component: "Navigation",
      props: {
        brand: "react-editor",
        links: defaultNavLinks,
        cta: { label: "Start building", href: "#" },
      },
    },
    NavBar: {
      label: "Nav bar",
      icon: <Square size={16} />,
      category: "site",
      component: "NavBar",
      props: {
        brand: "react-editor",
        links: defaultNavLinks,
        cta: { label: "Sign in", href: "#" },
        align: "center",
      },
    },
    Footer: {
      label: "Footer",
      icon: <PanelBottom size={16} />,
      category: "site",
      component: "Footer",
      props: {
        brand: "react-editor",
        tagline: "A visual editor for your React components.",
        columns: defaultFooterColumns,
        copyright: "© 2026 react-editor. All rights reserved.",
        social: defaultSocial,
      },
    },
    FooterLinks: {
      label: "Footer links",
      icon: <Square size={16} />,
      category: "site",
      component: "FooterLinks",
      props: { columns: defaultFooterColumns },
    },
  },
};

export const componentKey = Buffer.from(
  `${Object.keys(conf.components).join("-")}-${JSON.stringify({ initialData })}`
).toString("base64");

export default conf;
