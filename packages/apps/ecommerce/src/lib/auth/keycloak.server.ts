import { cookies } from "next/headers";

export function getAccessToken() {
  return cookies().get("access_token")?.value;
}

export function getRefreshToken(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get("refresh_token")?.value;
}
