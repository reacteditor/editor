/**
 * This file implements a *magic* catch-all route that renders the Editor editor.
 *
 * This route exposes /editor/[...editorPath], but is disabled by middleware.ts. The middleware
 * then rewrites all URL requests ending in `/edit` to this route, allowing you to visit any
 * page in your application and add /edit to the end to spin up a Editor editor.
 *
 * This approach enables public pages to be statically rendered whilst the /editor route can
 * remain dynamic.
 *
 * NB this route is public, and you will need to add authentication
 */

import "@puckeditor/core/editor.css";
import "@puckeditor/plugin-ai/styles.css";
import { Client } from "./client";
import { Metadata } from "next";
import { getPage } from "../../../lib/get-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ editorPath: string[] }>;
}): Promise<Metadata> {
  const { editorPath = [] } = await params;
  const path = `/${editorPath.join("/")}`;

  return {
    title: "Editor: " + path,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ editorPath: string[] }>;
}) {
  const { editorPath = [] } = await params;
  const path = `/${editorPath.join("/")}`;
  const data = getPage(path);

  return <Client path={path} data={data || {}} />;
}

export const dynamic = "force-dynamic";
