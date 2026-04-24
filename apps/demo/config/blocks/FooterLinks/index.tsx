import { ComponentConfig } from "@/core";

export type FooterLinksProps = {
  columns: Array<{
    heading: string;
    links: Array<{ label: string; href: string }>;
  }>;
};

export const FooterLinks: ComponentConfig<FooterLinksProps> = {
  fields: {
    columns: {
      type: "array",
      getItemSummary: (c) => c.heading,
      arrayFields: {
        heading: { type: "text" },
        links: {
          type: "array",
          getItemSummary: (l) => l.label,
          arrayFields: {
            label: { type: "text" },
            href: { type: "text" },
          },
        },
      },
    },
  },
  render: ({ columns }) => (
    <div className="grid w-full grid-cols-2 gap-8 md:grid-cols-4">
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
  ),
};
