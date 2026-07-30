"use client";

import React from "react";
import { AdminShell } from "@repo/shell";
import { useProjects } from "@repo/hooks";
import { useTenantId } from "@repo/hooks";
import type { ISidebarItem, IUserProps } from "@repo/shared-types";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: IUserProps;
}

function AdminShellWrapper({ children, user }: AdminLayoutClientProps) {
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
      projects={quickProjects}
      projectsLoading={projectsLoading}
    >
      {children}
    </AdminShell>
  );
}

export default function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  return (
    <AdminShellWrapper user={user}>
      {children}
    </AdminShellWrapper>
  );
}
