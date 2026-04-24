import { DefaultRootProps, RootConfig } from "@/core";

export type RootProps = DefaultRootProps;

export const Root: RootConfig<{
  props: RootProps;
  fields: {
    userField: { type: "userField"; option: boolean };
  };
}> = {
  fields: {
    title: { type: "text", default: "React Editor" },
  },
  render: ({ children }) => {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        {children}
      </div>
    );
  },
};

export default Root;
