export interface ApiKeyDto {
  id: string
  projectId: string
  name: string
  maskedKey: string
  prefix: string
  lastFourChars: string
  environment: 'production' | 'sandbox' | 'development'
  scopes: string[]
  isActive: boolean
  allowedIPs: string | null
  expiresAt: string | null
  createdAt: string
  lastUsedAt: string | null
  createdBy: string
}

export interface ApiKeyGeneratedResponse {
  apiKey: ApiKeyDto
  rawSecretKey: string
}

export interface CreateApiKeyRequest {
  name: string
  environment: 'production' | 'sandbox' | 'development'
  scopes: string[]
  allowedIPs?: string
  expiresAt?: string
}

export interface UpdateApiKeyRequest {
  name?: string
  scopes?: string[]
  isActive?: boolean
  allowedIPs?: string
  expiresAt?: string
}

export interface RegenerateApiKeyResponse {
  apiKey: ApiKeyDto
  rawSecretKey: string
}

export const API_KEY_SCOPE_OPTIONS = [
  { label: 'Products - Read', value: 'products:read' },
  { label: 'Products - Write', value: 'products:write' },
  { label: 'Orders - Read', value: 'orders:read' },
  { label: 'Orders - Write', value: 'orders:write' },
  { label: 'Categories - Read', value: 'categories:read' },
  { label: 'Brands - Read', value: 'brands:read' },
  { label: 'Customers - Read', value: 'customers:read' },
  { label: 'Inventory - Read', value: 'inventory:read' },
  { label: 'Inventory - Write', value: 'inventory:write' },
  { label: 'Comments - Read', value: 'comments:read' },
  { label: 'Discounts - Read', value: 'discounts:read' },
  { label: 'Discounts - Write', value: 'discounts:write' },
]
