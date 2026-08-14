"use client";

import { useCallback, useEffect, useState } from "react";
import { useProject, useProjects } from "@repo/hooks";
import type { ProjectDetailDto, ProjectDto } from "@repo/shared-types";

const PROJECT_COOKIE = "ProjectId";
const SLUG_COOKIE = "SiteSlug";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]!) : null;
}

function setCookie(name: string, value: string, days = 30) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export interface UseActiveProjectResult {
  projects: ProjectDto[];
  activeProjectId: string;
  project: ProjectDetailDto | undefined;
  projectError: Error | null;
  isLoading: boolean;
  switchProject: (projectId: string) => void;
}

export function useActiveProject(tenantId?: string): UseActiveProjectResult {
  const tid = tenantId || "";
  const [cookieProjectId, setCookieProjectId] = useState<string>("");

  useEffect(() => {
    setCookieProjectId(getCookie(PROJECT_COOKIE) || "");
  }, []);

  const {
    data: allProjects = [],
    isLoading: isProjectsLoading,
  } = useProjects(tid || undefined);

  const activeProjectId =
    cookieProjectId || allProjects[0]?.id || "";

  const {
    data: project,
    isLoading: isProjectLoading,
    error,
  } = useProject(activeProjectId, tid || undefined);

  useEffect(() => {
    if (activeProjectId && !cookieProjectId) {
      setCookie(PROJECT_COOKIE, activeProjectId);
      setCookieProjectId(activeProjectId);
      if (project?.slug) {
        setCookie(SLUG_COOKIE, project.slug);
      }
    }
  }, [activeProjectId, cookieProjectId, project?.slug]);

  const switchProject = useCallback(
    (selectedId: string) => {
      const selected = allProjects.find((p) => p.id === selectedId);
      setCookie(PROJECT_COOKIE, selectedId);
      if (selected?.slug) {
        setCookie(SLUG_COOKIE, selected.slug);
      }
      setCookieProjectId(selectedId);
    },
    [allProjects]
  );

  return {
    projects: allProjects,
    activeProjectId,
    project,
    projectError: error,
    isLoading: isProjectsLoading || (!!activeProjectId && isProjectLoading),
    switchProject,
  };
}