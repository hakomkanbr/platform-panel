import * as http from "../http";
import type { PaginatedResult, ListParams, KeyValue } from "../../types/common";
import type { PriceConstraint, PriceTier, ProductPrice, ProductPriceUpsertRequest } from "../../types/pricing";

export interface ProductPriceFilters extends ListParams {
  productId?: string;
  priceListId?: string;
  status?: string;
  currencyId?: string;
}

export const productPricesApi = {
  list: (params?: ProductPriceFilters) =>
    http.get<PaginatedResult<ProductPrice> | ProductPrice[]>("/Admin/ProductPrices", params),

  getById: (id: string) => http.get<ProductPrice>(`/Admin/ProductPrices/${id}`),

  create: (body: ProductPriceUpsertRequest) => http.post<ProductPrice>("/Admin/ProductPrices", body),

  update: (id: string, body: Partial<ProductPriceUpsertRequest>) =>
    http.put<ProductPrice>(`/Admin/ProductPrices/${id}`, body),

  delete: (id: string) => http.del<void>(`/Admin/ProductPrices/${id}`),

  getTiers: (id: string) => http.get<PriceTier[]>(`/Admin/ProductPrices/${id}/tiers`),

  addTier: (id: string, body: Partial<PriceTier>) => http.post<PriceTier>(`/Admin/ProductPrices/${id}/tiers`, body),

  updateTier: (id: string, tierId: string, body: Partial<PriceTier>) =>
    http.put<PriceTier>(`/Admin/ProductPrices/${id}/tiers/${tierId}`, body),

  deleteTier: (id: string, tierId: string) => http.del<void>(`/Admin/ProductPrices/${id}/tiers/${tierId}`),

  getConstraints: (id: string) => http.get<PriceConstraint[]>(`/Admin/ProductPrices/${id}/constraints`),

  addConstraint: (id: string, body: Partial<PriceConstraint>) =>
    http.post<PriceConstraint>(`/Admin/ProductPrices/${id}/constraints`, body),

  updateConstraint: (id: string, constraintId: string, body: Partial<PriceConstraint>) =>
    http.put<PriceConstraint>(`/Admin/ProductPrices/${id}/constraints/${constraintId}`, body),

  deleteConstraint: (id: string, constraintId: string) =>
    http.del<void>(`/Admin/ProductPrices/${id}/constraints/${constraintId}`),

  setMetadata: (id: string, metadata: KeyValue[]) => http.put<void>(`/Admin/ProductPrices/${id}/metadata`, { metadata }),

  getVersions: (id: string) => http.get<KeyValue[]>(`/Admin/ProductPrices/${id}/versions`),
};
