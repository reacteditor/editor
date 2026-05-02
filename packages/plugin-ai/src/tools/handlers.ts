import type { EditorApi, EditorAction, ComponentData } from "@reacteditor/core";
import { z } from "zod";
import { schemas, type BuiltinName } from "./definitions";
import { serializeConfig } from "./schema";

// `useGetEditor()` returns a function that reads the latest API. We accept
// that function so handlers always operate on the freshest state — important
// when several mutations chain inside one assistant turn.
type GetEditor = () => EditorApi;

// Trigger the editor's scrollToComponent command after a mutation. The
// command itself waits for the DOM to commit before measuring scroll
// position, so we don't need to RAF here.
const scrollAfterMutation = (getEditor: GetEditor, id: string) => {
  if (typeof window === "undefined") return;
  getEditor().scrollToComponent(id);
};

const summarizeComponent = (data: ComponentData) => ({
  id: data.props?.id,
  type: data.type,
  props: data.props,
});

const toParent = (parentId?: string, slot?: string) =>
  parentId ? { id: parentId, slot: slot ?? "default-zone" } : undefined;

export type HandlerCtx = {
  getEditor: GetEditor;
  dispatch: (a: EditorAction) => void;
  scrollToComponent: boolean;
};

export type Handler<Name extends BuiltinName> = (
  args: z.infer<(typeof schemas)[Name]>,
  ctx: HandlerCtx
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

  updateComponent: (args, { getEditor, scrollToComponent }) => {
    const editor = getEditor();
    if (!editor.getItemById(args.id)) return { error: "not_found", id: args.id };
    editor.updateProps(args.id, args.props);
    if (scrollToComponent) scrollAfterMutation(getEditor, args.id);
    return { ok: true, id: args.id };
  },

  addComponent: (args, { getEditor, scrollToComponent }) => {
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
    if (scrollToComponent) scrollAfterMutation(getEditor, result.id);

    return { ok: true, id: result.id };
  },

  removeComponent: (args, { getEditor }) => {
    const editor = getEditor();
    if (!editor.getItemById(args.id)) return { error: "not_found", id: args.id };
    editor.removeComponent(args.id);
    return { ok: true, id: args.id };
  },

  moveComponent: (args, { getEditor, scrollToComponent }) => {
    const editor = getEditor();
    if (!editor.getItemById(args.id)) return { error: "not_found", id: args.id };
    editor.moveComponent(args.id, {
      parent: toParent(args.parentId, args.slot),
      index: args.index,
    });
    if (scrollToComponent) scrollAfterMutation(getEditor, args.id);
    return { ok: true, id: args.id };
  },
};

export const callBuiltin = async (
  name: string,
  rawArgs: unknown,
  ctx: HandlerCtx
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
