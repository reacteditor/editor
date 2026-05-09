import { createContext, useContext, useMemo } from "react";
import { matchRoutes, useLocation, useNavigate } from "react-router";
import type { Config, Data, UserGenerics } from "../../types";

/** A route key — the literal pattern used in `pages`. */
export type RouteKey = string;

/**
 * Routing descriptor for the current page. Pure routing info — no page data
 * (use `pages[route.key]` for the static initial, or `useEditor((s) => s.appState.data)`
 * for the live editor data).
 */
export type AppRoute = {
  /** Route key/pattern, e.g. "/posts/:handle". */
  key: RouteKey;
  /** Canonical page URL with `editorPath` stripped, e.g. "/posts/abc". */
  path: string;
  /** Concrete params extracted from the URL (e.g. { handle: "abc" }). */
  params: Readonly<Record<string, string | undefined>>;
};

type AppConfigContext<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
> = {
  config: UserConfig;
  pages: Record<RouteKey, Partial<G["UserData"] | Data>>;
  /** "/edit" by default; null disables editor mode entirely. */
  editorPath: string | null;
};

export const appConfigContext = createContext<AppConfigContext | null>(null);

const useAppConfigContext = <
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>(): AppConfigContext<UserConfig, G> => {
  const ctx = useContext(appConfigContext);
  if (!ctx) {
    throw new Error("useApp must be called inside an <AppProvider> or <App>");
  }
  return ctx as AppConfigContext<UserConfig, G>;
};

const stripPrefix = (path: string, prefix: string): string => {
  if (path === prefix) return "/";
  if (!path.startsWith(`${prefix}/`)) return path;
  const rest = path.slice(prefix.length);
  return rest.startsWith("/") ? rest : `/${rest}`;
};

export type AppContextValue<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
> = AppConfigContext<UserConfig, G> & {
  /** All page route keys, in declaration order. */
  routes: RouteKey[];
  /** True when the live URL is under `editorPath`. */
  isEditing: boolean;
  /** Resolved routing descriptor for the current page. Null = 404. */
  route: AppRoute | null;
  /** Navigate to a route key. Wraps with editorPath when editing. */
  navigate: (route: RouteKey) => void;
};

/**
 * Read the resolved route context. Combines config + pages + editorPath
 * (from `<AppProvider>`) with the live location/navigation (from React Router).
 */
export const useApp = <
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>(): AppContextValue<UserConfig, G> => {
  const cfg = useAppConfigContext<UserConfig, G>();
  const location = useLocation();
  const rrNavigate = useNavigate();

  const currentPath = location.pathname || "/";

  const isEditing =
    cfg.editorPath !== null &&
    (currentPath === cfg.editorPath ||
      currentPath.startsWith(`${cfg.editorPath}/`));

  const pagePath = isEditing
    ? stripPrefix(currentPath, cfg.editorPath as string)
    : currentPath;

  const route = useMemo<AppRoute | null>(() => {
    const routeKeys = Object.keys(cfg.pages);
    if (routeKeys.length === 0) return null;
    const matches = matchRoutes(
      routeKeys.map((path) => ({ path })),
      pagePath
    );
    if (!matches || matches.length === 0) return null;
    const last = matches[matches.length - 1];
    return {
      key: last.route.path as RouteKey,
      path: pagePath,
      params: last.params,
    };
  }, [cfg.pages, pagePath]);

  const routes = useMemo(() => Object.keys(cfg.pages), [cfg.pages]);

  const navigate = (target: RouteKey) => {
    const next =
      isEditing && cfg.editorPath
        ? `${cfg.editorPath}${target === "/" ? "" : target}` || "/"
        : target;
    rrNavigate(next || "/");
  };

  return {
    ...cfg,
    routes,
    isEditing,
    route,
    navigate,
  };
};
