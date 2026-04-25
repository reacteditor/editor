import { cn } from "@/lib/utils";

type Props = {
  tagline: string;
  logos: Array<{ alt: string; src: string }>;
  grayscale: "yes" | "no";
};

export function Logos({ tagline, logos, grayscale }: Props) {
  return (
    <section className="w-full border-y border-border bg-muted/30 py-12">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {tagline ? (
          <p className="text-center text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {tagline}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-80">
          {(logos ?? [])
            .filter((l) => l.src)
            .map((l, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={l.src}
                alt={l.alt}
                className={cn(
                  "h-8 w-auto object-contain",
                  grayscale === "yes" &&
                    "grayscale transition-[filter] hover:grayscale-0"
                )}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
