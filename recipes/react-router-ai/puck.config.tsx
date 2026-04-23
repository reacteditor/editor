import type { Config } from "@puckeditor/core";
import { Heading } from "lucide-react";

type Props = {
  HeadingBlock: { title: string };
};

export const config: Config<Props> = {
  components: {
    HeadingBlock: {
      fields: {
        title: { type: "text", default: "Heading" },
      },
      render: ({ title }) => (
        <div style={{ padding: 64 }}>
          <h1>{title}</h1>
        </div>
      ),
    },
  },
  blocks: {
    Heading: {
      label: "Heading",
      icon: <Heading size={16} />,
      component: "HeadingBlock",
    },
  },
};

