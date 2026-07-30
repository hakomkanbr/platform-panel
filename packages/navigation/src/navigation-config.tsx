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
      path: `/admin`,
      description: "Platform overview and KPIs",
    },
    {
      key: "projects",
      label: "Projects",
      icon: <FolderOutlined />,
      path: `/admin/projects`,
      description: "Manage your projects",
    },
    {
      key: "billing",
      label: "Billing",
      icon: <CreditCardOutlined />,
      path: `/admin/billing`,
      description: "Manage subscriptions and invoices",
    },
    {
      key: "team",
      label: "Team (soon)",
      disabled: true,
      icon: <TeamOutlined />,
      path: `/admin/users`,
      description: "Manage team members",
    },
    // {
    //   key: "settings",
    //   label: "Settings",
    //   icon: <SettingOutlined />,
    //   path${process.env.NODE_ENV == "production" ? ": `/admin/setting`," : ": localhost:3000"}
    //   description: "Platform settings",
    // },
  ],
  workspace: [],
  project: [],
  application: [{
    key: "ecommerce",
    label: "E-Commerce",
    icon: <AppstoreOutlined />,
    path: `/admin/ecommerce`,
    description: "Manage e-commerce functionality and products",
  }, {
    key: "cms",
    label: "Content Management (soon)",
    icon: <AppstoreOutlined />,
    path: `/admin/cms`,
    description: "Manage content and assets",
    // disabled: true,
  }],
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
      application: [...config.application],
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
