"use client";

import {
  AutoField,
  Editor,
  FieldLabel,
  blocksPlugin,
  outlinePlugin,
} from "@/core";
import {
  mediaPlugin,
  type MediaAdapter,
  type MediaItem,
  type MediaPage,
} from "@reacteditor/plugin-media";
import config, { componentKey } from "../../config";
import { initialData } from "../../config/initial-data";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MemoryRouter } from "react-router";
import { Type } from "lucide-react";
import type { UserData } from "../../config/types";

const STORAGE_KEY = `react-editor-demo:${componentKey}`;

const MEDIA_BASE = "https://www.frontend-ai.com";
const MEDIA_API_KEY = process.env.NEXT_PUBLIC_MEDIA_API_KEY ?? "";

const frontendAiMediaAdapter: MediaAdapter = {
  fetchList: async ({ query, cursor, signal }) => {
    const url = new URL("/api/media", MEDIA_BASE);
    if (query) url.searchParams.set("query", query);
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await fetch(url, {
      method: "GET",
      headers: { "X-Api-Key": MEDIA_API_KEY },
      signal,
    });
    if (!res.ok) throw new Error(`List failed: ${res.status}`);
    return (await res.json()) as MediaPage;
  },

  // XHR is the only way to get upload progress in browsers; fetch's body
  // streaming covers download progress only.
  upload: (file, opts) =>
    new Promise<MediaItem>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${MEDIA_BASE}/api/media`);
      xhr.setRequestHeader("X-Api-Key", MEDIA_API_KEY);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) opts?.onProgress?.(e.loaded / e.total);
      };
      xhr.onload = () => {
        if (xhr.status >= 400) {
          reject(new Error(xhr.responseText || `Upload failed: ${xhr.status}`));
          return;
        }
        try {
          resolve(JSON.parse(xhr.responseText) as MediaItem);
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      };
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.onabort = () => {
        const err = new Error("Aborted");
        err.name = "AbortError";
        reject(err);
      };
      opts?.signal?.addEventListener("abort", () => xhr.abort());
      const fd = new FormData();
      fd.append("file", file);
      xhr.send(fd);
    }),

  delete: async (id) => {
    const res = await fetch(`${MEDIA_BASE}/api/media/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "X-Api-Key": MEDIA_API_KEY },
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  },
};

const plugins = [
  blocksPlugin(),
  outlinePlugin(),
  mediaPlugin({
    adapter: frontendAiMediaAdapter,
    showSearch: true,
  }),
];

export function Client() {
  const [data, setData] = useState<UserData | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setData(stored ? (JSON.parse(stored) as UserData) : initialData);
  }, []);

  const handlePublish = useCallback((next: UserData) => {
    setData(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const searchParams = useSearchParams();
  const metadata = useMemo(() => ({ example: "Hello, world" }), []);

  if (!data) return null;

  return (
    <MemoryRouter initialEntries={["/"]}>
      <Editor
        config={config}
        data={data}
        onPublish={handlePublish}
        plugins={plugins}
        metadata={metadata}
        iframe={{
          enabled: searchParams.get("disableIframe") === "true" ? false : true,
        }}
        fieldTransforms={{
          userField: ({ value }) => value,
        }}
        overrides={{
          fieldTypes: {
            userField: ({ readOnly, field, name, value, onChange }) => (
              <FieldLabel
                label={field.label || name}
                readOnly={readOnly}
                icon={<Type size={16} />}
              >
                <AutoField
                  field={{ type: "text" }}
                  onChange={onChange}
                  value={value}
                />
              </FieldLabel>
            ),
          },
        }}
      />
    </MemoryRouter>
  );
}

export default Client;
