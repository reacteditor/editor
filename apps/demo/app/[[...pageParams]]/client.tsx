"use client";

import {
  AutoField,
  Editor,
  FieldLabel,
  blocksPlugin,
  outlinePlugin,
} from "@/core";
import config, { componentKey } from "../../config";
import { initialData } from "../../config/initial-data";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MemoryRouter } from "react-router";
import { Type } from "lucide-react";
import type { UserData } from "../../config/types";

const STORAGE_KEY = `react-editor-demo:${componentKey}`;

const plugins = [blocksPlugin(), outlinePlugin()];

export function Client() {
  const [data, setData] = useState<UserData | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setData(stored ? (JSON.parse(stored) as UserData) : initialData);
  }, []);

  const handlePublish = useCallback((next: UserData) => {
    setData(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const searchParams = useSearchParams();
  const metadata = useMemo(() => ({ example: "Hello, world" }), []);

  if (!data) return null;

  return (
    <MemoryRouter initialEntries={["/"]}>
      <Editor
        config={config}
        data={data}
        onPublish={handlePublish}
        plugins={plugins}
        metadata={metadata}
        iframe={{
          enabled: searchParams.get("disableIframe") === "true" ? false : true,
        }}
        fieldTransforms={{
          userField: ({ value }) => value,
        }}
        overrides={{
          fieldTypes: {
            userField: ({ readOnly, field, name, value, onChange }) => (
              <FieldLabel
                label={field.label || name}
                readOnly={readOnly}
                icon={<Type size={16} />}
              >
                <AutoField
                  field={{ type: "text" }}
                  onChange={onChange}
                  value={value}
                />
              </FieldLabel>
            ),
          },
        }}
      />
    </MemoryRouter>
  );
}

export default Client;
