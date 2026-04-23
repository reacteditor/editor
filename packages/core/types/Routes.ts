/**
 * A concrete page destination surfaced in the editor's page switcher.
 * `path` is the stable identifier AND the URL; `title` is the display
 * label. Keep this type light — full page content lives in separate
 * per-page data blobs owned by the consumer. When Editor eventually
 * introduces a richer `Page` type (data + metadata + path + title),
 * `Route` can stay as the summary / reference projection of it.
 */
export type Route = {
  path: string;
  title: string;
};
