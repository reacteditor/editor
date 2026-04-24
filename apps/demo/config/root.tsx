import { DefaultRootProps, RootConfig } from "@/core";

export type RootProps = DefaultRootProps;

export const Root: RootConfig<{
  props: RootProps;
  fields: {
    userField: { type: "userField"; option: boolean };
  };
}> = {
  defaultProps: { title: "React Editor" },
  fields: {
    title: { type: "text" },
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
