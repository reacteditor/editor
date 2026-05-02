import { useApp } from "./context";

/**
 * Returns the schema-named params extracted from the current route.
 *
 * Designed for components rendered *inside* the schema (e.g. a ProductDetails
 * block inside `pages["/products/:handle"]`) — they need `:handle` resolved
 * by name, which `next/navigation`'s `useParams()` doesn't give them (Next
 * returns the catch-all segments array).
 *
 * Components outside `<AppProvider>` (page.tsx, layouts, framework chrome)
 * should keep using their host framework's hooks. This hook complements those,
 * it doesn't replace them.
 *
 * Returns `{}` when no page matched (404).
 */
export const useRouteParams = <
  P extends Record<string, string | string[] | undefined> = Record<
    string,
    string | string[] | undefined
  >
>(): P => {
  const { matched } = useApp();
  return (matched?.params ?? {}) as P;
};
