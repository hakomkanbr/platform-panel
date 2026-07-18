// utils/sidebarItems.tsx
import {
  HomeOutlined,
  FolderOutlined,
  StarOutlined,
  HistoryOutlined,
  TeamOutlined,
  CreditCardOutlined,
  SettingOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  LinkOutlined,
  FormOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { IRoleType, ISidebarItem } from "@repo/shared-types";
import { IoNavigateOutline } from "react-icons/io5";

export const getSidebarItems = (userRole: IRoleType): ISidebarItem[] => {
  const baseItems: ISidebarItem[] = [
    {
      key: "home",
      label: "Home",
      icon: <HomeOutlined />,
      path: "/admin",
    },
    {
      key: "projects",
      label: "Projects",
      icon: <FolderOutlined />,
      path: "/admin/projects",
    },
    {
      key: "app-library",
      label: "App Library",
      icon: <AppstoreOutlined />,
      path: "/admin/app-library",
    },
    {
      key: "favorites",
      label: "Favorites",
      icon: <StarOutlined />,
      path: "/admin/projects?tab=favorites",
    },
    {
      key: "recent",
      label: "Recent",
      icon: <HistoryOutlined />,
      path: "/admin/projects?tab=recent",
    },
  ];

  baseItems.push(
    // {
    //   key: "team",
    //   label: "Team",
    //   icon: <TeamOutlined />,
    //   path: "/admin/users",
    // },
    {
      key: "billing",
      label: "Billing",
      icon: <CreditCardOutlined />,
      path: "/admin/billing",
    },
    // {
    //   key: "settings",
    //   label: "Settings",
    //   icon: <SettingOutlined />,
    //   path: "/admin/setting",
    // },
  );

  const filterByRole = (items: ISidebarItem[]): ISidebarItem[] => {
    return items
      .filter((item) => !item.roles || item.roles.includes(userRole))
      .map((item) => ({
        ...item,
        children: item.children ? filterByRole(item.children) : undefined,
      }));
  };

  return filterByRole(baseItems);
};
