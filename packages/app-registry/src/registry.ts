import type { ApplicationDefinition } from "./types";

const registry = new Map<string, ApplicationDefinition>();

export const appRegistry = {
  registerApp(app: ApplicationDefinition): void {
    registry.set(app.id, app);
  },

  getApp(id: string): ApplicationDefinition | undefined {
    return registry.get(id);
  },

  getAllApps(): ApplicationDefinition[] {
    return Array.from(registry.values());
  }
};
