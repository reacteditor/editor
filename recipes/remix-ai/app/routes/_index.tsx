import { Render, type Config } from "@puckeditor/core";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import editorConfig from "~/editor.config";
import { getPage } from "~/models/page.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  // Get path, and default to slash for root path.
  const editorPath = params.editorPath || "/";
  // Get editorData for this path, this could be a database call.
  const editorData = getPage(editorPath);
  if (!editorData) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  // Return the data.
  return json({ editorData });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.editorData?.root?.props?.title || "Page";

  return [{ title }];
};

export default function Page() {
  const { editorData } = useLoaderData<typeof loader>();

  return <Render config={editorConfig as Config} data={editorData} />;
}
