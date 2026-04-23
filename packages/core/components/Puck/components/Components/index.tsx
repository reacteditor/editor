import { useAppStore } from "../../../../store";
import { BlockList } from "../../../BlockList";
import { useMemo } from "react";
import { Block } from "../../../../types";

export const Components = () => {
  const overrides = useAppStore((s) => s.overrides);
  const blocks = useAppStore((s) => s.config.blocks);
  const categoriesConfig = useAppStore((s) => s.config.categories);

  const Wrapper = useMemo(() => {
    // DEPRECATED
    if (overrides.components) {
      console.warn(
        "The `components` override has been deprecated and renamed to `drawer`"
      );
    }
    return overrides.components || overrides.drawer || "div";
  }, [overrides]);

  const groups = useMemo(() => {
    const entries = Object.entries(blocks ?? {}) as [string, Block][];
    if (!entries.length) return [] as [string | undefined, typeof entries][];

    const buckets = new Map<string | undefined, typeof entries>();
    for (const entry of entries) {
      const [, block] = entry;
      const key = block.category;
      const bucket = buckets.get(key) ?? [];
      bucket.push(entry);
      buckets.set(key, bucket);
    }
    return Array.from(buckets.entries());
  }, [blocks]);

  return (
    <Wrapper>
      {groups.length <= 1 && !groups[0]?.[0] ? (
        <BlockList id="all" />
      ) : (
        groups.map(([category, entries]) => {
          const categoryKey = category ?? "other";
          const title =
            categoriesConfig?.[categoryKey as string]?.title ??
            (category ?? "Other");

          return (
            <BlockList
              id={categoryKey}
              key={categoryKey}
              title={title as string}
            >
              {entries.map(([blockName, block]) => (
                <BlockList.Item
                  key={blockName}
                  blockName={blockName}
                  block={block}
                />
              ))}
            </BlockList>
          );
        })
      )}
    </Wrapper>
  );
};
