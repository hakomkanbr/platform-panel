import type { Id, KeyValue } from "./common";

/* ---------------------------------- Enums ---------------------------------- */

export type PriceListStatus = 1 | 2 | 3 | 4;
export type TaxMode = 1 | 2;
export type PricingStatus = 1 | 2 | 3 | 4 | 5 | 6;
export type ApprovalStatus = 1 | 2 | 3 | 4;
export type PriceConstraintType = 1 | 2 | 3 | 4 | 5;
export type PriceChangeReason = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/* ---------------------------------- Price List ---------------------------------- */

export interface PriceListReadModel {
  id: Id;
  code: string;
  name: string;
  description?: string | null;
  status: PriceListStatus;
  taxMode: TaxMode;
  currencyId: string;
  currencyCode?: string;
  priority: number;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string | null;
  publishedAt?: string | null;
  archivedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  versionNumber: number;
  translations: PriceListTranslationReadModel[];
  customerGroupIds: Id[];
  channelIds: Id[];
  regionIds: Id[];
  storeIds: Id[];
  metadata: KeyValueReadModel[];
  versions: PriceListVersionReadModel[];
}

export interface PriceListTranslationReadModel {
  languageId: Id;
  cultureCode: string;
  name: string;
  description?: string | null;
}

export interface PriceListVersionReadModel {
  id: Id;
  versionNumber: number;
  changeSummary: string;
  changedBy?: string | null;
  changedAt: string;
}

export interface KeyValueReadModel {
  id: Id;
  key: string;
  value: string;
}

export interface CreatePriceListCommand {
  code?: string;
  name: string;
  description?: string | null;
  taxMode: TaxMode;
  currencyId?: string;
  priority?: number;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
}

export interface UpdatePriceListRequest {
  name: string;
  description?: string | null;
  taxMode: TaxMode;
  currencyId: string;
  priority: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
}

export interface PriceListFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  languageId?: string;
}

export interface AddPriceListTranslationBody {
  languageId: Id;
  cultureCode: string;
  name: string;
  description?: string | null;
}

export interface UpdatePriceListTranslationBody {
  name: string;
  description?: string | null;
}

export interface AssignCustomerGroupBody {
  customerGroupId: Id;
}

export interface AssignChannelBody {
  channelId: Id;
}

export interface AssignRegionBody {
  regionId: Id;
}

export interface AssignStoreBody {
  storeId: Id;
}

export interface UpsertMetadataBody {
  key: string;
  value: string;
}

/* ---------------------------------- Product Price ---------------------------------- */

export interface ProductPriceReadModel {
  id: Id;
  productId: Id;
  variantId?: Id | null;
  currencyId: string;
  currencyCode?: string;
  priceListId?: Id | null;
  customerGroupId?: Id | null;
  channelId?: Id | null;
  regionId?: Id | null;
  storeId?: Id | null;
  basePrice: number;
  compareAtPrice?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  costPrice?: number | null;
  status: PricingStatus;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string | null;
  versionNumber: number;
  publishedAt?: string | null;
  archivedAt?: string | null;
  approvalStatus: ApprovalStatus;
  externalReference?: ExternalReferenceReadModel | null;
  tiers: PriceTierReadModel[];
  constraints: PriceConstraintReadModel[];
  metadata: KeyValueReadModel[];
  versions: ProductPriceVersionReadModel[];
}

export interface PriceTierReadModel {
  id: Id;
  minQuantity: number;
  maxQuantity?: number | null;
  price: number;
}

export interface PriceConstraintReadModel {
  id: Id;
  type: PriceConstraintType;
  value: number;
  message?: string | null;
}

export interface ProductPriceVersionReadModel {
  id: Id;
  versionNumber: number;
  changeSummary: string;
  changedBy?: string | null;
  reason: PriceChangeReason;
  changedAt: string;
  previousVersionId?: Id | null;
}

export interface ExternalReferenceReadModel {
  source: string;
  externalId: string;
  syncVersion?: string | null;
  lastSyncDate?: string | null;
}

export interface CreateProductPriceCommand {
  priceListId?: Id | null;
  productId?: Id | null;
  variantId?: Id | null;
  currencyId?: string | null;
  baseAmount: number;
  compareAtAmount?: number | null;
  minAmount?: number | null;
  maxAmount?: number | null;
  costAmount?: number | null;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
}

export interface UpdateProductPriceRequest {
  baseAmount: number;
  compareAtAmount?: number | null;
  minAmount?: number | null;
  maxAmount?: number | null;
  costAmount?: number | null;
  effectiveFrom: string;
  effectiveTo?: string | null;
}

export interface ProductPriceFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  productId?: string;
  priceListId?: string;
  currencyId?: string;
  status?: string;
  onlyEffective?: boolean;
}

export interface AddPriceTierBody {
  minQuantity: number;
  price: number;
  maxQuantity?: number | null;
}

export interface UpdatePriceTierBody {
  minQuantity: number;
  price: number;
  maxQuantity?: number | null;
}

export interface AddPriceConstraintBody {
  type: PriceConstraintType;
  value: number;
  message?: string | null;
}

export interface UpdatePriceConstraintBody {
  value: number;
  message?: string | null;
}

export interface RejectProductPriceBody {
  reason: string;
}

export interface ScheduleProductPriceBody {
  effectiveFrom: string;
  effectiveTo?: string | null;
}

export interface UpsertPriceMetadataBody {
  key: string;
  value: string;
}