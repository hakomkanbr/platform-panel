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
  LayoutOutlined,
  MenuOutlined,
  BuildOutlined,
  TagOutlined,
  ThunderboltOutlined,
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
      key: "presets",
      label: "Presets",
      icon: <ThunderboltOutlined />,
      path: "/admin/presets",
    },
    {
      key: "contents",
      label: "Contents",
      icon: <FileTextOutlined />,
      path: "/admin/contents",
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
    {
        key: "templates",
        label: "Templates",
        icon: <LayoutOutlined />,
        path: "/admin/templates",
    },
    {
        key: "themes",
        label: "Themes",
        icon: <LayoutOutlined />,
        path: "/admin/themes",
    },
    {
        key: "menus",
        label: "Menus",
        icon: <MenuOutlined />,
        path: "/admin/menus",
    },
    {
        key: "components",
        label: "Components",
        icon: <BuildOutlined />,
        path: "/admin/components",
    },
    {
        key: "tags",
        label: "Tags",
        icon: <TagOutlined />,
        path: "/admin/tags",
    },
  ];

  return baseItems;
};
