import { useEffect, useState } from "react";

const isBrowser = typeof window !== "undefined";

let installed = 0;
const subscribers = new Set<() => void>();
let originalPushState: typeof window.history.pushState | null = null;
let originalReplaceState: typeof window.history.replaceState | null = null;

const notify = () => {
  for (const fn of subscribers) fn();
};

const installHistoryHooks = () => {
  if (!isBrowser || installed > 0) {
    installed += 1;
    return;
  }
  installed = 1;
  originalPushState = window.history.pushState.bind(window.history);
  originalReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = (...args: Parameters<typeof window.history.pushState>) => {
    originalPushState!(...args);
    notify();
  };
  window.history.replaceState = (
    ...args: Parameters<typeof window.history.replaceState>
  ) => {
    originalReplaceState!(...args);
    notify();
  };

  window.addEventListener("popstate", notify);
};

const uninstallHistoryHooks = () => {
  if (!isBrowser || installed === 0) return;
  installed -= 1;
  if (installed > 0) return;

  if (originalPushState) window.history.pushState = originalPushState;
  if (originalReplaceState) window.history.replaceState = originalReplaceState;
  window.removeEventListener("popstate", notify);
  originalPushState = null;
  originalReplaceState = null;
};

/**
 * Reads the current browser pathname and re-renders on navigation.
 *
 * Skips all work when `enabled` is false — used by `<App>` so that when
 * the host (Next/Remix) passes `currentRoute` explicitly, we don't fight
 * the host's router by also hooking history.
 */
export const useBrowserRoute = ({ enabled = true } = {}): string => {
  const [pathname, setPathname] = useState<string>(() =>
    isBrowser ? window.location.pathname : "/"
  );

  useEffect(() => {
    if (!enabled || !isBrowser) return;

    installHistoryHooks();

    const update = () => setPathname(window.location.pathname);
    update();
    subscribers.add(update);

    return () => {
      subscribers.delete(update);
      uninstallHistoryHooks();
    };
  }, [enabled]);

  return pathname;
};
