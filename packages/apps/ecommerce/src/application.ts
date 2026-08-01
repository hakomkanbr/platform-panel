import { Navigation } from "./navigation";
import EcommerceAppRoot from "./Root";
import { EcommerceRoutes as Routes } from "./routes";
import type { ApplicationDefinition } from "@repo/application-types";

export const EcommerceApplication: ApplicationDefinition = {
    id: "catalog",
    name: "catalog",
    version: "0.0.1",

    navigation: Navigation,

    routes: Routes,

    Root: EcommerceAppRoot
};
