"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { navigationRegistry } from "./navigation-config";
import { useNavigationContext } from "./NavigationContext";
import type { ISidebarItem } from "@repo/shared-types";
import type { ShellNavigation } from "./types";

export function useNavigation() {
  const pathname = usePathname();
  const { shellNavigation, sidebarItems, appSidebarItems, setAppNavigation, clearAppNavigation } = useNavigationContext();

  const currentApp = useMemo(() => {
    if (!pathname) return null;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length >= 2) {
      return segments[1];
    }
    return null;
  }, [pathname]);

  const isActive = (path: string): boolean => {
    return pathname?.startsWith(path) ?? false;
  };

  return {
    sidebarItems,
    appSidebarItems,
    shellNavigation,
    currentApp,
    isActive,
    navigationRegistry,
    setAppNavigation,
    clearAppNavigation,
  };
}