import {
  compilePages,
  resolveRoute,
  type AppPages,
  type RouteKey,
} from "./route-resolver";

const DEFAULT_EDITOR_PATH = "/editor";

const stripEditorPrefix = (
  currentRoute: string,
  editorPath: string | null | undefined
): string => {
  if (editorPath === null || !editorPath) return currentRoute;
  if (currentRoute === editorPath) return "/";
  if (!currentRoute.startsWith(`${editorPath}/`)) return currentRoute;
  const rest = currentRoute.slice(editorPath.length);
  return rest.startsWith("/") ? rest : `/${rest}`;
};

export type GetRoutePropsOptions = {
  /** Defaults to "/editor". Pass null to skip editor-prefix handling. */
  editorPath?: string | null;
};

/**
 * Resolve the matched page for `currentRoute` against `pages` and return its
 * `root.props`. Editor prefix is stripped first so `/editor/about` returns the
 * same root props as `/about`.
 *
 * Useful in server-side contexts (e.g. Next's `generateMetadata`) where you
 * want a page's title/description without mounting `<App>`. Returns `null` when
 * no page matches.
 */
export const getRouteProps = <P = Record<string, unknown>>(
  pages: AppPages<{
    root?: { props?: P; [key: string]: unknown };
    [key: string]: unknown;
  }>,
  currentRoute: string,
  options: GetRoutePropsOptions = {}
): P | null => {
  const editorPath =
    options.editorPath === undefined ? DEFAULT_EDITOR_PATH : options.editorPath;
  const matchRoute = stripEditorPrefix(currentRoute || "/", editorPath);

  const compiled = compilePages(pages);
  const matched = resolveRoute(compiled, matchRoute);
  if (!matched) return null;

  const props = matched.data?.root?.props;
  return (props ?? null) as P | null;
};

/**
 * Lower-level variant that returns the matched route key alongside the props,
 * for callers that need to know which schema entry resolved (e.g. building
 * canonical URLs or persistence keys server-side).
 */
export const resolveRouteFromString = <Data = unknown>(
  pages: AppPages<Data>,
  currentRoute: string,
  options: GetRoutePropsOptions = {}
): { route: RouteKey; data: Data; params: Record<string, string | string[] | undefined> } | null => {
  const editorPath =
    options.editorPath === undefined ? DEFAULT_EDITOR_PATH : options.editorPath;
  const matchRoute = stripEditorPrefix(currentRoute || "/", editorPath);
  const compiled = compilePages(pages);
  const matched = resolveRoute(compiled, matchRoute);
  if (!matched) return null;
  return { route: matched.route, data: matched.data, params: matched.params };
};
