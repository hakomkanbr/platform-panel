import type { AuditInfo, Id, KeyValue, TranslationField } from "./common";

/* ---------------------------------- Categories ---------------------------------- */

export interface Category {
  id: Id;
  parentId?: Id | null;
  name: string;
  slug?: string;
  description?: string;
  status: number;
  sortOrder?: number;
  imageUrl?: string;
  icon?: string;
  children?: Category[];
  metadata?: KeyValue[];
  translations?: TranslationField[];
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

/* ----------------------------------- Brands ----------------------------------- */

export interface Brand {
  id: Id;
  name: string;
  slug?: string;
  description?: string;
  status: number;
  logoUrl?: string;
  websiteUrl?: string;
  countryCode?: string;
  metadata?: KeyValue[];
  translations?: TranslationField[];
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

/* ------------------------------------ Tags ------------------------------------ */

export interface Tag {
  id: Id;
  name: string;
  slug?: string;
  description?: string;
  status: number;
  metadata?: KeyValue[];
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

/* ---------------------------------- Attributes ---------------------------------- */

export interface AttributeValue {
  id?: Id;
  value: string;
  displayOrder?: number;
  isDefault?: boolean;
}

export interface AttributeDefinition {
  id?: Id;
  key: string;
  name: string;
  valueType: number;
  unit?: string;
  isRequired?: boolean;
  isSearchable?: boolean;
  isFilterable?: boolean;
  isVisibleOnStorefront?: boolean;
  displayOrder?: number;
  values?: AttributeValue[];
}

export interface AttributeGroup {
  id: Id;
  key: string;
  name: string;
  description?: string;
  displayOrder?: number;
  definitions?: AttributeDefinition[];
  createdAt?: string;
  updatedAt?: string;
}

/* ----------------------------------- Media ----------------------------------- */

export interface MediaItem {
  id?: Id;
  type: number;
  url: string;
  altText?: string;
  caption?: string;
  sortOrder?: number;
  isPrimary?: boolean;
}

/* ----------------------------------- Options ----------------------------------- */

export interface OptionValue {
  id?: Id;
  value: string;
  displayOrder?: number;
  swatchUrl?: string;
  isDefault?: boolean;
}

export interface ProductOption {
  id?: Id;
  name: string;
  inputType: number;
  isRequired?: boolean;
  isMultiSelect?: boolean;
  displayOrder?: number;
  values?: OptionValue[];
}

/* ---------------------------------- Variants ---------------------------------- */

export interface VariantValue {
  optionId?: Id;
  optionName?: string;
  value: string;
}

export interface Variant {
  id: Id;
  code?: string;
  name?: string;
  sku?: string;
  barcode?: string;
  values?: VariantValue[];
  price?: number;
  compareAtPrice?: number;
  cost?: number;
  stock?: number;
  status?: string;
  media?: MediaItem[];
  metadata?: KeyValue[];
  createdAt?: string;
  updatedAt?: string;
}

/* ---------------------------------- Product ---------------------------------- */

export type ProductStatus = "draft" | "published" | "archived";

export interface ProductListItem {
  id: Id;
  code?: string;
  name: string;
  slug?: string;
  type?: number;
  structure?: number;
  status?: ProductStatus;
  sku?: string;
  brandId?: Id;
  brandName?: string;
  primaryImageUrl?: string;
  categoryName?: string;
  price?: number;
  currency?: string;
  stock?: number;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCategory {
  categoryId: Id;
  categoryName?: string;
  isPrimary?: boolean;
}

export interface ProductAttribute {
  definitionId: Id;
  definitionKey?: string;
  definitionName?: string;
  value: string;
}

export interface ProductTranslation extends TranslationField {
  name?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ProductDetail extends AuditInfo {
  id: Id;
  code?: string;
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  type: number;
  structure: number;
  status: ProductStatus;
  sku?: string;
  barcode?: string;
  brandId?: Id;
  brandName?: string;
  categories?: ProductCategory[];
  tags?: Tag[];
  attributes?: ProductAttribute[];
  media?: MediaItem[];
  options?: ProductOption[];
  variants?: Variant[];
  metadata?: KeyValue[];
  translations?: ProductTranslation[];
  price?: number;
  compareAtPrice?: number;
  cost?: number;
  currency?: string;
  stock?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  isFeatured?: boolean;
  isVisible?: boolean;
  isTrackStock?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
}

export interface ProductLinkRequest {
  productId: string;
  productName?: string;
  relationType?: number;
}

export interface Relation {
  id?: Id;
  productId: Id;
  productName?: string;
  relationType: number;
  sortOrder?: number;
}
