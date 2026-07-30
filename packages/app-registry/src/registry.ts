import { Applications } from "./applications";
import type { ApplicationDefinition } from "./types";

const registry = new Map(
  Applications.map(app => [app.id, app])
);

export const appRegistry = {
  getApp(id: string): ApplicationDefinition | undefined {
    return registry.get(id);
  },

  getAllApps(): ApplicationDefinition[] {
    return Array.from(registry.values());
  }
};
