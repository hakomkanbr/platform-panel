"use client";
import React, { useEffect, useState } from "react";
import { Layout, ConfigProvider } from "antd";
import { useRouter } from "next/navigation";
import { modernTheme } from "@repo/theme";

import ModernSidebar from "../sidebar/ModernSidebar";
import ModernHeader from "../header/ModernHeader";
import ModernContent from "./ModernContent";
import type { IModule, ISidebarItem } from "@repo/shared-types";
import type { IUserProps } from "@repo/shared-types";

const { Sider } = Layout;

interface QuickProject {
  id: string;
  name: string;
  slug?: string;
  color?: string;
}

export interface AdminShellProps {
  children: React.ReactNode;
  user: IUserProps;
  sidebarItems?: ISidebarItem[];
  modules?: IModule[];
  siteSlug?: string;
  onLogout?: () => void;
  siteRequiredPaths?: string[];
  basePath?: string;
  headerComponents?: {
    siteSelect?: React.ReactNode;
    redirectWebsite?: React.ReactNode;
    migrateDatabase?: React.ReactNode;
  };
  currentProject?: { name: string; id: string | number } | null;
  projects?: QuickProject[];
  projectsLoading?: boolean;
}

const AdminShell: React.FC<AdminShellProps> = ({
  children,
  user,
  sidebarItems,
  modules,
  siteSlug,
  onLogout,
  siteRequiredPaths = [],
  basePath = "/admin",
  headerComponents,
  currentProject,
  projects,
  projectsLoading,
}) => {
  const resolvedSidebarItems: ISidebarItem[] = sidebarItems || (modules || []).map((mod) => ({
    key: mod.slug,
    label: mod.name,
    path: `/${mod.slug}`,
  }));
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const sidebarWidth = 280;
  const sidebarCollapsedWidth = 80;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!siteSlug && typeof window !== 'undefined' && !window.location.pathname.startsWith(`${basePath}/select-site`)) {
      const needsSite = siteRequiredPaths.some((path) =>
        window.location.pathname.startsWith(path),
      );
      if (needsSite) {
        window.location.href = `${basePath}/select-site?next=${window.location.pathname}`;
      }
    }
  }, [siteSlug, basePath, siteRequiredPaths]);

  const handleCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  return (
    <ConfigProvider theme={modernTheme}>
      <Layout
        className="modern-layout"
        style={{ minHeight: "100vh" }}
      >
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={sidebarWidth}
          collapsedWidth={isMobile ? 0 : sidebarCollapsedWidth}
          className="s2s-sidebar-floating"
          style={{
            position: "fixed",
            left: 12,
            top: 12,
            bottom: 12,
            height: "calc(100vh - 24px)",
            zIndex: 1000,
            background: "#FFFFFF",
            borderRadius: 16,
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.04)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden",
          }}
        >
          <ModernSidebar
            collapsed={collapsed}
            sidebarItems={resolvedSidebarItems}
            user={user}
            router={router}
            isMobile={isMobile}
            onCollapse={handleCollapse}
            projects={projects}
            projectsLoading={projectsLoading}
          />
        </Sider>

        <Layout
          className="modern-main-layout"
          style={{
            marginLeft: isMobile ? 0 : (collapsed ? sidebarCollapsedWidth + 24 : sidebarWidth + 24),
            transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
          <div style={{ padding: "24px 32px" }}>
            <ModernContent>{children}</ModernContent>
          </div>
        </Layout>

        {isMobile && !collapsed && (
          <div
            className="s2s-mobile-overlay"
            onClick={() => handleCollapse(true)}
          />
        )}
      </Layout>
    </ConfigProvider>
  );
};

export default AdminShell;