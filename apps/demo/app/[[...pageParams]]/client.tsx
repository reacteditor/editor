"use client";

import {
  App,
  AutoField,
  Button,
  FieldLabel,
  blocksPlugin,
  outlinePlugin,
  useApp,
} from "@/core";
import { aiPlugin } from "@reacteditor/plugin-ai";
import { nextjsResolveRoute } from "@/core/nextjs";
import config, { componentKey } from "../../config";
import { initialData } from "../../config/initial-data";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Type } from "lucide-react";
import type { UserData } from "../../config/types";

const STORAGE_KEY = `react-editor-demo:${componentKey}`;

// Read matchRoute via the same helper page.tsx uses server-side. Constructing
// pageParams from window.location lets us reuse the editor-prefix stripping
// rather than reimplementing it.
const currentMatchRoute = () => {
  const pathname =
    typeof window === "undefined" ? "/" : window.location.pathname;
  const pageParams = pathname.split("/").filter(Boolean);
  return nextjsResolveRoute({ pageParams }).matchRoute;
};

const plugins = [
  aiPlugin({
    api: "/api/chat",
    attachments: true,
    getCurrentRoute: () => ({ path: currentMatchRoute() }),
  }),
  blocksPlugin(),
  outlinePlugin(),
];

export function Client({ currentRoute }: { currentRoute: string }) {
  // Wait for localStorage before mounting <App>: <Editor> snapshots its `data`
  // prop on mount and ignores subsequent prop changes. If we mount with seed
  // data and then setPages(stored), the editor still shows the seed.
  const [pages, setPages] = useState<Record<string, UserData> | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setPages(stored ? (JSON.parse(stored) as Record<string, UserData>) : initialData);
  }, []);

  const handlePublish = useCallback(
    (data: UserData, route?: string) => {
      if (!route) return;
      setPages((prev) => {
        const next = { ...(prev ?? initialData), [route]: data };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const searchParams = useSearchParams();
  const metadata = useMemo(() => ({ example: "Hello, world" }), []);

  if (!pages) return null;

  return (
    <App
      config={config}
      pages={pages}
      currentRoute={currentRoute}
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
        headerActions: ViewButton,
      }}
    />
  );
}

function ViewButton({ children }: { children: React.ReactNode }) {
  const { matchRoute } = useApp();
  return (
    <>
      <div>
        <Button href={matchRoute} newTab variant="secondary">
          View
        </Button>
      </div>
      {children}
    </>
  );
}

export default Client;
