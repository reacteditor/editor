import type { RouteConfig } from "@react-router/dev/routes";
import { route, index } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("api/editor/*", "routes/api.editor.ts"),
  route("*", "routes/editor-splat.tsx"),
] satisfies RouteConfig;
