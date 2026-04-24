import { ComponentConfig } from "@/core";
import { Button as UIButton } from "@/components/ui/button";
import { iconOptions, resolveIcon } from "../../icons";

export type ButtonBlockProps = {
  label: string;
  href: string;
  variant: "default" | "secondary" | "outline" | "ghost" | "link";
  size: "sm" | "default" | "lg";
  icon: string;
  iconPosition: "leading" | "trailing";
};

export const Button: ComponentConfig<ButtonBlockProps> = {
  fields: {
    label: { type: "text", default: "Get started", contentEditable: true },
    href: { type: "text", default: "#" },
    variant: {
      type: "select",
      default: "default",
      options: [
        { label: "Primary", value: "default" },
        { label: "Secondary", value: "secondary" },
        { label: "Outline", value: "outline" },
        { label: "Ghost", value: "ghost" },
        { label: "Link", value: "link" },
      ],
    },
    size: {
      type: "radio",
      default: "default",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "default" },
        { label: "Large", value: "lg" },
      ],
    },
    icon: {
      type: "select",
      default: "none",
      options: iconOptions,
    },
    iconPosition: {
      type: "radio",
      default: "leading",
      options: [
        { label: "Leading", value: "leading" },
        { label: "Trailing", value: "trailing" },
      ],
    },
  },
  resolveFields: (data, { fields }) => {
    const hasIcon = Boolean(
      data.props.icon && data.props.icon !== "none"
    );
    return {
      ...fields,
      iconPosition: { ...fields.iconPosition, visible: hasIcon },
    };
  },
  render: ({ label, href, variant, size, icon, iconPosition }) => {
    const Icon = resolveIcon(icon);
    return (
      <UIButton asChild variant={variant} size={size}>
        <a href={href}>
          {Icon && iconPosition === "leading" ? <Icon /> : null}
          {label}
          {Icon && iconPosition === "trailing" ? <Icon /> : null}
        </a>
      </UIButton>
    );
  },
};
