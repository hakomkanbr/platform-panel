import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getAccessToken } from "../auth/keycloak.client";
import { getCurrentProjectId } from "./project-storage";
import { getStoredApiKey } from "./api-keys";

const PLATFORM_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const ECOMMERCE_URL = process.env.NEXT_PUBLIC_ECOMMERCE_API_URL || "http://localhost:5006";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function createClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
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
    (r) => r,
    (error) => {
      if (error.response?.status === 401) {
        if (typeof window !== "undefined") window.location.href = "/auth/login";
      }
      return Promise.reject(error);
    },
  );

  return client;
}

export function createPlatformClient(): AxiosInstance {
  return createClient(PLATFORM_URL);
}

export function createEcommerceClient(): AxiosInstance {
  return createClient(ECOMMERCE_URL);
}

export function createApiKeyClient(baseURL: string, apiKey: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
  });

  client.interceptors.request.use((config) => {
    const projectId = getCurrentProjectId();
    if (projectId) config.headers["X-Project-Id"] = projectId;
    return config;
  });

  return client;
}

export function createApiKeyEcommerceClient(apiKey: string): AxiosInstance {
  return createApiKeyClient(ECOMMERCE_URL, apiKey);
}

export function createApiKeyPlatformClient(apiKey: string): AxiosInstance {
  return createApiKeyClient(PLATFORM_URL, apiKey);
}

function unwrapResponse<T>(res: any): T {
  if (res.data?.succeeded === false) {
    throw new ApiError(400, res.data.errors?.join(", ") || "Request failed");
  }
  return (res.data as any).data ?? (res.data as any);
}

export async function apiGet<T>(url: string, config?: AxiosRequestConfig, client?: AxiosInstance): Promise<T> {
  const c = client || createEcommerceClient();
  const res = await c.get(url, config);
  return unwrapResponse<T>(res);
}

export async function apiPost<T>(url: string, body?: unknown, client?: AxiosInstance): Promise<T> {
  const c = client || createEcommerceClient();
  const res = await c.post(url, body);
  return unwrapResponse<T>(res);
}

export async function apiPut<T>(url: string, body?: unknown, client?: AxiosInstance): Promise<T> {
  const c = client || createEcommerceClient();
  const res = await c.put(url, body);
  return unwrapResponse<T>(res);
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig, client?: AxiosInstance): Promise<T> {
  const c = client || createEcommerceClient();
  const res = await c.delete(url, config);
  return unwrapResponse<T>(res);
}
