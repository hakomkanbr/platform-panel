import type { ISidebarItem } from "@repo/shared-types";

export interface AppNavigationItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path: string;
  description?: string;
  roles?: string[];
  children?: AppNavigationItem[];
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
  registerApp: (appName: string, items: AppNavigationItem[], section: keyof NavigationConfig) => void;
  getNavigationConfig: () => NavigationConfig;
  getSidebarItems: (section: keyof NavigationConfig) => ISidebarItem[];
}
