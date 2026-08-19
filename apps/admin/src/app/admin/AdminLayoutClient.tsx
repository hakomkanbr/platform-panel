"use client";

import React, { useEffect, useMemo } from "react";
import { AdminShell } from "@repo/shell";
import { useProjects } from "@repo/hooks";
import { useTenantId } from "@repo/hooks";
import { MediaProvider } from "@repo/media";
import type { IUserProps } from "@repo/shared-types";
import { allApplications } from "@/lib/app-registry";

const PROJECT_ID_COOKIE = "ProjectId";
const PROJECT_NAME_COOKIE = "ProjectName";
const PROJECT_SLUG_COOKIE = "ProjectSlug";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

function clearStorageKeys(keys: string[]) {
  if (typeof window === "undefined") return;
  for (const key of keys) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}

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

  // Resolve the active project only from projects that actually belong to the
  // current tenant. A stale ProjectId cookie left over from a previous account
  // or session (new accounts have no projects yet) must never be sent to
  // MediaProvider, otherwise it fires
  //   GET /api/v1/cdn/connections/{staleId} -> 404
  // for every admin page.
  const activeProjectId = useMemo(() => {
    if (projectsLoading) return null;
    const cookieProjectId = readCookie(PROJECT_ID_COOKIE);
    const matched = cookieProjectId
      ? projects.find((p) => p.id === cookieProjectId)?.id
      : undefined;
    return matched || projects[0]?.id || null;
  }, [projects, projectsLoading]);

  // Remove project cookies/storage that point to a project the current tenant
  // no longer owns. This clears the stale UUID reported in the CDN 404 so it
  // cannot resurface after the new account finishes onboarding.
  useEffect(() => {
    if (projectsLoading) return;
    const stored = readCookie(PROJECT_ID_COOKIE);
    if (!stored) return;
    const stillOwnsProject = projects.some((p) => p.id === stored);
    if (stillOwnsProject) return;

    clearCookie(PROJECT_ID_COOKIE);
    clearCookie(PROJECT_NAME_COOKIE);
    clearCookie(PROJECT_SLUG_COOKIE);
    clearStorageKeys([
      PROJECT_ID_COOKIE,
      PROJECT_NAME_COOKIE,
      PROJECT_SLUG_COOKIE,
      "projectId",
    ]);
  }, [projects, projectsLoading]);

  return (
    <AdminShell
      user={user}
      projects={quickProjects}
      projectsLoading={projectsLoading}
      applications={allApplications}
    >
      {activeProjectId ? (
        <MediaProvider showEmptyState={false} projectId={activeProjectId}>
          {children}
        </MediaProvider>
      ) : (
        children
      )}
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