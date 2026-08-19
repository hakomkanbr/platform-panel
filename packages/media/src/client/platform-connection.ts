import axios from "axios";
import type { CdnConnection } from "../types";

export interface TokenSource {
  getAccessToken: () => string | null;
}

/** Reads the auth token from cookies or browser storage. */
function defaultTokenSource(): string | null {
  if (typeof window === "undefined") return null;
  const readCookie = (name: string) =>
    document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${name}=`))
      ?.split("=")[1] ?? null;

  const cookieToken =
    readCookie("access_token") ||
    readCookie("accessToken") ||
    readCookie("kcToken") ||
    readCookie("AuthToken") ||
    readCookie("token");

  if (cookieToken) return decodeURIComponent(cookieToken);

  try {
    const storageToken =
      sessionStorage.getItem("access_token") ||
      sessionStorage.getItem("accessToken") ||
      sessionStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token");
    if (storageToken) return storageToken;
  } catch {}

  return null;
}

export interface CdnConnectionOptions {
  /** Platform API base URL. Defaults to NEXT_PUBLIC_GATEWAY_URL ?? NEXT_PUBLIC_API_URL ?? localhost:5000. */
  platformBaseUrl?: string;
  /** Custom token source (used in tests or non-browser contexts). */
  tokenSource?: TokenSource;
}

const DEFAULT_PLATFORM_URL =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_GATEWAY_URL || process.env.NEXT_PUBLIC_API_URL)) ||
  "http://localhost:5000";

export class CdnConnectionError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "CdnConnectionError";
  }
}

/**
 * Fetches (and lazily provisions) the CDN connection for a platform project.
 * The API key is scoped to the project and is only ever issued after the
 * platform confirms the project belongs to the authenticated tenant.
 */
export async function fetchCdnConnection(
  projectId: string,
  options: CdnConnectionOptions = {},
): Promise<CdnConnection> {
  const baseUrl = (options.platformBaseUrl ?? DEFAULT_PLATFORM_URL).replace(/\/$/, "");
  const token = options.tokenSource ? options.tokenSource.getAccessToken() : defaultTokenSource();

  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await axios.get(`${baseUrl}/api/v1/cdn/connections/${projectId}`, {
    headers,
    withCredentials: true,
  });

  const body = res.data;
  if (res.status !== 200 || !body || body.success === false) {
    throw new CdnConnectionError(res.status, body?.message ?? "Failed to load CDN connection.");
  }

  // Handle both { data: CdnConnection } and raw CdnConnection
  const conn = body.data ?? body;
  return conn as CdnConnection;
}

export { DEFAULT_PLATFORM_URL };