import type { ISidebarItem } from "@repo/shared-types";

export interface AppNavigationItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path: string;
  description?: string;
  disabled?: boolean;
  type?: any;
  roles?: string[];
  children?: AppNavigationItem[];
}

export interface AppMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  icon?: React.ReactNode;
  baseRoute: string;
  navigation: AppNavigationItem[];
  settingsRoute?: string;
}

export interface AppRegistration {
  metadata: AppMetadata;
  register: () => void;
  unregister: () => void;
}

export interface AppRegistryState {
  applications: Map<string, AppMetadata>;
  activeAppId: string | null;
  availableApps: string[];
}