"use client";

import type { Data } from "@frontend/core";
import { Editor } from "@frontend/core";
import config from "../../../editor.config";

export function Client({ path, data }: { path: string; data: Partial<Data> }) {
  return (
    <Editor
      config={config}
      data={data}
      onPublish={async (data) => {
        await fetch("/editor/api", {
          method: "post",
          body: JSON.stringify({ data, path }),
        });
      }}
    />
  );
}
