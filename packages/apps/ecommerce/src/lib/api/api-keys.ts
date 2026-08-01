import { createPlatformClient } from './client';
import type { ApiKeyDto, ApiKeyGeneratedResponse, CreateApiKeyRequest, UpdateApiKeyRequest, RegenerateApiKeyResponse } from '@/types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const apiKeysApi = {
  list: async (projectId: string): Promise<ApiKeyDto[]> => {
    const client = createPlatformClient();
    const res = await client.get<ApiResponse<ApiKeyDto[]>>(`/api/v1/projects/${projectId}/api-keys`);
    return res.data.data;
  },

  getById: async (projectId: string, keyId: string): Promise<ApiKeyDto> => {
    const client = createPlatformClient();
    const res = await client.get<ApiResponse<ApiKeyDto>>(`/api/v1/projects/${projectId}/api-keys/${keyId}`);
    return res.data.data;
  },

  create: async (projectId: string, request: CreateApiKeyRequest): Promise<ApiKeyGeneratedResponse> => {
    const client = createPlatformClient();
    const res = await client.post<ApiResponse<ApiKeyGeneratedResponse>>(`/api/v1/projects/${projectId}/api-keys`, request);
    return res.data.data;
  },

  update: async (projectId: string, keyId: string, request: UpdateApiKeyRequest): Promise<void> => {
    const client = createPlatformClient();
    await client.put(`/api/v1/projects/${projectId}/api-keys/${keyId}`, request);
  },

  delete: async (projectId: string, keyId: string): Promise<void> => {
    const client = createPlatformClient();
    await client.delete(`/api/v1/projects/${projectId}/api-keys/${keyId}`);
  },

  regenerate: async (projectId: string, keyId: string): Promise<RegenerateApiKeyResponse> => {
    const client = createPlatformClient();
    const res = await client.post<ApiResponse<RegenerateApiKeyResponse>>(`/api/v1/projects/${projectId}/api-keys/${keyId}/regenerate`);
    return res.data.data;
  },
};

export const API_KEY_STORAGE_KEY = 's2s:apiKey';

export function getStoredApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  const envKey = process.env.NEXT_PUBLIC_STOREFRONT_API_KEY;
  if (envKey) return envKey;
  try {
    return sessionStorage.getItem(API_KEY_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storeApiKey(apiKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  } catch { }
}

export function removeStoredApiKey(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(API_KEY_STORAGE_KEY);
  } catch { }
}
