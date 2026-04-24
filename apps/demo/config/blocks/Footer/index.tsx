import { ComponentConfig } from "@/core";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Twitter } from "lucide-react";
import { defaultFooterColumns, defaultSocial } from "../../seeds";

const socialOptions = [
  { label: "Twitter", value: "twitter" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "GitHub", value: "github" },
] as const;

export type FooterProps = {
  brand: string;
  tagline: string;
  columns: Array<{
    heading: string;
    links: Array<{ label: string; href: string }>;
  }>;
  copyright: string;
  social: Array<{ platform: "twitter" | "linkedin" | "github"; href: string }>;
};

const socialIcon = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
};

export const Footer: ComponentConfig<FooterProps> = {
  global: true,
  fields: {
    brand: { type: "text", default: "react-editor", contentEditable: true },
    tagline: {
      type: "textarea",
      default: "A visual editor for your React components.",
      contentEditable: true,
    },
    columns: {
      type: "array",
      default: defaultFooterColumns,
      getItemSummary: (c) => c.heading,
      arrayFields: {
        heading: { type: "text", contentEditable: true },
        links: {
          type: "array",
          getItemSummary: (l) => l.label,
          arrayFields: {
            label: { type: "text", contentEditable: true },
            href: { type: "text" },
          },
        },
      },
    },
    copyright: {
      type: "text",
      default: "© 2026 react-editor. All rights reserved.",
      contentEditable: true,
    },
    social: {
      type: "array",
      default: defaultSocial,
      getItemSummary: (s) => s.platform,
      arrayFields: {
        platform: {
          type: "select",
          default: "twitter",
          options: [...socialOptions],
        },
        href: { type: "text" },
      },
    },
  },
  render: ({ brand, tagline, columns, copyright, social }) => (
    <footer className="w-full border-t border-border bg-muted/20">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <a
              href="/"
              className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground"
            >
              <span className="inline-flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                ◆
              </span>
              <span>{brand}</span>
            </a>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {tagline}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 md:col-span-3">
            {(columns ?? []).map((col, i) => (
              <div key={i} className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-foreground">
                  {col.heading}
                </span>
                <ul className="flex flex-col gap-2">
                  {(col.links ?? []).map((l, j) => (
                    <li key={j}>
                      <a
                        href={l.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <Separator className="my-10" />
        <div className="flex flex-col-reverse items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">{copyright}</p>
          <div className="flex items-center gap-3">
            {(social ?? []).map((s, i) => {
              const Icon = socialIcon[s.platform];
              return (
                <a
                  key={i}
                  href={s.href || "#"}
                  aria-label={s.platform}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  ),
};
