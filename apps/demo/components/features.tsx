import * as React from "react";
import { cn } from "@/lib/utils";

type Columns = "2" | "3" | "4";

type SlotRender = React.ComponentType<{ className?: string }>;

type Props = {
  tagline: string;
  heading: string;
  subheading: string;
  columns: Columns;
  items: SlotRender;
};

const columnsClasses: Record<Columns, string> = {
  "2": "sm:grid-cols-2",
  "3": "sm:grid-cols-2 lg:grid-cols-3",
  "4": "sm:grid-cols-2 lg:grid-cols-4",
};

export function Features({
  tagline,
  heading,
  subheading,
  columns,
  items: Items,
}: Props) {
  return (
    <section className="w-full bg-background py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          {tagline ? (
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              {tagline}
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
  );
}
