"use client";

import type { Data } from "@frontend/core";
import { Editor } from "@frontend/core";
import { createAiPlugin } from "@puckeditor/plugin-ai";

import config from "../../../editor.config";

const aiPlugin = createAiPlugin();

export function Client({ path, data }: { path: string; data: Partial<Data> }) {
  return (
    <Editor
      plugins={[aiPlugin]}
      config={config}
      data={data}
      onPublish={async (data) => {
        await fetch("/api/pages", {
          method: "post",
          body: JSON.stringify({ data, path }),
        });
      }}
    />
  );
}
