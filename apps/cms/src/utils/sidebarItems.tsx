// utils/sidebarItems.tsx
import {
  DashboardOutlined,
  GlobalOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  LinkOutlined,
  FormOutlined,
  FolderOutlined,
  UserOutlined,
  SettingOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { IRoleType } from "@/abstracts/user/user";
import { IoNavigateOutline } from "react-icons/io5";
import { ISidebarItem } from "@/abstracts/sidebar-item";

export const getSidebarItems = (
  userRole: IRoleType,
  modules: any[] = [],
): ISidebarItem[] => {
  const baseItems: ISidebarItem[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <DashboardOutlined />,
      path: "/admin",
    },
    {
      key: "pages",
      label: "Pages",
      icon: <FileTextOutlined />,
      path: "/admin/pages",
    },
    {
      key: "navigations",
      label: "Navigations",
      icon: <IoNavigateOutline />,
      path: "/admin/navigations",
    },
    {
      key: "modules",
      label: "Modules",
      icon: <AppstoreOutlined />,
      path: "/admin/modules",
    },
    {
      key: "collections",
      label: "Collections",
      icon: <DatabaseOutlined />,
      path: "/admin/collections",
    },
    {
      key: "relations",
      label: "Relations",
      icon: <LinkOutlined />,
      path: "/admin/relations",
    },
  ];

  return baseItems;
};
