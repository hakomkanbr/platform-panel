import type { AuditInfo, Id, KeyValue } from "./common";

/* ---------------------------------- Enums ---------------------------------- */

export type ProductType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type ProductStructure = 1 | 2 | 3 | 4 | 5;
export type ProductStatus = 1 | 2 | 3 | 4;
export type ProductVisibility = 1 | 2 | 3 | 4;
export type CategoryStatus = 1 | 2;
export type BrandStatus = 1 | 2;
export type TagStatus = 1 | 2;
export type AttributeValueType = 1 | 2 | 3 | 4 | 5 | 6;
export type RelationType = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type MediaType = 1 | 2 | 3 | 4 | 5 | 6;
export type OptionInputType = 1 | 2 | 3 | 4 | 5;
export type WeightUnit = 1 | 2 | 3 | 4;
export type DimensionUnit = 1 | 2 | 3 | 4 | 5;

/* ---------------------------------- Product Summary (list) ---------------------------------- */

export interface ProductSummaryReadModel {
  id: Id;
  code: string;
  type: ProductType;
  structure: ProductStructure;
  status: ProductStatus;
  visibility: ProductVisibility;
  brandId?: Id | null;
  brandName?: string | null;
  displayOrder: number;
  publishedAt?: string | null;
  name: string;
  slug: string;
  sku?: string | null;
  price?: number | null;
  currencyId?: Id | null;
  primaryMediaUrl?: string | null;
  hasOptions: boolean;
  variantCount: number;
  activeVariantCount: number;
}

export interface ProductFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  type?: string;
  structure?: string;
  visibility?: string;
  brandId?: string;
  categoryId?: string;
  tagId?: string;
  onlyPublished?: boolean;
  languageId?: string;
}

/* ---------------------------------- Product Detail ---------------------------------- */

export interface ProductReadModel extends AuditInfo {
  id: Id;
  code: string;
  type: ProductType;
  structure: ProductStructure;
  status: ProductStatus;
  visibility: ProductVisibility;
  brandId?: Id | null;
  externalReference?: ExternalReferenceReadModel | null;
  displayOrder: number;
  publishedAt?: string | null;
  archivedAt?: string | null;
  translations: ProductTranslationReadModel[];
  variants: ProductVariantReadModel[];
  options: ProductOptionReadModel[];
  media: ProductMediaReadModel[];
  attributes: ProductAttributeReadModel[];
  categories: ProductCategoryReadModel[];
  tags: ProductTagReadModel[];
  relations: ProductRelationReadModel[];
  metadata: ProductMetadataReadModel[];
}

export interface ProductUpsertBody {
  code?: string;
  brandId?: Id | null;
  displayOrder?: number;
  externalProvider?: string | null;
  externalUrl?: string | null;
  externalId?: string | null;
  price?: number | null;
  compareAtPrice?: number | null;
  cost?: number | null;
  currencyId?: string | null;
  currency?: string | null;
}

export interface ProductWorkspaceBody {
  name: string;
  code: string;
  slug: string;
  type: ProductType;
  structure: ProductStructure;
  languageId: string;
  cultureCode: string;
  shortDescription?: string | null;
  description?: string | null;
  brandId?: Id | null;
  isVisible?: boolean;
  isFeatured?: boolean;
  status?: number | null;
  price?: number | null;
  compareAtPrice?: number | null;
  cost?: number | null;
  currencyId?: string | null;
  isTrackStock?: boolean;
  stock?: number | null;
  sku?: string | null;
  barcode?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  categoryIds?: Id[];
  tagIds?: Id[];
  metadata?: Record<string, string>;
}

/* ---------------------------------- Pricing (current price from Pricing module) ---------------------------------- */

export interface ProductPricingReadModel {
  priceId: Id;
  productId: Id;
  variantId?: Id | null;
  currencyId: Id;
  price: number;
  compareAtPrice?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  costPrice?: number | null;
  isActive: boolean;
  isPublished: boolean;
  isEffective: boolean;
  effectiveFrom: string;
  effectiveTo?: string | null;
  publishedAt?: string | null;
}

/* ---------------------------------- Product Detail (ui-shape) ---------------------------------- */

export interface ProductDetail extends ProductReadModel {
  brandName?: string | null;
  sku?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  barcode?: string | null;
  price?: number | null;
  compareAtPrice?: number | null;
  cost?: number | null;
  currency?: string | null;
  stock?: number | null;
  isTrackStock?: boolean;
  isVisible?: boolean;
  isFeatured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  pricing?: ProductPricingReadModel | null;
}

/* ---------------------------------- Product List Item (ui-shape) ---------------------------------- */

export interface ProductListItem {
  id: Id;
  code: string;
  type: ProductType;
  structure: ProductStructure;
  status: ProductStatus;
  visibility: ProductVisibility;
  name: string;
  slug: string;
  brandId?: Id | null;
  brandName?: string | null;
  sku?: string | null;
  price?: number | null;
  currencyId?: Id | null;
  stock?: number | null;
  primaryMediaUrl?: string | null;
  updatedAt?: string | null;
  publishedAt?: string | null;
}

/* ---------------------------------- Product Detail (ui-shape) ---------------------------------- */

export interface MediaItem {
  id?: Id;
  type: number;
  url: string;
  altText?: string;
  caption?: string;
  sortOrder?: number;
  isPrimary?: boolean;
}

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

export interface Relation {
  id?: Id;
  productId: Id;
  productName?: string;
  relationType: RelationType;
  sortOrder?: number;
}

/* ---------------------------------- Translations ---------------------------------- */

export interface ProductTranslationReadModel {
  languageId: Id;
  cultureCode: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
  redirectUrl?: string | null;
}

export interface AddProductTranslationBody {
  languageId: Id;
  cultureCode: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
}

export interface UpdateProductTranslationBody {
  languageId: Id;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
  redirectUrl?: string | null;
}

/* ---------------------------------- Variants ---------------------------------- */

export interface WeightReadModel {
  value: number;
  unit: WeightUnit;
}

export interface DimensionsReadModel {
  length: number;
  width: number;
  height: number;
  unit: DimensionUnit;
}

export interface ProductVariantReadModel {
  id: Id;
  sku: string;
  barcode?: string | null;
  gtin?: string | null;
  displayName?: string | null;
  weight?: WeightReadModel | null;
  dimensions?: DimensionsReadModel | null;
  isActive: boolean;
  isDefault: boolean;
  displayOrder?: number | null;
  optionValues: ProductVariantOptionReadModel[];
}

export interface ProductVariantOptionReadModel {
  variantId: Id;
  optionId: Id;
  optionValueId: Id;
}

export interface AddProductVariantBody {
  sku: string;
  barcode?: string | null;
  gtin?: string | null;
  displayName?: string | null;
  weightValue?: number | null;
  weightUnit?: WeightUnit | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  dimensionUnit?: DimensionUnit | null;
  displayOrder?: number | null;
}

export interface AssignVariantOptionBody {
  optionId: Id;
  optionValueId: Id;
}

/* ---------------------------------- Options ---------------------------------- */

export interface ProductOptionReadModel {
  id: Id;
  code: string;
  inputType: OptionInputType;
  isRequired: boolean;
  displayOrder: number;
  isSearchable: boolean;
  isFilterable: boolean;
  translations: OptionTranslationReadModel[];
  values: ProductOptionValueReadModel[];
}

export interface OptionTranslationReadModel {
  languageId: Id;
  cultureCode: string;
  name: string;
}

export interface ProductOptionValueReadModel {
  id: Id;
  optionId: Id;
  value: string;
  colorHex?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
  translations: OptionValueTranslationReadModel[];
}

export interface OptionValueTranslationReadModel {
  languageId: Id;
  cultureCode: string;
  name: string;
}

export interface AddProductOptionBody {
  code: string;
  inputType: OptionInputType;
  languageId: Id;
  cultureCode: string;
  name: string;
  isRequired: boolean;
  displayOrder: number;
}

export interface AddProductOptionValueBody {
  languageId: Id;
  cultureCode: string;
  value: string;
  name?: string | null;
  colorHex?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
}

/* ---------------------------------- Media ---------------------------------- */

export interface ProductMediaReadModel {
  id: Id;
  productId: Id;
  variantId?: Id | null;
  mediaType: MediaType;
  mediaUrl: string;
  displayName?: string | null;
  altText?: string | null;
  contentType?: string | null;
  sizeInBytes?: number | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface AddProductMediaBody {
  mediaType: MediaType;
  mediaUrl: string;
  displayName?: string | null;
  altText?: string | null;
  contentType?: string | null;
  sizeInBytes?: number | null;
  isPrimary: boolean;
  sortOrder: number;
  variantId?: Id | null;
}

/* ---------------------------------- Attributes ---------------------------------- */

export interface ProductAttributeReadModel {
  id: Id;
  attributeDefinitionId: Id;
  key: string;
  name: string;
  isVisibleOnStorefront: boolean;
  values: ProductAttributeValueReadModel[];
}

export interface ProductAttributeValueReadModel {
  id: Id;
  value: string;
  valueSlug?: string | null;
  valueId?: Id | null;
}

export interface AddProductAttributeBody {
  attributeDefinitionId: Id;
  key: string;
  name: string;
  isVisibleOnStorefront: boolean;
}

export interface SetAttributeValuesBody {
  values: ProductAttributeValueInput[];
}

export interface ProductAttributeValueInput {
  id?: Id | null;
  value: string;
  valueSlug?: string | null;
}

/* ---------------------------------- Categories (on product) ---------------------------------- */

export interface ProductCategoryReadModel {
  id: Id;
  categoryId: Id;
  isPrimary: boolean;
  displayOrder: number;
}

export interface AddProductCategoryBody {
  categoryId: Id;
  isPrimary: boolean;
  displayOrder: number;
}

/* ---------------------------------- Tags (on product) ---------------------------------- */

export interface ProductTagReadModel {
  id: Id;
  tagId: Id;
}

export interface AddProductTagBody {
  tagId: Id;
}

/* ---------------------------------- Relations ---------------------------------- */

export interface ProductRelationReadModel {
  id: Id;
  relatedProductId: Id;
  relationType: RelationType;
  quantity: number;
  strength?: number | null;
}

export interface AddProductRelationBody {
  relatedProductId: Id;
  relationType: RelationType;
  quantity: number;
  strength?: number | null;
}

/* ---------------------------------- Metadata ---------------------------------- */

export interface ProductMetadataReadModel {
  id: Id;
  key: string;
  value: string;
}

export interface UpsertProductMetadataBody {
  key: string;
  value: string;
}

/* ---------------------------------- External Reference ---------------------------------- */

export interface ExternalReferenceReadModel {
  provider?: string | null;
  url?: string | null;
  externalId?: string | null;
}

/* ---------------------------------- Categories ---------------------------------- */

export interface CategoryReadModel {
  id: Id;
  status: CategoryStatus;
  parentId?: Id | null;
  path: string;
  level: number;
  name?: string;
  slug?: string;
  description?: string;
  sortOrder?: number;
  imageUrl?: string;
  productCount?: number;
  translations: CategoryTranslationReadModel[];
  children?: CategoryReadModel[];
}

export interface CategoryTranslationReadModel {
  languageId: Id;
  cultureCode: string;
  name: string;
  slug: string;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
  redirectUrl?: string | null;
}

export interface CreateCategoryCommand {
  languageId: Id;
  cultureCode: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: Id | null;
}

export interface UpdateCategoryRequest {
  languageId: Id;
  name: string;
  slug: string;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
  redirectUrl?: string | null;
  parentId?: Id | null;
}

export interface ChangeCategoryStatusRequest {
  status: CategoryStatus;
}

export interface CategoryFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  parentId?: string;
  languageId?: string;
}

/* ---------------------------------- Brands ---------------------------------- */

export interface BrandReadModel {
  id: Id;
  status: BrandStatus;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  name?: string;
  slug?: string;
  description?: string;
  translations: BrandTranslationReadModel[];
}

export interface BrandTranslationReadModel {
  languageId: Id;
  cultureCode: string;
  name: string;
  slug: string;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
  redirectUrl?: string | null;
}

export interface CreateBrandCommand {
  languageId: Id;
  cultureCode: string;
  name: string;
  slug: string;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
  redirectUrl?: string | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
}

export interface UpdateBrandRequest {
  languageId: Id;
  name: string;
  slug: string;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
  redirectUrl?: string | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
}

export interface ChangeBrandStatusRequest {
  status: BrandStatus;
}

export interface BrandFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  languageId?: string;
}

/* ---------------------------------- Tags ---------------------------------- */

export interface TagReadModel {
  id: Id;
  status: TagStatus;
  name?: string;
  slug?: string;
  translations: TagTranslationReadModel[];
}

export interface TagTranslationReadModel {
  languageId: Id;
  cultureCode: string;
  name: string;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
  redirectUrl?: string | null;
}

export interface CreateTagCommand {
  languageId: Id;
  cultureCode: string;
  name: string;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
  redirectUrl?: string | null;
}

export interface UpdateTagRequest {
  languageId: Id;
  name: string;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
  redirectUrl?: string | null;
}

export interface ChangeTagStatusRequest {
  status: TagStatus;
}

export interface TagFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  languageId?: string;
}

/* ---------------------------------- Attribute Groups ---------------------------------- */

export interface AttributeGroupReadModel {
  id: Id;
  key: string;
  name?: string;
  description?: string;
  displayOrder: number;
  translations: AttributeGroupTranslationReadModel[];
  definitions: AttributeDefinitionReadModel[];
}

export interface AttributeGroupTranslationReadModel {
  languageId: Id;
  cultureCode: string;
  name: string;
}

export interface AttributeDefinitionReadModel {
  id: Id;
  attributeGroupId: Id;
  key: string;
  name?: string;
  valueType: AttributeValueType;
  isRequired: boolean;
  isSearchable: boolean;
  isFilterable: boolean;
  isVisibleOnStorefront: boolean;
  unit?: string | null;
  displayOrder?: number;
  translations: AttributeDefinitionTranslationReadModel[];
  values: AttributeDefinitionValueReadModel[];
}

export interface AttributeDefinitionTranslationReadModel {
  languageId: Id;
  cultureCode: string;
  name: string;
}

export interface AttributeDefinitionValueReadModel {
  id: Id;
  value: string;
  displayOrder: number;
}

export interface CreateAttributeGroupCommand {
  languageId: Id;
  cultureCode: string;
  name: string;
  key: string;
  description?: string | null;
  displayOrder?: number;
}

export interface UpdateAttributeGroupRequest {
  languageId: Id;
  name: string;
  displayOrder: number;
}

export interface AddAttributeDefinitionCommand {
  groupId?: Id;
  languageId: Id;
  cultureCode: string;
  key: string;
  name: string;
  valueType: AttributeValueType;
  isRequired: boolean;
  isSearchable: boolean;
  isFilterable: boolean;
  isVisibleOnStorefront: boolean;
  unit?: string | null;
  displayOrder?: number;
}

export interface AddDefinitionValueBody {
  value: string;
  displayOrder: number;
}

export interface AttributeGroupFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  key?: string;
  languageId?: string;
}