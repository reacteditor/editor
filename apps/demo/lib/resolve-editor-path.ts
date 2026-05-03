/**
 * Legacy helper for the `custom-ui` example. The main demo now uses
 * `nextjsResolveRoute` from `@reacteditor/core/nextjs` together with
 * `<App editorPath="/editor" />` — see `app/[[...pageParams]]`.
 */
const resolveEditorPath = (editorPath: string[] = []) => {
  const hasPath = editorPath.length > 0;
  const isEdit = hasPath ? editorPath[editorPath.length - 1] === "edit" : false;
  return {
    isEdit,
    path: `/${(isEdit
      ? [...editorPath].slice(0, editorPath.length - 1)
      : [...editorPath]
    ).join("/")}`,
  };
};

export default resolveEditorPath;
