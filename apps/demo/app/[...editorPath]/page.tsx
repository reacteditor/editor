import resolveEditorPath from "../../lib/resolve-editor-path";
import { Metadata } from "next";
import Client from "./client";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ framework: string; uuid: string; editorPath: string[] }>;
}): Promise<Metadata> {
  const { editorPath } = await params;
  const { isEdit, path } = resolveEditorPath(editorPath);

  if (isEdit) {
    return {
      title: "Editing: " + path,
    };
  }

  return {
    title: "",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ framework: string; uuid: string; editorPath: string[] }>;
}) {
  const { editorPath } = await params;
  const { isEdit, path } = resolveEditorPath(editorPath);

  return <Client isEdit={isEdit} path={path} />;
}

export const dynamic = "force-dynamic";
