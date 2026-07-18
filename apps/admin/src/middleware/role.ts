import { NextRequest, NextResponse } from "next/server";

export function roleMiddleware(request: NextRequest) {
  const role = request.cookies.get("role")?.value;
  const pathname = request.nextUrl.pathname;

  // مثال: صفحات معينة تحتاج دور Admin فقط
  if (pathname.startsWith("/admin/settings") && role !== "Admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return null;
}
