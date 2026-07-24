import {
  DashboardOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  LinkOutlined,
  FormOutlined,
} from "@ant-design/icons";
import type { AppMetadata } from "@repo/app-registry";

export const cmsAppMetadata: AppMetadata = {
  id: "cms",
  name: "CMS",
  description: "Content Management System",
  version: "1.0.0",
  icon: <FileTextOutlined />,
  baseRoute: "/admin",
  navigation: [
    {
      key: "cms-dashboard",
      label: "Overview",
      icon: <DashboardOutlined />,
      path: "/admin",
      description: "CMS Dashboard",
    },
    {
      key: "pages",
      label: "Pages",
      icon: <FileTextOutlined />,
      path: "/admin/pages",
      description: "Manage pages",
    },
    {
      key: "navigations",
      label: "Navigations",
      icon: <AppstoreOutlined />,
      path: "/admin/navigations",
      description: "Manage navigation menus",
    },
    {
      key: "modules",
      label: "Modules",
      icon: <DatabaseOutlined />,
      path: "/admin/modules",
      description: "Manage content modules",
    },
    {
      key: "collections",
      label: "Collections",
      icon: <DatabaseOutlined />,
      path: "/admin/collections",
      description: "Manage collections",
    },
    {
      key: "relations",
      label: "Relations",
      icon: <LinkOutlined />,
      path: "/admin/relations",
      description: "Manage relations",
    },
    {
      key: "forms",
      label: "Forms",
      icon: <FormOutlined />,
      path: "/admin/forms",
      description: "Manage forms",
    },
  ],
};