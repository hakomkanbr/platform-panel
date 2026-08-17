import type { ApplicationDefinition } from "@repo/application-types";
import { OrdersNavigation } from "./orders-navigation";
import { OrdersRoot } from "./commerce/roots/OrdersRoot";

export const OrdersApplication: ApplicationDefinition = {
  id: "orders",
  name: "orders",
  version: "0.1.0",

  navigation: OrdersNavigation,

  routes: [],

  Root: OrdersRoot,
};
