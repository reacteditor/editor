import type { MediaAdapter, MediaItem } from "@reacteditor/plugin-media";

const seed: MediaItem[] = [
  {
    id: "seed-1",
    name: "Mountain",
    url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400",
    width: 1600,
    height: 1067,
    mimeType: "image/jpeg",
  },
  {
    id: "seed-2",
    name: "Forest",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    width: 1600,
    height: 1067,
    mimeType: "image/jpeg",
  },
  {
    id: "seed-3",
    name: "Desert",
    url: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1600",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=400",
    width: 1600,
    height: 1067,
    mimeType: "image/jpeg",
  },
  {
    id: "seed-4",
    name: "Ocean",
    url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1600",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400",
    width: 1600,
    height: 1067,
    mimeType: "image/jpeg",
  },
];

export function createDemoMediaAdapter(): MediaAdapter {
  const items: MediaItem[] = [...seed];

  return {
    async fetchList({ query }) {
      const q = query.trim().toLowerCase();
      const filtered = q
        ? items.filter((item) =>
            (item.name ?? item.id).toLowerCase().includes(q)
          )
        : items;
      return { items: [...filtered] };
    },
    async upload(file, opts) {
      if (opts?.onProgress) {
        for (let p = 0.2; p < 1; p += 0.2) {
          await new Promise((r) => setTimeout(r, 80));
          opts.onProgress(p);
        }
      }
      const url = URL.createObjectURL(file);
      const item: MediaItem = {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        url,
        thumbnailUrl: url,
        mimeType: file.type,
      };
      items.unshift(item);
      opts?.onProgress?.(1);
      return item;
    },
    async delete(id) {
      const idx = items.findIndex((item) => item.id === id);
      if (idx >= 0) {
        const [removed] = items.splice(idx, 1);
        if (removed?.url.startsWith("blob:")) URL.revokeObjectURL(removed.url);
      }
    },
  };
}
