"use client";

import React from "react";
import { EmptyState } from "@repo/ui";
import { useTranslations } from "@repo/localization";
import { useAppRoute } from "../useAppRoute";
import { OrdersPage } from "./orders-page";
import { ReturnsPage } from "./returns-page";
import { DraftOrdersPage } from "./draft-orders-page";

export function OrdersApp() {
  const route = useAppRoute("orders");
  const t = useTranslations();

  const [first] = route;

  if (!first || first === "overview" || first === "list") return <OrdersPage />;
  if (first === "returns") return <ReturnsPage />;
  if (first === "draft-orders") return <DraftOrdersPage />;

  return (
    <div style={{ padding: 48 }}>
      <EmptyState
        title={t("orders.pageNotFound")}
        description={t("orders.routeNotFound")}
      />
    </div>
  );
}
