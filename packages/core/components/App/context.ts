import { createContext, useContext } from "react";
import type { Config, Data, UserGenerics } from "../../types";
import type { ResolvedRoute, RouteKey } from "../../lib/route-resolver";

export type AppContextValue<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
> = {
  config: UserConfig;
  pages: Record<RouteKey, Partial<G["UserData"] | Data>>;
  /** All page route keys, sorted by specificity. */
  routes: RouteKey[];
  /** Resolved current pathname (post default-resolution). */
  currentRoute: string;
  /** "/editor" by default; null disables editor mode entirely. */
  editorPath: string | null;
  /** True when currentRoute starts with editorPath. */
  isEditing: boolean;
  /** The URL relative to editorPath when isEditing — what pages are matched against. */
  matchRoute: string;
  /** Result of matching matchRoute against pages. Null = 404. */
  matched: ResolvedRoute<Partial<G["UserData"] | Data>> | null;
  /** Navigate to a route key. App wraps this with editorPath when editing. */
  navigate: (route: RouteKey) => void;
};

export const appContext = createContext<AppContextValue | null>(null);

export const useApp = <
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>(): AppContextValue<UserConfig, G> => {
  const ctx = useContext(appContext);
  if (!ctx) {
    throw new Error("useApp must be called inside an <AppProvider> or <App>");
  }
  return ctx as AppContextValue<UserConfig, G>;
};
