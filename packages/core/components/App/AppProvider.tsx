"use client";

import { ReactNode, useCallback, useMemo } from "react";
import type { Config, Data, UserGenerics } from "../../types";
import {
  compilePages,
  resolveRoute,
  type RouteKey,
} from "../../lib/route-resolver";
import { useBrowserRoute } from "../../lib/use-browser-route";
import { useStableValue } from "../../lib/use-stable-value";
import { appContext, type AppContextValue } from "./context";

const DEFAULT_EDITOR_PATH = "/editor";

const stripPrefix = (path: string, prefix: string): string => {
  if (!path.startsWith(prefix)) return path;
  const rest = path.slice(prefix.length);
  if (!rest) return "/";
  return rest.startsWith("/") ? rest : `/${rest}`;
};

const isBrowser = typeof window !== "undefined";

export type AppProviderProps<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
> = {
  config: UserConfig;
  pages: Record<RouteKey, Partial<G["UserData"] | Data>>;
  /** Optional — falls back to window.location.pathname via useBrowserRoute. */
  currentRoute?: string;
  /** Defaults to "/editor". Pass null to disable editor mode. */
  editorPath?: string | null;
  /** Navigate to a target URL. Defaults to history.pushState. */
  onNavigate?: (url: string) => void;
  children?: ReactNode;
};

export function AppProvider<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>({
  config,
  pages,
  currentRoute: currentRouteProp,
  editorPath = DEFAULT_EDITOR_PATH,
  onNavigate,
  children,
}: AppProviderProps<UserConfig, G>) {
  // Only run the browser-route hook when host hasn't supplied a route.
  // Hooks always run, but the listener installation is gated.
  const browserRoute = useBrowserRoute({
    enabled: currentRouteProp === undefined,
  });
  const currentRoute = currentRouteProp ?? browserRoute;

  // Structurally stabilize so users can pass inline pages={{ ... }} without
  // re-compiling routes on every parent render.
  const stablePages = useStableValue(pages);
  const compiled = useMemo(() => compilePages(stablePages), [stablePages]);
  const routes = useMemo(() => compiled.map((r) => r.key), [compiled]);

  const resolvedEditorPath =
    editorPath === null ? null : editorPath || DEFAULT_EDITOR_PATH;

  const isEditing =
    resolvedEditorPath !== null &&
    (currentRoute === resolvedEditorPath ||
      currentRoute.startsWith(`${resolvedEditorPath}/`));

  const matchRoute = isEditing
    ? stripPrefix(currentRoute, resolvedEditorPath as string)
    : currentRoute;

  const matched = useMemo(
    () => resolveRoute(compiled, matchRoute),
    [compiled, matchRoute]
  );

  const navigate = useCallback(
    (route: RouteKey) => {
      const target =
        isEditing && resolvedEditorPath
          ? `${resolvedEditorPath}${route === "/" ? "" : route}` || "/"
          : route;
      const url = target || "/";
      if (onNavigate) {
        onNavigate(url);
      } else if (isBrowser) {
        window.history.pushState(null, "", url);
      }
    },
    [isEditing, resolvedEditorPath, onNavigate]
  );

  const value: AppContextValue<UserConfig, G> = useMemo(
    () => ({
      config,
      pages: stablePages,
      routes,
      currentRoute,
      editorPath: resolvedEditorPath,
      isEditing,
      matchRoute,
      matched,
      navigate,
    }),
    [
      config,
      stablePages,
      routes,
      currentRoute,
      resolvedEditorPath,
      isEditing,
      matchRoute,
      matched,
      navigate,
    ]
  );

  return (
    <appContext.Provider value={value as AppContextValue}>
      {children}
    </appContext.Provider>
  );
}
