import { Editor, type Data, type Config } from "@frontend/core";
import styles from "@frontend/core/frontend.css";
import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import invariant from "tiny-invariant";

import editorConfig from "~/editor.config";
import { getPage, setPage } from "~/models/page.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const editorPath = params.editorPath || "/";
  const formData = await request.formData();
  const editorData = formData.get("editorData");

  invariant(editorData, "Missing data");
  invariant(typeof editorData === "string", "Invalid data");

  setPage(editorPath, JSON.parse(editorData));

  return json({ ok: true });
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles, id: "editor-css" },
];

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const editorPath = params.editorPath || "/";
  const initialData = getPage(editorPath) || {
    content: [],
    root: {},
  };
  return json({ editorPath, initialData });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.initialData?.root?.props?.title || "Untitled page";

  return [{ title: `Editing: ${title}` }];
};

export default function Edit() {
  const { initialData } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  return (
    <Editor
      config={editorConfig as Config}
      data={initialData}
      onPublish={async (data: Data) => {
        // Use form data here because it's the usual remix way.
        let formData = new FormData();
        formData.append("editorData", JSON.stringify(data));
        submit(formData, { method: "post" });
      }}
    />
  );
}
