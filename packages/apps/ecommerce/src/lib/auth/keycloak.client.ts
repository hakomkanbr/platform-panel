export function getAccessToken() {
  if (typeof window === "undefined") return null;

  return (
    document.cookie
      .split("; ")
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1] ?? null
  );
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;

  return (
    document.cookie
      .split("; ")
      .find((c) => c.startsWith("refresh_token="))
      ?.split("=")[1] ?? null
  );
}
