import { Plugin } from "@/core/types";
import { useEffect } from "react";

const DEFAULT_CDN_URL = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";
const SCRIPT_ID = "frontend-tailwind-cdn";

type TailwindCdnPluginOptions = {
  src?: string;
};

const createTailwindCdnPlugin = (
  options: TailwindCdnPluginOptions = {}
): Plugin => {
  const src = options.src ?? DEFAULT_CDN_URL;

  return {
    overrides: {
      iframe: ({ children, document }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (!document) return;

          if (document.getElementById(SCRIPT_ID)) return;

          const script = document.createElement("script");
          script.id = SCRIPT_ID;
          script.src = src;
          document.head.appendChild(script);
        }, [document]);

        return <>{children}</>;
      },
    },
  };
};

export default createTailwindCdnPlugin;
