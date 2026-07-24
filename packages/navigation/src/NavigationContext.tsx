"use client";

import React, { createContext, useContext, useMemo } from "react";
import { navigationRegistry } from "./navigation-config";
import type { ISidebarItem } from "@repo/shared-types";

interface NavigationContextValue {
  sidebarItems: ISidebarItem[];
  registerApp: typeof navigationRegistry.registerApp;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => ({
    sidebarItems: navigationRegistry.getSidebarItems("platform"),
    registerApp: navigationRegistry.registerApp,
  }), []);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigationContext must be used within NavigationProvider");
  return ctx;
}
