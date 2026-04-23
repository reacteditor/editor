import { ComponentData, Config, Data, GlobalData } from "../types";

/**
 * Inverse of resolveGlobals. Walks a resolved Data tree and extracts the
 * shared props of any global-marked component into a separate GlobalData
 * map, leaving the instance with only its extrinsic state (children + id).
 *
 * Used when emitting onChange / onGlobalsChange to the consumer so stored
 * page data doesn't duplicate global props.
 *
 * For multi-instance scenarios (two AppShells on the same page), the first
 * encountered instance wins — subsequent instances are stripped but don't
 * overwrite the extracted entry.
 */
export function splitGlobalData(
  data: Data,
  config: Config
): { data: Data; globalData: GlobalData } {
  const extracted: GlobalData = {};

  function visit(node: ComponentData): ComponentData {
    const type = node.type;
    const componentConfig = config.components[type];
    const fields = componentConfig?.fields ?? {};
    const isGlobal = componentConfig?.global === true;

    // Recurse into slot contents first so nested globals are processed
    // before we decide what this node's own shared/instance split looks like.
    const processedProps: Record<string, any> = { ...((node.props as any) ?? {}) };
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

    if (!isGlobal) {
      return { ...node, props: processedProps } as ComponentData;
    }

    // Per-instance unlink: if this instance has opted out of global sync
    // (__synced: false), keep its full props inline and do NOT extract to
    // globalData. This is the escape hatch for one-off variants.
    if (processedProps.__synced === false) {
      return { ...node, props: processedProps } as ComponentData;
    }

    // Global instance (synced): split props into shared (globalData) +
    // extrinsic (children + id stay on the instance).
    const { children, id, ...sharedProps } = processedProps;

    if (!extracted[type]) {
      extracted[type] = { props: sharedProps };
    }

    const instanceProps: Record<string, any> = { id };
    if (children !== undefined) instanceProps.children = children;

    return { ...node, props: instanceProps as any } as ComponentData;
  }

  const strippedContent = (data.content ?? []).map((item) =>
    visit(item as ComponentData)
  );

  return {
    data: { ...data, content: strippedContent } as Data,
    globalData: extracted,
  };
}
