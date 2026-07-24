"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { navigationRegistry } from "./navigation-config";
import type { ISidebarItem } from "@repo/shared-types";

export function useNavigation() {
  const pathname = usePathname();

  const sidebarItems = useMemo(() => {
    return navigationRegistry.getSidebarItems("platform");
  }, []);

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
    currentApp,
    isActive,
    navigationRegistry,
  };
}
