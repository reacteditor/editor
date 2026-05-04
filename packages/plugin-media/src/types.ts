import type { ReactNode } from "react";

export type MediaItem = {
  id: string;
  url: string;
  thumbnailUrl?: string;
  name?: string;
  width?: number;
  height?: number;
  mimeType?: string;
};

export type MediaPage = {
  items: MediaItem[];
  nextCursor?: string;
};

export type MediaAdapter = {
  fetchList: (params: {
    query: string;
    cursor?: string;
    signal?: AbortSignal;
  }) => Promise<MediaPage | null>;
  upload: (
    file: File,
    opts?: {
      signal?: AbortSignal;
      onProgress?: (progress: number) => void;
    }
  ) => Promise<MediaItem>;
  delete?: (id: string) => Promise<void>;
};

export type MediaPluginOptions = {
  adapter: MediaAdapter;
  /**
   * Called when the user clicks a tile. Receives the normalized item; use
   * this to insert the asset into the editor (e.g. via `editor.dispatch`).
   */
  onSelect?: (item: MediaItem) => void;
  /**
   * When true, renders a search input in the panel header. The query is
   * forwarded to `adapter.fetchList({ query })` on submit (Enter or icon
   * click). When false (default), only the plain list is shown.
   */
  showSearch?: boolean;
  initialQuery?: string;
  /**
   * MIME filter for the file picker and drop zone. Defaults to `"image/*"`.
   * Files not matching are silently ignored on drop.
   */
  accept?: string;
  /**
   * Hover label override for tiles. Defaults to `item.name ?? item.id`.
   */
  getItemSummary?: (item: MediaItem) => ReactNode;
  emptyState?: ReactNode;
};
