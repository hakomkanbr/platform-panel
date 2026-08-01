"use client";

import React from "react";
import { EmptyState } from "@repo/ui";
import { useAppRoute } from "../useAppRoute";
import { CatalogOverviewPage } from "./catalog-overview";
import { ProductsPage } from "./products/products-page";
import { ProductCreatePage } from "./products/product-create-page";
import { ProductDetailPage } from "./products/product-detail-page";
import { CategoriesPage } from "./categories/categories-page";
import { BrandsPage } from "./brands/brands-page";
import { TagsPage } from "./tags/tags-page";
import { AttributesPage } from "./attributes/attributes-page";

export function CatalogApp() {
  const route = useAppRoute("catalog");

  const [first, second] = route;

  if (!first || first === "overview") return <CatalogOverviewPage />;
  if (first === "products") {
    if (!second) return <ProductsPage />;
    if (second === "new") return <ProductCreatePage />;
    return <ProductDetailPage id={second} />;
  }
  if (first === "categories") return <CategoriesPage />;
  if (first === "brands") return <BrandsPage />;
  if (first === "tags") return <TagsPage />;
  if (first === "attributes") return <AttributesPage />;

  return (
    <div style={{ padding: 48 }}>
      <EmptyState
        title="Page not found"
        description={`No catalog page matches this route.`}
      />
    </div>
  );
}
