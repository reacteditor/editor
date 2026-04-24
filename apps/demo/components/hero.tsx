import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Align = "left" | "center";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  align: Align;
};

export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  align,
}: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-background py-24 md:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.muted.DEFAULT)_0%,theme(colors.background)_60%)]" />
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div
          className={cn(
            "flex flex-col gap-8",
            align === "center" ? "items-center text-center" : "items-start"
          )}
        >
          {eyebrow ? (
            <Badge variant="outline" className="rounded-full px-3 py-1">
              {eyebrow}
            </Badge>
          ) : null}
          <h1
            className={cn(
              "max-w-3xl text-5xl font-semibold tracking-tight text-foreground md:text-7xl",
              align === "center" && "mx-auto"
            )}
          >
            {title}
          </h1>
          <p
            className={cn(
              "max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl",
              align === "center" && "mx-auto"
            )}
          >
            {subtitle}
          </p>
          <div
            className={cn(
              "flex flex-wrap gap-3",
              align === "center" && "justify-center"
            )}
          >
            {primaryCta?.label ? (
              <Button asChild size="lg">
                <a href={primaryCta.href || "#"}>{primaryCta.label}</a>
              </Button>
            ) : null}
            {secondaryCta?.label ? (
              <Button asChild variant="outline" size="lg">
                <a href={secondaryCta.href || "#"}>{secondaryCta.label}</a>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
