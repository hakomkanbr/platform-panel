export function getAccessToken() {
  if (typeof window === "undefined") return null;

  const readCookie = (name: string) =>
    document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${name}=`))
      ?.split("=")[1] ?? null;

  return (
    readCookie("access_token") ||
    readCookie("kcToken") ||
    readCookie("AuthToken") ||
    null
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
