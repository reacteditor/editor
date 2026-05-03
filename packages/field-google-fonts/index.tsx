import React, { useEffect, useState } from "react";
import type { ExternalField } from "@/core/types";
import googleFontsJson from "./google-fonts.json";

export type GoogleFont = {
  family: string;
  category?: string;
  variants?: string[];
  subsets?: string[];
};

// google-fonts.json is a static snapshot of every Google Fonts family keyed
// `slug → "Display Name"`. We materialise it once into a GoogleFont[] so the
// no-API-key path covers the full ~1700-font catalog instead of a curated 25.
const STATIC_CATALOG: GoogleFont[] = Object.values(
  googleFontsJson as Record<string, string>
)
  .map((family) => ({ family }))
  .sort((a, b) => a.family.localeCompare(b.family));

type Sort = "alpha" | "popularity" | "trending" | "date" | "style";

type Options = {
  /**
   * Google Fonts Developer API key
   * (https://developers.google.com/fonts/docs/developer_api). When supplied,
   * the field fetches the live catalog. Without a key the field falls back to
   * a curated list of popular fonts so the picker still works offline.
   */
  apiKey?: string;
  /**
   * Pre-supplied font list — wins over `apiKey`. Useful for tests or when the
   * host app already proxies the catalog through its own backend.
   */
  families?: GoogleFont[];
  sort?: Sort;
  /** Restrict to fonts that include this subset (e.g. "latin", "cyrillic"). */
  subset?: string;
  /** Field placeholder. Defaults to "Select a Google font". */
  placeholder?: string;
  /** Number of fonts shown initially and added on each "Load more" click. */
  pageSize?: number;
  filterFields?: ExternalField["filterFields"];
  initialFilters?: ExternalField["initialFilters"];
};


// Module-level cache so repeated renders for the same family don't keep
// re-injecting <link> tags. Keyed on family name.
const linkCache = new Map<string, HTMLLinkElement>();

const ensureFontLoaded = (family: string) => {
  if (typeof document === "undefined") return;
  if (linkCache.has(family)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  // `display=swap` so the row text falls back to system font until the web
  // font lands, instead of holding a blank (FOIT).
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  ).replace(/%20/g, "+")}&display=swap`;
  document.head.appendChild(link);
  linkCache.set(family, link);
};

const FontPreview: React.FC<{ family: string }> = ({ family }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ensureFontLoaded(family);

    // Use the FontFaceSet API where available so we only flip to the styled
    // preview once the file has actually rendered. Falls through to "loaded"
    // immediately on browsers that don't expose document.fonts.
    if (typeof document !== "undefined" && (document as any).fonts?.load) {
      (document as any).fonts
        .load(`16px "${family}"`)
        .then(() => {
          if (!cancelled) setLoaded(true);
        })
        .catch(() => {
          if (!cancelled) setLoaded(true);
        });
    } else {
      setLoaded(true);
    }

    return () => {
      cancelled = true;
    };
  }, [family]);

  return (
    <span
      style={{
        fontFamily: loaded ? `"${family}", system-ui, sans-serif` : undefined,
        fontSize: 16,
        lineHeight: 1.2,
      }}
    >
      {family}
    </span>
  );
};

const buildEndpoint = (apiKey: string, sort: Sort) =>
  `https://www.googleapis.com/webfonts/v1/webfonts?key=${encodeURIComponent(
    apiKey
  )}&sort=${sort}`;

const filterByQuery = (items: GoogleFont[], query?: string) => {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter((f) => f.family.toLowerCase().includes(q));
};

const filterByCategory = (items: GoogleFont[], category?: unknown) => {
  if (!category) return items;
  return items.filter((f) => f.category === category);
};

const filterBySubset = (items: GoogleFont[], subset?: string) => {
  if (!subset) return items;
  return items.filter((f) => f.subsets?.includes(subset));
};

/**
 * Returns an `external` field whose value is the font family name (a plain
 * string, e.g. "Inter"). Components can drop it straight into a CSS
 * `font-family` declaration without unwrapping an object.
 */
export function createFieldGoogleFonts(
  options: Options = {}
): ExternalField<string> {
  const {
    apiKey,
    families,
    sort = "popularity",
    subset,
    placeholder = "Select a Google font",
    pageSize = 50,
    filterFields,
    initialFilters,
  } = options;

  // Closure-scoped pagination state. We grow the slice on "Load more" and
  // reset it whenever the search query or filters change so the user always
  // starts a new search at page 1.
  let currentLimit = pageSize;
  let lastFilteredTotal = 0;
  let lastSignature: string | null = null;

  // Per-field cache so the catalog only round-trips once even if the user
  // re-opens the picker repeatedly.
  let cached: GoogleFont[] | null = families ?? null;

  const loadCatalog = async (): Promise<GoogleFont[]> => {
    if (cached) return cached;
    if (!apiKey) {
      cached = STATIC_CATALOG;
      return cached;
    }
    const res = await fetch(buildEndpoint(apiKey, sort));
    if (!res.ok) {
      // Network/quota failure shouldn't take the picker down — fall back to
      // the curated list and log so the host can diagnose.
      // eslint-disable-next-line no-console
      console.warn(
        `field-google-fonts: webfonts API returned ${res.status}; using fallback list`
      );
      cached = STATIC_CATALOG;
      return cached;
    }
    const data = (await res.json()) as { items?: GoogleFont[] };
    cached = (data.items ?? []).map((f) => ({
      family: f.family,
      category: f.category,
      variants: f.variants,
      subsets: f.subsets,
    }));
    return cached;
  };

  return {
    type: "external",
    placeholder,
    showSearch: true,
    // Disable the input cache so re-submitting (which the "Load more" button
    // does to grow the slice) actually re-runs fetchList instead of returning
    // a cached page.
    cache: { enabled: false },
    fetchList: async ({ query, filters = {} }) => {
      const all = await loadCatalog();
      let results = all;
      results = filterByQuery(results, query);
      results = filterByCategory(results, (filters as any).category);
      results = filterBySubset(results, subset);

      const signature = `${query ?? ""}|${JSON.stringify(filters)}`;
      if (signature !== lastSignature) {
        lastSignature = signature;
        currentLimit = pageSize;
      }
      lastFilteredTotal = results.length;

      return results.slice(0, currentLimit);
    },
    mapProp: (item: GoogleFont) => item.family,
    mapRow: (item: GoogleFont) => ({
      family: <FontPreview family={item.family} />,
    }),
    getItemSummary: (item) => item ?? "",
    renderFooter: ({ items }) => {
      const shown = items.length;
      const total = lastFilteredTotal;
      const hasMore = shown < total;
      return (
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: 12,
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span>
            Showing {shown} of {total}
          </span>
          {hasMore && (
            <button
              type="button"
              style={{
                background: "transparent",
                border: "1px solid var(--editor-border-default)",
                borderRadius: "var(--editor-radius-md)",
                color: "var(--editor-text-primary)",
                cursor: "pointer",
                font: "inherit",
                padding: "6px 12px",
              }}
              onClick={(e) => {
                currentLimit += pageSize;
                // Re-trigger ExternalInput's search by submitting the form
                // it wraps every row in. There's no public API for this yet,
                // so we walk up the DOM.
                const form = (e.currentTarget as HTMLElement).closest("form");
                form?.requestSubmit();
              }}
            >
              Load more
            </button>
          )}
        </div>
      );
    },
    filterFields,
    initialFilters,
  };
}
