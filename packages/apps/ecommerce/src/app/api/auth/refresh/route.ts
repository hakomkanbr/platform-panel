import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/refresh
//
// Each frontend app (admin-platform, tenant-platform, …) is a PUBLIC Keycloak
// client (PKCE, no secret).  The rule is simple:
//   • refresh_token was issued by client X  →  must be refreshed by client X
//   • public client                         →  NO client_secret in the body
//
// The frontend passes its own client_id in the request body so this single
// route works for every app without any server-side configuration change.
// ─────────────────────────────────────────────────────────────────────────────

const KEYCLOAK_ISSUER = process.env.KEYCLOAK_ISSUER!;

// Allowlist of client IDs permitted to use this refresh endpoint.
// Add new public clients here as the platform grows.
const ALLOWED_CLIENT_IDS = new Set([
  "admin-platform",
  "tenant-platform",
  // 'mobile-app',
  // 'partner-portal',
]);

export async function POST(request: Request) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  // ── Read client_id sent by the frontend ──────────────────────────────────
  let clientId: string | undefined;
  try {
    const body = await request.json();
    clientId = body?.clientId;
  } catch {
    // body is not JSON or empty
  }

  console.info("clientId : ", clientId);

  // Fall back to env var so existing code keeps working
  if (!clientId) {
    clientId = process.env.KEYCLOAK_CLIENT_ID;
    console.info(
      "process.env.KEYCLOAK_CLIENT_ID : ",
      process.env.KEYCLOAK_CLIENT_ID,
    );
  }

  console.info("ALLOWED_CLIENT_IDS : ", ALLOWED_CLIENT_IDS);

  // ── Validate against allowlist ────────────────────────────────────────────
  if (!clientId || !ALLOWED_CLIENT_IDS.has(clientId)) {
    return NextResponse.json({ error: "Invalid client" }, { status: 400 });
  }

  // ── Refresh with Keycloak ─────────────────────────────────────────────────
  try {
    const form = JSON.stringify({
      // client_id: clientId, // public client — no secret
      // grant_type: "refresh_token",
      refreshToken: refreshToken,
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_GATEWAY_URL}/api/v1/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: form,
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error(
        `Keycloak refresh failed for client ${clientId}:`,
        response.status,
        error,
      );

      const res = NextResponse.json(
        { error: "Session expired" },
        { status: 401 },
      );
      res.cookies.delete("access_token");
      res.cookies.delete("refresh_token");
      res.cookies.delete("kcToken");
      return res;
    }

    // 1. Parse the JSON
    const jsonResponse = await response.json();

    // 2. Safely check if the gateway returned success: true
    if (!jsonResponse.success || !jsonResponse.data) {
      return NextResponse.json(
        { error: "Invalid token response format" },
        { status: 401 },
      );
    }

    // 3. Extract the tokens from the 'data' object
    const tokens = jsonResponse.data;

    // 4. Use camelCase 'expiresIn'
    const res = NextResponse.json({ ok: true, expiresIn: tokens.expiresIn });

    const cookieBase = {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    };

    // 5. Update property names to use camelCase (accessToken, refreshToken)
    res.cookies.set("access_token", tokens.accessToken, {
      ...cookieBase,
      httpOnly: true,
      maxAge: tokens.expiresIn,
    });

    res.cookies.set("refresh_token", tokens.refreshToken, {
      ...cookieBase,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    res.cookies.set("kcToken", tokens.accessToken, {
      ...cookieBase,
      httpOnly: false,
      maxAge: tokens.expiresIn ?? 3600,
    });

    return res;
  } catch (err) {
    console.error("Refresh route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
