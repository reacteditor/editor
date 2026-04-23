import type { Data } from "@puckeditor/core";
import { Render } from "@puckeditor/core";

import { config } from "../../editor.config";

export function EditorRender({ data }: { data: Data }) {
  return <Render config={config} data={data} />;
}
