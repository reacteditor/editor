"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router";
type Platform = string;

type Props = {
  avatarUrl: string;
  name: string;
  title: string;
  bio: string;
  socials: Array<{ platform: Platform; href: string }>;
};

const socialIcon: Record<string, React.FC<{ className?: string }>> = {};

const initials = (name: unknown) => {
  if (typeof name !== "string" || !name) return "";
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export function TeamCard({ avatarUrl, name, title, bio, socials }: Props) {
  return (
    <Card className="h-full min-w-[240px] items-center gap-4 p-6 text-center">
      <CardHeader className="flex flex-col items-center gap-3 px-0">
        <Avatar className="size-20">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
          <AvatarFallback className="text-lg font-medium">
            {initials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-foreground">
            {name}
          </span>
          <span className="text-sm text-muted-foreground">{title}</span>
        </div>
      </CardHeader>
      <CardContent className="px-0 text-sm text-muted-foreground">
        {bio}
      </CardContent>
      {(socials ?? []).length ? (
        <div className="flex gap-3">
          {(socials ?? []).map((s, i) => {
            const Icon = socialIcon[s.platform];
            return (
              <Link
                key={i}
                to={s.href || "#"}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={s.platform}
              >
                {Icon ? <Icon className="size-4" /> : s.platform}
              </Link>
            );
          })}
        </div>
      ) : null}
    </Card>
  );
}
