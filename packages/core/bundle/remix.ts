/**
 * Remix helpers for `<App>`.
 *
 * Pure functions — no `@remix-run/*` imports — namespaced for future
 * extension.
 */

export type RemixSplatParams = {
  /** The splat segment from a `$.tsx` route. */
  "*"?: string;
};

/**
 * Convert Remix splat params into a route string for `<App currentRoute>`.
 *
 * Mounted at `app/routes/$.tsx`:
 *   `/products/abc` → `params = { "*": "products/abc" }`
 *                  → `remixResolveRoute(params)` → `"/products/abc"`
 */
export const remixResolveRoute = (params: RemixSplatParams): string => {
  const splat = params?.["*"] ?? "";
  if (!splat) return "/";
  return splat.startsWith("/") ? splat : `/${splat}`;
};
