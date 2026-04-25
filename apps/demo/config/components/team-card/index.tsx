import { ComponentConfig } from "@/core";
import { Users } from "lucide-react";
import { TeamCard as TeamCardComponent } from "@/components/team-card";

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

export const TeamCard: ComponentConfig<TeamCardProps> = {
  label: "Team card",
  icon: <Users size={16} />,
  category: "cards",
  defaultProps: {
    avatarUrl: "",
    name: "Alex Rivera",
    title: "Founding engineer",
    bio: "Builds the editor runtime and the primitives that compose every interface.",
    socials: [
      { platform: "twitter", href: "#" },
      { platform: "github", href: "#" },
    ],
  },
  fields: {
    avatarUrl: { type: "text" },
    name: { type: "text", contentEditable: true },
    title: {
      type: "text",
      contentEditable: true,
    },
    bio: {
      type: "textarea",
      contentEditable: true,
    },
    socials: {
      type: "array",
      defaultItemProps: { platform: "twitter", href: "#" },
      getItemSummary: (s) => s.platform,
      arrayFields: {
        platform: {
          type: "select",
          options: [...socialOptions],
        },
        href: { type: "text" },
      },
    },
  },
  render: ({ avatarUrl, name, title, bio, socials }) => (
    <TeamCardComponent
      avatarUrl={avatarUrl}
      name={name}
      title={title}
      bio={bio}
      socials={socials}
    />
  ),
};
