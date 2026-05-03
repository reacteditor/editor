import type { Data } from "@reacteditor/core";
import { Render } from "@reacteditor/core";

import { config } from "../../editor.config";

export function EditorRender({ data }: { data: Data }) {
  return <Render config={config} data={data} />;
}
