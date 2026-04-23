/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ComponentConfig } from "@/core";
import styles from "./styles.module.css";
import { getClassNameFactory } from "@/core/lib";
import { Section } from "../../components/Section";

const getClassName = getClassNameFactory("Logos", styles);

export type LogosProps = {
  logos: {
    alt: string;
    imageUrl: string;
  }[];
};

const GOOGLE_LOGO =
  "https://logolook.net/wp-content/uploads/2021/06/Google-Logo.png";

export const Logos: ComponentConfig<LogosProps> = {
  fields: {
    logos: {
      type: "array",
      getItemSummary: (item, i) => item.alt || `Feature #${i}`,
      arrayFields: {
        alt: { type: "text", default: "" },
        imageUrl: { type: "text", default: "" },
      },
      default: [
        { alt: "google", imageUrl: GOOGLE_LOGO },
        { alt: "google", imageUrl: GOOGLE_LOGO },
        { alt: "google", imageUrl: GOOGLE_LOGO },
        { alt: "google", imageUrl: GOOGLE_LOGO },
        { alt: "google", imageUrl: GOOGLE_LOGO },
      ],
    },
  },
  render: ({ logos }) => {
    return (
      <Section className={getClassName()}>
        <div className={getClassName("items")}>
          {logos.map((item, i) => (
            <div key={i} className={getClassName("item")}>
              <img
                className={getClassName("image")}
                alt={item.alt}
                src={item.imageUrl}
                height={64}
              ></img>
            </div>
          ))}
        </div>
      </Section>
    );
  },
};
