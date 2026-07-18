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
