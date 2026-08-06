"use client";

import React from "react";
import { EmptyState } from "@repo/ui";
import { useTranslations } from "@repo/localization";
import { useAppRoute } from "../useAppRoute";
import { CatalogOverviewPage } from "./catalog-overview";
import { ProductsPage } from "./products/products-page";
import { ProductWorkspace } from "./products/product-workspace";
import { CategoriesPage } from "./categories/categories-page";
import { BrandsPage } from "./brands/brands-page";
import { TagsPage } from "./tags/tags-page";
import { AttributesPage } from "./attributes/attributes-page";

export function CatalogApp() {
  const route = useAppRoute("catalog");
  const t = useTranslations();

  const [first, second] = route;

  if (!first || first === "overview") return <CatalogOverviewPage />;
  if (first === "products") {
    if (!second) return <ProductsPage />;
    if (second === "new") return <ProductWorkspace id={null} />;
    return <ProductWorkspace id={second} />;
  }
  if (first === "categories") return <CategoriesPage />;
  if (first === "brands") return <BrandsPage />;
  if (first === "tags") return <TagsPage />;
  if (first === "attributes") return <AttributesPage />;

  return (
    <div style={{ padding: 48 }}>
      <EmptyState
        title={t("catalog.pageNotFound")}
        description={t("catalog.routeNotFound")}
      />
    </div>
  );
}
