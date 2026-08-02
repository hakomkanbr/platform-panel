import type { ComponentType, ReactNode } from "react";

/** A recursive message tree localized for one locale. */
export interface AppDictionary {
  [key: string]: AppDictionary | string;
}

/**
 * Dictionaries an application exposes. The platform auto-loads and merges
 * these with the global dictionaries; no manual import is required by pages.
 */
export interface ApplicationTranslations {
  en: AppDictionary;
  ar: AppDictionary;
  tr: AppDictionary;
}

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
  icon?: ReactNode;
}

export interface ApplicationDefinition {
  id: string;
  name: string;
  version: string;

  icon?: ReactNode;

  navigation: AppNavigationItem[];

  routes: AppRoute[];

  /** Per-locale dictionaries contributed by this application (auto-merged). */
  translations?: Partial<ApplicationTranslations>;

  Root: ComponentType<any>;
}
