export { AuthProvider, useAuth } from './contexts/AuthContext';
export type { SessionManager } from './contexts/AuthContext';
export type { UserProfile, AuthState } from './types/identity';
export type { AuthClient, LoginResponse, SessionResponse } from './types/client';
export { authApi } from './lib/api/auth';
export { getApiClient, DefaultAuthClient, GATEWAY_URL } from './lib/api/client';
