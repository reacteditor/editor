"use client";

import { Button as UIButton } from "@/components/ui/button";
import { resolveIcon } from "@/config/icons";
import { Link } from "react-router";

type Variant = "default" | "secondary" | "outline" | "ghost" | "link";
type Size = "sm" | "default" | "lg";
type IconPosition = "leading" | "trailing";

type Props = {
  label: string;
  href: string;
  variant: Variant;
  size: Size;
  icon: string;
  iconPosition: IconPosition;
};

export function Button({
  label,
  href,
  variant,
  size,
  icon,
  iconPosition,
}: Props) {
  const Icon = resolveIcon(icon);
  return (
    <UIButton asChild variant={variant} size={size}>
      <Link to={href}>
        {Icon && iconPosition === "leading" ? <Icon /> : null}
        {label}
        {Icon && iconPosition === "trailing" ? <Icon /> : null}
      </Link>
    </UIButton>
  );
}
