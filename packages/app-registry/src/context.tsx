"use client";

import React, { createContext, useContext, useCallback, useMemo, useState } from "react";
import { appRegistry } from "./registry";
import type { AppMetadata, AppNavigationItem } from "./types";

interface AppRegistryContextValue {
  registeredApps: AppMetadata[];
  activeAppId: string | null;
  activeApp: AppMetadata | null;
  activeAppNavigation: AppNavigationItem[];
  registerApp: (metadata: AppMetadata) => void;
  unregisterApp: (appId: string) => void;
  setActiveApp: (appId: string | null) => void;
  getApp: (appId: string) => AppMetadata | undefined;
}

const AppRegistryContext = createContext<AppRegistryContextValue | null>(null);

export function AppRegistryProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState(0);

  const registerApp = useCallback((metadata: AppMetadata) => {
    appRegistry.register(metadata);
    setVersion((v) => v + 1);
  }, []);

  const unregisterApp = useCallback((appId: string) => {
    appRegistry.unregister(appId);
    setVersion((v) => v + 1);
  }, []);

  const setActiveApp = useCallback((appId: string | null) => {
    appRegistry.setActiveApp(appId);
    setVersion((v) => v + 1);
  }, []);

  const value = useMemo(
    () => ({
      registeredApps: appRegistry.getAllApps(),
      activeAppId: appRegistry.getActiveAppId(),
      activeApp: appRegistry.getActiveApp(),
      activeAppNavigation: appRegistry.getActiveApp()?.navigation ?? [],
      registerApp,
      unregisterApp,
      setActiveApp,
      getApp: appRegistry.getApp.bind(appRegistry),
    }),
    [version, registerApp, unregisterApp, setActiveApp],
  );

  return (
    <AppRegistryContext.Provider value={value}>
      {children}
    </AppRegistryContext.Provider>
  );
}

export function useAppRegistry() {
  const ctx = useContext(AppRegistryContext);
  if (!ctx) {
    throw new Error("useAppRegistry must be used within an AppRegistryProvider");
  }
  return ctx;
}