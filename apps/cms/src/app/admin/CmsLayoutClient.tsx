"use client";

import React, { useEffect } from "react";
import { AdminShell, QuickProject } from "@repo/shell";
import { useProjects } from "@repo/hooks";
import { useTenantId } from "@repo/hooks";
import { useAppRegistry } from "@repo/app-registry";
import { useNavigation } from "@repo/navigation";
import type { ISidebarItem, IUserProps } from "@repo/shared-types";
import { cmsAppMetadata } from "../../app.config";
import QueryProvider from "@/components/common/QueryProvider";

interface CmsLayoutClientProps {
  children: React.ReactNode;
  sidebarItems: ISidebarItem[];
  user: IUserProps;
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


  const quickProjects = projects.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
  }));

  return (
    <AdminShell
      user={user}
      appMode="sub"
      currentProject={currentProject}
      projects={quickProjects}
      projectsLoading={projectsLoading}
    >
      <CmsAppRegistration>{children}</CmsAppRegistration>
    </AdminShell>
  );
}

export default function CmsLayoutClient({
  children,
  sidebarItems,
  user,
  currentProject,
}: CmsLayoutClientProps) {
  console.info("CmsLayoutClient.currentProject => ", currentProject);
  return (
    <QueryProvider>
      <CmsShellWrapper currentProject={currentProject} user={user}>
        {children}
      </CmsShellWrapper>
    </QueryProvider>
  );
}
