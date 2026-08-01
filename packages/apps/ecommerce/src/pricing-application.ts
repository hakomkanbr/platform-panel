import type { ApplicationDefinition } from "@repo/application-types";
import { PricingNavigation } from "./pricing-navigation";
import { PricingRoot } from "./commerce/roots/PricingRoot";

export const PricingApplication: ApplicationDefinition = {
  id: "pricing",
  name: "pricing",
  version: "0.1.0",

  navigation: PricingNavigation,

  routes: [],

  Root: PricingRoot,
};
