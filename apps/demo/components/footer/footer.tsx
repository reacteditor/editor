import { Separator } from "@/components/ui/separator";
import { MousePointer2 } from "lucide-react";

type Platform = string;

type Props = {
  brand: string;
  tagline: string;
  columns: Array<{
    heading: string;
    links: Array<{ label: string; href: string }>;
  }>;
  copyright: string;
  social: Array<{ platform: Platform; href: string }>;
};

const socialIcon: Record<string, React.FC<{ className?: string }>> = {};

export function Footer({
  brand,
  tagline,
  columns,
  copyright,
  social,
}: Props) {
  return (
    <footer className="w-full border-t border-border bg-muted/20">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <a
              href="/"
              className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground"
            >
              <span className="inline-flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MousePointer2 size={14} />
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
                  {Icon ? <Icon className="size-4" /> : s.platform}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
