import type { Data } from "@frontend/core";
import { Render } from "@frontend/core";

import { config } from "../../editor.config";

export function EditorRender({ data }: { data: Data }) {
  return <Render config={config} data={data} />;
}
