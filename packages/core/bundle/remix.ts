/**
 * Remix helpers for `<App>`.
 *
 * Pure functions — no `@remix-run/*` imports — namespaced for future
 * extension.
 */

const DEFAULT_EDITOR_PATH = "/editor";

export type RemixSplatParams = {
  /** The splat segment from a `$.tsx` route. */
  "*"?: string;
};

export type RemixResolvedRoute = {
  /** Full path including any editor prefix, e.g. "/editor/products/foo". */
  route: string;
  /** True when `route` starts with the editor prefix. */
  isEditor: boolean;
  /** Path with the editor prefix stripped — what schemas match against. */
  matchRoute: string;
};

const stripEditorPrefix = (
  route: string,
  editorPath: string | null
): string => {
  if (!editorPath) return route;
  if (route === editorPath) return "/";
  if (!route.startsWith(`${editorPath}/`)) return route;
  const rest = route.slice(editorPath.length);
  return rest.startsWith("/") ? rest : `/${rest}`;
};

const buildRoute = (params: RemixSplatParams): string => {
  const splat = params?.["*"] ?? "";
  if (!splat) return "/";
  return splat.startsWith("/") ? splat : `/${splat}`;
};

/**
 * Resolve Remix splat params into a route descriptor for `<App>`.
 *
 * Mounted at `app/routes/$.tsx`:
 *   - `/products/abc` → `{ route: "/products/abc", isEditor: false, matchRoute: "/products/abc" }`
 *   - `/editor/products/abc` → `{ route: "/editor/products/abc", isEditor: true, matchRoute: "/products/abc" }`
 *
 * `editorPath` defaults to "/editor" — same default as `<App>`. Pass `null`
 * to skip editor-mode classification.
 */
export const remixResolveRoute = (
  params: RemixSplatParams,
  options?: { editorPath?: string | null }
): RemixResolvedRoute => {
  const editorPath =
    options?.editorPath === undefined
      ? DEFAULT_EDITOR_PATH
      : options.editorPath;
  const route = buildRoute(params);
  const isEditor =
    editorPath !== null &&
    (route === editorPath || route.startsWith(`${editorPath}/`));
  const matchRoute = isEditor ? stripEditorPrefix(route, editorPath) : route;
  return { route, isEditor, matchRoute };
};
