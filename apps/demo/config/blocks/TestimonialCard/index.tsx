import * as React from "react";
import { ComponentConfig } from "@/core";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type TestimonialCardProps = {
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
};

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

export const TestimonialCard: ComponentConfig<TestimonialCardProps> = {
  fields: {
    quote: { type: "richtext", contentEditable: true },
    author: { type: "text", default: "Jane Doe", contentEditable: true },
    role: {
      type: "text",
      default: "Head of Marketing, Acme",
      contentEditable: true,
    },
    avatarUrl: { type: "text" },
  },
  render: ({ quote, author, role, avatarUrl }) => (
    <Card className="h-full gap-4 p-6">
      <CardContent className="px-0 text-base leading-relaxed text-foreground">
        {quote as unknown as React.ReactNode}
      </CardContent>
      <CardHeader className="flex flex-row items-center gap-3 px-0">
        <Avatar className="size-10">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={author} /> : null}
          <AvatarFallback className="text-xs font-medium">
            {initials(author)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {author}
          </span>
          <span className="text-xs text-muted-foreground">{role}</span>
        </div>
      </CardHeader>
    </Card>
  ),
};
