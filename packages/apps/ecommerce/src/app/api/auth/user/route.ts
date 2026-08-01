import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function parseJwt(token: string): any {
  try {
    const base64Payload = token.split(".")[1];

    const payload = Buffer.from(base64Payload, "base64").toString("utf8");

    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function extractRoles(payload: any): string[] {
  const realmRoles = payload?.realm_access?.roles || [];

  const resourceRoles = Object.values(payload?.resource_access || {}).flatMap(
    (client: any) => client?.roles || [],
  );

  const allRoles = realmRoles.concat(resourceRoles);

  return allRoles.filter(
    (role: string, index: number) => allRoles.indexOf(role) === index,
  );
}

export async function GET() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.info("Access Token:", accessToken);

    const payload = parseJwt(accessToken);

    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const roles = extractRoles(payload);

    console.info("JWT Payload:", payload);
    console.info("Extracted Roles:", roles);

    return NextResponse.json({
      id: payload.sub || "",
      token: accessToken,
      refreshToken: cookieStore.get("refresh_token")?.value || "",
      username: payload.preferred_username || "",
      email: payload.email || "",
      firstName: payload.given_name || "",
      lastName: payload.family_name || "",
      fullName: payload.name || "",
      emailVerified: payload.email_verified || false,
      roles,
    });
  } catch (error) {
    console.error("Auth User API Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
