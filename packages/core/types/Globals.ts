import type { Data } from "./Data";

/**
 * Shared state for components whose config has `global: true`. Lives inside
 * `data.globals` and is keyed by component type. Instances opt in per-node
 * via `synced: true`; synced instances render from this map (children + id
 * stay extrinsic).
 */
export type GlobalsMap = NonNullable<Data["globals"]>;
