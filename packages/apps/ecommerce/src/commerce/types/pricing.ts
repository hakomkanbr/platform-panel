import type { AuditInfo, Id, KeyValue, TranslationField } from "./common";

export type PriceListStatus = "draft" | "active" | "inactive";

export interface PriceListChannel {
  channelId: Id;
  channelName?: string;
  priority?: number;
}

export interface PriceListCustomerGroup {
  customerGroupId: Id;
  customerGroupName?: string;
}

export interface PriceListRegion {
  regionId: Id;
  regionName?: string;
}

export interface PriceListStore {
  storeId: Id;
  storeName?: string;
}

export interface PriceList {
  id: Id;
  code?: string;
  name: string;
  description?: string;
  status: PriceListStatus;
  taxMode?: number;
  currencyId?: Id;
  currencyCode?: string;
  priority?: number;
  isDefault?: boolean;
  effectiveFrom?: string;
  effectiveTo?: string;
  channels?: PriceListChannel[];
  customerGroups?: PriceListCustomerGroup[];
  regions?: PriceListRegion[];
  stores?: PriceListStore[];
  metadata?: KeyValue[];
  translations?: TranslationField[];
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

/* ------------------------------- Product Prices ------------------------------- */

export type PriceStatus = "draft" | "active" | "inactive";

export interface PriceTier {
  id?: Id;
  minQuantity: number;
  maxQuantity?: number;
  price: number;
  compareAtPrice?: number;
}

export interface PriceConstraint {
  id?: Id;
  type: number;
  value: number;
  description?: string;
}

export interface ProductPrice {
  id: Id;
  productId?: Id;
  productName?: string;
  variantId?: Id;
  variantName?: string;
  priceListId?: Id;
  priceListName?: string;
  currencyId?: Id;
  currencyCode?: string;
  baseAmount: number;
  compareAtAmount?: number;
  minAmount?: number;
  maxAmount?: number;
  costAmount?: number;
  status: PriceStatus;
  effectiveFrom?: string;
  effectiveTo?: string;
  priority?: number;
  constraints?: PriceConstraint[];
  tiers?: PriceTier[];
  metadata?: KeyValue[];
  versions?: KeyValue[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductPriceUpsertRequest {
  priceListId: Id;
  productId?: Id;
  variantId?: Id;
  currencyId?: Id;
  baseAmount: number;
  compareAtAmount?: number;
  minAmount?: number;
  maxAmount?: number;
  costAmount?: number;
  status?: PriceStatus;
  effectiveFrom?: string;
  effectiveTo?: string;
  tiers?: PriceTier[];
  constraints?: PriceConstraint[];
}
