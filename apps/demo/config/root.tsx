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
  render: ({ editor: { renderDropZone: DropZone } }) => {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <DropZone zone="default-zone" className="flex-1" />
      </div>
    );
  },
};

export default Root;
