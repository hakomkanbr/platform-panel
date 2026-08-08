export type ApiKeyEnvironment = "development" | "staging" | "production";

export type ApiKeyType = "developer" | "marketplace";

export type ApiKeyStatus = "active" | "disabled" | "revoked";

export type ApiKeyExpiration = "never" | "30days" | "90days" | "1year" | "custom";

export type ApiKeyAccessLevel = "read_only" | "standard_read" | "custom_read";

export type ApiKeyScope = "current_project" | "marketplace_projects";

export interface ApiKeyPermission {
  resource: string;
  actions: string[];
}

export interface ApiKeyDto {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  prefix: string;
  environment: ApiKeyEnvironment;
  permissions: ApiKeyPermission[];
  scope?: ApiKeyScope;
  accessLevel?: ApiKeyAccessLevel;
  lastUsed: string | null;
  createdAt: string;
  expiresAt: string | null;
  expiration: ApiKeyExpiration;
  status: ApiKeyStatus;
  createdBy: string;
  createdByEmail?: string;
  usageCount: number;
  ipRestrictions: string[];
  allowedDomains: string[];
  rateLimit: number;
  metadata: Record<string, unknown>;
  updatedAt?: string;
  revokedAt?: string | null;
  revokedBy?: string | null;
}

export interface CreateApiKeyRequest {
  name: string;
  description?: string;
  keyType?: ApiKeyType;
  environment: ApiKeyEnvironment;
  expiration: ApiKeyExpiration;
  customExpirationDate?: string | null;
  permissions: ApiKeyPermission[];
  scope?: ApiKeyScope;
  ipRestrictions?: string[];
  allowedDomains?: string[];
  rateLimit?: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateApiKeyRequest {
  name?: string;
  description?: string;
  environment?: ApiKeyEnvironment;
  expiration?: ApiKeyExpiration;
  customExpirationDate?: string | null;
  permissions?: ApiKeyPermission[];
  ipRestrictions?: string[];
  allowedDomains?: string[];
  rateLimit?: number;
  metadata?: Record<string, unknown>;
}

export interface CreateApiKeyResponse {
  key: ApiKeyDto;
  secret: string;
}

export interface ApiKeyAuditLog {
  id: string;
  apiKeyId: string;
  action: string;
  performedBy: string;
  performedAt: string;
  details?: string;
}

export const API_KEY_PERMISSIONS = [
  {
    resource: "projects",
    label: "Projects",
    actions: [
      { value: "read", label: "Read" },
      { value: "write", label: "Write" },
    ],
  },
  {
    resource: "users",
    label: "Users",
    actions: [
      { value: "read", label: "Read" },
      { value: "write", label: "Write" },
    ],
  },
  {
    resource: "storage",
    label: "Storage",
    actions: [
      { value: "read", label: "Read" },
      { value: "upload", label: "Upload" },
      { value: "delete", label: "Delete" },
    ],
  },
  {
    resource: "cms",
    label: "CMS",
    actions: [
      { value: "read", label: "Read" },
      { value: "publish", label: "Publish" },
    ],
  },
  {
    resource: "files",
    label: "Files",
    actions: [
      { value: "read", label: "Read" },
      { value: "upload", label: "Upload" },
      { value: "delete", label: "Delete" },
    ],
  },
  {
    resource: "forms",
    label: "Forms",
    actions: [
      { value: "read", label: "Read" },
      { value: "submit", label: "Submit" },
    ],
  },
  {
    resource: "commerce",
    label: "Commerce",
    actions: [
      { value: "read", label: "Read" },
      { value: "orders", label: "Orders" },
    ],
  },
  {
    resource: "analytics",
    label: "Analytics",
    actions: [
      { value: "read", label: "Read" },
    ],
  },
] as const;

export interface ApiKeyPermissionGroup {
  resource: string;
  module: string;
  label: string;
  actions: readonly { value: string; label: string }[];
}

export const API_KEY_READ_PERMISSIONS: readonly ApiKeyPermissionGroup[] = [
  {
    resource: "catalog:products",
    module: "Catalog",
    label: "Products",
    actions: [{ value: "read", label: "Read" }],
  },
  {
    resource: "catalog:categories",
    module: "Catalog",
    label: "Categories",
    actions: [{ value: "read", label: "Read" }],
  },
  {
    resource: "catalog:brands",
    module: "Catalog",
    label: "Brands",
    actions: [{ value: "read", label: "Read" }],
  },
  {
    resource: "orders",
    module: "Orders",
    label: "Orders",
    actions: [{ value: "read", label: "Read" }],
  },
  {
    resource: "customers",
    module: "Customers",
    label: "Customers",
    actions: [{ value: "read", label: "Read" }],
  },
  {
    resource: "inventory",
    module: "Inventory",
    label: "Inventory",
    actions: [{ value: "read", label: "Read" }],
  },
  {
    resource: "pricing",
    module: "Pricing",
    label: "Prices",
    actions: [{ value: "read", label: "Read" }],
  },
  {
    resource: "marketing:promotions",
    module: "Marketing",
    label: "Promotions",
    actions: [{ value: "read", label: "Read" }],
  },
  {
    resource: "reviews",
    module: "Reviews",
    label: "Reviews",
    actions: [{ value: "read", label: "Read" }],
  },
  {
    resource: "analytics",
    module: "Analytics",
    label: "Analytics",
    actions: [{ value: "read", label: "Read" }],
  },
  {
    resource: "payments",
    module: "Payments",
    label: "Payments",
    actions: [{ value: "read", label: "Read" }],
  },
  {
    resource: "shipping",
    module: "Shipping",
    label: "Shipping",
    actions: [{ value: "read", label: "Read" }],
  },
];
