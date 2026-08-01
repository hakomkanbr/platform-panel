// project-storage.ts

export const STORAGE_KEY = "s2s:selectedProject";

export function getCurrentProjectId() {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  return JSON.parse(raw).projectId;
}
