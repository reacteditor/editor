import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { Config, Field, Fields } from "@reacteditor/core";

const fieldToZod = (field: Field): z.ZodTypeAny => {
  switch (field.type) {
    case "text":
    case "textarea":
    case "richtext":
      return z.string();
    case "number":
      return z.number();
    case "select":
    case "radio": {
      const values = (field as { options: { value: unknown }[] }).options.map(
        (o) => o.value
      );
      return z.union(values.map((v) => z.literal(v as never)) as never);
    }
    case "array": {
      const itemFields = (field as { arrayFields: Fields }).arrayFields;
      return z.array(fieldsToZod(itemFields));
    }
    case "object": {
      const objectFields = (field as { objectFields: Fields }).objectFields;
      return fieldsToZod(objectFields);
    }
    case "external":
    case "custom":
      return z.unknown();
    case "slot":
      // Slots hold child components — model edits children via dedicated
      // addComponent / moveComponent tools, not by writing a slot prop.
      return z.unknown().optional();
    default:
      return z.unknown();
  }
};

export const fieldsToZod = (fields: Fields) => {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const [name, field] of Object.entries(fields)) {
    shape[name] = fieldToZod(field as Field).optional();
  }
  return z.object(shape);
};

export type SerializedConfig = {
  components: Record<
    string,
    {
      label?: string;
      category?: string;
      defaultProps?: Record<string, unknown>;
      propsSchema: unknown;
    }
  >;
  root?: {
    defaultProps?: Record<string, unknown>;
    propsSchema: unknown;
  };
  categories?: Record<string, { title?: string; components?: string[] }>;
};

export const serializeConfig = (config: Config): SerializedConfig => {
  const components: SerializedConfig["components"] = {};
  for (const [type, comp] of Object.entries(config.components ?? {})) {
    const fields = (comp as { fields?: Fields }).fields ?? {};
    components[type] = {
      label: (comp as { label?: string }).label,
      category: (comp as { category?: string }).category,
      defaultProps: (comp as { defaultProps?: Record<string, unknown> })
        .defaultProps,
      propsSchema: zodToJsonSchema(fieldsToZod(fields)),
    };
  }

  const rootFields = (config.root as { fields?: Fields } | undefined)?.fields;
  const root = rootFields
    ? {
        defaultProps: (
          config.root as { defaultProps?: Record<string, unknown> } | undefined
        )?.defaultProps,
        propsSchema: zodToJsonSchema(fieldsToZod(rootFields)),
      }
    : undefined;

  return { components, root, categories: config.categories as never };
};
