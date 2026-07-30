import { Applications } from "./applications";

const registry = new Map(
  Applications.map(app => [app.id, app])
);

export const appRegistry = {
  getApp(id: string) {

    return registry.get(id);

  },

  getAllApps() {

    return [...registry.values()];

  }
};