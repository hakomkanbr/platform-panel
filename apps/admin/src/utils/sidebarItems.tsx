// utils/sidebarItems.tsx
import {
  HomeOutlined,
  FolderOutlined,
  CreditCardOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { IRoleType, ISidebarItem } from "@repo/shared-types";
import { IoNavigateOutline } from "react-icons/io5";

export const getSidebarItems = (
  userRole: IRoleType,
  modules: any[] = [],
): ISidebarItem[] => {
  const baseItems: ISidebarItem[] = [
    {
      key: "home",
      label: "Home",
      icon: <HomeOutlined />,
      path: "http://localhost:3000/admin",
    },
    {
      key: "projects",
      label: "Projects",
      icon: <FolderOutlined />,
      path: "http://localhost:3000/admin/projects",
    },
    {
      key: "app-library",
      label: "App Library",
      icon: <AppstoreOutlined />,
<<<<<<< HEAD
      path: "http://localhost:3000/admin/app-library",
=======
      path: "/admin/app-library",
>>>>>>> f333b542ae586d1c9082c2e5125fedc036a2dd75
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
      path: "http://localhost:3000/admin/billing",
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
