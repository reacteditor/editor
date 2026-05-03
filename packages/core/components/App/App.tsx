"use client";

import { ReactNode } from "react";
import { Route, Routes } from "react-router";
import type {
  Config,
  IframeConfig,
  Metadata,
  Overrides,
  Permissions,
  Plugin,
  UserGenerics,
  Viewports,
} from "../../types";
import { FieldTransforms } from "../../types/API/FieldTransforms";
import { Editor } from "../Editor";
import { Render } from "../Render";
import { AppProvider, type AppProviderProps } from "./AppProvider";
import { useApp } from "./context";
import type { RouteKey } from "./context";

export type AppProps<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
> = AppProviderProps<UserConfig, G> & {
  /** Called when the editor publishes. `route` is the schema route key. */
  onPublish?: (data: G["UserData"], route?: string) => void;
  onChange?: (data: G["UserData"]) => void;
  /** Pass-through Editor configuration. */
  plugins?: Plugin<UserConfig>[];
  overrides?: Partial<Overrides<UserConfig>>;
  fieldTransforms?: FieldTransforms<UserConfig>;
  metadata?: Metadata;
  iframe?: IframeConfig;
  viewports?: Viewports;
  permissions?: Partial<Permissions>;
  /** Optional custom not-found component — falls back to a built-in. */
  renderNotFound?: () => ReactNode;
};

const joinEditorPath = (editorPath: string, route: RouteKey): string => {
  if (route === "/") return editorPath;
  return `${editorPath}${route}`;
};

const DefaultNotFound = () => (
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
      <p>No page matches this route.</p>
    </div>
  </div>
);

type LayoutProps<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
> = Omit<
  AppProps<UserConfig, G>,
  | "config"
  | "pages"
  | "currentRoute"
  | "editorPath"
  | "router"
  | "children"
>;

function RenderRoute<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>({
  routeKey,
  metadata,
}: {
  routeKey: RouteKey;
  metadata?: Metadata;
}) {
  const { config, pages } = useApp<UserConfig, G>();
  const data = pages[routeKey];
  if (!data) return null;
  // Key by routeKey so navigating between routes that share an element
  // type (e.g. Routes selecting different <RenderRoute> matches) actually
  // remounts <Render> instead of just re-rendering with new props.
  return (
    <Render<UserConfig>
      key={routeKey}
      config={config}
      data={data}
      metadata={metadata}
    />
  );
}

function EditorRouteRender<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>({
  routeKey,
  layoutProps,
}: {
  routeKey: RouteKey;
  layoutProps: LayoutProps<UserConfig, G>;
}) {
  const {
    onPublish,
    onChange,
    plugins,
    overrides,
    fieldTransforms,
    metadata,
    iframe,
    viewports,
    permissions,
  } = layoutProps;

  const { config, pages, routes, navigate } = useApp<UserConfig, G>();
  const data = pages[routeKey];

  if (!data) return null;

  return (
    <Editor<UserConfig>
      // Key by routeKey so React unmounts the old <Editor> and mounts a fresh
      // one when the route changes. <Editor> snapshots `data` once on mount
      // and ignores subsequent prop changes, so without this the form fields
      // would still show the previous page's values.
      key={routeKey}
      config={config}
      data={data}
      plugins={plugins}
      overrides={overrides}
      fieldTransforms={fieldTransforms as FieldTransforms<UserConfig>}
      metadata={metadata}
      iframe={iframe}
      viewports={viewports}
      permissions={permissions}
      onChange={onChange}
      onPublish={onPublish}
      routes={routes}
      currentPath={routeKey}
      onRouteChange={(next) => navigate(next)}
    />
  );
}

function NotFoundRoute({
  renderNotFound,
}: {
  renderNotFound?: () => ReactNode;
}) {
  return renderNotFound ? <>{renderNotFound()}</> : <DefaultNotFound />;
}

function AppLayout<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>(layoutProps: LayoutProps<UserConfig, G>) {
  const { pages, editorPath } = useApp<UserConfig, G>();

  const renderRoutes = Object.keys(pages);

  return (
    <Routes>
      {renderRoutes.map((routeKey) => (
        <Route
          key={`render:${routeKey}`}
          path={routeKey}
          element={
            <RenderRoute<UserConfig, G>
              routeKey={routeKey}
              metadata={layoutProps.metadata}
            />
          }
        />
      ))}
      {editorPath !== null &&
        renderRoutes.map((routeKey) => (
          <Route
            key={`edit:${routeKey}`}
            path={joinEditorPath(editorPath, routeKey)}
            element={
              <EditorRouteRender<UserConfig, G>
                routeKey={routeKey}
                layoutProps={layoutProps}
              />
            }
          />
        ))}
      <Route
        path="*"
        element={
          <NotFoundRoute renderNotFound={layoutProps.renderNotFound} />
        }
      />
    </Routes>
  );
}

export function App<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>(props: AppProps<UserConfig, G>) {
  const {
    config,
    pages,
    currentRoute,
    editorPath,
    router,
    children,
    ...layoutProps
  } = props;

  return (
    <AppProvider<UserConfig, G>
      config={config}
      pages={pages}
      currentRoute={currentRoute}
      editorPath={editorPath}
      router={router}
    >
      {children ?? <AppLayout<UserConfig, G> {...layoutProps} />}
    </AppProvider>
  );
}
