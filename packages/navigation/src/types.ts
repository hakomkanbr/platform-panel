import type { ISidebarItem } from "@repo/shared-types";
import type { AppNavigationItem } from "@repo/app-registry";

export type { AppNavigationItem };

export interface ShellNavigation {
  platform: AppNavigationItem[];
  application: AppNavigationItem[];
}

export interface NavigationConfig {
  platform: AppNavigationItem[];
  workspace: AppNavigationItem[];
  project: AppNavigationItem[];
  application: AppNavigationItem[];
  developer: AppNavigationItem[];
  settings: AppNavigationItem[];
}

export interface NavigationRegistry {
  getNavigationConfig: () => NavigationConfig;
  getSidebarItems: (section: keyof NavigationConfig) => ISidebarItem[];
  getShellNavigation: () => ShellNavigation;
}