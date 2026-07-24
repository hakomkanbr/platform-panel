import type { AppMetadata } from "./types";

const registry = new Map<string, AppMetadata>();
let activeApp: string | null = null;

export const appRegistry = {
  register(metadata: AppMetadata): void {
    registry.set(metadata.id, metadata);
  },

  unregister(appId: string): void {
    registry.delete(appId);
    if (activeApp === appId) {
      activeApp = null;
    }
  },

  getApp(appId: string): AppMetadata | undefined {
    return registry.get(appId);
  },

  getAllApps(): AppMetadata[] {
    return Array.from(registry.values());
  },

  setActiveApp(appId: string | null): void {
    activeApp = appId;
  },

  getActiveApp(): AppMetadata | null {
    if (!activeApp) return null;
    return registry.get(activeApp) ?? null;
  },

  getActiveAppId(): string | null {
    return activeApp;
  },
};