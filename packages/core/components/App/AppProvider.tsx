"use client";

import { ReactNode, useMemo } from "react";
import {
  BrowserRouter,
  HashRouter,
  MemoryRouter,
  StaticRouter,
} from "react-router";
import type { Config, Data, UserGenerics } from "../../types";
import { useStableValue } from "../../lib/use-stable-value";
import { appConfigContext, type RouteKey } from "./context";

/**
 * The hardcoded editor URL prefix. Routes under "/editor/..." are routed
 * to <Editor>, everything else goes to <Render>. Power users who need
 * a different prefix should compose <AppProvider> with their own <Routes>
 * and skip the default layout (see docs).
 */
export const EDITOR_PATH = "/editor";

const isServer = typeof window === "undefined";

/** Which RR router variant to use on the client. SSR always uses StaticRouter. */
export type AppRouterVariant = "browser" | "hash" | "memory";

export type AppProviderProps<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
> = {
  config: UserConfig;
  pages: Record<RouteKey, Partial<G["UserData"] | Data>>;
  /** Defaults to "/editor". Pass null to disable editor mode. */
  editorPath?: string | null;
  /** Client-side router variant. Defaults to "browser". */
  router?: AppRouterVariant;
  /**
   * Initial pathname for SSR (StaticRouter) or MemoryRouter.
   * Required during SSR so the first paint matches the requested URL.
   * Ignored for BrowserRouter and HashRouter on the client (they read window).
   */
  currentRoute?: string;
  children?: ReactNode;
};

export function AppProvider<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>({
  config,
  pages,
  editorPath = EDITOR_PATH,
  router = "browser",
  currentRoute,
  children,
}: AppProviderProps<UserConfig, G>) {
  // Structurally stabilize so inline pages={{ ... }} doesn't churn matchers.
  const stablePages = useStableValue(pages);

  const resolvedEditorPath =
    editorPath === null ? null : editorPath || EDITOR_PATH;

  const ctxValue = useMemo(
    () => ({
      config,
      pages: stablePages,
      editorPath: resolvedEditorPath,
    }),
    [config, stablePages, resolvedEditorPath]
  );

  const inner = (
    <appConfigContext.Provider value={ctxValue as any}>
      {children}
    </appConfigContext.Provider>
  );

  if (isServer) {
    return <StaticRouter location={currentRoute ?? "/"}>{inner}</StaticRouter>;
  }

  if (router === "hash") {
    return <HashRouter>{inner}</HashRouter>;
  }
  if (router === "memory") {
    return (
      <MemoryRouter initialEntries={[currentRoute ?? "/"]}>
        {inner}
      </MemoryRouter>
    );
  }
  return <BrowserRouter>{inner}</BrowserRouter>;
}
