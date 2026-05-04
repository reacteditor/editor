/* eslint-disable @next/next/no-img-element */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Check, Copy, Plus, Search, X } from "lucide-react";
import type { MediaAdapter, MediaItem, MediaPluginOptions } from "../types";
import { Loader } from "./Loader";
import styles from "./styles.module.css";

type UploadTile = {
  id: string;
  file: File;
  url: string;
  progress: number;
  error?: string;
  controller: AbortController;
};

// First occurrence wins. Used wherever we merge fetched pages or upload
// results into the existing list — server may return an item we already
// have optimistically (uploads), or the same id across pages.
const dedupeById = <T extends { id: string }>(list: T[]): T[] => {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of list) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
};

const matchesAccept = (file: File, accept: string): boolean => {
  if (!accept || accept === "*/*") return true;
  return accept.split(",").some((raw) => {
    const part = raw.trim();
    if (!part) return false;
    if (part.startsWith(".")) {
      return file.name.toLowerCase().endsWith(part.toLowerCase());
    }
    if (part.endsWith("/*")) {
      return file.type.startsWith(part.slice(0, -1));
    }
    return file.type === part;
  });
};

export const MediaPanel = ({ options }: { options: MediaPluginOptions }) => {
  const { adapter, onSelect, showSearch, getItemSummary } = options;
  const accept = options.accept ?? "image/*";
  const initialQuery = options.initialQuery ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);

  const [items, setItems] = useState<MediaItem[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState<Error | null>(null);

  const [uploads, setUploads] = useState<UploadTile[]>([]);
  const [dragDepth, setDragDepth] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [uploaderOpen, setUploaderOpen] = useState(false);

  const fetchAbortRef = useRef<AbortController | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const runFetch = useCallback(
    async (q: string, c: string | undefined, append: boolean) => {
      fetchAbortRef.current?.abort();
      const controller = new AbortController();
      fetchAbortRef.current = controller;

      setLoading(true);
      setPageError(null);
      try {
        const page = await adapter.fetchList({
          query: q,
          cursor: c,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        const next = page?.items ?? [];
        setItems((prev) =>
          append ? dedupeById([...prev, ...next]) : dedupeById(next)
        );
        setCursor(page?.nextCursor);
        setHasMore(Boolean(page?.nextCursor));
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        setPageError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [adapter]
  );

  // Reset + fetch whenever the submitted query changes (incl. initial mount).
  useEffect(() => {
    setItems([]);
    setCursor(undefined);
    setHasMore(true);
    setSelectedId(null);
    runFetch(submittedQuery, undefined, false);
    return () => fetchAbortRef.current?.abort();
  }, [submittedQuery, runFetch]);

  // Infinite scroll. Sentinel sits below the grid; when it intersects the
  // body viewport and we have a cursor + nothing in flight, fetch the next
  // page. Re-runs when items append because the sentinel re-mounts under new
  // content height.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = bodyRef.current;
    if (!sentinel || !root || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (loading || !cursor) return;
        runFetch(submittedQuery, cursor, true);
      },
      { root, rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, cursor, submittedQuery, runFetch]);

  // Revoke any object URLs we still hold on unmount (uploads in flight).
  useEffect(
    () => () => {
      uploads.forEach((u) => URL.revokeObjectURL(u.url));
      fetchAbortRef.current?.abort();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Click-away to clear selection. Listens at document level on mousedown
  // so it fires before the tile's own click — when the click *is* on a tile
  // (or the selection footer), the click is preserved and the tile's own
  // handler still runs. Only mounts when something is selected.
  useEffect(() => {
    if (!selectedId) return;
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (
        target?.closest?.("[data-mediapanel-tile], [data-mediapanel-footer]")
      ) {
        return;
      }
      setSelectedId(null);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [selectedId]);

  // Reset the delete-confirm state whenever the selected item changes.
  useEffect(() => {
    setConfirmingDelete(false);
  }, [selectedId]);

  // Default uploader visibility: open when, after the fetch settles, there
  // are no images; closed otherwise. Gating on !loading keeps the uploader
  // hidden during the initial fetch so the spinner is the only thing on
  // screen, then auto-expands once we know the result is empty. Manual
  // toggles via the + button persist until the next empty/non-empty
  // transition.
  const hasNoMedia =
    !loading && !pageError && items.length === 0 && uploads.length === 0;
  useEffect(() => {
    setUploaderOpen(hasNoMedia);
  }, [hasNoMedia]);

  const onSearchSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setSubmittedQuery(query.trim());
    },
    [query]
  );

  const onSearchClear = useCallback(() => {
    setQuery("");
    setSubmittedQuery("");
  }, []);

  const onSearchKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape" && (query || submittedQuery)) {
        e.preventDefault();
        onSearchClear();
      }
    },
    [query, submittedQuery, onSearchClear]
  );

  const startUpload = useCallback(
    async (file: File) => {
      const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const url = URL.createObjectURL(file);
      const controller = new AbortController();
      const tile: UploadTile = {
        id,
        file,
        url,
        progress: 0,
        controller,
      };
      setUploads((prev) => [tile, ...prev]);

      const removeTile = () =>
        setUploads((prev) => {
          const found = prev.find((u) => u.id === id);
          if (found) URL.revokeObjectURL(found.url);
          return prev.filter((u) => u.id !== id);
        });

      try {
        const item = await adapter.upload(file, {
          signal: controller.signal,
          onProgress: (p) => {
            setUploads((prev) =>
              prev.map((u) =>
                u.id === id ? { ...u, progress: Math.max(0, Math.min(1, p)) } : u
              )
            );
          },
        });
        removeTile();
        setItems((prev) => dedupeById([item, ...prev]));
        setUploaderOpen(false);
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") {
          removeTile();
          return;
        }
        setUploads((prev) =>
          prev.map((u) =>
            u.id === id
              ? {
                  ...u,
                  error: err instanceof Error ? err.message : String(err),
                }
              : u
          )
        );
      }
    },
    [adapter]
  );

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter((f) => matchesAccept(f, accept));
      files.forEach(startUpload);
    },
    [accept, startUpload]
  );

  const onFilesPicked = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget.files?.length) handleFiles(e.currentTarget.files);
      e.currentTarget.value = "";
    },
    [handleFiles]
  );

  // Drag enter/leave fire for child elements too, so we count depth instead
  // of toggling a boolean — that's the only reliable way to keep the overlay
  // visible while the cursor is over an inner tile.
  const onDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.types.includes("Files")) return;
    setDragDepth((d) => d + 1);
  }, []);

  const onDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.types.includes("Files")) return;
    setDragDepth((d) => Math.max(0, d - 1));
  }, []);

  const onDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      if (!e.dataTransfer.types.includes("Files")) return;
      e.preventDefault();
      setDragDepth(0);
      if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const confirmItemDelete = useCallback(
    async (item: MediaItem) => {
      if (!adapter.delete) return;
      setConfirmingDelete(false);
      setSelectedId(null);
      const prev = items;
      setItems((current) => current.filter((i) => i.id !== item.id));
      try {
        await adapter.delete(item.id);
      } catch (err) {
        setItems(prev);
        setPageError(err instanceof Error ? err : new Error(String(err)));
      }
    },
    [adapter, items]
  );

  const retryUpload = useCallback(
    (id: string) => {
      const tile = uploads.find((u) => u.id === id);
      if (!tile) return;
      setUploads((prev) => prev.filter((u) => u.id !== id));
      URL.revokeObjectURL(tile.url);
      startUpload(tile.file);
    },
    [uploads, startUpload]
  );

  const onItemSelect = useCallback(
    (item: MediaItem) => {
      setSelectedId((prev) => {
        if (prev === item.id) return null;
        onSelect?.(item);
        return item.id;
      });
    },
    [onSelect]
  );

  const onItemCopy = useCallback(async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      window.setTimeout(
        () => setCopiedId((prev) => (prev === item.id ? null : prev)),
        1500
      );
    } catch {
      // Clipboard write can fail in unfocused/insecure contexts; swallow
      // since the user can re-trigger by clicking again.
    }
  }, []);

  const titleFor = useCallback(
    (item: MediaItem): string | undefined => {
      const summary = getItemSummary?.(item) ?? item.name ?? item.id;
      return typeof summary === "string" ? summary : undefined;
    },
    [getItemSummary]
  );

  const isInitialEmpty =
    !loading && !pageError && items.length === 0 && uploads.length === 0;

  // Aggregate progress across in-flight (non-errored) uploads. Drives the
  // single header-anchored progress bar below the header.
  const activeUploads = uploads.filter((u) => !u.error);
  const aggregateProgress =
    activeUploads.length === 0
      ? 0
      : activeUploads.reduce((sum, u) => sum + u.progress, 0) /
        activeUploads.length;

  const selectedItem = selectedId
    ? items.find((i) => i.id === selectedId) ?? null
    : null;

  return (
    <div className={styles.MediaPanel}>
      <div className={styles["MediaPanel-header"]}>
        {showSearch && (
          <SearchForm
            query={query}
            onChange={setQuery}
            onSubmit={onSearchSubmit}
            onKeyDown={onSearchKeyDown}
          />
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          className={styles["MediaPanel-fileInput"]}
          onChange={onFilesPicked}
        />
        <button
          type="button"
          aria-label={uploaderOpen ? "Hide uploader" : "Show uploader"}
          aria-pressed={uploaderOpen}
          className={styles["MediaPanel-uploadBtn"]}
          onClick={() => setUploaderOpen((v) => !v)}
        >
          <span className={styles["MediaPanel-uploadBtn-icon"]}>
            <Plus size={16} />
          </span>
        </button>
      </div>

      {activeUploads.length > 0 && (
        <div
          className={styles["MediaPanel-progress"]}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={aggregateProgress}
          aria-label="Uploading"
        >
          <div
            className={styles["MediaPanel-progress-bar"]}
            style={{ width: `${Math.round(aggregateProgress * 100)}%` }}
          />
        </div>
      )}

      {pageError && (
        <div className={styles["MediaPanel-error"]} role="alert">
          {pageError.message ?? "Something went wrong."}
        </div>
      )}

      <div ref={bodyRef} className={styles["MediaPanel-body"]}>
        {uploaderOpen && (
          <div
            className={[
              styles["MediaPanel-uploader"],
              dragDepth > 0 ? styles["MediaPanel-uploader--active"] : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            {dragDepth > 0 ? (
              <div className={styles["MediaPanel-uploader-hint"]}>
                Drop to upload
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className={styles["MediaPanel-button"]}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Add images
                </button>
                <div className={styles["MediaPanel-uploader-hint"]}>
                  or drop files to upload
                </div>
              </>
            )}
          </div>
        )}

        {isInitialEmpty ? (
          options.emptyState ? <EmptyState options={options} /> : null
        ) : (
          <div className={styles["MediaPanel-grid"]}>
            {uploads.map((u) => (
              <UploadTileView
                key={u.id}
                tile={u}
                onRetry={() => retryUpload(u.id)}
                onCancel={() => {
                  u.controller.abort();
                  URL.revokeObjectURL(u.url);
                  setUploads((prev) => prev.filter((x) => x.id !== u.id));
                }}
              />
            ))}
            {items.map((item) => (
              <Tile
                key={item.id}
                item={item}
                title={titleFor(item)}
                selected={selectedId === item.id}
                copied={copiedId === item.id}
                onClick={() => onItemSelect(item)}
                onCopy={() => onItemCopy(item)}
              />
            ))}
          </div>
        )}

        {loading && items.length > 0 && (
          <div className={styles["MediaPanel-status"]}>
            <Loader size={20} aria-label="Loading" />
          </div>
        )}

        {loading && items.length === 0 && uploads.length === 0 && (
          <div className={styles["MediaPanel-status"]}>
            <Loader size={20} aria-label="Loading" />
          </div>
        )}

        {hasMore && <div ref={sentinelRef} className={styles["MediaPanel-sentinel"]} />}
      </div>

      {selectedItem && (
        <div
          className={styles["MediaPanel-footer"]}
          data-mediapanel-footer=""
        >
          {confirmingDelete ? (
            <div className={styles["MediaPanel-footer-confirm"]}>
              <span className={styles["MediaPanel-footer-prompt"]}>
                Are you sure?
              </span>
              <button
                type="button"
                className={styles["MediaPanel-button"]}
                onClick={() => setConfirmingDelete(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles["MediaPanel-button"]}
                onClick={() => confirmItemDelete(selectedItem)}
              >
                Delete
              </button>
            </div>
          ) : (
            <div className={styles["MediaPanel-footer-actions"]}>
              <button
                type="button"
                className={styles["MediaPanel-button"]}
                onClick={() => onItemCopy(selectedItem)}
              >
                {copiedId === selectedItem.id ? (
                  <Check size={12} />
                ) : (
                  <Copy size={12} />
                )}
                {copiedId === selectedItem.id ? "Copied" : "Copy URL"}
              </button>
              {adapter.delete && (
                <button
                  type="button"
                  className={styles["MediaPanel-button"]}
                  onClick={() => setConfirmingDelete(true)}
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SearchForm = ({
  query,
  onChange,
  onSubmit,
  onKeyDown,
}: {
  query: string;
  onChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}) => (
  <form className={styles["MediaPanel-search"]} onSubmit={onSubmit}>
    <div className={styles["MediaPanel-searchIcon"]}>
      <Search size={14} />
    </div>
    <input
      type="search"
      value={query}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder="search"
      className={styles["MediaPanel-searchInput"]}
    />
  </form>
);

const Tile = ({
  item,
  title,
  selected,
  copied,
  onClick,
  onCopy,
}: {
  item: MediaItem;
  title: string | undefined;
  selected: boolean;
  copied: boolean;
  onClick: () => void;
  onCopy: () => void;
}) => {
  const className = [
    styles["MediaPanel-tile"],
    selected ? styles["MediaPanel-tile--selected"] : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      title={title}
      aria-pressed={selected}
      data-mediapanel-tile=""
    >
      <img
        src={item.thumbnailUrl ?? item.url}
        alt={item.name ?? ""}
        className={styles["MediaPanel-tile-img"]}
        loading="lazy"
      />
      <span className={styles["MediaPanel-tile-actions"]}>
        <TileAction
          label={copied ? "Copied" : "Copy URL"}
          onActivate={onCopy}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </TileAction>
      </span>
    </button>
  );
};

// Inner action; rendered as a span with role=button so it nests inside the
// outer tile <button> (nested <button> is invalid HTML).
const TileAction = ({
  label,
  onActivate,
  children,
}: {
  label: string;
  onActivate: () => void;
  children: React.ReactNode;
}) => (
  <span
    role="button"
    aria-label={label}
    tabIndex={0}
    className={styles["MediaPanel-tile-action"]}
    onClick={(e) => {
      e.stopPropagation();
      onActivate();
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        onActivate();
      }
    }}
  >
    {children}
  </span>
);

const UploadTileView = ({
  tile,
  onRetry,
  onCancel,
}: {
  tile: UploadTile;
  onRetry: () => void;
  onCancel: () => void;
}) => {
  const errored = Boolean(tile.error);
  return (
    <div
      className={`${styles["MediaPanel-tile"]} ${
        styles["MediaPanel-tile--uploading"]
      } ${errored ? styles["MediaPanel-tile--errored"] : ""}`}
    >
      <img
        src={tile.url}
        alt={tile.file.name}
        className={styles["MediaPanel-tile-img"]}
      />
      {errored ? (
        <>
          <div className={styles["MediaPanel-tile-error"]} title={tile.error}>
            Failed
          </div>
          <span className={styles["MediaPanel-tile-actions"]} style={{ opacity: 1 }}>
            <TileAction label="Retry" onActivate={onRetry}>
              <Plus size={12} />
            </TileAction>
          </span>
        </>
      ) : (
        <span className={styles["MediaPanel-tile-actions"]} style={{ opacity: 1 }}>
          <TileAction label="Cancel upload" onActivate={onCancel}>
            <X size={12} />
          </TileAction>
        </span>
      )}
    </div>
  );
};

const EmptyState = ({ options }: { options: MediaPluginOptions }) => {
  if (!options.emptyState) return null;
  return <div className={styles["MediaPanel-empty"]}>{options.emptyState}</div>;
};

// Re-export so MediaPanel.tsx is the only thing the entry needs to import
// for the adapter type when consumers pass it in.
export type { MediaAdapter };
