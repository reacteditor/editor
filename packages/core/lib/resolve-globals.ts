import { ComponentData, Config, Data } from "../types";

type GlobalsMap = NonNullable<Data["globals"]>;

/**
 * Recursively resolves a single component node against the data's globals
 * map. If the node opts in via `synced: true` and its type has an entry in
 * globals, the node's props are replaced with the global's props (children +
 * id stay extrinsic, matching React conventions).
 *
 * Cycle guard: if a global's contents transitively reference the same type,
 * leave the inner reference unresolved and warn in dev.
 */
function resolveItem(
  item: ComponentData,
  globals: GlobalsMap,
  config: Config,
  visitedTypes: Set<string>
): ComponentData {
  const type = item.type;
  const componentConfig = config.components[type];
  const globalEntry = globals[type];
  const shouldApplyGlobal = Boolean(
    componentConfig?.global &&
      item.synced &&
      globalEntry &&
      !visitedTypes.has(type)
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
      item.synced &&
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
            ? resolveItem(child, globals, config, nextVisited)
            : child
        );
      }
    }
  }

  return { ...item, props: mergedProps } as ComponentData;
}

/**
 * Walks a Data tree and inlines any synced global entries onto their
 * matching component instances. Identity-preserving when `data.globals` is
 * empty or missing.
 */
export function resolveGlobals<T extends Data>(data: T, config: Config): T {
  const globals = data.globals;
  if (!globals || Object.keys(globals).length === 0) return data;

  const visited = new Set<string>();
  const content = (data.content ?? []).map((item) =>
    resolveItem(item as ComponentData, globals, config, visited)
  );

  return { ...data, content } as T;
}
