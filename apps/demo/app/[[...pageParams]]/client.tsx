"use client";

import {
  AppProvider,
  AutoField,
  Button,
  Editor,
  FieldLabel,
  Render,
  blocksPlugin,
  outlinePlugin,
  useApp,
} from "@/core";
import { aiPlugin } from "@reacteditor/plugin-ai";
import config, { componentKey } from "../../config";
import { initialData } from "../../config/initial-data";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Type } from "lucide-react";
import type { UserData } from "../../config/types";

const isBrowser = typeof window !== "undefined";

const localStorageKey = (route: string) =>
  `react-editor-demo:${componentKey}:${route}`;

/**
 * Build the full pages map from initial-data, hydrating each entry with any
 * locally-persisted version. Keyed by route key (e.g. "/products/:handle"),
 * not by concrete pathname — that's what onPublish hands back to us.
 */
const loadPages = (): Record<string, UserData> => {
  if (!isBrowser) return initialData;

  const out: Record<string, UserData> = {};
  for (const [route, seed] of Object.entries(initialData)) {
    const stored = window.localStorage.getItem(localStorageKey(route));
    out[route] = stored ? (JSON.parse(stored) as UserData) : seed;
  }
  return out;
};

export function Client({ currentRoute }: { currentRoute: string }) {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [pages, setPages] = useState<Record<string, UserData>>(initialData);

  useEffect(() => {
    setIsClient(true);
    setPages(loadPages());
  }, []);

  const handlePublish = useCallback((route: string, data: UserData) => {
    window.localStorage.setItem(localStorageKey(route), JSON.stringify(data));
    setPages((prev) => ({ ...prev, [route]: data }));
  }, []);

  const onNavigate = useCallback(
    (url: string) => router.push(url),
    [router]
  );

  if (!isClient) return null;

  return (
    <AppProvider
      config={config}
      pages={pages}
      currentRoute={currentRoute}
      onNavigate={onNavigate}
    >
      <DemoLayout onPublish={handlePublish} />
    </AppProvider>
  );
}

/**
 * Reads the resolved route from `useApp()` so plugins, overrides, and the
 * Render/Editor toggle stay derived from a single source — no parallel
 * editor-prefix logic in the demo.
 */
function DemoLayout({
  onPublish,
}: {
  onPublish: (route: string, data: UserData) => void;
}) {
  const { matchRoute, isEditing, matched, navigate, routes } = useApp();
  const searchParams = useSearchParams();

  const metadata = useMemo(() => ({ example: "Hello, world" }), []);

  const plugins = useMemo(
    () => [
      aiPlugin({
        api: "/api/chat",
        attachments: true,
        getCurrentRoute: () => ({ path: matchRoute }),
        renderTool: ({ name, state, output, input }) => {
          if (name !== "generateImage" || state !== "output-available") {
            return undefined;
          }
          const url = (output as { url?: string } | undefined)?.url;
          if (!url) return undefined;
          return (
            <img
              src={url}
              alt={
                (input as { prompt?: string } | undefined)?.prompt ??
                "Generated image"
              }
              style={{
                display: "block",
                width: "100%",
                maxWidth: 240,
                aspectRatio: "1 / 1",
                objectFit: "cover",
                borderRadius: 10,
                background: "var(--editor-color-grey-12, #f4f4f5)",
              }}
            />
          );
        },
      }),
      blocksPlugin(),
      outlinePlugin(),
    ],
    [matchRoute]
  );

  const editorRoutes = useMemo(
    () =>
      routes.map((route) => {
        const data = matched && matched.route === route ? matched.data : null;
        const title =
          (data?.root as { props?: { title?: string } } | undefined)?.props
            ?.title ?? (route === "/" ? "Home" : route);
        return { path: route, title };
      }),
    [routes, matched]
  );

  if (!matched) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <h1>404</h1>
          <p>No page matches {matchRoute}</p>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <Editor<typeof config>
        config={config}
        data={matched.data}
        plugins={plugins}
        metadata={metadata}
        onPublish={(data) => onPublish(matched.route, data as UserData)}
        routes={editorRoutes}
        currentPath={matched.route}
        onRouteChange={(next) => navigate(next)}
        iframe={{
          enabled: searchParams.get("disableIframe") === "true" ? false : true,
        }}
        fieldTransforms={{
          userField: ({ value }) => value,
        }}
        _experimentalVirtualization
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
          headerActions: ({ children }) => (
            <>
              <div>
                <Button href={matchRoute} newTab variant="secondary">
                  View
                </Button>
              </div>
              {children}
            </>
          ),
        }}
      />
    );
  }

  return <Render<typeof config> config={config} data={matched.data} metadata={metadata} />;
}

export default Client;
