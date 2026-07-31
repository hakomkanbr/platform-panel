import type { ApplicationDefinition } from "@repo/application-types";

export interface AppRegistry {
  register(app: ApplicationDefinition): void;
  get(id: string): ApplicationDefinition | undefined;
  getAll(): ApplicationDefinition[];
  find(predicate: (app: ApplicationDefinition) => boolean): ApplicationDefinition[];
}

export function createApplicationRegistry(): AppRegistry {
  const apps = new Map<string, ApplicationDefinition>();

  return {
    register(app: ApplicationDefinition): void {
      apps.set(app.id, app);
    },

    get(id: string): ApplicationDefinition | undefined {
      return apps.get(id);
    },

    getAll(): ApplicationDefinition[] {
      return Array.from(apps.values());
    },

    find(predicate: (app: ApplicationDefinition) => boolean): ApplicationDefinition[] {
      return Array.from(apps.values()).filter(predicate);
    },
  };
}
