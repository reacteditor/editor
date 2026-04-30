import type { EditorApi, EditorAction, ComponentData } from "@reacteditor/core";
import { z } from "zod";
import { schemas, type BuiltinName } from "./definitions";
import { serializeConfig } from "./schema";

// `useGetEditor()` returns a function that reads the latest API. We accept
// that function so handlers always operate on the freshest state — important
// when several mutations chain inside one assistant turn.
type GetEditor = () => EditorApi;

// Mirrors core's lib/get-frame.ts. The plugin can't import it (not on the
// public surface) so the lookup is reproduced here.
const getEditorFrameDoc = (): Document | null => {
  if (typeof window === "undefined") return null;
  const frameEl = document.querySelector("#preview-frame");
  if (frameEl?.tagName === "IFRAME") {
    return (frameEl as HTMLIFrameElement).contentDocument ?? document;
  }
  return frameEl?.ownerDocument ?? document;
};

// Wait one frame after a state mutation so the iframe re-renders the newly
// inserted node, then scroll it into view.
const scrollComponentIntoView = (id: string) => {
  if (typeof window === "undefined") return;
  requestAnimationFrame(() => {
    const doc = getEditorFrameDoc();
    const el = doc?.querySelector(
      `[data-editor-component="${id}"]`
    ) as HTMLElement | null;
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
};

const summarizeComponent = (data: ComponentData) => ({
  id: data.props?.id,
  type: data.type,
  props: data.props,
});

const toParent = (parentId?: string, slot?: string) =>
  parentId ? { id: parentId, slot: slot ?? "default-zone" } : undefined;

export type Handler<Name extends BuiltinName> = (
  args: z.infer<(typeof schemas)[Name]>,
  ctx: { getEditor: GetEditor; dispatch: (a: EditorAction) => void }
) => unknown | Promise<unknown>;

export const handlers: { [K in BuiltinName]: Handler<K> } = {
  getConfig: (_args, { getEditor }) => serializeConfig(getEditor().config),

  getSchema: (_args, { getEditor }) => {
    const { data } = getEditor().appState;
    return { root: data.root, content: data.content, globals: data.globals };
  },

  updateSchema: (args, { dispatch }) => {
    // Bulk replacement of root/content/globals — coarser than the typed
    // commands, so we keep this on raw dispatch.
    dispatch({
      type: "setData",
      data: (prev) => ({
        ...prev,
        ...(args.root ? { root: { ...prev.root, ...args.root } } : {}),
        ...(args.content ? { content: args.content as never } : {}),
        ...(args.globals ? { globals: args.globals as never } : {}),
      }),
      recordHistory: true,
    });
    return { ok: true };
  },

  updateRootProps: (args, { getEditor }) => {
    getEditor().updateRoot(args.props);
    return { ok: true };
  },

  getComponent: (args, { getEditor }) => {
    const item = getEditor().getItemById(args.id);
    if (!item) return { error: "not_found", id: args.id };
    return summarizeComponent(item);
  },

  searchComponents: (args, { getEditor }) => {
    const { data } = getEditor().appState;
    const items: ComponentData[] = [];
    for (const node of data.content as ComponentData[]) items.push(node);

    let results = items;
    if (args.type) results = results.filter((c) => c.type === args.type);
    if (args.query) {
      const q = args.query.toLowerCase();
      results = results.filter((c) =>
        JSON.stringify(c.props ?? {})
          .toLowerCase()
          .includes(q)
      );
    }
    return results.map(summarizeComponent);
  },

  updateComponent: (args, { getEditor }) => {
    const editor = getEditor();
    if (!editor.getItemById(args.id)) return { error: "not_found", id: args.id };
    editor.updateProps(args.id, args.props);
    return { ok: true, id: args.id };
  },

  addComponent: (args, { getEditor }) => {
    const editor = getEditor();
    const componentConfig = (
      editor.config.components as Record<string, unknown>
    )[args.type] as { defaultProps?: Record<string, unknown> } | undefined;
    if (!componentConfig) {
      return { error: "unknown_type", type: args.type };
    }

    const id = `${args.type}-${Math.random().toString(36).slice(2, 10)}`;
    const data: ComponentData = {
      type: args.type,
      props: {
        ...(componentConfig.defaultProps ?? {}),
        ...(args.props ?? {}),
        id,
      },
    };

    const result = editor.insertComponent({
      type: args.type,
      parent: toParent(args.parentId, args.slot),
      index: args.index,
      data,
    });
    scrollComponentIntoView(result.id);

    return { ok: true, id: result.id };
  },

  removeComponent: (args, { getEditor }) => {
    const editor = getEditor();
    if (!editor.getItemById(args.id)) return { error: "not_found", id: args.id };
    editor.removeComponent(args.id);
    return { ok: true, id: args.id };
  },

  moveComponent: (args, { getEditor }) => {
    const editor = getEditor();
    if (!editor.getItemById(args.id)) return { error: "not_found", id: args.id };
    editor.moveComponent(args.id, {
      parent: toParent(args.parentId, args.slot),
      index: args.index,
    });
    return { ok: true, id: args.id };
  },
};

export const callBuiltin = async (
  name: string,
  rawArgs: unknown,
  ctx: { getEditor: GetEditor; dispatch: (a: EditorAction) => void }
): Promise<unknown> => {
  if (!(name in schemas)) return undefined; // not a built-in
  const key = name as BuiltinName;
  const parsed = schemas[key].safeParse(rawArgs ?? {});
  if (!parsed.success) {
    return {
      error: "invalid_arguments",
      issues: parsed.error.issues,
    };
  }
  return await (handlers[key] as Handler<BuiltinName>)(parsed.data, ctx);
};
