"use client";

import React from "react";
import { EmptyState } from "@repo/ui";
import { useAppRoute } from "../useAppRoute";
import { PricingOverviewPage } from "./pricing-overview";
import { PriceListsPage } from "./price-lists/price-lists-page";
import { PriceListDetailPage } from "./price-lists/price-list-detail-page";
import { ProductPricesPage } from "./product-prices/product-prices-page";

export function PricingApp() {
  const route = useAppRoute("pricing");

  const [first, second] = route;

  if (!first || first === "overview") return <PricingOverviewPage />;
  if (first === "price-lists") {
    if (!second) return <PriceListsPage />;
    if (second === "new") return <PriceListsPage />;
    return <PriceListDetailPage id={second} />;
  }
  if (first === "product-prices") return <ProductPricesPage />;

  return (
    <div style={{ padding: 48 }}>
      <EmptyState
        title="Page not found"
        description="No pricing page matches this route."
      />
    </div>
  );
}
