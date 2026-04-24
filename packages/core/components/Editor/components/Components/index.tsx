import { useAppStore } from "../../../../store";
import { ComponentList } from "../../../ComponentList";
import { ReactNode, useMemo, useState } from "react";
import { Search } from "lucide-react";
import styles from "./styles.module.css";
import getClassNameFactory from "../../../../lib/get-class-name-factory";

const getClassName = getClassNameFactory("Components", styles);

type ComponentConfigLike = {
  label?: string;
  icon?: ReactNode;
  category?: string;
};

export const Components = () => {
  const overrides = useAppStore((s) => s.overrides);
  const components = useAppStore((s) => s.config.components);
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
    const entries = (
      Object.entries(components ?? {}) as [string, ComponentConfigLike][]
    ).filter(([name, conf]) => {
      if (!query) return true;
      const label = (conf.label ?? name).toLowerCase();
      return label.includes(query);
    });
    if (!entries.length) return [] as [string | undefined, typeof entries][];

    const buckets = new Map<string | undefined, typeof entries>();
    for (const entry of entries) {
      const [, conf] = entry;
      const key = conf.category;
      const bucket = buckets.get(key) ?? [];
      bucket.push(entry);
      buckets.set(key, bucket);
    }
    return Array.from(buckets.entries());
  }, [components, search]);

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
        <ComponentList id="all">
          {groups[0][1].map(([name, conf]) => (
            <ComponentList.Item
              key={name}
              name={name}
              label={(conf.label ?? name) as string}
              icon={conf.icon}
            />
          ))}
        </ComponentList>
      ) : (
        groups.map(([category, entries]) => {
          const categoryKey = category ?? "other";
          const title =
            categoriesConfig?.[categoryKey as string]?.title ??
            (category ?? "Other");

          return (
            <ComponentList
              id={categoryKey}
              key={categoryKey}
              title={title as string}
            >
              {entries.map(([name, conf]) => (
                <ComponentList.Item
                  key={name}
                  name={name}
                  label={(conf.label ?? name) as string}
                  icon={conf.icon}
                />
              ))}
            </ComponentList>
          );
        })
      )}
    </Wrapper>
  );
};
