import { Field, Fields } from "../types/Fields";

/**
 * Computes an initial value for a single field, recursively resolving
 * nested object/array/slot structures. Explicit `default` wins over the
 * per-field-type fallback.
 */
export function resolveFieldDefault(field: Field): any {
  switch (field.type) {
    case "text":
    case "textarea":
      return field.default ?? "";

    case "number":
      return field.default ?? 0;

    case "select":
    case "radio": {
      if (field.default !== undefined) return field.default;
      const first = field.options?.[0];
      return first ? first.value : undefined;
    }

    case "object": {
      if (field.default !== undefined) return field.default;
      const out: Record<string, any> = {};
      for (const [name, sub] of Object.entries(field.objectFields)) {
        out[name] = resolveFieldDefault(sub as Field);
      }
      return out;
    }

    case "array":
      return field.default ?? [];

    case "slot":
      return [];

    case "external":
    case "custom":
    case "richtext":
      return null;

    default:
      return undefined;
  }
}

/**
 * Computes the per-item template used when a new row is appended to
 * an array field — one object where each sub-field is seeded from its
 * own `default` (or the per-type fallback).
 */
export function resolveArrayItemTemplate(
  arrayFields: Record<string, Field>
): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [name, sub] of Object.entries(arrayFields)) {
    out[name] = resolveFieldDefault(sub);
  }
  return out;
}

/**
 * Computes the initial props object for a component from its `fields`
 * schema. Drives "zero-conf instance of type X" for block inserts and
 * any programmatic insert path that doesn't supply full props.
 */
export function resolveFieldDefaults(
  fields: Fields | undefined
): Record<string, any> {
  if (!fields) return {};
  const out: Record<string, any> = {};
  for (const [name, field] of Object.entries(fields)) {
    out[name] = resolveFieldDefault(field as Field);
  }
  return out;
}
