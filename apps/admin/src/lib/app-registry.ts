import { createApplicationRegistry } from "@repo/app-registry";
import { CmsApplication } from "@repo/apps-cms";
import { EcommerceApplication } from "@repo/apps-ecommerce";

export const registry = createApplicationRegistry();

registry.register(CmsApplication);
registry.register(EcommerceApplication);

export const allApplications = registry.getAll();
