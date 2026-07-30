import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:5000";

const REFRESH_URL = "/api/auth/refresh";
const CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "tenant-dashboard";

let apiClient: AxiosInstance | null = null;
let isRefreshing = false;
let pendingRequests: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

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

function extractTenantId(): string | undefined {
  const token = getCookie("kcToken") || getCookie("AuthToken") || getCookie("access_token");
  if (!token) return undefined;
  const payload = decodeJwtPayload(token);
  return (payload?.tenant_id as string) || undefined;
}

async function attemptTokenRefresh(): Promise<string | null> {
  try {
    const res = await fetch(REFRESH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: CLIENT_ID }),
      credentials: "include",
    });
    if (!res.ok) return null;
    return getCookie("kcToken") || getCookie("AuthToken") || null;
  } catch {
    return null;
  }
}

function onRefreshed(token: string) {
  pendingRequests.forEach((p) => p.resolve(token));
  pendingRequests = [];
}

function onRefreshFailed(error: unknown) {
  pendingRequests.forEach((p) => p.reject(error));
  pendingRequests = [];
}

export const getGatewayClient = (): AxiosInstance => {
  if (apiClient) return apiClient;

  apiClient = axios.create({
    baseURL: GATEWAY_URL,
    headers: {
      "Content-Type": "application/json",
      "X-Correlation-Id":
        typeof crypto !== "undefined"
          ? crypto.randomUUID?.() || Date.now().toString(36)
          : Date.now().toString(36),
      "X-Tenant-Id": "NO_TENANT_ID",
    },
    timeout: 30000,
    withCredentials: true,
  });

  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== "undefined") {
        const token = getCookie("kcToken") || getCookie("AuthToken") || getCookie("access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        const tenantId = extractTenantId();
        if (tenantId) {
          config.headers["X-Tenant-Id"] = tenantId;
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      if (!error.response || !originalRequest) return Promise.reject(error);
      const { status } = error.response;

      if (status === 404) {
        const data = error.response.data as { error?: { code?: string } };
        if (data?.error?.code === "NO_SUBSCRIPTION") {
          return Promise.reject(new Error("No active subscription"));
        }
      }

      if (status !== 401 || originalRequest._retry) return Promise.reject(error);

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient!(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await attemptTokenRefresh();
        if (!newToken) {
          isRefreshing = false;
          onRefreshFailed(error);
          return Promise.reject(new Error("Session expired. Please login again."));
        }
        isRefreshing = false;
        onRefreshed(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient!(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshFailed(refreshError);
        return Promise.reject(refreshError);
      }
    },
  );

  return apiClient;
};
