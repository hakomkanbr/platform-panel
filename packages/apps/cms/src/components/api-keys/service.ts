import { getGatewayClient } from "@repo/api-client";
import api_points from "@/api/points";
import type {
  ApiKeyDto,
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
  CreateApiKeyResponse,
  ApiKeyAuditLog,
  ApiKeyPermission,
  ApiKeyExpiration,
} from "./types";

interface BackendApiKeyDto {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  maskedKey: string;
  prefix: string;
  lastFourChars: string;
  environment: string;
  status: string;
  scopes: string[];
  allowedIPs: string | null;
  allowedDomains: string | null;
  rateLimit: number | null;
  usageCount: number;
  metadata: Record<string, unknown> | null;
  expiresAt: string | null;
  createdAt: string;
  lastUsedAt: string | null;
  createdBy: string;
  revokedAt: string | null;
  revokedBy: string | null;
}

interface BackendApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface BackendApiKeyGeneratedResponse {
  apiKey: BackendApiKeyDto;
  rawSecretKey: string;
}

function mapScopesToPermissions(scopes: string[]): ApiKeyPermission[] {
  const map = new Map<string, Set<string>>();
  for (const scope of scopes) {
    const [resource, action] = scope.split(":");
    if (resource && action) {
      if (!map.has(resource)) map.set(resource, new Set());
      map.get(resource)!.add(action);
    }
  }
  return Array.from(map.entries()).map(([resource, actions]) => ({
    resource,
    actions: Array.from(actions),
  }));
}

function mapPermissionsToScopes(permissions: ApiKeyPermission[]): string[] {
  const scopes: string[] = [];
  for (const perm of permissions) {
    for (const action of perm.actions) {
      scopes.push(`${perm.resource}:${action}`);
    }
  }
  return scopes;
}

function calcExpiration(expiresAt: string | null): ApiKeyExpiration {
  if (!expiresAt) return "never";
  const now = Date.now();
  const exp = new Date(expiresAt).getTime();
  const days = (exp - now) / (1000 * 60 * 60 * 24);
  if (days <= 30) return "30days";
  if (days <= 90) return "90days";
  if (days <= 365) return "1year";
  return "custom";
}

function mapBackendToFrontend(b: BackendApiKeyDto): ApiKeyDto {
  return {
    id: b.id,
    projectId: b.projectId,
    name: b.name,
    description: b.description ?? undefined,
    prefix: b.prefix,
    environment: b.environment as ApiKeyDto["environment"],
    permissions: mapScopesToPermissions(b.scopes),
    lastUsed: b.lastUsedAt,
    createdAt: b.createdAt,
    expiresAt: b.expiresAt,
    expiration: calcExpiration(b.expiresAt),
    status: b.status as ApiKeyDto["status"],
    createdBy: b.createdBy,
    usageCount: b.usageCount,
    ipRestrictions: b.allowedIPs ? b.allowedIPs.split(",").map((s) => s.trim()).filter(Boolean) : [],
    allowedDomains: b.allowedDomains ? b.allowedDomains.split(",").map((s) => s.trim()).filter(Boolean) : [],
    rateLimit: b.rateLimit ?? 0,
    metadata: b.metadata ?? {},
  };
}

function resolveExpiresAt(expiration: string, customDate?: string | null): string | null {
  if (expiration === "never") return null;
  if (expiration === "custom") return customDate ?? null;
  const days: Record<string, number> = { "30days": 30, "90days": 90, "1year": 365 };
  const n = days[expiration];
  if (!n) return null;
  return new Date(Date.now() + n * 86400000).toISOString();
}

function mapCreateToBackend(f: CreateApiKeyRequest) {
  return {
    name: f.name,
    description: f.description ?? null,
    environment: f.environment,
    scopes: mapPermissionsToScopes(f.permissions),
    allowedIPs: f.ipRestrictions?.join(",") ?? null,
    allowedDomains: f.allowedDomains?.join(",") ?? null,
    rateLimit: f.rateLimit ?? null,
    expiresAt: resolveExpiresAt(f.expiration, f.customExpirationDate),
    metadata: f.metadata ?? null,
  };
}

function mapUpdateToBackend(f: UpdateApiKeyRequest) {
  return {
    name: f.name ?? null,
    description: f.description ?? null,
    environment: f.environment ?? null,
    scopes: f.permissions ? mapPermissionsToScopes(f.permissions) : null,
    allowedIPs: f.ipRestrictions?.join(",") ?? null,
    allowedDomains: f.allowedDomains?.join(",") ?? null,
    rateLimit: f.rateLimit ?? null,
    metadata: f.metadata ?? null,
  };
}

function buildUrl(template: string, projectId: string, id?: string): string {
  let url = template.replace("{projectId}", projectId);
  if (id) url = url.replace("{id}", id);
  return url;
}

export const apiKeyService = {
  async list(projectId: string): Promise<ApiKeyDto[]> {
    const res = await getGatewayClient().get(buildUrl(api_points.apiKeys.list, projectId));
    const body = res.data as BackendApiResponse<BackendApiKeyDto[]>;
    if (!body.success) throw new Error(body.message ?? "Failed to load API keys");
    return body.data.map(mapBackendToFrontend);
  },

  async getOne(projectId: string, id: string): Promise<ApiKeyDto> {
    const res = await getGatewayClient().get(buildUrl(api_points.apiKeys.getOne, projectId, id));
    const body = res.data as BackendApiResponse<BackendApiKeyDto>;
    if (!body.success) throw new Error(body.message ?? "API key not found");
    return mapBackendToFrontend(body.data);
  },

  async create(projectId: string, request: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
    const res = await getGatewayClient().post(buildUrl(api_points.apiKeys.create, projectId), mapCreateToBackend(request));
    const body = res.data as BackendApiResponse<BackendApiKeyGeneratedResponse>;
    if (!body.success) throw new Error(body.message ?? "Failed to create API key");
    return {
      key: mapBackendToFrontend(body.data.apiKey),
      secret: body.data.rawSecretKey,
    };
  },

  async update(projectId: string, id: string, request: UpdateApiKeyRequest): Promise<void> {
    const res = await getGatewayClient().put(buildUrl(api_points.apiKeys.update, projectId, id), mapUpdateToBackend(request));
    const body = res.data as BackendApiResponse<undefined>;
    if (!body.success) throw new Error(body.message ?? "Failed to update API key");
  },

  async delete(projectId: string, id: string): Promise<void> {
    const res = await getGatewayClient().delete(buildUrl(api_points.apiKeys.delete, projectId, id));
    const body = res.data as BackendApiResponse<null>;
    if (!body.success) throw new Error(body.message ?? "Failed to delete API key");
  },

  async rotate(projectId: string, id: string): Promise<CreateApiKeyResponse> {
    const res = await getGatewayClient().post(buildUrl(api_points.apiKeys.rotate, projectId, id));
    const body = res.data as BackendApiResponse<BackendApiKeyGeneratedResponse>;
    if (!body.success) throw new Error(body.message ?? "Failed to rotate API key");
    return {
      key: mapBackendToFrontend(body.data.apiKey),
      secret: body.data.rawSecretKey,
    };
  },

  async revoke(projectId: string, id: string): Promise<void> {
    const res = await getGatewayClient().post(buildUrl(api_points.apiKeys.revoke, projectId, id));
    const body = res.data as BackendApiResponse<null>;
    if (!body.success) throw new Error(body.message ?? "Failed to revoke API key");
  },

  async disable(projectId: string, id: string): Promise<void> {
    const res = await getGatewayClient().post(buildUrl(api_points.apiKeys.disable, projectId, id));
    const body = res.data as BackendApiResponse<null>;
    if (!body.success) throw new Error(body.message ?? "Failed to disable API key");
  },

  async enable(projectId: string, id: string): Promise<void> {
    const res = await getGatewayClient().post(buildUrl(api_points.apiKeys.enable, projectId, id));
    const body = res.data as BackendApiResponse<null>;
    if (!body.success) throw new Error(body.message ?? "Failed to enable API key");
  },

  async getAuditLog(projectId: string, id: string): Promise<ApiKeyAuditLog[]> {
    const res = await getGatewayClient().get(buildUrl(api_points.apiKeys.auditLog, projectId, id));
    const body = res.data as BackendApiResponse<ApiKeyAuditLog[]>;
    if (!body.success) throw new Error(body.message ?? "Failed to load audit log");
    return body.data;
  },
};
