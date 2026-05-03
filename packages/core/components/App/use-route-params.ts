import { useParams } from "react-router";

/**
 * Returns the schema-named params extracted from the current route.
 *
 * Designed for components rendered *inside* the schema (e.g. a ProductDetails
 * block inside `pages["/products/:handle"]`) — they need `:handle` resolved
 * by name. This is a typed re-export of React Router's `useParams()`.
 *
 * Returns `{}` when no page matched (404).
 */
export const useRouteParams = useParams as <
  P extends Record<string, string | undefined> = Record<string, string | undefined>
>() => Readonly<P>;
