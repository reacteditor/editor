import { useEffect, useState } from "react";
import config, { componentKey } from "../config";
import { getInitialData } from "../config/initial-data";
import { Metadata, resolveAllData } from "@/core";
import { Components, UserData } from "../config/types";
import { RootProps } from "../config/root";

const isBrowser = typeof window !== "undefined";

/**
 * Legacy helper for the `custom-ui` example. The main demo now drives state
 * through `<App schema>` + onPublish — see `app/[[...pageParams]]`.
 */
export const useDemoData = ({
  path,
  isEdit,
  metadata = {},
}: {
  path: string;
  isEdit: boolean;
  metadata?: Metadata;
}) => {
  const key = `react-editor-demo:${componentKey}:${path}`;

  const [data] = useState<Partial<UserData>>(() => {
    if (isBrowser) {
      const dataStr = localStorage.getItem(key);
      if (dataStr) return JSON.parse(dataStr);
      return getInitialData(path);
    }
  });

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

  return { data, resolvedData, key };
};
