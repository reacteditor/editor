import { useAppStore } from "../../../../store";
import { BlockList } from "../../../BlockList";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Block } from "../../../../types";
import styles from "./styles.module.css";
import getClassNameFactory from "../../../../lib/get-class-name-factory";

const getClassName = getClassNameFactory("Components", styles);

export const Components = () => {
  const overrides = useAppStore((s) => s.overrides);
  const blocks = useAppStore((s) => s.config.blocks);
  const categoriesConfig = useAppStore((s) => s.config.categories);

  const [search, setSearch] = useState("");

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
    const query = search.trim().toLowerCase();
    const entries = (Object.entries(blocks ?? {}) as [string, Block][]).filter(
      ([, block]) => {
        if (!query) return true;
        return block.label.toLowerCase().includes(query);
      }
    );
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
  }, [blocks, search]);

  return (
    <Wrapper>
      <div className={getClassName("search")}>
        <div className={getClassName("searchIcon")}>
          <Search size={14} />
        </div>
        <input
          type="search"
          className={getClassName("searchInput")}
          placeholder="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {groups.length === 0 ? (
        <div className={getClassName("empty")}>No results match your search</div>
      ) : groups.length <= 1 && !groups[0]?.[0] ? (
        <BlockList id="all">
          {groups[0][1].map(([blockName, block]) => (
            <BlockList.Item
              key={blockName}
              blockName={blockName}
              block={block}
            />
          ))}
        </BlockList>
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
