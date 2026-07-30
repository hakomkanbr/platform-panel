import { SiteSlug } from "@/abstracts/siteSlug";
import siteRequiredPaths from "@/utils/site-required-paths";
import { NextRequest, NextResponse } from "next/server";

export function siteMiddleware(request: NextRequest) {
  const currentSite = request.cookies.get(SiteSlug)?.value;
  const pathname = request.nextUrl.pathname;


  const needsSite = siteRequiredPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (!currentSite && needsSite) {
    return NextResponse.redirect(new URL(`/admin/select-site?next=${pathname}`, request.url));
  }

  return null;
}
