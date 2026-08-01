import { createApplicationRegistry } from "@repo/app-registry";
import { CmsApplication } from "@repo/apps-cms";
import { EcommerceApplication, PricingApplication } from "@repo/apps-ecommerce";

export const registry = createApplicationRegistry();

registry.register(CmsApplication);
registry.register(EcommerceApplication);
registry.register(PricingApplication);

export const allApplications = registry.getAll();
