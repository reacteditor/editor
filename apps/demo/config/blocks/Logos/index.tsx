import { ComponentConfig } from "@/core";
import { cn } from "@/lib/utils";

export type LogosProps = {
  eyebrow: string;
  logos: Array<{ alt: string; src: string }>;
  grayscale: "yes" | "no";
};

export const Logos: ComponentConfig<LogosProps> = {
  fields: {
    eyebrow: { type: "text", contentEditable: true },
    logos: {
      type: "array",
      getItemSummary: (l, i) => l.alt || `Logo ${(i ?? 0) + 1}`,
      arrayFields: {
        alt: { type: "text" },
        src: { type: "text" },
      },
    },
    grayscale: {
      type: "radio",
      default: "yes",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
    },
  },
  render: ({ eyebrow, logos, grayscale }) => (
    <section className="w-full border-y border-border bg-muted/30 py-12">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {eyebrow ? (
          <p className="text-center text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {eyebrow}
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
  ),
};
