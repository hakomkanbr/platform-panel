"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Layout } from "antd";
import { useRouter } from "next/navigation";
import { NavigationProvider } from "@repo/navigation";
import { AppRegistryProvider } from "@repo/app-registry";
import { ShellProvider, useShell } from "../context/ShellContext";
import type { QuickProject } from "../context/ShellContext";
import { GlobalSidebar } from "../components/GlobalSidebar";
import { GlobalHeader } from "../components/GlobalHeader";
import type { GlobalHeaderProps } from "../components/GlobalHeader";
import ModernContent from "./ModernContent";
import type { IModule, ISidebarItem } from "@repo/shared-types";
import type { IUserProps } from "@repo/shared-types";

const { Sider } = Layout;

export interface AdminShellProps {
  children: React.ReactNode;
  user: IUserProps;
  sidebarItems?: ISidebarItem[];
  modules?: IModule[];
  siteSlug?: string;
  onLogout?: () => void;
  siteRequiredPaths?: string[];
  basePath?: string;
  appMode?: 'main' | 'sub';
  headerComponents?: {
    siteSelect?: React.ReactNode;
    redirectWebsite?: React.ReactNode;
    migrateDatabase?: React.ReactNode;
  };
  currentProject?: { name: string; id: string | number } | null;
  projects?: QuickProject[];
  projectsLoading?: boolean;
}

const AdminShellInner: React.FC<{
  children: React.ReactNode;
  sidebarItems?: ISidebarItem[];
  siteSlug?: string;
  onLogout?: () => void;
  siteRequiredPaths?: string[];
  headerComponents?: AdminShellProps["headerComponents"];
  currentProject?: { name: string; id: string | number } | null;
  projects?: QuickProject[];
  projectsLoading?: boolean;
}> = ({
  children,
  sidebarItems,
  siteSlug,
  onLogout,
  siteRequiredPaths = [],
  headerComponents,
  currentProject,
  projects: propProjects,
  projectsLoading: propProjectsLoading,
}) => {
  const { collapsed, isMobile, basePath, setCollapsed, setProjects, setProjectsLoading, setCurrentProject } = useShell();
  const router = useRouter();
  const sidebarWidth = 280;
  const sidebarCollapsedWidth = 80;

  useEffect(() => {
    if (propProjects) setProjects(propProjects);
  }, [propProjects, setProjects]);

  useEffect(() => {
    if (propProjectsLoading !== undefined) setProjectsLoading(propProjectsLoading);
  }, [propProjectsLoading, setProjectsLoading]);

  useEffect(() => {
    if (currentProject) {
      setCurrentProject({
        id: String(currentProject.id),
        name: currentProject.name,
      });
    }
  }, [currentProject, setCurrentProject]);

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

  return (
    <Layout className="modern-layout" style={{ minHeight: "100vh" }}>
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
        <GlobalSidebar />
      </Sider>

      <Layout
        className="modern-main-layout"
        style={{
          marginLeft: isMobile ? 0 : (collapsed ? sidebarCollapsedWidth + 24 : sidebarWidth + 24),
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <GlobalHeader
          onLogout={onLogout}
          projects={propProjects}
          projectsLoading={propProjectsLoading}
          headerExtras={
            <>
              {headerComponents?.redirectWebsite}
              {process.env.NODE_ENV === "development" && headerComponents?.migrateDatabase}
            </>
          }
        />
        <div style={{ padding: "24px 32px" }}>
          <ModernContent>{children}</ModernContent>
        </div>
      </Layout>

      {isMobile && !collapsed && (
        <div
          className="s2s-mobile-overlay"
          onClick={() => setCollapsed(true)}
        />
      )}
    </Layout>
  );
};

const AdminShell: React.FC<AdminShellProps> = (props) => {
  const {
    children,
    user,
    basePath = "/admin",
    appMode = "main",
  } = props;

  return (
    <AppRegistryProvider>
      <NavigationProvider>
        <ShellProvider user={user} initialBasePath={basePath} appMode={appMode}>
          <AdminShellInner {...props}>
            {children}
          </AdminShellInner>
        </ShellProvider>
      </NavigationProvider>
    </AppRegistryProvider>
  );
};

export default AdminShell;