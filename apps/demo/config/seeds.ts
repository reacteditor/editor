export const defaultNavLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Team", href: "#team" },
  { label: "FAQ", href: "#faq" },
];

export const defaultLogos = [
  { alt: "Vercel", src: "https://cdn.simpleicons.org/vercel" },
  { alt: "Next.js", src: "https://cdn.simpleicons.org/nextdotjs" },
  { alt: "React", src: "https://cdn.simpleicons.org/react" },
  { alt: "TypeScript", src: "https://cdn.simpleicons.org/typescript" },
  { alt: "Tailwind", src: "https://cdn.simpleicons.org/tailwindcss" },
  { alt: "Radix", src: "https://cdn.simpleicons.org/radixui" },
];

export const defaultFooterColumns = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "Guides", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export const defaultSocial = [
  { platform: "twitter" as const, href: "#" },
  { platform: "github" as const, href: "#" },
  { platform: "linkedin" as const, href: "#" },
];

export const defaultFAQItems = [
  {
    question: "What is React Editor?",
    answer:
      "<p>A drag-and-drop visual editor that works with your own React components. You keep your stack, own your data, and extend anything.</p>",
  },
  {
    question: "How do I register my own components?",
    answer:
      "<p>Export a <code>Config</code> with your components and pass it to the <code>Editor</code>. Every component registers its fields and a render function.</p>",
  },
  {
    question: "Where is my data stored?",
    answer:
      "<p>Wherever you put it. The editor emits JSON — persist to your database, file system, or CMS.</p>",
  },
  {
    question: "Does it work with Tailwind?",
    answer:
      "<p>Yes — you use your own components, so it works with Tailwind, shadcn, Chakra, or any UI library you already have.</p>",
  },
  {
    question: "Is it production-ready?",
    answer:
      "<p>Use it today for app surfaces, docs, and marketing sites. Custom permissions, roles, and plugins are all supported.</p>",
  },
];

export const seededFeatureCards = [
  {
    type: "feature-card" as const,
    props: {
      id: "seed-feature-1",
      icon: "sparkles",
      title: "Drag-and-drop authoring",
      description:
        "Compose any UI from your own React components. Fields, validation, and rich text built in.",
      cta: { label: "", href: "" },
    },
  },
  {
    type: "feature-card" as const,
    props: {
      id: "seed-feature-2",
      icon: "zap",
      title: "Own your stack",
      description:
        "No vendor runtime. Installs as a React package and stores data as plain JSON.",
      cta: { label: "", href: "" },
    },
  },
  {
    type: "feature-card" as const,
    props: {
      id: "seed-feature-3",
      icon: "rocket",
      title: "Extensible end to end",
      description:
        "Plugins, custom fields, permission rules, and overrides for every editor surface.",
      cta: { label: "", href: "" },
    },
  },
];

export const seededTestimonialCards = [
  {
    type: "testimonial-card" as const,
    props: {
      id: "seed-testimonial-1",
      quote:
        "<p>We replaced a homegrown CMS with this in a weekend. Authoring feels like Figma, output is just JSON.</p>",
      author: "Priya Raman",
      role: "Staff engineer, Lumos",
      avatarUrl: "",
    },
  },
  {
    type: "testimonial-card" as const,
    props: {
      id: "seed-testimonial-2",
      quote:
        "<p>Marketing edits the site without our help now. The primitives map 1:1 to our design system.</p>",
      author: "Marcus Cole",
      role: "Design systems lead, Tessera",
      avatarUrl: "",
    },
  },
  {
    type: "testimonial-card" as const,
    props: {
      id: "seed-testimonial-3",
      quote:
        "<p>The slot model makes it trivial to mix custom blocks with stock layout primitives. Extensibility that actually scales.</p>",
      author: "Ada Okonkwo",
      role: "Engineering manager, Northwind",
      avatarUrl: "",
    },
  },
];

export const seededPriceCards = [
  {
    type: "price-card" as const,
    props: {
      id: "seed-tier-starter",
      name: "Starter",
      price: "$0",
      cadence: "month" as const,
      features: [
        { text: "Up to 3 editors" },
        { text: "Unlimited content" },
        { text: "Community support" },
      ],
      highlighted: "no" as const,
      badge: "",
      cta: { label: "Start free", href: "#", variant: "outline" as const },
    },
  },
  {
    type: "price-card" as const,
    props: {
      id: "seed-tier-team",
      name: "Team",
      price: "$49",
      cadence: "month" as const,
      features: [
        { text: "Unlimited editors" },
        { text: "Role-based permissions" },
        { text: "Custom plugins" },
        { text: "Priority support" },
      ],
      highlighted: "yes" as const,
      badge: "Most popular",
      cta: {
        label: "Start 14-day trial",
        href: "#",
        variant: "default" as const,
      },
    },
  },
  {
    type: "price-card" as const,
    props: {
      id: "seed-tier-enterprise",
      name: "Enterprise",
      price: "Custom",
      cadence: "year" as const,
      features: [
        { text: "SSO, audit logs, SLA" },
        { text: "Dedicated cluster" },
        { text: "Custom onboarding" },
      ],
      highlighted: "no" as const,
      badge: "",
      cta: { label: "Contact sales", href: "#", variant: "outline" as const },
    },
  },
];

export const seededTeamCards = [
  {
    type: "team-card" as const,
    props: {
      id: "seed-member-1",
      avatarUrl: "",
      name: "Riley Chen",
      title: "Founder, editor runtime",
      bio: "Built the original block engine. Previously on a visual builder at a large B2B.",
      socials: [
        { platform: "twitter" as const, href: "#" },
        { platform: "github" as const, href: "#" },
      ],
    },
  },
  {
    type: "team-card" as const,
    props: {
      id: "seed-member-2",
      avatarUrl: "",
      name: "Sam Okafor",
      title: "Design systems",
      bio: "Tokens, typography, and the opinionated defaults that make every screen feel intentional.",
      socials: [
        { platform: "twitter" as const, href: "#" },
        { platform: "linkedin" as const, href: "#" },
      ],
    },
  },
  {
    type: "team-card" as const,
    props: {
      id: "seed-member-3",
      avatarUrl: "",
      name: "Daria Volkova",
      title: "Infra & API",
      bio: "Persistence, migrations, and the plugin SDK. Owns everything below the render tree.",
      socials: [
        { platform: "github" as const, href: "#" },
        { platform: "linkedin" as const, href: "#" },
      ],
    },
  },
  {
    type: "team-card" as const,
    props: {
      id: "seed-member-4",
      avatarUrl: "",
      name: "Jordan Blake",
      title: "Developer relations",
      bio: "Guides, recipes, and the community. Your first stop if you get stuck.",
      socials: [
        { platform: "twitter" as const, href: "#" },
        { platform: "github" as const, href: "#" },
      ],
    },
  },
];
