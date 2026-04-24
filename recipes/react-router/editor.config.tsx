import type { Config } from "@frontendai/react-editor";
import { Heading } from "lucide-react";

type Props = {
  HeadingBlock: { title: string };
};

export const config: Config<Props> = {
  components: {
    HeadingBlock: {
      label: "Heading",
      icon: <Heading size={16} />,
      defaultProps: { title: "Heading" },
      fields: {
        title: { type: "text" },
      },
      render: ({ title }) => (
        <div style={{ padding: 64 }}>
          <h1>{title}</h1>
        </div>
      ),
    },
  },
};

