import type { ReactNode } from "react";

export interface NavigationItem {
  key: string;
  label: string;
  path: string;

  icon?: ReactNode;

  disabled?: boolean;

  children?: NavigationItem[];
}

export interface NavigationState {

  platform: NavigationItem[];

  application: NavigationItem[];

}