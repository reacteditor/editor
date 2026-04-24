import { ComponentConfig, Slot } from "@/core";
import { cn } from "@/lib/utils";

export type FeaturesProps = {
  eyebrow: string;
  heading: string;
  subheading: string;
  columns: "2" | "3" | "4";
  items: Slot;
};

const columnsClasses: Record<FeaturesProps["columns"], string> = {
  "2": "sm:grid-cols-2",
  "3": "sm:grid-cols-2 lg:grid-cols-3",
  "4": "sm:grid-cols-2 lg:grid-cols-4",
};

export const Features: ComponentConfig<FeaturesProps> = {
  fields: {
    eyebrow: { type: "text", contentEditable: true },
    heading: { type: "text", contentEditable: true },
    subheading: { type: "textarea", contentEditable: true },
    columns: {
      type: "radio",
      default: "3",
      options: [
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
      ],
    },
    items: { type: "slot" },
  },
  render: ({ eyebrow, heading, subheading, columns, items: Items }) => (
    <section className="w-full bg-background py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {heading}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{subheading}</p>
        </div>
        <Items
          className={cn(
            "mt-16 grid grid-cols-1 gap-6",
            columnsClasses[columns]
          )}
        />
      </div>
    </section>
  ),
};
