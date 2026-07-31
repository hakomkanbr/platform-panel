import type { ApplicationDefinition } from "@repo/application-types";

// Placeholder component until ecommerce is implemented
function EcommerceRoot({ projectId }: { projectId: string }) {
  return null;
}

export const EcommerceApplication: ApplicationDefinition = {
  id: "ecommerce",
  name: "Ecommerce",
  version: "0.0.1",

  navigation: [
    {
      key: "products",
      label: "Products",
      path: "products",
    },
    {
      key: "orders",
      label: "Orders",
      path: "orders",
    },
    {
      key: "customers",
      label: "Customers",
      path: "customers",
    },
  ],

  routes: [
    { id: "dashboard", path: "", title: "Dashboard" },
    { id: "products", path: "products", title: "Products" },
    { id: "orders", path: "orders", title: "Orders" },
  ],

  Root: EcommerceRoot,
};
