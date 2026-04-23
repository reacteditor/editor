import resolveEditorPath from "../../../lib/resolve-puck-path";
import { Metadata } from "next";
import Client from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ framework: string; uuid: string; puckPath: string[] }>;
}): Promise<Metadata> {
  const { puckPath } = await params;
  const { isEdit, path } = resolveEditorPath(puckPath);

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
  params: Promise<{ framework: string; uuid: string; puckPath: string[] }>;
}) {
  const { puckPath } = await params;
  const { isEdit, path } = resolveEditorPath(puckPath);

  return <Client isEdit={isEdit} path={path} />;
}
