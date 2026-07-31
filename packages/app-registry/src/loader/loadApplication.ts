import type { AppRegistry } from "../registry";

export function loadApplication(registry: AppRegistry, id: string) {
  return registry.get(id);
}
