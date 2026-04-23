import React from "react";
import { ComponentConfig } from "@/core/types";
import { getClassNameFactory } from "@/core/lib";
import styles from "../../components/Header/styles.module.css";

const getClassName = getClassNameFactory("Header", styles);

export type SiteHeaderProps = {
  logo: string;
  navItems: { label: string; href: string }[];
};

export const SiteHeader: ComponentConfig<SiteHeaderProps> = {
  global: true,
  label: "Site header",
  fields: {
    logo: { type: "text", default: "LOGO" },
    navItems: {
      type: "array",
      getItemSummary: (item, i) => item.label || `Item ${i ?? ""}`,
      arrayFields: {
        label: { type: "text", default: "Link" },
        href: { type: "text", default: "/" },
      },
      default: [
        { label: "Home", href: "/" },
        { label: "Pricing", href: "/pricing" },
        { label: "About", href: "/about" },
      ],
    },
  },
  render: ({ logo, navItems, editor }) => {
    const navPath =
      typeof window !== "undefined"
        ? window.location.pathname.replace("/edit", "") || "/"
        : "/";

    return (
      <div className={getClassName()}>
        <header className={getClassName("inner")}>
          <div className={getClassName("logo")}>{logo}</div>
          <nav className={getClassName("items")}>
            {navItems.map((item, i) => {
              const href = editor.isEditing ? "" : item.href;
              const isActive = navPath === (item.href || "/");
              const El = href ? "a" : "span";
              return (
                <El
                  key={i}
                  href={href || "/"}
                  style={{
                    textDecoration: "none",
                    color: isActive
                      ? "var(--fe-color-grey-02)"
                      : "var(--fe-color-grey-06)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {item.label}
                </El>
              );
            })}
          </nav>
        </header>
      </div>
    );
  },
};
