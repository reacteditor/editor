import { useEffect, useState } from "react";
import config, { componentKey } from "../config";
import { getInitialData, initialData } from "../config/initial-data";
import { GlobalData, Metadata, resolveAllData } from "@/core";
import { Components, UserData } from "../config/types";
import { RootProps } from "../config/root";

const isBrowser = typeof window !== "undefined";

export const useDemoData = ({
  path,
  isEdit,
  metadata = {},
}: {
  path: string;
  isEdit: boolean;
  metadata?: Metadata;
}) => {
  // unique b64 key that updates each time we add / remove components
  const key = `react-editor-demo:${componentKey}:${path}`;
  // Globals are shared across all pages — one key, no path.
  const globalsKey = `react-editor-demo-globals:${componentKey}`;

  const [data] = useState<Partial<UserData>>(() => {
    if (isBrowser) {
      const dataStr = localStorage.getItem(key);

      if (dataStr) {
        return JSON.parse(dataStr);
      }

      return getInitialData(path);
    }
  });

  const [globalData, setGlobalData] = useState<GlobalData>(() => {
    if (!isBrowser) return {};
    const stored = localStorage.getItem(globalsKey);
    return stored ? JSON.parse(stored) : {};
  });

  // Normally this would happen on the server, but we can't
  // do that because we're using local storage as a database
  const [resolvedData, setResolvedData] = useState<Partial<UserData>>(data);

  useEffect(() => {
    if (data && !isEdit) {
      resolveAllData<Components, RootProps>(data, config, metadata).then(
        setResolvedData
      );
    }
  }, [data, isEdit]);

  useEffect(() => {
    if (!isEdit) {
      const title = data?.root?.props?.title || data?.root?.title;
      document.title = title || "";
    }
  }, [data, isEdit]);

  return { data, resolvedData, globalData, setGlobalData, key, globalsKey };
};
