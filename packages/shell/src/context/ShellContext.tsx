"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import { ConfigProvider } from "antd";
import type { IUserProps } from "@repo/shared-types";
import { modernTheme, darkTheme } from "@repo/theme";
import Cookies from "js-cookie";

const PROJECT_ID_COOKIE = "ProjectId";
const PROJECT_NAME_COOKIE = "ProjectName";

export interface QuickProject {
  id: string;
  name: string;
  slug?: string;
  color?: string;
  description?: string;
}

export interface ShellTheme {
  mode: "light" | "dark";
  toggle: () => void;
}

export interface ShellContextValue {
  user: IUserProps | null;
  theme: ShellTheme;
  projects: QuickProject[];
  projectsLoading: boolean;
  currentProject: QuickProject | null;
  basePath: string;
  appMode: "main" | "sub";
  collapsed: boolean;
  isMobile: boolean;
  setCollapsed: (collapsed: boolean) => void;
  setCurrentProject: (project: QuickProject | null) => void;
  setProjects: (projects: QuickProject[]) => void;
  setProjectsLoading: (loading: boolean) => void;
  setBasePath: (path: string) => void;
}

const ShellContext = createContext<ShellContextValue | null>(null);

export function ShellProvider({
  children,
  user: initialUser,
  initialBasePath = "/admin",
  appMode = "main",
}: {
  children: React.ReactNode;
  user?: IUserProps | null;
  initialBasePath?: string;
  appMode?: "main" | "sub";
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentProject, setCurrentProject] = useState<QuickProject | null>(
    null,
  );
  const [projects, setProjects] = useState<QuickProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [basePath, setBasePath] = useState(initialBasePath);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCurrentProject({
      id: Cookies.get(PROJECT_ID_COOKIE) || "",
      name: Cookies.get(PROJECT_NAME_COOKIE) || "",
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo<ShellContextValue>(
    () => ({
      user: initialUser ?? null,
      theme: { mode: themeMode, toggle: toggleTheme },
      projects,
      projectsLoading,
      currentProject,
      basePath,
      appMode,
      collapsed,
      isMobile,
      setCollapsed,
      setCurrentProject,
      setProjects,
      setProjectsLoading,
      setBasePath,
    }),
    [
      initialUser,
      themeMode,
      toggleTheme,
      projects,
      projectsLoading,
      currentProject,
      basePath,
      appMode,
      collapsed,
      isMobile,
    ],
  );

  return (
    <ShellContext.Provider value={value}>
      <ConfigProvider theme={themeMode === "dark" ? darkTheme : modernTheme}>
        {children}
      </ConfigProvider>
    </ShellContext.Provider>
  );
}

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) {
    throw new Error("useShell must be used within a ShellProvider");
  }
  return ctx;
}
