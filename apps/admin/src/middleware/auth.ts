import { NextRequest, NextResponse } from "next/server";

export function authMiddleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const pathname = request.nextUrl.pathname;

  const isLoginPage = pathname === "/auth/login";
  const isProtected = pathname.startsWith("/admin");

  // إذا المستخدم لا يملك توكن ويحاول دخول /admin → أعد توجيهه إلى /login
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return null; // استمر إلى middleware التالي
}
