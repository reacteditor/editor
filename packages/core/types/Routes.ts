/**
 * A route key — the literal string used as a `pages` key in `<App>` and
 * the picker entry in `<Editor routes>`. The same string flows through:
 *   - `pages={{ [routeKey]: pageData }}` declares the schema
 *   - `<Editor routes={[routeKey, ...]}>` powers the page picker
 *   - `<Editor route={{ key: routeKey, path, params }}>` marks the selected page
 *   - `onPublish({ data, route })` returns the descriptor for persistence
 *
 * Patterns follow path-to-regexp v8 / Express 5 syntax: "/", "/about",
 * "/products/:handle", "/docs/*splat".
 */
export type Route = string;
