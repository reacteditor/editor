import { useRef } from "react";
import { deepEqual } from "fast-equals";

/**
 * Returns a structurally-stable reference. Updates only when `value` deep-changes,
 * so referentially-fresh-but-content-equal objects don't re-trigger downstream memos.
 *
 * Used inside `<AppProvider>` so that users passing inline `pages={{ ... }}` don't
 * re-compile the route table on every parent render.
 */
export const useStableValue = <T,>(value: T): T => {
  const ref = useRef<T>(value);
  if (!deepEqual(ref.current, value)) {
    ref.current = value;
  }
  return ref.current;
};
