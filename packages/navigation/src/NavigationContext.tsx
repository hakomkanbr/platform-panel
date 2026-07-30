"use client";

import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { navigationRegistry } from "./navigation-config";
import type { ISidebarItem } from "@repo/shared-types";
import type { ShellNavigation, AppNavigationItem } from "./types";

interface NavigationContextValue {
  shellNavigation: ShellNavigation;
  sidebarItems: ISidebarItem[];
  appSidebarItems: ISidebarItem[];
  registerApp: typeof navigationRegistry.registerApp;
  setAppNavigation: (items: AppNavigationItem[]) => void;
  clearAppNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState(0);

  const setAppNavigation = useCallback((items: AppNavigationItem[]) => {
    navigationRegistry.setAppNavigation(items);
    setVersion((v) => v + 1);
  }, []);

  const clearAppNavigation = useCallback(() => {
    navigationRegistry.clearAppNavigation();
    setVersion((v) => v + 1);
  }, []);

  const value = useMemo(() => {
    const shell = navigationRegistry.getShellNavigation();
    return {
      shellNavigation: shell,
      sidebarItems: shell.platform.map(toSidebarItem),
      appSidebarItems: shell.application.map(toSidebarItem),
      registerApp: navigationRegistry.registerApp,
      setAppNavigation,
      clearAppNavigation,
    };
  }, [version, setAppNavigation, clearAppNavigation]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

function toSidebarItem(item: AppNavigationItem): ISidebarItem {
  return {
    key: item.key,
    label: item.label,
    icon: item.icon,
    path: item.path,
    disabled: item.disabled,
    type: item.type,
    roles: item.roles,
    children: item.children?.map(toSidebarItem),
  };
}

export function useNavigationContext() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigationContext must be used within NavigationProvider");
  return ctx;
}