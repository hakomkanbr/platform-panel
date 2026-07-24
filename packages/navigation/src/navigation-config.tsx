import type {
  NavigationConfig,
  AppNavigationItem,
  NavigationRegistry,
  ShellNavigation,
} from "./types";
import type { ISidebarItem } from "@repo/shared-types";
import {
  HomeOutlined,
  FolderOutlined,
  CreditCardOutlined,
  AppstoreOutlined,
  TeamOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const config: NavigationConfig = {
  platform: [
    {
      key: "home",
      label: "Dashboard",
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
      key: "billing",
      label: "Billing",
      icon: <CreditCardOutlined />,
      path: "/admin/billing",
      description: "Manage subscriptions and invoices",
    },
    {
      key: "team",
      label: "Team",
      icon: <TeamOutlined />,
      path: "/admin/users",
      description: "Manage team members",
    },
    // {
    //   key: "settings",
    //   label: "Settings",
    //   icon: <SettingOutlined />,
    //   path: "/admin/setting",
    //   description: "Platform settings",
    // },
  ],
  workspace: [],
  project: [],
  application: [],
  developer: [],
  settings: [],
};

let appNavigationItems: AppNavigationItem[] = [];

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
  registerApp: (
    appName: string,
    items: AppNavigationItem[],
    section: keyof NavigationConfig,
  ) => {
    config[section].push(...items);
  },
  getNavigationConfig: () => config,
  getSidebarItems: (section: keyof NavigationConfig): ISidebarItem[] => {
    return config[section].map(toSidebarItem);
  },
  getShellNavigation: (): ShellNavigation => {
    return {
      platform: [...config.platform],
      application: [...appNavigationItems],
    };
  },
  setAppNavigation: (items: AppNavigationItem[]) => {
    appNavigationItems = items;
  },
  clearAppNavigation: () => {
    appNavigationItems = [];
  },
};

export function createNavigationConfig() {
  return navigationRegistry;
}
