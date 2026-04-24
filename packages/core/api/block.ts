import type { ReactNode } from "react";

export type Block = {
  label: string;
  icon?: ReactNode;
  category?: string;
  // JSX snippet — parsed via @babel/parser when the block is dropped onto
  // the canvas. Must have a single root element (wrap siblings in <>...</>).
  jsx: string;
};

export function block(def: Block): Block {
  return def;
}
