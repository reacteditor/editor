"use client";

import { App, AutoField, FieldLabel, outlinePlugin } from "@/core";
import { mediaPlugin } from "@reacteditor/plugin-media";
import config, { componentKey } from "../../config";
import { initialData, initialPricingData } from "../../config/initial-data";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Type } from "lucide-react";
import { createDemoMediaAdapter } from "../../lib/media-adapter";
import type { UserData } from "../../config/types";

const STORAGE_PREFIX = `react-editor-demo:${componentKey}`;
const storageKeyFor = (route: string) => `${STORAGE_PREFIX}:${route}`;

const mediaAdapter = createDemoMediaAdapter();
const plugins = [
  outlinePlugin(),
  mediaPlugin({
    adapter: mediaAdapter,
    showSearch: true,
  }),
];

const ROUTES = ["/", "/pricing"] as const;

export function Client() {
  const [pages, setPages] = useState<Record<string, UserData> | null>(null);

  useEffect(() => {
    const next: Record<string, UserData> = {};
    for (const r of ROUTES) {
      const stored = window.localStorage.getItem(storageKeyFor(r));
      next[r] = stored
        ? (JSON.parse(stored) as UserData)
        : r === "/pricing"
        ? initialPricingData
        : initialData;
    }
    setPages(next);
  }, []);

  const handlePublish = useCallback(
    async ({
      data: next,
      route,
    }: {
      data: UserData;
      route: {
        key: string;
        path: string;
        params: Record<string, string | undefined>;
      } | null;
    }) => {
      // eslint-disable-next-line no-console
      console.log("[demo] onPublish start", { data: next, route });
      // Simulate a slow remote save so the Publish button's loading state
      // is visible.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (!route) return;
      window.localStorage.setItem(storageKeyFor(route.key), JSON.stringify(next));
      setPages((prev) => (prev ? { ...prev, [route.key]: next } : prev));
      // eslint-disable-next-line no-console
      console.log("[demo] onPublish done", { route });
    },
    []
  );

  const searchParams = useSearchParams();
  const metadata = useMemo(() => ({ example: "Hello, world" }), []);

  if (!pages) return null;

  return (
    <App
      router="memory"
      currentPath="/edit"
      config={config}
      pages={pages}
      editorPath="/edit"
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
  );
}

export default Client;
