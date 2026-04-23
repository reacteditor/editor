import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const res = NextResponse.next({ request: req });

  if (req.method === "GET") {
    // Rewrite routes that match "/[...editorPath]/edit" to "/editor/[...editorPath]"
    if (req.nextUrl.pathname.endsWith("/edit")) {
      const pathWithoutEdit = req.nextUrl.pathname.slice(
        0,
        req.nextUrl.pathname.length - 5
      );
      const pathWithEditPrefix = `/editor${pathWithoutEdit}`;

      return NextResponse.rewrite(new URL(pathWithEditPrefix, req.url));
    }

    // Disable "/editor/[...editorPath]"
    if (req.nextUrl.pathname.startsWith("/editor")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
}
