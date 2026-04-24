import { ComponentConfig } from "@/core";
import { MousePointerClick } from "lucide-react";
import { Button as ButtonComponent } from "@/components/button";
import { iconOptions } from "../../icons";

export type ButtonBlockProps = {
  label: string;
  href: string;
  variant: "default" | "secondary" | "outline" | "ghost" | "link";
  size: "sm" | "default" | "lg";
  icon: string;
  iconPosition: "leading" | "trailing";
};

export const Button: ComponentConfig<ButtonBlockProps> = {
  label: "Button",
  icon: <MousePointerClick size={16} />,
  category: "elements",
  defaultProps: {
    label: "Get started",
    href: "#",
    variant: "default",
    size: "default",
    icon: "none",
    iconPosition: "leading",
  },
  fields: {
    label: { type: "text", contentEditable: true },
    href: { type: "text" },
    variant: {
      type: "select",
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
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "default" },
        { label: "Large", value: "lg" },
      ],
    },
    icon: {
      type: "select",
      options: iconOptions,
    },
    iconPosition: {
      type: "radio",
      options: [
        { label: "Leading", value: "leading" },
        { label: "Trailing", value: "trailing" },
      ],
    },
  },
  resolveFields: (data, { fields }) => {
    const hasIcon = Boolean(data.props.icon && data.props.icon !== "none");
    return {
      ...fields,
      iconPosition: { ...fields.iconPosition, visible: hasIcon },
    };
  },
  render: ({ label, href, variant, size, icon, iconPosition }) => (
    <ButtonComponent
      label={label}
      href={href}
      variant={variant}
      size={size}
      icon={icon}
      iconPosition={iconPosition}
    />
  ),
};
