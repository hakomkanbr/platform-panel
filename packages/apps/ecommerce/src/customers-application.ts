import type { ApplicationDefinition } from "@repo/application-types";
import { CustomersNavigation } from "./customers-navigation";
import { CustomersRoot } from "./commerce/roots/CustomersRoot";

export const CustomersApplication: ApplicationDefinition = {
  id: "customers",
  name: "customers",
  version: "0.1.0",

  navigation: CustomersNavigation,

  routes: [],

  Root: CustomersRoot,
};
