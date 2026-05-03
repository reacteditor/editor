"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveIcon } from "@/config/icons";
import { Link } from "react-router";

type Props = {
  icon: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
};

export function FeatureCard({ icon, title, description, cta }: Props) {
  const Icon = resolveIcon(icon);
  return (
    <Card className="h-full min-w-[280px] gap-4 p-6 transition-shadow hover:shadow-md">
      <CardHeader className="px-0">
        {Icon ? (
          <div className="mb-2 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
        ) : null}
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-0 text-sm leading-relaxed text-muted-foreground">
        {description}
      </CardContent>
      {cta?.label ? (
        <Link
          to={cta.href || "#"}
          className="inline-flex items-center gap-1 px-6 text-sm font-medium text-primary hover:underline"
        >
          {cta.label}
          <span aria-hidden>→</span>
        </Link>
      ) : null}
    </Card>
  );
}
