import { match, type MatchFunction } from "path-to-regexp";

/**
 * A route key is the literal string used as the page's key in `pages`.
 * Examples: "/", "/about", "/products/:handle", "/docs/*splat".
 * Returned to onPublish so the host can persist by route key.
 */
export type RouteKey = string;

export type AppPages<Data = unknown> = Record<RouteKey, Data>;

export type RouteParams = Partial<Record<string, string | string[]>>;

export type ResolvedRoute<Data = unknown> = {
  /** The route key string — stable persistence identifier. */
  route: RouteKey;
  /** Concrete params extracted from the URL (e.g. { handle: "abc" }). */
  params: RouteParams;
  /** The page's data. */
  data: Data;
};

type CompiledRoute<Data> = {
  key: RouteKey;
  data: Data;
  match: MatchFunction<RouteParams>;
  /** Specificity score — higher beats lower when multiple routes match. */
  score: number;
};

const score = (key: RouteKey): number => {
  // Static segments worth more than dynamic; catch-alls last.
  const segments = key.split("/").filter(Boolean);
  let s = 0;
  for (const seg of segments) {
    if (seg.startsWith("*")) s += 1;
    else if (seg.startsWith(":")) s += 100;
    else s += 10000;
  }
  return s;
};

export const compilePages = <Data,>(
  pages: AppPages<Data>
): CompiledRoute<Data>[] => {
  return Object.entries(pages)
    .map(([key, data]) => ({
      key,
      data,
      match: match(key, { decode: decodeURIComponent }),
      score: score(key),
    }))
    .sort((a, b) => b.score - a.score);
};

export const resolveRoute = <Data,>(
  compiled: CompiledRoute<Data>[],
  currentRoute: string
): ResolvedRoute<Data> | null => {
  const normalized = currentRoute || "/";
  for (const route of compiled) {
    const result = route.match(normalized);
    if (result) {
      return {
        route: route.key,
        params: result.params,
        data: route.data,
      };
    }
  }
  return null;
};
