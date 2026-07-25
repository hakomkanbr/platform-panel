"use client";

<<<<<<< HEAD
import React, { useEffect } from "react";
import { AdminShell, QuickProject } from "@repo/shell";
import { useProjects } from "@repo/hooks";
import { useTenantId } from "@repo/hooks";
import { useAppRegistry } from "@repo/app-registry";
import { useNavigation } from "@repo/navigation";
import type { ISidebarItem, IUserProps } from "@repo/shared-types";
import { cmsAppMetadata } from "../../app.config";
=======
import React from "react";
import { AdminShell } from "@repo/shell";
import QueryProvider from "@/components/common/QueryProvider";
import { useProjects } from "@/hooks/useApps";
import { useTenantId } from "@/hooks/useTenantId";
import type { ISidebarItem, IUserProps } from "@repo/shared-types";
>>>>>>> f333b542ae586d1c9082c2e5125fedc036a2dd75

interface CmsLayoutClientProps {
  children: React.ReactNode;
  sidebarItems: ISidebarItem[];
  user: IUserProps;
<<<<<<< HEAD
  currentProject: { id: string; name: string } | null;
}

function CmsAppRegistration({ children }: { children: React.ReactNode }) {
  const { registerApp, setActiveApp } = useAppRegistry();
  const { setAppNavigation } = useNavigation();

  useEffect(() => {
    registerApp(cmsAppMetadata);
    setActiveApp("cms");
    setAppNavigation(cmsAppMetadata.navigation);
  }, [registerApp, setActiveApp, setAppNavigation]);

  return <>{children}</>;
}

function CmsShellWrapper({
  children,
  user,
  currentProject,
}: {
  children: React.ReactNode;
  user: IUserProps;
  currentProject: QuickProject | null;
}) {
  const tenantId = useTenantId();
  const { data: projects = [], isLoading: projectsLoading } =
    useProjects(tenantId);
=======
}

function CmsShellWrapper({ children, sidebarItems, user }: CmsLayoutClientProps) {
  const tenantId = useTenantId();
  const { data: projects = [], isLoading: projectsLoading } = useProjects(tenantId);
>>>>>>> f333b542ae586d1c9082c2e5125fedc036a2dd75

  const quickProjects = projects.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
  }));

  return (
    <AdminShell
<<<<<<< HEAD
      user={user}
      appMode="sub"
      currentProject={currentProject}
      projects={quickProjects}
      projectsLoading={projectsLoading}
    >
      <CmsAppRegistration>{children}</CmsAppRegistration>
=======
      sidebarItems={sidebarItems}
      user={user}
      appMode="sub"
      projects={quickProjects}
      projectsLoading={projectsLoading}
    >
      {children}
>>>>>>> f333b542ae586d1c9082c2e5125fedc036a2dd75
    </AdminShell>
  );
}

<<<<<<< HEAD
export default function CmsLayoutClient({
  children,
  sidebarItems,
  user,
  currentProject,
}: CmsLayoutClientProps) {
  console.info("CmsLayoutClient.currentProject => ", currentProject);
  return (
    <CmsShellWrapper currentProject={currentProject} user={user}>
      {children}
    </CmsShellWrapper>
=======
export default function CmsLayoutClient({ children, sidebarItems, user }: CmsLayoutClientProps) {
  return (
    <QueryProvider>
      <CmsShellWrapper sidebarItems={sidebarItems} user={user}>
        {children}
      </CmsShellWrapper>
    </QueryProvider>
>>>>>>> f333b542ae586d1c9082c2e5125fedc036a2dd75
  );
}
