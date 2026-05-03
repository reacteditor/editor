import { matchRoutes } from "react-router";

const DEFAULT_EDITOR_PATH = "/editor";

const stripEditorPrefix = (
  currentRoute: string,
  editorPath: string | null | undefined
): string => {
  if (!editorPath) return currentRoute;
  if (currentRoute === editorPath) return "/";
  if (!currentRoute.startsWith(`${editorPath}/`)) return currentRoute;
  const rest = currentRoute.slice(editorPath.length);
  return rest.startsWith("/") ? rest : `/${rest}`;
};

export type GetRoutePropsOptions = {
  /** Defaults to "/editor". Pass null to skip editor-prefix handling. */
  editorPath?: string | null;
};

type AnyPages = Record<
  string,
  {
    root?: { props?: unknown; [key: string]: unknown };
    [key: string]: unknown;
  }
>;

const findMatch = (pages: AnyPages, pathname: string) => {
  const keys = Object.keys(pages);
  if (keys.length === 0) return null;
  const matches = matchRoutes(
    keys.map((path) => ({ path })),
    pathname
  );
  if (!matches || matches.length === 0) return null;
  const last = matches[matches.length - 1];
  const key = last.route.path as string;
  return { route: key, params: last.params, data: pages[key] };
};

/**
 * Resolve the matched page for `currentRoute` against `pages` and return its
 * `root.props`. Editor prefix is stripped first so `/edit/about` returns the
 * same root props as `/about`.
 *
 * Server-safe — uses `matchRoutes` from `react-router` which is a pure
 * non-React utility. Useful in Next's `generateMetadata` and similar hooks.
 */
export const getRouteProps = <P = Record<string, unknown>>(
  pages: AnyPages,
  currentRoute: string,
  options: GetRoutePropsOptions = {}
): P | null => {
  const editorPath =
    options.editorPath === undefined ? DEFAULT_EDITOR_PATH : options.editorPath;
  const matchRoute = stripEditorPrefix(currentRoute || "/", editorPath);
  const match = findMatch(pages, matchRoute);
  if (!match) return null;
  const props = match.data?.root?.props;
  return (props ?? null) as P | null;
};

/**
 * Lower-level variant that returns the matched route key alongside the data,
 * for callers that need to know which entry resolved (canonical URLs,
 * persistence keys, etc.) server-side.
 */
export const resolveRouteFromString = <Data = unknown>(
  pages: Record<string, Data>,
  currentRoute: string,
  options: GetRoutePropsOptions = {}
): {
  route: string;
  data: Data;
  params: Readonly<Record<string, string | undefined>>;
} | null => {
  const editorPath =
    options.editorPath === undefined ? DEFAULT_EDITOR_PATH : options.editorPath;
  const matchRoute = stripEditorPrefix(currentRoute || "/", editorPath);
  const match = findMatch(pages as AnyPages, matchRoute);
  if (!match) return null;
  return {
    route: match.route,
    data: match.data as Data,
    params: match.params,
  };
};
