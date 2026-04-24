import { ComponentConfig } from "@/core";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Linkedin, Twitter } from "lucide-react";

const socialOptions = [
  { label: "Twitter", value: "twitter" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "GitHub", value: "github" },
] as const;

export type TeamCardProps = {
  avatarUrl: string;
  name: string;
  title: string;
  bio: string;
  socials: Array<{
    platform: "twitter" | "linkedin" | "github";
    href: string;
  }>;
};

const socialIcon = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const TeamCard: ComponentConfig<TeamCardProps> = {
  fields: {
    avatarUrl: { type: "text" },
    name: { type: "text", default: "Alex Rivera" },
    title: { type: "text", default: "Founding engineer" },
    bio: {
      type: "textarea",
      default: "A short bio.",
    },
    socials: {
      type: "array",
      getItemSummary: (s) => s.platform,
      arrayFields: {
        platform: {
          type: "select",
          default: "twitter",
          options: [...socialOptions],
        },
        href: { type: "text" },
      },
    },
  },
  render: ({ avatarUrl, name, title, bio, socials }) => (
    <Card className="h-full items-center gap-4 p-6 text-center">
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
              <a
                key={i}
                href={s.href || "#"}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={s.platform}
              >
                <Icon className="size-4" />
              </a>
            );
          })}
        </div>
      ) : null}
    </Card>
  ),
};
