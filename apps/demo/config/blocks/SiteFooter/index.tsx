import React from "react";
import { ComponentConfig } from "@/core/types";
import { Section } from "../../components/Section";

export type SiteFooterProps = {
  sections: {
    title: string;
    links: { label: string; href: string }[];
  }[];
  byline: string;
};

export const SiteFooter: ComponentConfig<SiteFooterProps> = {
  global: true,
  label: "Site footer",
  fields: {
    sections: {
      type: "array",
      getItemSummary: (item, i) => item.title || `Section ${i ?? ""}`,
      arrayFields: {
        title: { type: "text", default: "Section" },
        links: {
          type: "array",
          getItemSummary: (item) => item.label || "Link",
          arrayFields: {
            label: { type: "text", default: "Label" },
            href: { type: "text", default: "#" },
          },
          default: [
            { label: "Label", href: "#" },
            { label: "Label", href: "#" },
            { label: "Label", href: "#" },
            { label: "Label", href: "#" },
          ],
        },
      },
      default: [
        {
          title: "Section",
          links: [
            { label: "Label", href: "#" },
            { label: "Label", href: "#" },
            { label: "Label", href: "#" },
            { label: "Label", href: "#" },
          ],
        },
        {
          title: "Section",
          links: [
            { label: "Label", href: "#" },
            { label: "Label", href: "#" },
            { label: "Label", href: "#" },
            { label: "Label", href: "#" },
          ],
        },
      ],
    },
    byline: { type: "text", default: "Made with Editor" },
  },
  render: ({ sections, byline }) => (
    <footer style={{ background: "var(--fe-color-grey-12)" }}>
      <h2 style={{ visibility: "hidden", height: 0, margin: 0 }}>Footer</h2>
      <div style={{ padding: 32 }}>
        <Section>
          <div
            style={{
              display: "grid",
              gridGap: 24,
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              paddingTop: 24,
              paddingBottom: 24,
            }}
          >
            {sections.map((section, i) => (
              <div key={i}>
                <h3
                  style={{
                    margin: 0,
                    padding: 0,
                    fontSize: "inherit",
                    fontWeight: 600,
                    color: "var(--fe-color-grey-03)",
                  }}
                >
                  {section.title}
                </h3>
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    paddingTop: 12,
                  }}
                >
                  {section.links.map((link, j) => (
                    <li key={j} style={{ paddingBottom: 8 }}>
                      <a
                        href={link.href || "#"}
                        style={{
                          textDecoration: "none",
                          fontSize: 14,
                          color: "var(--fe-color-grey-05)",
                        }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      </div>
      <div
        style={{
          padding: 64,
          textAlign: "center",
          color: "var(--fe-color-grey-03)",
          background: "var(--fe-color-grey-11)",
        }}
      >
        {byline}
      </div>
    </footer>
  ),
};
