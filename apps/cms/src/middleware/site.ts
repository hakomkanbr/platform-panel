import siteRequiredPaths from "@/utils/site-required-paths";
import { NextRequest, NextResponse } from "next/server";

const PROJECT_ID_COOKIE = "ProjectId";

export function siteMiddleware(request: NextRequest) {
  const currentProjectId = request.cookies.get(PROJECT_ID_COOKIE)?.value;
  const pathname = request.nextUrl.pathname;

  const needsProject = siteRequiredPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (!currentProjectId && needsProject) {
    return NextResponse.redirect(new URL(`/admin/select-project?next=${pathname}`, request.url));
  }

  return null;
}
