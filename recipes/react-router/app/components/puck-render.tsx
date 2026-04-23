import type { Data } from "@frontendai/react-editor";
import { Render } from "@frontendai/react-editor";

import { config } from "../../editor.config";

export function EditorRender({ data }: { data: Data }) {
  return <Render config={config} data={data} />;
}
