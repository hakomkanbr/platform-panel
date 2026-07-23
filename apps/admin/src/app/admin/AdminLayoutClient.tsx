"use client";

import React from "react";
import { AdminShell } from "@repo/shell";
import QueryProvider from "@/components/common/QueryProvider";
import { useProjects } from "@/hooks/useApps";
import { useTenantId } from "@/hooks/useTenantId";
import type { ISidebarItem, IUserProps } from "@repo/shared-types";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  sidebarItems: ISidebarItem[];
  user: IUserProps;
}

function AdminShellWrapper({ children, sidebarItems, user }: AdminLayoutClientProps) {
  const tenantId = useTenantId();
  const { data: projects = [], isLoading: projectsLoading } = useProjects(tenantId);

  const quickProjects = projects.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
  }));

  return (
    <AdminShell
      sidebarItems={sidebarItems}
      user={user}
      projects={quickProjects}
      projectsLoading={projectsLoading}
    >
      {children}
    </AdminShell>
  );
}

export default function AdminLayoutClient({ children, sidebarItems, user }: AdminLayoutClientProps) {
  return (
    <QueryProvider>
      <AdminShellWrapper sidebarItems={sidebarItems} user={user}>
        {children}
      </AdminShellWrapper>
    </QueryProvider>
  );
}
