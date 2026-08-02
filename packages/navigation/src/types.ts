import type { ReactNode } from "react";

export interface NavigationItem {
  key: string;
  label: ReactNode;
  path: string;

  /** Optional localization key (e.g. `common.nav.dashboard`). When present, UI
   * renders the translated text instead of the raw label. */
  labelKey?: string;

  icon?: ReactNode;

  disabled?: boolean;

  children?: NavigationItem[];
}

export interface NavigationState {

  platform: NavigationItem[];

  application: NavigationItem[];

}