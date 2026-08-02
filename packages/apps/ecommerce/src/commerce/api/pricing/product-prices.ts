import * as http from "../http";
import type { PaginatedResult, ListParams } from "../../types/common";
import type {
  ProductPriceReadModel,
  ProductPriceFilters,
  CreateProductPriceCommand,
  UpdateProductPriceRequest,
  AddPriceTierBody,
  UpdatePriceTierBody,
  AddPriceConstraintBody,
  UpdatePriceConstraintBody,
  RejectProductPriceBody,
  ScheduleProductPriceBody,
  UpsertPriceMetadataBody,
} from "../../types/pricing";

export const productPricesApi = {
  list: (params?: ProductPriceFilters) =>
    http.get<PaginatedResult<ProductPriceReadModel>>("/Admin/ProductPrices", params),

  getById: (id: string) => http.get<ProductPriceReadModel>(`/Admin/ProductPrices/${id}`),

  getByProduct: (productId: string, variantId?: string) =>
    http.get<ProductPriceReadModel[]>(`/Admin/ProductPrices/by-product/${productId}`, variantId ? { variantId } : undefined),

  getVersionHistory: (id: string) =>
    http.get<unknown>(`/Admin/ProductPrices/${id}/versions`),

  create: (body: CreateProductPriceCommand) => http.post<ProductPriceReadModel>("/Admin/ProductPrices", body),

  update: (id: string, body: UpdateProductPriceRequest) =>
    http.put<ProductPriceReadModel>(`/Admin/ProductPrices/${id}`, body),

  delete: (id: string) => http.del<void>(`/Admin/ProductPrices/${id}`),

  publish: (id: string) => http.put<void>(`/Admin/ProductPrices/${id}/publish`),

  archive: (id: string) => http.put<void>(`/Admin/ProductPrices/${id}/archive`),

  activate: (id: string) => http.put<void>(`/Admin/ProductPrices/${id}/activate`),

  deactivate: (id: string) => http.put<void>(`/Admin/ProductPrices/${id}/deactivate`),

  submitForApproval: (id: string) =>
    http.put<void>(`/Admin/ProductPrices/${id}/submit-for-approval`),

  approve: (id: string) => http.put<void>(`/Admin/ProductPrices/${id}/approve`),

  reject: (id: string, body: RejectProductPriceBody) =>
    http.put<void>(`/Admin/ProductPrices/${id}/reject`, body),

  schedule: (id: string, body: ScheduleProductPriceBody) =>
    http.put<void>(`/Admin/ProductPrices/${id}/schedule`, body),

  expire: (id: string) => http.put<void>(`/Admin/ProductPrices/${id}/expire`),

  addTier: (id: string, body: AddPriceTierBody) =>
    http.put<ProductPriceReadModel>(`/Admin/ProductPrices/${id}/tiers`, body),

  updateTier: (id: string, tierId: string, body: UpdatePriceTierBody) =>
    http.put<ProductPriceReadModel>(`/Admin/ProductPrices/${id}/tiers/${tierId}`, body),

  deleteTier: (id: string, tierId: string) =>
    http.del<void>(`/Admin/ProductPrices/${id}/tiers/${tierId}`),

  addConstraint: (id: string, body: AddPriceConstraintBody) =>
    http.put<ProductPriceReadModel>(`/Admin/ProductPrices/${id}/constraints`, body),

  updateConstraint: (id: string, constraintId: string, body: UpdatePriceConstraintBody) =>
    http.put<ProductPriceReadModel>(`/Admin/ProductPrices/${id}/constraints/${constraintId}`, body),

  deleteConstraint: (id: string, constraintId: string) =>
    http.del<void>(`/Admin/ProductPrices/${id}/constraints/${constraintId}`),

  upsertMetadata: (id: string, body: UpsertPriceMetadataBody) =>
    http.put<void>(`/Admin/ProductPrices/${id}/metadata`, body),

  removeMetadata: (id: string, key: string) =>
    http.del<void>(`/Admin/ProductPrices/${id}/metadata/${key}`),
};