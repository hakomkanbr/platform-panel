import type { ApplicationDefinition } from "@repo/application-types";
import { Navigation } from "./navigation";
import { EcommerceRoutes as Routes } from "./routes";
import { CatalogRoot } from "./commerce/roots/CatalogRoot";

export const EcommerceApplication: ApplicationDefinition = {
  id: "catalog",
  name: "catalog",
  version: "0.1.0",

  navigation: Navigation,

  routes: Routes,

  Root: CatalogRoot,
};
