import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export interface AuthMiddlewareOptions {
  publicPaths?: string[];
  matcher?: string[];
  loginPath?: string;
}

export function createAuthMiddleware(options: AuthMiddlewareOptions = {}) {
  const {
    publicPaths = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/verify-email",
      "/login",
      "/",
      "/api/auth/callback",
    ],
    loginPath = "/no_auth",
  } = options;

  return async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("access_token")?.value;

    const isPublic = publicPaths.some(
      (p) => pathname === p || pathname.startsWith(p),
    );
    const isApiAuth = pathname.startsWith("/api/auth/");
    const isStatic =
      pathname.startsWith("/_next") || pathname.startsWith("/favicon");

    if (isPublic || isApiAuth || isStatic) {
      return NextResponse.next();
    }

    if (!accessToken && pathname.startsWith("/tenant")) {
      const loginUrl = new URL(loginPath, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  };
}

export const config = {
  matcher: ["/((?!_next|favicon|api/auth).*)"],
};
