import { ComponentData, Config, Data } from "../types";

type GlobalsMap = NonNullable<Data["globals"]>;

/**
 * Inverse of resolveGlobals. Walks a resolved Data tree, harvesting the
 * shared props of every `synced: true` instance into `data.globals`, and
 * stripping those instances down to their extrinsic state (children + id).
 *
 * Used internally before emitting `onChange` so the persisted shape doesn't
 * duplicate global props on every synced instance.
 *
 * For multi-instance scenarios (two of the same global on a page), the first
 * encountered instance wins — subsequent instances are stripped but don't
 * overwrite the extracted entry.
 */
export function splitGlobals<T extends Data>(data: T, config: Config): T {
  const extracted: GlobalsMap = { ...((data.globals ?? {}) as GlobalsMap) };

  function visit(node: ComponentData): ComponentData {
    const type = node.type;
    const componentConfig = config.components[type];
    const fields = componentConfig?.fields ?? {};
    const isGlobalType = componentConfig?.global === true;

    const processedProps: Record<string, any> = {
      ...((node.props as any) ?? {}),
    };
    for (const [fieldName, fieldDef] of Object.entries(fields)) {
      if ((fieldDef as any)?.type === "slot") {
        const slotValue = processedProps[fieldName];
        if (Array.isArray(slotValue)) {
          processedProps[fieldName] = slotValue.map((child: any) =>
            child &&
            typeof child === "object" &&
            "type" in child &&
            "props" in child
              ? visit(child)
              : child
          );
        }
      }
    }

    if (!isGlobalType || !node.synced) {
      return { ...node, props: processedProps } as ComponentData;
    }

    const { children, id, ...sharedProps } = processedProps;

    extracted[type] = { props: sharedProps };

    const instanceProps: Record<string, any> = { id };
    if (children !== undefined) instanceProps.children = children;

    return {
      ...node,
      props: instanceProps as any,
      synced: true,
    } as ComponentData;
  }

  const strippedContent = (data.content ?? []).map((item) =>
    visit(item as ComponentData)
  );

  return {
    ...data,
    content: strippedContent,
    globals: extracted,
  } as T;
}
