"use client";

import { CSSProperties, ReactElement, ReactNode } from "react";
import { Route, Routes } from "react-router";
import type {
  Config,
  IframeConfig,
  InitialHistory,
  Metadata,
  OnAction,
  Overrides,
  Permissions,
  Plugin,
  UserGenerics,
  Viewports,
} from "../../types";
import type { UiState } from "../../types/AppState";
import { FieldTransforms } from "../../types/API/FieldTransforms";
import { EditorAction } from "../../reducer";
import { Editor } from "../Editor";
import { Render } from "../Render";
import { AppProvider, type AppProviderProps } from "./AppProvider";
import { useApp } from "./context";
import type { RouteKey } from "./context";

/** Editor pass-through props shared by <App> (default layout) and <App.Editor>. */
type EditorPassthroughProps<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
> = {
  /** Called when the editor publishes. `route` is the schema route key. */
  onPublish?: (data: G["UserData"], route?: string) => void;
  onChange?: (data: G["UserData"]) => void;
  onAction?: OnAction<G["UserData"]>;
  ui?: Partial<UiState>;
  plugins?: Plugin<UserConfig>[];
  overrides?: Partial<Overrides<UserConfig>>;
  fieldTransforms?: FieldTransforms<UserConfig>;
  metadata?: Metadata;
  iframe?: IframeConfig;
  viewports?: Viewports;
  permissions?: Partial<Permissions>;
  renderHeader?: (props: {
    children: ReactNode;
    dispatch: (action: EditorAction) => void;
    state: G["UserAppState"];
  }) => ReactElement;
  renderHeaderActions?: (props: {
    state: G["UserAppState"];
    dispatch: (action: EditorAction) => void;
  }) => ReactElement;
  title?: ReactNode;
  dnd?: { disableAutoScroll?: boolean };
  initialHistory?: InitialHistory;
  height?: CSSProperties["height"];
  fullScreenCanvas?: boolean;
  disableZoomControls?: boolean;
  _experimentalVirtualization?: boolean;
};

export type AppProps<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
> = AppProviderProps<UserConfig, G> &
  EditorPassthroughProps<UserConfig, G> & {
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

function RenderForKey<
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
  // type (e.g. Routes selecting different <RenderForKey> matches) actually
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

function EditorForKey<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>({
  routeKey,
  editorProps,
  children,
}: {
  routeKey: RouteKey;
  editorProps: EditorPassthroughProps<UserConfig, G>;
  children?: ReactNode;
}) {
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
      ui={editorProps.ui}
      plugins={editorProps.plugins}
      overrides={editorProps.overrides}
      fieldTransforms={
        editorProps.fieldTransforms as FieldTransforms<UserConfig>
      }
      metadata={editorProps.metadata}
      iframe={editorProps.iframe}
      viewports={editorProps.viewports}
      permissions={editorProps.permissions}
      onChange={editorProps.onChange}
      onPublish={editorProps.onPublish}
      onAction={editorProps.onAction}
      renderHeader={editorProps.renderHeader}
      renderHeaderActions={editorProps.renderHeaderActions}
      title={editorProps.title}
      dnd={editorProps.dnd}
      initialHistory={editorProps.initialHistory}
      height={editorProps.height}
      fullScreenCanvas={editorProps.fullScreenCanvas}
      disableZoomControls={editorProps.disableZoomControls}
      _experimentalVirtualization={editorProps._experimentalVirtualization}
      routes={routes}
      currentRoute={routeKey}
      onRouteChange={(next) => navigate(next)}
    >
      {children}
    </Editor>
  );
}

export type AppRenderProps = {
  metadata?: Metadata;
  renderNotFound?: () => ReactNode;
};

/**
 * Mounts <Render> for the current page when the URL is *not* under editorPath.
 * Returns null while editing — safe to place anywhere inside <App>.
 */
function AppRender<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>({ metadata, renderNotFound }: AppRenderProps) {
  const { pages, isEditing } = useApp<UserConfig, G>();
  if (isEditing) return null;
  const routeKeys = Object.keys(pages);
  return (
    <Routes>
      {routeKeys.map((routeKey) => (
        <Route
          key={`render:${routeKey}`}
          path={routeKey}
          element={
            <RenderForKey<UserConfig, G>
              routeKey={routeKey}
              metadata={metadata}
            />
          }
        />
      ))}
      <Route
        path="*"
        element={
          renderNotFound ? <>{renderNotFound()}</> : <DefaultNotFound />
        }
      />
    </Routes>
  );
}

export type AppEditorProps<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
> = EditorPassthroughProps<UserConfig, G> & {
  children?: ReactNode;
  renderNotFound?: () => ReactNode;
};

/**
 * Mounts <Editor> for the current page when the URL is under editorPath.
 * Returns null otherwise. Children are forwarded to <Editor> for compositional
 * UI (e.g. <Editor.Preview />, <Editor.Fields />).
 */
function AppEditor<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>(props: AppEditorProps<UserConfig, G>) {
  const { children, renderNotFound, ...editorProps } = props;
  const { pages, isEditing, editorPath } = useApp<UserConfig, G>();
  if (!isEditing || editorPath === null) return null;
  const routeKeys = Object.keys(pages);
  return (
    <Routes>
      {routeKeys.map((routeKey) => (
        <Route
          key={`edit:${routeKey}`}
          path={joinEditorPath(editorPath, routeKey)}
          element={
            <EditorForKey<UserConfig, G>
              routeKey={routeKey}
              editorProps={editorProps}
            >
              {children}
            </EditorForKey>
          }
        />
      ))}
      <Route
        path="*"
        element={
          renderNotFound ? <>{renderNotFound()}</> : <DefaultNotFound />
        }
      />
    </Routes>
  );
}

type DefaultLayoutProps<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
> = EditorPassthroughProps<UserConfig, G> & {
  renderNotFound?: () => ReactNode;
};

function DefaultAppLayout<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>(props: DefaultLayoutProps<UserConfig, G>) {
  const { renderNotFound, ...editorProps } = props;
  return (
    <>
      <AppRender<UserConfig, G>
        metadata={editorProps.metadata}
        renderNotFound={renderNotFound}
      />
      <AppEditor<UserConfig, G> {...editorProps} renderNotFound={renderNotFound} />
    </>
  );
}

export function App<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>(props: AppProps<UserConfig, G>) {
  const {
    config,
    pages,
    currentPath,
    editorPath,
    router,
    children,
    ...layoutProps
  } = props;

  return (
    <AppProvider<UserConfig, G>
      config={config}
      pages={pages}
      currentPath={currentPath}
      editorPath={editorPath}
      router={router}
    >
      {children ?? <DefaultAppLayout<UserConfig, G> {...layoutProps} />}
    </AppProvider>
  );
}

App.Render = AppRender;
App.Editor = AppEditor;
