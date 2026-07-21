"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import type { UserProfile, AuthState } from "../types/identity";
import type { AuthClient } from "../types/client";
import { DefaultAuthClient } from "../lib/api/client";

export interface SessionManager extends AuthState {
  login: {
    (email: string, password: string): Promise<void>;
    (accessToken: string, refreshToken: string, user: Partial<UserProfile>): void;
  };
  logout: () => Promise<void>;
  requireTenantAdmin: () => boolean;
}

const DEFAULT_AUTH_STATE: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isPlatformAdmin: false,
  isTenantAdmin: false,
  isLoading: true,
};

const AuthContext = createContext<SessionManager | null>(null);

export function AuthProvider({
  children,
  client,
}: {
  children: React.ReactNode;
  client?: AuthClient;
}) {
  const authClient = new DefaultAuthClient();
  const [authState, setAuthState] = useState<AuthState>(DEFAULT_AUTH_STATE);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    const checkAuth = async () => {
      try {
        const res = await authClient.getSession();
        if (res.success && res.data?.isAuthenticated && res.data.user) {
          const user = res.data.user;
          const roles = user.roles || [];
          setAuthState({
            token: null, // Tokens are HttpOnly, we don't store them in state
            refreshToken: null,
            user,
            isAuthenticated: true,
            isPlatformAdmin: roles.includes("platform_admin"),
            isTenantAdmin:
              roles.includes("tenant_admin") ||
              roles.includes("tenant_editor") ||
              roles.includes("tenant_viewer") ||
              roles.includes("sales_manager") ||
              roles.includes("tenant_user"),
            isLoading: false,
          });
        } else {
          setAuthState({ ...DEFAULT_AUTH_STATE, isLoading: false });
        }
      } catch {
        setAuthState({ ...DEFAULT_AUTH_STATE, isLoading: false });
      }
    };

    checkAuth();
  }, [authClient]);

  const login = useCallback(
    async (...args: [string, string] | [string, string, Partial<UserProfile>]) => {
      let user: Partial<UserProfile>;
      if (args.length === 3) {
        user = args[2];
      } else {
        const res = await authClient.login(args[0], args[1]);
        if (!res.success || !res.data?.user) {
          throw new Error(res.error?.message || "Login failed");
        }
        user = res.data.user;
      }
      const roles = user.roles || [];
      setAuthState({
        token: null,
        refreshToken: null,
        user: user as UserProfile,
        isAuthenticated: true,
        isPlatformAdmin: roles.includes("platform_admin"),
        isTenantAdmin:
          roles.includes("tenant_admin") ||
          roles.includes("tenant_editor") ||
          roles.includes("tenant_viewer") ||
          roles.includes("sales_manager") ||
          roles.includes("tenant_user"),
        isLoading: false,
      });
    },
    [authClient],
  );

  const logout = useCallback(async () => {
    await authClient.logout();
    setAuthState({ ...DEFAULT_AUTH_STATE, isLoading: false });
  }, [authClient]);

  const requireTenantAdmin = useCallback(() => {
    if (authState.isLoading) return false;
    if (!authState.isAuthenticated && !authState.user) return false;
    if (!authState.isTenantAdmin) return false;
    return true;
  }, [authState]);

  return (
    <AuthContext.Provider
      value={{ ...authState, login, logout, requireTenantAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
