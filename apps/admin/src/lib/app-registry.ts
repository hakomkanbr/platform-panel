import { createApplicationRegistry } from "@repo/app-registry";
import { CmsApplication } from "@repo/apps-cms";
import { EcommerceApplication, PricingApplication, OrdersApplication, CustomersApplication } from "@repo/apps-ecommerce";

export const registry = createApplicationRegistry();

registry.register(CmsApplication);
registry.register(EcommerceApplication);
registry.register(PricingApplication);
registry.register(OrdersApplication);
registry.register(CustomersApplication);

export const allApplications = registry.getAll();
