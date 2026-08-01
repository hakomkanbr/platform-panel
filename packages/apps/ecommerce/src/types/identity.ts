export interface TenantDto {
  id: string
  name: string
  domain: string
  tenantId: string
  schemaVersion: string
  isActive: boolean
  maintenanceMode: boolean
  createdAt: string
  appId?: string
  keycloakGroupId?: string
  adminUserId?: string
  adminEmail?: string
  currentPlan?: string
  status?: 'Active' | 'Maintenance' | 'Suspended'
}

export interface CreateTenantRequest {
  name: string
  domain: string
  tenantId: string
  adminUserId?: string
  appId?: string
}

export interface UpdateMaintenanceRequest {
  enabled: boolean
}

export interface UpgradeVersionRequest {
  newVersion: string
}

export interface BusinessClientDto {
  id: string
  name: string
  email: string
  phone: string
  company: string
  address: string
  notes: string
  tenantId: string
  tenantName?: string
  createdAt: string
  updatedAt: string
  linkedUsers: LinkedUserDto[]
}

export interface LinkedUserDto {
  userId: string
  email: string
  firstName: string
  lastName: string
  linkedAt: string
  tenantId?: string
}

export interface CreateClientRequest {
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  notes?: string
  tenantId: string
  linkedUserIds?: string[]
}

export interface UpdateClientRequest {
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  notes?: string
  linkedUserIds?: string[]
}

export interface UserProfile {
  id: string
  email: string
  firstName?: string
  lastName?: string
  roles: string[]
  tenantId?: string
  appId?: string
}

export interface AuthState {
  token: string | null
  refreshToken: string | null
  user: UserProfile | null
  isAuthenticated: boolean
  isPlatformAdmin: boolean
  isTenantAdmin: boolean
}
