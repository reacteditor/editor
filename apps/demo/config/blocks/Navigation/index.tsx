import { ComponentConfig } from "@/core";
import { Button } from "@/components/ui/button";

export type NavigationProps = {
  brand: string;
  links: Array<{ label: string; href: string }>;
  cta: { label: string; href: string };
};

export const Navigation: ComponentConfig<NavigationProps> = {
  global: true,
  fields: {
    brand: { type: "text", default: "react-editor", contentEditable: true },
    links: {
      type: "array",
      getItemSummary: (l) => l.label,
      arrayFields: {
        label: { type: "text", contentEditable: true },
        href: { type: "text" },
      },
    },
    cta: {
      type: "object",
      objectFields: {
        label: { type: "text", contentEditable: true },
        href: { type: "text" },
      },
    },
  },
  render: ({ brand, links, cta }) => (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6 md:px-10">
        <a
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground"
        >
          <span className="inline-flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            ◆
          </span>
          <span>{brand}</span>
        </a>
        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm md:flex">
          {(links ?? []).map((l, i) => (
            <a
              key={i}
              href={l.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {cta?.label ? (
            <Button asChild size="sm">
              <a href={cta.href || "#"}>{cta.label}</a>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  ),
};
