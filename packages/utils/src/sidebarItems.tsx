import {
  HomeOutlined,
  FolderOutlined,
  CreditCardOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import type { IRoleType, ISidebarItem } from "@repo/shared-types";

export const getSidebarItems = (userRole: IRoleType, modules: any[] = []): ISidebarItem[] => {
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
  ];

  baseItems.push({
    key: "billing",
    label: "Billing",
    icon: <CreditCardOutlined />,
    path: "/admin/billing",
  });

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
