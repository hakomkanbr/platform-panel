import crypto from "crypto";
import { cookies } from "next/headers";
import { apiPost } from "../api/client";

const KEYCLOAK_ISSUER = process.env.NEXT_PUBLIC_KEYCLOAK_URL!;
const CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!;
const REDIRECT_URI = process.env.KEYCLOAK_REDIRECT_URI!;

console.info("_______ Keycloak Config Start _______");
console.info("KEYCLOAK_ISSUER:", KEYCLOAK_ISSUER);
console.info("CLIENT_ID:", CLIENT_ID);
console.info("REDIRECT_URI:", REDIRECT_URI);
console.info("_______ Keycloak Config End _______");

export interface TokenSet {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  id_token?: string;
}

export function generatePKCE() {
  const codeVerifier = crypto.randomBytes(64).toString("base64url");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");
  return { codeVerifier, codeChallenge };
}

export function getAuthorizationUrl(codeChallenge: string, state: string) {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
  });
  return `${KEYCLOAK_ISSUER}/protocol/openid-connect/auth?${params.toString()}`;
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
): Promise<TokenSet> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    code,
    code_verifier: codeVerifier,
    redirect_uri: REDIRECT_URI,
  });

  const response = await fetch(
    `${KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    },
  );

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${await response.text()}`);
  }

  return response.json();
}

export async function refreshTokens(refreshToken: string): Promise<TokenSet> {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });

  const response = await fetch(
    `${KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    },
  );

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${await response.text()}`);
  }

  return response.json();
}

export async function getUserInfo(accessToken: string) {
  const response = await fetch(
    `${KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!response.ok) return null;
  return response.json();
}

export async function logout(refreshToken: string) {
  await apiPost(`/api/v1/auth/logout`, {
    refresh_token: refreshToken,
  });
}

// export function getAccessToken(): string | undefined {
//   const cookieStore = cookies();
//   return cookieStore.get("access_token")?.value;
// }

// export function getAccessToken() {
//   if (typeof window === "undefined") return null;

//   return (
//     document.cookie
//       .split("; ")
//       .find((c) => c.startsWith("access_token="))
//       ?.split("=")[1] ?? null
//   );
// }

// export function getRefreshToken(): string | undefined {
//   const cookieStore = cookies();
//   return cookieStore.get("refresh_token")?.value;
// }
