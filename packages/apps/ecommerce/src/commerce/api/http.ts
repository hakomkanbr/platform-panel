import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { COMMERCE_API_URL } from "../config";
import { getAccessToken } from "../../lib/auth/keycloak.client";
import { getCurrentProjectId } from "../../lib/api/project-storage";
import type { ApiResponse } from "../types/common";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

const client: AxiosInstance = axios.create({
  baseURL: COMMERCE_API_URL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const projectId = getCurrentProjectId();
  if (projectId) config.headers["X-Project-Id"] = projectId;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      if (!path.startsWith("/auth")) window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);

function unwrap<T>(res: { status: number; data: unknown }): T {
  const body = res.data as ApiResponse<T>;
  if (body && typeof body === "object" && "succeeded" in body) {
    if (body.succeeded === false) {
      const message =
        (Array.isArray(body.errors) && body.errors.length ? body.errors.join(", ") : undefined) ||
        body.error ||
        body.message ||
        "Request failed";
      throw new ApiError(res.status ?? 400, message);
    }
    return body.data as T;
  }
  return body as T;
}

export async function get<T>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
  const res = await client.get(url, { params, ...config });
  return unwrap<T>(res);
}

export async function post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await client.post(url, body, config);
  return unwrap<T>(res);
}

export async function put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await client.put(url, body, config);
  return unwrap<T>(res);
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await client.delete(url, config);
  return unwrap<T>(res);
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}
