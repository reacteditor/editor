// Bare verb phrases. The "..." suffix is appended at render time only while
// the tool call is in flight, so the same string serves both states:
//   active:    "Update component..."
//   completed: "Update component"
export const DEFAULT_LABELS: Record<string, string> = {
  getConfig: "Read config",
  getSchema: "Read schema",
  updateSchema: "Update schema",
  updateRootProps: "Update root props",
  getComponent: "Read component",
  searchComponents: "Search components",
  updateComponent: "Update component",
  addComponent: "Add component",
  removeComponent: "Remove component",
  moveComponent: "Move component",
};

export const humanize = (name: string) =>
  name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

export const labelFor = (name: string, _args?: unknown, done = false) => {
  const base = DEFAULT_LABELS[name] ?? humanize(name);
  return done ? base : `${base}...`;
};
