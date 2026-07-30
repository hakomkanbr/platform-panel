import { appRegistry } from "../registry";

export function loadApplication(id: string) {
    return appRegistry.getApp(id);
}