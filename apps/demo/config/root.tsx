import { DefaultRootProps, RootConfig } from "@/core";

export type RootProps = DefaultRootProps;

export const Root: RootConfig<{
  props: RootProps;
  fields: {
    userField: { type: "userField"; option: boolean };
  };
}> = {
  fields: {
    title: { type: "text", default: "My Page" },
  },
  render: ({ puck: { renderDropZone: DropZone } }) => {
    return (
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <DropZone zone="default-zone" style={{ flexGrow: 1 }} />
      </div>
    );
  },
};

export default Root;
