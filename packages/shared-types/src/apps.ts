export interface AppCatalogDto {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  baseUrl: string;
  port: number;
  healthCheckUrl: string;
  capabilityCode: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateAppCatalogRequest {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  baseUrl: string;
  port: number;
  healthCheckUrl: string;
  capabilityCode: string;
}

export interface UpdateAppCatalogRequest {
  displayName?: string;
  description?: string;
  icon?: string;
  baseUrl?: string;
  port?: number;
  healthCheckUrl?: string;
  capabilityCode?: string;
  isActive?: boolean;
}

export interface ProjectDto {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  slug: string;
  logo?: string;
  logoUrl?: string;
  phone?: string;
  whatsappPhone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  currency?: string;
  appCount: number;
  enabledAppCount: number;
  createdAt: string;
  updatedAt: string | null;
  isMarketplaceMember: boolean;
}

export interface ProjectDetailDto {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  slug: string;
  logo?: string;
  logoUrl?: string;
  phone?: string;
  whatsappPhone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  currency?: string;
  createdAt: string;
  updatedAt: string | null;
  isMarketplaceMember: boolean;
  apps: ProjectAppDto[];
}

export interface ProjectAppDto {
  id: string;
  appCatalogId: string;
  appName: string;
  appDisplayName: string;
  appIcon: string;
  appBaseUrl: string;
  appPort: number;
  capabilityCode: string;
  isEnabled: boolean;
  enabledAt: string | null;
  disabledAt: string | null;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  logo?: string;
  logoUrl?: string;
  phone?: string;
  whatsappPhone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  currency?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  logo?: string;
  logoUrl?: string;
  phone?: string;
  whatsappPhone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  currency?: string;
}

export interface EnableAppRequest {
  appCatalogId: string;
}

export interface PlanCapability {
  value: number;
  capabilityType: string;
  unit: string | null;
  capabilityName: string;
}
