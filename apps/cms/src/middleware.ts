import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./middleware/auth";
import { siteMiddleware } from "./middleware/site";
import { roleMiddleware } from "./middleware/role";

export function middleware(request: NextRequest) {
  return (
    authMiddleware(request) ||
    siteMiddleware(request) ||
    roleMiddleware(request) ||
    NextResponse.next()
  );
}

// حدد المسارات التي تريد حماية middleware لها
export const config = {
  matcher: ["/admin/:path*", "/auth/login", "/admin/select-project"],
};
