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
  const route = nextjsResolveRoute(resolved);
  const isEdit = route === "/editor" || route.startsWith("/editor/");
  const props = getRouteProps<{ title?: string }>(initialData, route);

  if (isEdit) {
    const editingRoute = route === "/editor" ? "/" : route.slice("/editor".length);
    return { title: `Editing: ${editingRoute}` };
  }
  return { title: props?.title ?? "" };
}

export default async function Page({
  params,
}: {
  params: Promise<{ pageParams?: string[] }>;
}) {
  const resolved = await params;
  const currentRoute = nextjsResolveRoute(resolved);
  return <Client currentRoute={currentRoute} />;
}

export const dynamic = "force-dynamic";
