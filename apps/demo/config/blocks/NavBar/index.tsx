import { ComponentConfig } from "@/core";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NavBarProps = {
  brand: string;
  links: Array<{ label: string; href: string }>;
  cta: { label: string; href: string };
  align: "start" | "center" | "end";
};

const justifyClasses: Record<NavBarProps["align"], string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

export const NavBar: ComponentConfig<NavBarProps> = {
  fields: {
    brand: { type: "text", default: "react-editor" },
    links: {
      type: "array",
      getItemSummary: (l) => l.label,
      arrayFields: {
        label: { type: "text" },
        href: { type: "text" },
      },
    },
    cta: {
      type: "object",
      objectFields: {
        label: { type: "text" },
        href: { type: "text" },
      },
    },
    align: {
      type: "radio",
      default: "center",
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
      ],
    },
  },
  render: ({ brand, links, cta, align }) => (
    <div className="flex w-full items-center gap-6">
      <a
        href="/"
        className="text-sm font-semibold tracking-tight text-foreground"
      >
        {brand}
      </a>
      <nav
        className={cn(
          "flex flex-1 items-center gap-6 text-sm",
          justifyClasses[align]
        )}
      >
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
      {cta?.label ? (
        <Button asChild size="sm">
          <a href={cta.href || "#"}>{cta.label}</a>
        </Button>
      ) : null}
    </div>
  ),
};
