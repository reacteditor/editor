/**
 * Next.js helpers for `<App>`.
 *
 * Pure functions — no `next/*` imports — but namespaced under
 * `@reacteditor/core/nextjs` so framework-specific helpers can be added
 * later without breaking changes.
 */

export type NextRouteParams = {
  /** The catch-all segment from `app/[[...pageParams]]/page.tsx`. */
  pageParams?: string[];
};

/**
 * Convert Next's catch-all params into a route string for `<App currentRoute>`.
 *
 * Mounted at `app/[[...pageParams]]/page.tsx`:
 *   `/products/abc` → `params = { pageParams: ["products", "abc"] }`
 *                  → `nextjsResolveRoute(params)` → `"/products/abc"`
 *
 * Mounted at `app/shops/[shopId]/[[...pageParams]]/page.tsx`:
 *   the catch-all already excludes the basePath, so this still returns
 *   the correct schema-relative route — no basePath argument needed.
 */
export const nextjsResolveRoute = (params: NextRouteParams): string => {
  const segments = params?.pageParams ?? [];
  if (segments.length === 0) return "/";
  return "/" + segments.join("/");
};
