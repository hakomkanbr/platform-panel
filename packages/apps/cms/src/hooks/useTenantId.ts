"use client";

import { useMemo } from "react";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : undefined;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function useTenantId(): string | undefined {
  return useMemo(() => {
    const token = getCookie("AuthToken") || getCookie("kcToken") || getCookie("access_token");
    if (!token) return undefined;
    const payload = decodeJwtPayload(token);
    return (payload?.tenant_id as string) || undefined;
  }, []);
}
