"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
  getProjectIdFromUrl, getTenantIdFromUrl, getTenantIdFromKeycloak,
  fetchMyProjects, fetchProjects, fetchProject, createMyProject, createProject,
  type ProjectDetailDto, ProjectDto,
} from "@/lib/project-context";
import { STORAGE_KEY } from "@/lib/api/project-storage";

interface ProjectContextValue {
  project: ProjectDetailDto | null;
  projects: ProjectDto[];
  tenantId: string | null;
  projectId: string | null;
  isLoading: boolean;
  isProjectsLoading: boolean;
  error: string | null;
  switchProject: (projectId: string) => Promise<void>;
  refreshProject: () => Promise<void>;
  loadProjectsList: (force?: boolean) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextValue>({
  project: null, projects: [], tenantId: null, projectId: null,
  isLoading: true, isProjectsLoading: false, error: null,
  switchProject: async () => {}, refreshProject: async () => {}, loadProjectsList: async () => {},
});

export function useProject() { return useContext(ProjectContext); }

const PROJECT_ID_KEY = "s2s:projectId";
const PROJECTS_TTL = 60_000;

function readCachedSelection(): { tenantId: string | null; projectId: string | null } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function writeCachedSelection(tenantId: string | null, projectId: string | null) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ tenantId, projectId }));
    if (projectId) sessionStorage.setItem(PROJECT_ID_KEY, projectId);
    else sessionStorage.removeItem(PROJECT_ID_KEY);
  } catch { }
}

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [project, setProject] = useState<ProjectDetailDto | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initRef = useRef(false);
  const projectsFetchedAtRef = useRef<number>(0);
  const projectsInFlightRef = useRef<Promise<void> | null>(null);
  const activeProjectReqRef = useRef(0);

  const resolveTenantId = useCallback((): string | null => {
    return getTenantIdFromUrl() || getTenantIdFromKeycloak();
  }, []);

  const loadProject = useCallback(async (pid: string, tid?: string) => {
    const reqId = ++activeProjectReqRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const p = await fetchProject(pid, tid);
      if (reqId !== activeProjectReqRef.current) return;
      setProject(p);
      setProjectId(p.id);
      setTenantId(p.tenantId);
      writeCachedSelection(p.tenantId, p.id);
    } catch (err: any) {
      if (reqId !== activeProjectReqRef.current) return;
      setError(err?.message || "Failed to load project");
    } finally {
      if (reqId === activeProjectReqRef.current) setIsLoading(false);
    }
  }, []);

  const loadProjectsList = useCallback(async (force = false) => {
    const isFresh = Date.now() - projectsFetchedAtRef.current < PROJECTS_TTL;
    if (!force && isFresh && projects.length > 0) return;
    if (projectsInFlightRef.current) return projectsInFlightRef.current;

    const task = (async () => {
      setIsProjectsLoading(true);
      try {
        const list = tenantId ? await fetchProjects(tenantId) : await fetchMyProjects();
        setProjects(list);
        projectsFetchedAtRef.current = Date.now();
      } catch (err: any) {
        setError(err?.message || "Failed to load projects");
      } finally {
        setIsProjectsLoading(false);
        projectsInFlightRef.current = null;
      }
    })();
    projectsInFlightRef.current = task;
    return task;
  }, [tenantId, projects.length]);

  const ensureProject = useCallback(async (tid: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const list = tid ? await fetchProjects(tid) : await fetchMyProjects();
      let resolvedTenantId = tid;
      if (list.length > 0) {
        resolvedTenantId = resolvedTenantId || list[0].tenantId;
        setProjects(list);
        projectsFetchedAtRef.current = Date.now();
        setTenantId(resolvedTenantId);
        await loadProject(list[0].id, resolvedTenantId);
      } else {
        const newProjectId = tid
          ? await createProject(tid, "My Store", "Auto-created project")
          : await createMyProject("My Store", "Auto-created project");
        if (!resolvedTenantId) {
          const p = await fetchProject(newProjectId);
          resolvedTenantId = p.tenantId;
        }
        setTenantId(resolvedTenantId!);
        await loadProject(newProjectId, resolvedTenantId!);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to initialize project");
    } finally {
      setIsLoading(false);
    }
  }, [loadProject]);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      setIsLoading(true);
      const urlTid = resolveTenantId();
      const urlPid = getProjectIdFromUrl();
      const cached = readCachedSelection();

      if (urlTid && urlPid) { setTenantId(urlTid); await loadProject(urlPid, urlTid); return; }
      if (urlPid) { await loadProject(urlPid, cached?.tenantId || undefined); return; }
      if (cached?.projectId) { setTenantId(cached.tenantId); await loadProject(cached.projectId, cached.tenantId || undefined); return; }
      await ensureProject(urlTid);
    };
    init();
  }, []);

  const switchProject = useCallback(async (newProjectId: string) => {
    if (newProjectId === projectId) return;
    await loadProject(newProjectId, tenantId || undefined);
  }, [projectId, tenantId, loadProject]);

  const refreshProject = useCallback(async () => {
    if (projectId) await loadProject(projectId, tenantId || undefined);
  }, [projectId, tenantId, loadProject]);

  return (
    <ProjectContext.Provider value={{
      project, tenantId, projectId, isLoading, isProjectsLoading,
      projects, error, switchProject, refreshProject, loadProjectsList,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}
