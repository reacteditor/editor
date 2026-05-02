"use client";

import {
  AutoField,
  Button,
  FieldLabel,
  Editor,
  Render,
  Route,
  blocksPlugin,
  outlinePlugin,
} from "@/core";
import { aiPlugin } from "@reacteditor/plugin-ai";
import config from "../../config";
import { initialData } from "../../config/initial-data";
import { useDemoData } from "../../lib/use-demo-data";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Type } from "lucide-react";

export function Client(props: { path: string; isEdit: boolean }) {
  // Keyed by path so a route change fully remounts — useDemoData's useState
  // initializer re-runs against the new path instead of retaining the
  // previous page's data. Without this, Next's App Router preserves the
  // client component across navigations and the editor keeps stale state.
  return <ClientInner key={props.path} {...props} />;
}

function ClientInner({ path, isEdit }: { path: string; isEdit: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const metadata = {
    example: "Hello, world",
  };

  const { data, resolvedData, key } = useDemoData({
    path,
    isEdit,
    metadata,
  });

  // Build the routes list from the known initial-data pages. Each route's
  // title comes from that page's Root props (falling back to the path).
  const routes = useMemo<Route[]>(
    () =>
      Object.entries(initialData).map(([routePath, pageData]) => ({
        path: routePath,
        title:
          (pageData.root as any)?.props?.title ??
          (routePath === "/" ? "Home" : routePath),
      })),
    []
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const plugins = useMemo(
    () => [
      aiPlugin({
        api: "/api/chat",
        attachments: true,
        getCurrentRoute: () => ({
          path,
          title: routes.find((r) => r.path === path)?.title,
        }),
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
    [path, routes]
  );

  if (!isClient) return null;

  if (isEdit) {
    return (
      <div>
        <Editor
          config={config}
          data={data}
          plugins={plugins}
          onPublish={async (data) => {
            localStorage.setItem(key, JSON.stringify(data));
          }}
          headerPath={path}
          routes={routes}
          currentPath={path}
          onRouteChange={(next) => {
            router.push(`${next === "/" ? "" : next}/edit`);
          }}
          iframe={{
            enabled:
              searchParams.get("disableIframe") === "true" ? false : true,
          }}
          fieldTransforms={{
            userField: ({ value }) => value, // Included to check types
          }}
          _experimentalVirtualization
          overrides={{
            fieldTypes: {
              // Example of user field provided via overrides
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
                  <Button href={path} newTab variant="secondary">
                    View
                  </Button>
                </div>

                {children}
              </>
            ),
          }}
          metadata={metadata}
        />
      </div>
    );
  }

  if (data.content) {
    return <Render config={config} data={resolvedData} metadata={metadata} />;
  }

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
        <p>Page does not exist in session storage</p>
      </div>
    </div>
  );
}

export default Client;
