import { ReactNode } from "react";
import { ComponentDataOptionalId } from "./Data";
import { DefaultComponents } from "./Config";

type BlockCommon = {
  label: string;
  icon?: ReactNode;
  category?: string;
};

type BlockShorthand<C extends DefaultComponents> = {
  [K in keyof C]: BlockCommon & {
    component: K;
    props?: Partial<C[K]>;
    content?: never;
  };
}[keyof C];

type BlockComposite = BlockCommon & {
  content: ComponentDataOptionalId | ComponentDataOptionalId[];
  component?: never;
  props?: never;
};

export type Block<C extends DefaultComponents = DefaultComponents> =
  | BlockShorthand<C>
  | BlockComposite;

export type BlockMap<C extends DefaultComponents = DefaultComponents> = Record<
  string,
  Block<C>
>;
