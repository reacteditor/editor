import type { Route } from "./+types/_index";
import { EditorRender } from "~/components/puck-render";
import { resolveEditorPath } from "~/lib/resolve-puck-path.server";
import { getPage } from "~/lib/pages.server";

export async function loader() {
  const { isEditorRoute, path } = resolveEditorPath("/");
  let page = await getPage(path);

  if (!page) {
    throw new Response("Not Found", { status: 404 });
  }

  return {
    isEditorRoute,
    path,
    data: page,
  };
}

export function meta({ data: loaderData }: Route.MetaArgs) {
  return [
    {
      title: loaderData.data.root.props?.title ?? "",
    },
  ];
}

export default function EditorSplatRoute({ loaderData }: Route.ComponentProps) {
  return <EditorRender data={loaderData.data} />;
}
