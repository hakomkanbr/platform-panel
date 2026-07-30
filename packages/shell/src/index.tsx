export { default as AdminShell } from "./layout";
export type { AdminShellProps } from "./layout";
export { default as ModernContent } from "./layout/ModernContent";
export { default as ModernSiteSelect } from "./header/ModernSiteSelect";
export { default as RedirectWebsite } from "./header/RedirectWebsite";
export { default as MigrateDatabase } from "./header/MigrateDatabase";
export { default as SelectProjectPage } from "./select-project";
export { loadApplication } from "./loader/loadApplication";

// New Architecture Exports
export { ShellProvider, useShell } from "./context/ShellContext";
export type {
  ShellContextValue,
  ShellTheme,
  QuickProject,
} from "./context/ShellContext";
export { GlobalHeader } from "./components/GlobalHeader";
export type { GlobalHeaderProps } from "./components/GlobalHeader";
export { GlobalSidebar } from "./components/GlobalSidebar";
export { ProjectSelector } from "./components/ProjectSelector";
export { ApplicationSelector } from "./components/ApplicationSelector";
export { WorkspaceSelector } from "./components/WorkspaceSelector";
