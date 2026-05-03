export { Render } from "../components/ServerRender";

export * from "../lib/resolve-all-data";
export * from "../lib/transform-props";
export * from "../lib/migrate";
export { walkTree } from "../lib/data/walk-tree";

// Route helpers — server-safe (matchRoutes from `react-router` is a pure
// non-React function, no DOM/window required).
export {
  getRouteProps,
  resolveRouteFromString,
} from "../lib/get-route-props";
export type { GetRoutePropsOptions } from "../lib/get-route-props";
