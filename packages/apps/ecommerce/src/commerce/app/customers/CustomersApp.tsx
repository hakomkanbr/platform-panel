"use client";

import React from "react";
import { EmptyState } from "@repo/ui";
import { useTranslations } from "@repo/localization";
import { useAppRoute } from "../useAppRoute";
import { CustomersPage } from "./customers-page";
import { CustomerGroupsPage } from "./customer-groups-page";
import { CustomerAddressesPage } from "./customer-addresses-page";

export function CustomersApp() {
  const route = useAppRoute("customers");
  const t = useTranslations();

  const [first] = route;

  if (!first || first === "overview" || first === "list") return <CustomersPage />;
  if (first === "groups") return <CustomerGroupsPage />;
  if (first === "addresses") return <CustomerAddressesPage />;

  return (
    <div style={{ padding: 48 }}>
      <EmptyState
        title={t("customers.pageNotFound")}
        description={t("customers.routeNotFound")}
      />
    </div>
  );
}
