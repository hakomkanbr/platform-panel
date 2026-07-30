import type {
  ApiKeyDto,
  ApiKeyEnvironment,
  ApiKeyExpiration,
  ApiKeyStatus,
  ApiKeyPermission,
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
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
  CreateApiKeyResponse,
  ApiKeyAuditLog,
};

export interface ApiKeyFormData {
  name: string;
  description?: string;
  environment: ApiKeyEnvironment;
  expiration: ApiKeyExpiration;
  customExpirationDate?: string;
  permissions: ApiKeyPermission[];
  ipRestrictions?: string;
  allowedDomains?: string;
  rateLimit?: number;
  metadata?: string;
}
