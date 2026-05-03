import { Metadata } from "next";
import { getRouteProps } from "@/core/rsc";
import { nextjsResolveRoute } from "@/core/nextjs";
import { initialData } from "../../config/initial-data";
import Client from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pageParams?: string[] }>;
}): Promise<Metadata> {
  const resolved = await params;
  const { isEditor, matchRoute } = nextjsResolveRoute(resolved);

  if (isEditor) return { title: `Editing: ${matchRoute}` };

  const props = getRouteProps<{ title?: string }>(initialData, matchRoute);
  return { title: props?.title ?? "" };
}

export default async function Page({
  params,
}: {
  params: Promise<{ pageParams?: string[] }>;
}) {
  const resolved = await params;
  const { route } = nextjsResolveRoute(resolved);
  return <Client currentPath={route} />;
}

export const dynamic = "force-dynamic";
