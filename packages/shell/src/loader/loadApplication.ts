import { ApplicationRegistry } from "../registry";

export function loadApplication(id: string) {
    return ApplicationRegistry.find((x: any) => x.id === id);
}