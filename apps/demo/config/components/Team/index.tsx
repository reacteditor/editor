import { ComponentConfig, Slot } from "@/core";
import { Users } from "lucide-react";
import { Team as TeamComponent } from "@/components/team";

export type TeamProps = {
  eyebrow: string;
  heading: string;
  subheading: string;
  members: Slot;
};

export const Team: ComponentConfig<TeamProps> = {
  label: "Team",
  icon: <Users size={16} />,
  category: "sections",
  defaultProps: {
    eyebrow: "Team",
    heading: "Built by a small, focused team",
    subheading:
      "We come from editor, framework, and design-systems teams. This is the tool we always wanted.",
    members: [
      {
        type: "TeamCard",
        props: {
          id: "seed-member-1",
          avatarUrl: "",
          name: "Riley Chen",
          title: "Founder, editor runtime",
          bio: "Shipped the original block engine. Previously on a visual builder at a large B2B.",
          socials: [
            { platform: "twitter", href: "#" },
            { platform: "github", href: "#" },
          ],
        },
      },
      {
        type: "TeamCard",
        props: {
          id: "seed-member-2",
          avatarUrl: "",
          name: "Sam Okafor",
          title: "Design systems",
          bio: "Tokens, typography, and the opinionated defaults that make pages look intentional.",
          socials: [
            { platform: "twitter", href: "#" },
            { platform: "linkedin", href: "#" },
          ],
        },
      },
      {
        type: "TeamCard",
        props: {
          id: "seed-member-3",
          avatarUrl: "",
          name: "Daria Volkova",
          title: "Infra & API",
          bio: "Persistence, migrations, and the plugin SDK. Owns everything below the render tree.",
          socials: [
            { platform: "github", href: "#" },
            { platform: "linkedin", href: "#" },
          ],
        },
      },
      {
        type: "TeamCard",
        props: {
          id: "seed-member-4",
          avatarUrl: "",
          name: "Jordan Blake",
          title: "Developer relations",
          bio: "Guides, recipes, and the community. Your first stop if you get stuck.",
          socials: [
            { platform: "twitter", href: "#" },
            { platform: "github", href: "#" },
          ],
        },
      },
    ],
  },
  fields: {
    eyebrow: { type: "text", contentEditable: true },
    heading: {
      type: "text",
      contentEditable: true,
    },
    subheading: {
      type: "textarea",
      contentEditable: true,
    },
    members: { type: "slot" },
  },
  render: ({ eyebrow, heading, subheading, members }) => (
    <TeamComponent
      eyebrow={eyebrow}
      heading={heading}
      subheading={subheading}
      members={members}
    />
  ),
};
