/**
 * Next.js helpers for `<App>`.
 *
 * Pure functions — no `next/*` imports — but namespaced under
 * `@reacteditor/core/nextjs` so framework-specific helpers can be added
 * later without breaking changes.
 */

const DEFAULT_EDITOR_PATH = "/editor";

export type NextRouteParams = {
  /** The catch-all segment from `app/[[...pageParams]]/page.tsx`. */
  pageParams?: string[];
};

export type NextjsResolvedRoute = {
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

const buildRoute = (params: NextRouteParams): string => {
  const segments = params?.pageParams ?? [];
  if (segments.length === 0) return "/";
  return "/" + segments.join("/");
};

/**
 * Resolve Next's catch-all params into a route descriptor for `<App>`.
 *
 * Mounted at `app/[[...pageParams]]/page.tsx`:
 *   - `/products/abc` → `{ route: "/products/abc", isEditor: false, matchRoute: "/products/abc" }`
 *   - `/editor/products/abc` → `{ route: "/editor/products/abc", isEditor: true, matchRoute: "/products/abc" }`
 *
 * `editorPath` defaults to "/editor" — same default as `<App>`. Pass `null`
 * to skip editor-mode classification.
 *
 * Mounted at `app/shops/[shopId]/[[...pageParams]]/page.tsx`:
 *   the catch-all already excludes the basePath, so this returns the
 *   correct schema-relative route — no basePath argument needed.
 */
export const nextjsResolveRoute = (
  params: NextRouteParams,
  options?: { editorPath?: string | null }
): NextjsResolvedRoute => {
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
