"use client";

import React, { useEffect } from "react";
import { Layout } from "antd";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { NavigationProvider } from "@repo/navigation";
import { ShellProvider, useShell } from "../context/ShellContext";
import { useLocalization } from "@repo/localization";
import type { QuickProject } from "../context/ShellContext";
import { GlobalSidebar } from "../components/GlobalSidebar";
import { GlobalHeader } from "../components/GlobalHeader";
import ModernContent from "./ModernContent";
import type { IModule, ISidebarItem } from "@repo/shared-types";
import type { IUserProps } from "@repo/shared-types";
import type { ApplicationDefinition } from "@repo/application-types";

const { Sider } = Layout;

export interface AdminShellProps {
  children: React.ReactNode;
  user: IUserProps;
  modules?: IModule[];
  siteSlug?: string;
  onLogout?: () => void;
  siteRequiredPaths?: string[];
  basePath?: string;
  appMode?: "main" | "sub";
  application?: ApplicationDefinition;
  applications?: ApplicationDefinition[];
  headerComponents?: {
    siteSelect?: React.ReactNode;
    redirectWebsite?: React.ReactNode;
    migrateDatabase?: React.ReactNode;
  };
  currentProject?: QuickProject | null;
  projects?: QuickProject[];
  projectsLoading?: boolean;
}

const AdminShellInner: React.FC<{
  children: React.ReactNode;
  siteSlug?: string;
  onLogout?: () => void;
  siteRequiredPaths?: string[];
  headerComponents?: AdminShellProps["headerComponents"];
  currentProject?: { name: string; id: string | number } | null;
  projects?: QuickProject[];
  projectsLoading?: boolean;
  applications?: ApplicationDefinition[];
}> = ({
  children,
  siteSlug,
  onLogout,
  siteRequiredPaths = [],
  headerComponents,
  currentProject,
  projects: propProjects,
  projectsLoading: propProjectsLoading,
  applications,
}) => {
    const {
      collapsed,
      isMobile,
      basePath,
      setCollapsed,
      setProjects,
      setProjectsLoading,
      setCurrentProject,
    } = useShell();
    const { direction } = useLocalization();
    const isRTL = direction === "rtl";
    const router = useRouter();
    const sidebarWidth = 280;
    const sidebarCollapsedWidth = 80;

    useEffect(() => {
      if (propProjects) setProjects(propProjects);
    }, [propProjects, setProjects]);

    useEffect(() => {
      if (propProjectsLoading !== undefined)
        setProjectsLoading(propProjectsLoading);
    }, [propProjectsLoading, setProjectsLoading]);

    useEffect(() => {
      if (currentProject) {
        setCurrentProject({
          id: String(currentProject.id),
          name: currentProject.name,
        });
      } else {
        const storedId = Cookies.get("ProjectId");
        const storedName = Cookies.get("ProjectName");
        if (storedId && storedName) {
          setCurrentProject({
            id: storedId,
            name: storedName,
          });
        }
      }
    }, [currentProject, setCurrentProject]);

    useEffect(() => {
      if (
        !siteSlug &&
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith(`${basePath}/select-site`)
      ) {
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
            ...(isRTL ? { right: 12 } : { left: 12 }),
          }}
        >
          <GlobalSidebar />
        </Sider>

        <Layout
          className="modern-main-layout"
          style={{
            ...(isMobile ? {} : { marginLeft: isRTL ? 0 : collapsed ? sidebarCollapsedWidth + 24 : sidebarWidth + 24 }),
            ...(isMobile ? {} : { marginRight: isRTL ? (collapsed ? sidebarCollapsedWidth + 24 : sidebarWidth + 24) : 0 }),
            transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <GlobalHeader
            onLogout={onLogout}
            projects={propProjects}
            projectsLoading={propProjectsLoading}
            applications={applications}
            headerExtras={
              <>
                {headerComponents?.redirectWebsite}
                {process.env.NODE_ENV === "development" &&
                  headerComponents?.migrateDatabase}
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
  const { children, user, basePath = "/admin", appMode = "main", application, applications } = props;
  return (
    <NavigationProvider application={application}>
      <ShellProvider user={user} initialBasePath={basePath} appMode={appMode}>
        <AdminShellInner currentProject={props.currentProject} {...props} applications={applications}>{children}</AdminShellInner>
      </ShellProvider>
    </NavigationProvider>
  );
};

export default AdminShell;
