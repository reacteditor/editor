import { ComponentData, Config, Data, GlobalData } from "../types";

/**
 * Recursively resolves a single component node against globalData.
 *
 * Rule: if the node's type is marked `global: true` in config AND has an
 * entry in globalData AND the instance is not explicitly unlinked, replace
 * its props with the global's props. The `children` slot stays from the
 * instance (extrinsic, React-style) and the `id` is preserved.
 *
 * Per-instance unlink: if the instance has `__synced: false` on its props,
 * it opts out of global resolution — its own props are used as-is. Used
 * when a user wants a one-off variant on a specific page.
 *
 * Cycle guard: if a global's contents transitively reference the same type,
 * leave the inner reference unresolved and warn in dev.
 */
function resolveItem(
  item: ComponentData,
  globalData: GlobalData,
  config: Config,
  visitedTypes: Set<string>
): ComponentData {
  const type = item.type;
  const componentConfig = config.components[type];
  const globalEntry = globalData[type];
  const isUnlinked = (item.props as any)?.__synced === false;
  const shouldApplyGlobal = Boolean(
    componentConfig?.global &&
      globalEntry &&
      !visitedTypes.has(type) &&
      !isUnlinked
  );

  let mergedProps: Record<string, any>;
  if (shouldApplyGlobal) {
    mergedProps = {
      ...(globalEntry as { props: Record<string, any> }).props,
      children: (item.props as any)?.children,
      id: (item.props as any)?.id,
    };
  } else {
    if (
      componentConfig?.global &&
      globalEntry &&
      visitedTypes.has(type) &&
      typeof process !== "undefined" &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn(
        `[resolveGlobals] cycle detected while resolving global "${type}" — leaving reference unresolved`
      );
    }
    mergedProps = { ...((item.props as any) ?? {}) };
  }

  const fields = componentConfig?.fields ?? {};
  const nextVisited = shouldApplyGlobal
    ? new Set([...visitedTypes, type])
    : visitedTypes;

  for (const [fieldName, fieldDef] of Object.entries(fields)) {
    if ((fieldDef as any)?.type === "slot") {
      const slotValue = mergedProps[fieldName];
      if (Array.isArray(slotValue)) {
        mergedProps[fieldName] = slotValue.map((child: any) =>
          child &&
          typeof child === "object" &&
          "type" in child &&
          "props" in child
            ? resolveItem(child, globalData, config, nextVisited)
            : child
        );
      }
    }
  }

  return { ...item, props: mergedProps } as ComponentData;
}

/**
 * Walks a Data tree and resolves any component node whose type is marked
 * global and has an entry in globalData. Returns a new Data tree with
 * globals inlined. Identity-preserving when globalData is empty or missing.
 */
export function resolveGlobals<T extends Data>(
  data: T,
  globalData: GlobalData | undefined,
  config: Config
): T {
  if (!globalData || Object.keys(globalData).length === 0) return data;

  const visited = new Set<string>();
  const content = (data.content ?? []).map((item) =>
    resolveItem(item as ComponentData, globalData, config, visited)
  );

  return { ...data, content } as T;
}
