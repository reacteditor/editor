import { useFetcher, useLoaderData } from "react-router";
import type { Data } from "@reacteditor/core";
import { Editor, Render } from "@reacteditor/core";

import type { Route } from "./+types/editor-splat";
import { config } from "../../editor.config";
import { resolveEditorPath } from "~/lib/resolve-editor-path.server";
import { getPage, savePage } from "~/lib/pages.server";
import editorStyles from "@reacteditor/core/react-editor.css?url";

export async function loader({ params }: Route.LoaderArgs) {
  const pathname = params["*"] ?? "/";
  const { isEditorRoute, path } = resolveEditorPath(pathname);
  let page = await getPage(path);

  // Throw a 404 if we're not rendering the editor and data for the page does not exist
  if (!isEditorRoute && !page) {
    throw new Response("Not Found", { status: 404 });
  }

  // Empty shell for new pages
  if (isEditorRoute && !page) {
    page = {
      content: [],
      root: {
        props: {
          title: "",
        },
      },
    };
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
      title: loaderData.isEditorRoute
        ? `Edit: ${loaderData.path}`
        : loaderData.data.root.props?.title ?? "",
    },
  ];
}

export async function action({ params, request }: Route.ActionArgs) {
  const pathname = params["*"] ?? "/";
  const { path } = resolveEditorPath(pathname);
  const body = (await request.json()) as { data: Data };

  await savePage(path, body.data);
}

function Editor() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  return (
    <>
      <link rel="stylesheet" href={editorStyles} id="editor-css" />
      <Editor
        config={config}
        data={loaderData.data}
        onPublish={async (data) => {
          await fetcher.submit(
            {
              data,
            },
            {
              action: "",
              method: "post",
              encType: "application/json",
            }
          );
        }}
      />
    </>
  );
}

export default function EditorSplatRoute({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      {loaderData.isEditorRoute ? (
        <Editor />
      ) : (
        <Render config={config} data={loaderData.data} />
      )}
    </div>
  );
}
