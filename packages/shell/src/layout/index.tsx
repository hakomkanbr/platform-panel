"use client";
import React, { useEffect, useState } from "react";
import { Layout, ConfigProvider } from "antd";
import { useRouter } from "next/navigation";

import ModernSidebar from "../sidebar/ModernSidebar";
import ModernHeader from "../header/ModernHeader";
import ModernContent from "./ModernContent";
import type { IModule, ISidebarItem } from "@repo/shared-types";
import type { IUserProps } from "@repo/shared-types";

const { Sider } = Layout;

export interface AdminShellProps {
  children: React.ReactNode;
  user: IUserProps;
  sidebarItems: ISidebarItem[];
  siteSlug?: string;
  onLogout?: () => void;
  siteRequiredPaths?: string[];
  basePath?: string;
  headerComponents?: {
    siteSelect?: React.ReactNode;
    redirectWebsite?: React.ReactNode;
    migrateDatabase?: React.ReactNode;
    notifications?: React.ReactNode;
  };
  currentProject?: { name: string; id: string | number } | null;
}

const AdminShell: React.FC<AdminShellProps> = ({
  children,
  user,
  sidebarItems,
  siteSlug,
  onLogout,
  siteRequiredPaths = [],
  basePath = "/admin",
  headerComponents,
  currentProject,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const customTheme = {
    token: {
      colorPrimary: "#6366f1",
      colorBgContainer: "#ffffff",
      colorBgLayout: "#f8fafc",
      borderRadius: 12,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    components: {
      Layout: {
        siderBg: "#ffffff",
        headerBg: "#ffffff",
        bodyBg: "#f8fafc",
      },
      Menu: {
        itemBg: "transparent",
        itemSelectedBg: "#f1f5f9",
        itemHoverBg: "#f8fafc",
        itemSelectedColor: "#6366f1",
        itemColor: "#64748b",
        iconSize: 18,
        fontSize: 14,
        itemHeight: 48,
        itemMarginInline: 8,
        itemBorderRadius: 8,
      },
    },
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
        setSidebarWidth(0);
      } else {
        setSidebarWidth(collapsed ? 80 : 280);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed]);

  useEffect(() => {
    if (!siteSlug && !location.pathname.startsWith(`${basePath}/select-site`)) {
      const needsSite = siteRequiredPaths.some((path) =>
        location.pathname.startsWith(path),
      );
      if (needsSite) {
        location.href = `${basePath}/select-site?next=${location.pathname}`;
      }
    }
  }, [siteSlug, basePath, siteRequiredPaths]);

  const handleCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
    setSidebarWidth(collapsed ? 80 : 280);
  };

  return (
    <ConfigProvider theme={customTheme}>
      <Layout
        className="modern-layout"
        style={{ minHeight: "100vh", background: "#f8fafc" }}
      >
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={sidebarWidth}
          collapsedWidth={isMobile ? 0 : 80}
          className="modern-sidebar"
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            height: "100vh",
            zIndex: 1000,
            background: "#ffffff",
            borderRight: "1px solid #e2e8f0",
            boxShadow: "4px 0 6px -1px rgb(0 0 0 / 0.1)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <ModernSidebar
            collapsed={collapsed}
            sidebarItems={sidebarItems}
            user={user}
            router={router}
            isMobile={isMobile}
            onCollapse={handleCollapse}
          />
        </Sider>

        <Layout
          className="modern-main-layout"
          style={{
            marginLeft: isMobile ? 0 : sidebarWidth,
            transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background: "#f8fafc",
          }}
        >
          <ModernHeader
            collapsed={collapsed}
            user={user}
            onCollapse={handleCollapse}
            isMobile={isMobile}
            onLogout={onLogout}
            headerComponents={headerComponents}
            basePath={basePath}
            currentProject={currentProject}
          />
          <ModernContent>{children}</ModernContent>
        </Layout>

        {isMobile && !collapsed && (
          <div
            className="mobile-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={() => handleCollapse(true)}
          />
        )}
      </Layout>

      <style jsx global>{`
        .modern-layout .ant-layout-sider-children {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .modern-layout .ant-menu {
          border: none !important;
          background: transparent !important;
        }

        .modern-layout .ant-menu-item {
          margin: 4px 8px !important;
          border-radius: 8px !important;
          height: 48px !important;
          line-height: 48px !important;
          display: flex !important;
          align-items: center !important;
        }

        .modern-layout .ant-menu-item-selected {
          background: linear-gradient(
            135deg,
            #6366f1 0%,
            #8b5cf6 100%
          ) !important;
          color: white !important;
        }

        .modern-layout .ant-menu-item-selected .ant-menu-item-icon {
          color: white !important;
        }

        .modern-layout .ant-menu-item:hover {
          background: #f1f5f9 !important;
          color: #6366f1 !important;
        }

        .modern-layout .ant-menu-submenu-title {
          margin: 4px 8px !important;
          border-radius: 8px !important;
          height: 48px !important;
          line-height: 48px !important;
        }

        .modern-layout .ant-menu-submenu-title:hover {
          background: #f1f5f9 !important;
          color: #6366f1 !important;
        }

        .modern-layout .ant-layout-header {
          padding: 0 24px !important;
          background: white !important;
          border-bottom: 1px solid #e2e8f0 !important;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1) !important;
        }

        .modern-layout .ant-layout-content {
          margin: 24px !important;
          padding: 0 !important;
          background: transparent !important;
        }

        @media (max-width: 768px) {
          .modern-layout .ant-layout-content {
            margin: 16px !important;
          }
        }
      `}</style>
    </ConfigProvider>
  );
};

export default AdminShell;
