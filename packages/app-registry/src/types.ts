import type { ComponentType, ReactNode } from "react";

export interface AppNavigationItem {
  key: string;
  label: string;
  path: string;
  icon?: ReactNode;
  description?: string;
  disabled?: boolean;
  roles?: string[];
  children?: AppNavigationItem[];
}

export interface AppRoute {
  id: string;
  path: string;
  title?: string;
  icon?: React.ReactNode;
}

export interface ApplicationDefinition {
  id: string;
  name: string;
  version: string;

  icon?: ReactNode;

  navigation: AppNavigationItem[];

  routes: AppRoute[];

  Root: ComponentType<any>;
}

export interface AppRegistryState {
  applications: Map<string, ApplicationDefinition>;
  activeAppId: string | null;
}