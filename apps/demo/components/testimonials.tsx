import * as React from "react";

type SlotRender = React.ComponentType<{ className?: string }>;

type Props = {
  tagline: string;
  heading: string;
  subheading: string;
  items: SlotRender;
};

export function Testimonials({
  tagline,
  heading,
  subheading,
  items: Items,
}: Props) {
  return (
    <section className="w-full bg-muted/40 py-24">
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
        <Items className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" />
      </div>
    </section>
  );
}
