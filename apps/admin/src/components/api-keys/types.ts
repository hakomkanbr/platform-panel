import type {
  ApiKeyDto,
  ApiKeyEnvironment,
  ApiKeyExpiration,
  ApiKeyStatus,
  ApiKeyPermission,
  ApiKeyType,
  ApiKeyAccessLevel,
  ApiKeyScope,
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
  CreateApiKeyResponse,
  ApiKeyAuditLog,
} from "@repo/shared-types";

export type {
  ApiKeyDto,
  ApiKeyEnvironment,
  ApiKeyExpiration,
  ApiKeyStatus,
  ApiKeyPermission,
  ApiKeyType,
  ApiKeyAccessLevel,
  ApiKeyScope,
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
  CreateApiKeyResponse,
  ApiKeyAuditLog,
};

export interface ApiKeyFormData {
  name: string;
  description?: string;
  accessLevel: ApiKeyAccessLevel;
  scope: ApiKeyScope;
  environment: ApiKeyEnvironment;
  expiration: ApiKeyExpiration;
  customExpirationDate?: string;
  permissions: ApiKeyPermission[];
  ipRestrictions?: string;
  allowedDomains?: string;
  rateLimit?: number;
  metadata?: string;
}
