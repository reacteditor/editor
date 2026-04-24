import type { ComponentType, ReactNode } from "react";
import type { Field, Fields } from "../types/Fields";

// Map a single field's schema entry to its resolved-at-render type.
// Slot fields become ReactNode (the editor resolves the slot to children).
// Other field types expose whatever value they carry at runtime.
type InferFieldValue<F> = F extends { type: "slot" }
  ? ReactNode
  : F extends { type: "text" | "textarea" | "richtext" }
    ? string
    : F extends { type: "number" }
      ? number
      : F extends { type: "select" | "radio"; options: infer O }
        ? O extends ReadonlyArray<{ value: infer V }>
          ? V
          : string
        : F extends { type: "array"; arrayFields: Record<string, any>; default?: infer D }
          ? D extends ReadonlyArray<infer _>
            ? D
            : Record<string, unknown>[]
          : F extends { type: "object"; default?: infer D }
            ? D
            : F extends { type: "external" | "custom"; default?: infer D }
              ? D
              : unknown;

type RenderProps<F extends Fields<any, any>> = {
  [K in keyof F]: InferFieldValue<F[K]>;
};

export type ComponentDef<F extends Fields<any, any> = Fields<any, any>> = {
  name: string;
  fields: F;
  render: (props: RenderProps<F>) => ReactNode;
  global?: boolean;
  contentEditable?: boolean;
  label?: string;
  // Pass-through hooks from the existing ComponentConfig surface.
  // Typed loosely here; the reducer still consumes them via the registered
  // component's statics at runtime.
  resolveFields?: (data: any, params: any) => any;
  resolveData?: (data: any, params: any) => any;
  permissions?: Record<string, boolean>;
  resolvePermissions?: (data: any, params: any) => any;
  metadata?: Record<string, unknown>;
  inline?: boolean;
};

export type RegisteredComponent<F extends Fields<any, any> = Fields<any, any>> =
  ComponentType<RenderProps<F>> & {
    displayName: string;
    fields: F;
    __isEditorComponent: true;
  } & Omit<ComponentDef<F>, "name" | "fields" | "render">;

// Factory: produces a React function component with editor metadata attached.
// Calling <Hero title="..."/> at render time invokes `render` with the
// resolved props; the editor reads Hero.fields to know what's configurable.
export function component<F extends Fields<any, any>>(
  def: ComponentDef<F>
): RegisteredComponent<F> {
  const Component = ((props: RenderProps<F>) => def.render(props)) as RegisteredComponent<F>;
  Component.displayName = def.name;
  Component.fields = def.fields;
  Component.__isEditorComponent = true;

  if (def.global !== undefined) Component.global = def.global;
  if (def.contentEditable !== undefined) Component.contentEditable = def.contentEditable;
  if (def.label !== undefined) Component.label = def.label;
  if (def.resolveFields) Component.resolveFields = def.resolveFields;
  if (def.resolveData) Component.resolveData = def.resolveData;
  if (def.permissions) Component.permissions = def.permissions;
  if (def.resolvePermissions) Component.resolvePermissions = def.resolvePermissions;
  if (def.metadata) Component.metadata = def.metadata;
  if (def.inline !== undefined) Component.inline = def.inline;

  return Component;
}

export function isRegisteredComponent(value: unknown): value is RegisteredComponent {
  return (
    typeof value === "function" &&
    (value as { __isEditorComponent?: boolean }).__isEditorComponent === true
  );
}
