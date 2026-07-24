import type { NavigationConfig, AppNavigationItem, NavigationRegistry } from './types';
import type { ISidebarItem } from "@repo/shared-types";
import {
  HomeOutlined,
  FolderOutlined,
  CreditCardOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const config: NavigationConfig = {
  platform: [
    {
      key: "home",
      label: "Home",
      icon: <HomeOutlined />,
      path: "/admin",
      description: "Platform overview and KPIs",
    },
    {
      key: "projects",
      label: "Projects",
      icon: <FolderOutlined />,
      path: "/admin/projects",
      description: "Manage your projects",
    },
    {
      key: "app-library",
      label: "App Library",
      icon: <AppstoreOutlined />,
      path: "/admin/app-library",
      description: "Browse available applications",
    },
    {
      key: "billing",
      label: "Billing",
      icon: <CreditCardOutlined />,
      path: "/admin/billing",
      description: "Manage subscriptions and invoices",
    },
  ],
  workspace: [],
  project: [],
  application: [],
  developer: [],
  settings: [],
};

function toSidebarItem(item: AppNavigationItem): ISidebarItem {
  return {
    key: item.key,
    label: item.label,
    icon: item.icon,
    path: item.path,
    roles: item.roles,
    children: item.children?.map(toSidebarItem),
  };
}

export const navigationRegistry: NavigationRegistry = {
  registerApp: (appName: string, items: AppNavigationItem[], section: keyof NavigationConfig) => {
    config[section].push(...items);
  },
  getNavigationConfig: () => config,
  getSidebarItems: (section: keyof NavigationConfig): ISidebarItem[] => {
    return config[section].map(toSidebarItem);
  },
};

export function createNavigationConfig() {
  return navigationRegistry;
}
