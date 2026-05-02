"use client";

import { ReactNode, useCallback, useMemo } from "react";
import type {
  Config,
  Data,
  IframeConfig,
  Metadata,
  Overrides,
  Permissions,
  Plugin,
  Route,
  UserGenerics,
  Viewports,
} from "../../types";
import { FieldTransforms } from "../../types/API/FieldTransforms";
import { Editor } from "../Editor";
import { Render } from "../Render";
import { AppProvider, type AppProviderProps } from "./AppProvider";
import { useApp } from "./context";
import type { RouteKey } from "../../lib/route-resolver";

export type AppPublishContext = {
  /** The route key string — load-bearing persistence identifier. */
  route: RouteKey;
};

export type AppProps<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
> = AppProviderProps<UserConfig, G> & {
  /** Called when the editor publishes. Receives the route key. */
  onPublish?: (data: G["UserData"], ctx: AppPublishContext) => void;
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

const titleFor = (route: RouteKey, data: Partial<Data>): string => {
  const root = data?.root as { props?: { title?: string }; title?: string } | undefined;
  const title = root?.props?.title ?? root?.title;
  if (typeof title === "string" && title) return title;
  return route === "/" ? "Home" : route;
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

function AppLayout<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>({
  onPublish,
  onChange,
  plugins,
  overrides,
  fieldTransforms,
  metadata,
  iframe,
  viewports,
  permissions,
  renderNotFound,
}: Omit<
  AppProps<UserConfig, G>,
  | "config"
  | "pages"
  | "currentRoute"
  | "editorPath"
  | "onNavigate"
  | "children"
>) {
  const {
    config,
    pages,
    routes: routeKeys,
    isEditing,
    matched,
    matchRoute,
    navigate,
  } = useApp<UserConfig, G>();

  // Build the page picker list from page entries.
  const routes = useMemo<Route[]>(
    () =>
      routeKeys.map((route) => ({
        path: route,
        title: titleFor(route, pages[route] as Partial<Data>),
      })),
    [routeKeys, pages]
  );

  const handlePublish = useCallback(
    (data: G["UserData"]) => {
      if (!matched || !onPublish) return;
      onPublish(data, { route: matched.route });
    },
    [matched, onPublish]
  );

  if (!matched) {
    return renderNotFound ? <>{renderNotFound()}</> : <DefaultNotFound />;
  }

  if (isEditing) {
    return (
      <Editor<UserConfig>
        config={config}
        data={matched.data}
        plugins={plugins}
        overrides={overrides}
        fieldTransforms={fieldTransforms as FieldTransforms<UserConfig>}
        metadata={metadata}
        iframe={iframe}
        viewports={viewports}
        permissions={permissions}
        onChange={onChange}
        onPublish={handlePublish}
        routes={routes}
        currentPath={matchRoute}
        onRouteChange={(next) => navigate(next)}
      />
    );
  }

  return (
    <Render<UserConfig>
      config={config}
      data={matched.data}
      metadata={metadata}
    />
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
    onNavigate,
    children,
    ...layoutProps
  } = props;

  return (
    <AppProvider<UserConfig, G>
      config={config}
      pages={pages}
      currentRoute={currentRoute}
      editorPath={editorPath}
      onNavigate={onNavigate}
    >
      {children ?? <AppLayout<UserConfig, G> {...layoutProps} />}
    </AppProvider>
  );
}
