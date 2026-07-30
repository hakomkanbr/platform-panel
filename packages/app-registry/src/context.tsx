"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { appRegistry } from "./registry";
import type { ApplicationDefinition, AppNavigationItem } from "./types";

interface AppRegistryContextValue {
  registeredApps: ApplicationDefinition[];
  activeAppId: string | null;
  activeApp: ApplicationDefinition | null;
  activeAppNavigation: AppNavigationItem[];
  setActiveApp: (appId: string | null) => void;
  getApp: (appId: string) => ApplicationDefinition | undefined;
}

const AppRegistryContext = createContext<AppRegistryContextValue | null>(null);

export function AppRegistryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeAppId, setActiveAppId] = useState<string | null>(null);

  const activeApp = useMemo(() => {
    if (!activeAppId) return null;
    return appRegistry.getApp(activeAppId) ?? null;
  }, [activeAppId]);

  const value = useMemo(
    () => ({
      registeredApps: appRegistry.getAllApps(),
      activeAppId,
      activeApp,
      activeAppNavigation: activeApp?.navigation ?? [],
      setActiveApp: setActiveAppId,
      getApp: appRegistry.getApp,
    }),
    [activeAppId, activeApp],
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
    throw new Error("useAppRegistry must be used within AppRegistryProvider");
  }

  return ctx;
}