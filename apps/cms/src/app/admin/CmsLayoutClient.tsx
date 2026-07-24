"use client";

import React, { useEffect } from "react";
import { AdminShell } from "@repo/shell";
import { useProjects } from "@repo/hooks";
import { useTenantId } from "@repo/hooks";
import { useAppRegistry } from "@repo/app-registry";
import { useNavigation } from "@repo/navigation";
import type { ISidebarItem, IUserProps } from "@repo/shared-types";
import { cmsAppMetadata } from "../../app.config";

interface CmsLayoutClientProps {
  children: React.ReactNode;
  sidebarItems: ISidebarItem[];
  user: IUserProps;
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

function CmsShellWrapper({ children, user }: { children: React.ReactNode; user: IUserProps }) {
  const tenantId = useTenantId();
  const { data: projects = [], isLoading: projectsLoading } = useProjects(tenantId);

  const quickProjects = projects.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
  }));

  return (
    <AdminShell
      user={user}
      appMode="sub"
      projects={quickProjects}
      projectsLoading={projectsLoading}
    >
      <CmsAppRegistration>
        {children}
      </CmsAppRegistration>
    </AdminShell>
  );
}

export default function CmsLayoutClient({ children, sidebarItems, user }: CmsLayoutClientProps) {
  return (
    <CmsShellWrapper user={user}>
      {children}
    </CmsShellWrapper>
  );
}