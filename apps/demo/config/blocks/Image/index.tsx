import { ComponentConfig } from "@/core";
import { cn } from "@/lib/utils";

export type ImageProps = {
  src: string;
  alt: string;
  ratio: "auto" | "1:1" | "4:3" | "16:9" | "21:9";
  fit: "cover" | "contain";
  rounded: "none" | "md" | "lg" | "xl" | "full";
};

const ratioClasses: Record<ImageProps["ratio"], string> = {
  auto: "",
  "1:1": "aspect-square",
  "4:3": "aspect-[4/3]",
  "16:9": "aspect-video",
  "21:9": "aspect-[21/9]",
};

const roundedClasses: Record<ImageProps["rounded"], string> = {
  none: "",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-2xl",
  full: "rounded-full",
};

export const Image: ComponentConfig<ImageProps> = {
  fields: {
    src: {
      type: "text",
      placeholder: "https://...",
      default: "https://placehold.co/1600x900",
    },
    alt: { type: "text" },
    ratio: {
      type: "select",
      default: "16:9",
      options: [
        { label: "Auto", value: "auto" },
        { label: "1:1", value: "1:1" },
        { label: "4:3", value: "4:3" },
        { label: "16:9", value: "16:9" },
        { label: "21:9", value: "21:9" },
      ],
    },
    fit: {
      type: "radio",
      default: "cover",
      options: [
        { label: "Cover", value: "cover" },
        { label: "Contain", value: "contain" },
      ],
    },
    rounded: {
      type: "select",
      default: "xl",
      options: [
        { label: "None", value: "none" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra large", value: "xl" },
        { label: "Full", value: "full" },
      ],
    },
  },
  render: ({ src, alt, ratio, fit, rounded }) => (
    <div
      className={cn(
        "overflow-hidden bg-muted",
        ratioClasses[ratio],
        roundedClasses[rounded]
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={cn(
            "h-full w-full",
            fit === "cover" ? "object-cover" : "object-contain"
          )}
        />
      ) : null}
    </div>
  ),
};
