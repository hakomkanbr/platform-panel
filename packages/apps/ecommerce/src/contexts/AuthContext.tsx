"use client";

import { apiPost, createPlatformClient } from "@/lib/api/client";
import { getRefreshToken } from "@/lib/auth/keycloak.client";
import { UserProfile } from "@/types/identity";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isPlatformAdmin: boolean;
  isTenantAdmin: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (token: string, refreshToken: string, user: UserProfile) => void;
  logout: () => Promise<void>;
  requireTenantAdmin: () => boolean;
}

const DEFAULT_AUTH_STATE: AuthState = {
  token: null, refreshToken: null, user: null,
  isAuthenticated: false, isPlatformAdmin: false, isTenantAdmin: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(DEFAULT_AUTH_STATE);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    const checkAuth = async () => {
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          setAuthState({ ...DEFAULT_AUTH_STATE, isLoading: false });
          return;
        }
        await apiPost("/api/v1/auth/refresh", { refreshToken }, createPlatformClient());
      } catch {
        setAuthState({ ...DEFAULT_AUTH_STATE, isLoading: false });
      }
    };

    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
      checkAuth();
    }
  }, []);

  const login = useCallback((token: string, refreshToken: string, user: UserProfile) => {
    const roles = user.roles || [];
    setAuthState({
      token, refreshToken, user, isAuthenticated: true,
      isPlatformAdmin: true,
      isTenantAdmin: roles.includes("tenant_admin") || roles.includes("tenant_editor") ||
        roles.includes("tenant_viewer") || roles.includes("sales_manager") || roles.includes("tenant_user"),
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthState({ ...DEFAULT_AUTH_STATE, isLoading: false });
  }, []);

  const requireTenantAdmin = useCallback(() => {
    if (authState.isLoading) return false;
    if (!authState.isAuthenticated && !authState.token && !authState.user) return false;
    if (!authState.isTenantAdmin) return false;
    return true;
  }, [authState]);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, requireTenantAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
