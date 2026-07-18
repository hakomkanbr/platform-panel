import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { AuthClient, LoginResponse, SessionResponse } from "../../types/client";

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:5000";
const REFRESH_URL = "/api/v1/auth/refresh"; // Identity API refresh endpoint

let apiClient: AxiosInstance | null = null;
let isRefreshing = false;
let pendingRequests: Array<{
  resolve: () => void;
  reject: (err: unknown) => void;
}> = [];

function redirectToLogin(): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    // Let the application route guards handle the actual redirect, or emit an event
  }
}

async function attemptTokenRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${GATEWAY_URL}${REFRESH_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
      credentials: "include", // This will send the HttpOnly refresh_token cookie
    });
    return res.ok;
  } catch {
    return false;
  }
}

function onRefreshed() {
  pendingRequests.forEach((p) => p.resolve());
  pendingRequests = [];
}

function onRefreshFailed(error: unknown) {
  pendingRequests.forEach((p) => p.reject(error));
  pendingRequests = [];
}

export const getApiClient = (): AxiosInstance => {
  if (apiClient) return apiClient;

  apiClient = axios.create({
    baseURL: GATEWAY_URL,
    headers: {
      "Content-Type": "application/json",
      "X-Correlation-Id":
        typeof crypto !== "undefined"
          ? crypto.randomUUID?.() || Date.now().toString(36)
          : Date.now().toString(36),
    },
    timeout: 30000,
  });

  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== "undefined") {
        const cookie = document.cookie.split("; ").find((c) => c.startsWith("access_token="));
        const token = cookie?.slice("access_token=".length);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(formatError(error)),
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (!error.response || !originalRequest) {
        return Promise.reject(formatError(error));
      }

      const { status } = error.response;

      if (status !== 401 || originalRequest._retry) {
        const handledError = handleApiError(error);
        return Promise.reject(handledError);
      }

      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        }).then(() => {
          return apiClient!(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const success = await attemptTokenRefresh();

        if (!success) {
          isRefreshing = false;
          onRefreshFailed(error);
          redirectToLogin();
          return Promise.reject(
            new Error("Session expired. Please login again."),
          );
        }

        isRefreshing = false;
        onRefreshed();
        return apiClient!(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshFailed(refreshError);
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    },
  );

  return apiClient;
};

const handleApiError = (error: AxiosError): Error => {
  if (!error.response)
    return new Error("Network error. Check your connection.");
  const { status, data } = error.response;
  const body = data as Record<string, unknown>;
  const serverMessage: any =
    (body?.error as Record<string, unknown>)?.message ||
    (body?.message as string) ||
    "";

  switch (status) {
    case 403:
      return new Error(
        serverMessage || "You do not have permission for this action.",
      );
    case 409:
      return new Error(serverMessage || "Conflict: Resource already exists.");
    case 422:
      return new Error(serverMessage || "Validation failed.");
    case 500:
      return new Error(serverMessage || "Internal server error.");
    default:
      return new Error(serverMessage || `Error ${status}`);
  }
};

const formatError = (error: unknown): Error => {
  if (error instanceof Error) return error;
  return new Error("Request failed");
};

export class DefaultAuthClient implements AuthClient {
  private api = getApiClient();

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const res = await this.api.post<LoginResponse>("/api/v1/auth/login", {
        email,
        password,
      });
      return res.data;
    } catch (e: any) {
      return {
        success: false,
        error: { code: "LOGIN_FAILED", message: e.message },
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post("/api/v1/auth/logout", {});
    } catch (e) {
      console.warn("Logout request failed", e);
    }
  }

  async getSession(): Promise<SessionResponse> {
    try {
      console.info("Fetching Session...");
      const token = typeof window !== "undefined"
      ? document.cookie.split("; ").find((c) => c.startsWith("access_token="))?.slice("access_token=".length)
      : null;
      console.info("Fetching Session...token" );
      const config: Record<string, any> = {};
      if (token) {
        console.info("Fetching Session...has token" );
        config.headers = { Authorization: `Bearer ${token}` };
      }
      const res = await this.api.get<SessionResponse>("/api/v1/auth/session", config);
      return res.data;
    } catch (e: any) {
      return {
        success: false,
        error: { code: "SESSION_FAILED", message: e.message },
      };
    }
  }
}

export { GATEWAY_URL };
