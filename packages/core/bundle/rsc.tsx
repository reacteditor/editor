export { Render } from "../components/ServerRender";

export * from "../lib/resolve-all-data";
export * from "../lib/transform-props";
export * from "../lib/migrate";
export { walkTree } from "../lib/data/walk-tree";

// Route helpers — pure JS, server-safe.
export {
  compilePages,
  resolveRoute as resolvePageRoute,
} from "../lib/route-resolver";
export type {
  AppPages,
  ResolvedRoute,
  RouteKey,
} from "../lib/route-resolver";
export {
  getRouteProps,
  resolveRouteFromString,
} from "../lib/get-route-props";
export type { GetRoutePropsOptions } from "../lib/get-route-props";
