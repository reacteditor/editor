import { createContext, useContext, useMemo } from "react";
import { matchRoutes, useLocation, useNavigate } from "react-router";
import type { Config, Data, UserGenerics } from "../../types";

/** A route key — the literal pattern used in `pages`. */
export type RouteKey = string;

export type AppMatched<Data = unknown> = {
  /** The route key string — stable persistence identifier. */
  route: RouteKey;
  /** Concrete params extracted from the URL (e.g. { handle: "abc" }). */
  params: Readonly<Record<string, string | undefined>>;
  /** The page's data. */
  data: Data;
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
  /** Resolved current pathname from React Router. */
  currentRoute: string;
  /** True when currentRoute starts with editorPath. */
  isEditing: boolean;
  /** The URL relative to editorPath when isEditing — what pages are matched against. */
  matchRoute: string;
  /** Result of matching matchRoute against pages. Null = 404. */
  matched: AppMatched<Partial<G["UserData"] | Data>> | null;
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

  const currentRoute = location.pathname || "/";

  const isEditing =
    cfg.editorPath !== null &&
    (currentRoute === cfg.editorPath ||
      currentRoute.startsWith(`${cfg.editorPath}/`));

  const matchRoute = isEditing
    ? stripPrefix(currentRoute, cfg.editorPath as string)
    : currentRoute;

  const matched = useMemo<AppMatched<Partial<G["UserData"] | Data>> | null>(() => {
    const routeKeys = Object.keys(cfg.pages);
    if (routeKeys.length === 0) return null;
    const matches = matchRoutes(
      routeKeys.map((path) => ({ path })),
      matchRoute
    );
    if (!matches || matches.length === 0) return null;
    const last = matches[matches.length - 1];
    const key = last.route.path as RouteKey;
    return {
      route: key,
      params: last.params,
      data: cfg.pages[key],
    };
  }, [cfg.pages, matchRoute]);

  const routes = useMemo(() => Object.keys(cfg.pages), [cfg.pages]);

  const navigate = (route: RouteKey) => {
    const target =
      isEditing && cfg.editorPath
        ? `${cfg.editorPath}${route === "/" ? "" : route}` || "/"
        : route;
    rrNavigate(target || "/");
  };

  return {
    ...cfg,
    routes,
    currentRoute,
    isEditing,
    matchRoute,
    matched,
    navigate,
  };
};
