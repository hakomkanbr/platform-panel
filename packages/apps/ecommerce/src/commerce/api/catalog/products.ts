import * as http from "../http";
import type { PaginatedResult, ListParams, KeyValue, TranslationField } from "../../types/common";
import type {
  MediaItem,
  ProductAttribute,
  ProductDetail,
  ProductListItem,
  ProductOption,
  ProductTranslation,
  Relation,
  Variant,
} from "../../types/catalog";

export interface ProductFilters extends ListParams {
  status?: string;
  categoryId?: string;
  brandId?: string;
  type?: string;
  structure?: string;
}

export interface ProductUpsertBody {
  name: string;
  code?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  type?: number;
  structure?: number;
  sku?: string;
  barcode?: string;
  brandId?: string;
  categoryIds?: string[];
  tagIds?: string[];
  price?: number;
  compareAtPrice?: number;
  cost?: number;
  currency?: string;
  stock?: number;
  isTrackStock?: boolean;
  isFeatured?: boolean;
  isVisible?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  metadata?: KeyValue[];
}

export const productsApi = {
  list: (params?: ProductFilters) => http.get<PaginatedResult<ProductListItem>>("/Admin/Products", params),

  getById: (id: string) => http.get<ProductDetail>(`/Admin/Products/${id}`),

  create: (body: ProductUpsertBody) => http.post<ProductDetail>("/Admin/Products", body),

  update: (id: string, body: Partial<ProductUpsertBody>) => http.put<ProductDetail>(`/Admin/Products/${id}`, body),

  delete: (id: string) => http.del<void>(`/Admin/Products/${id}`),

  publish: (id: string) => http.put<void>(`/Admin/Products/${id}/publish`),

  unpublish: (id: string) => http.put<void>(`/Admin/Products/${id}/unpublish`),

  archive: (id: string) => http.put<void>(`/Admin/Products/${id}/archive`),

  restore: (id: string) => http.put<void>(`/Admin/Products/${id}/restore`),

  getOptions: (id: string) => http.get<ProductOption[]>(`/Admin/Products/${id}/options`),

  addOption: (id: string, body: Partial<ProductOption>) =>
    http.post<ProductOption>(`/Admin/Products/${id}/options`, body),

  updateOption: (id: string, optionId: string, body: Partial<ProductOption>) =>
    http.put<ProductOption>(`/Admin/Products/${id}/options/${optionId}`, body),

  deleteOption: (id: string, optionId: string) => http.del<void>(`/Admin/Products/${id}/options/${optionId}`),

  getVariants: (id: string) => http.get<Variant[]>(`/Admin/Products/${id}/variants`),

  addVariant: (id: string, body: Partial<Variant>) => http.post<Variant>(`/Admin/Products/${id}/variants`, body),

  updateVariant: (id: string, variantId: string, body: Partial<Variant>) =>
    http.put<Variant>(`/Admin/Products/${id}/variants/${variantId}`, body),

  deleteVariant: (id: string, variantId: string) => http.del<void>(`/Admin/Products/${id}/variants/${variantId}`),

  getMedia: (id: string) => http.get<MediaItem[]>(`/Admin/Products/${id}/media`),

  addMedia: (id: string, body: Partial<MediaItem>) => http.post<MediaItem>(`/Admin/Products/${id}/media`, body),

  updateMedia: (id: string, mediaId: string, body: Partial<MediaItem>) =>
    http.put<MediaItem>(`/Admin/Products/${id}/media/${mediaId}`, body),

  deleteMedia: (id: string, mediaId: string) => http.del<void>(`/Admin/Products/${id}/media/${mediaId}`),

  getAttributes: (id: string) => http.get<ProductAttribute[]>(`/Admin/Products/${id}/attributes`),

  addAttribute: (id: string, body: Partial<ProductAttribute>) =>
    http.post<ProductAttribute>(`/Admin/Products/${id}/attributes`, body),

  updateAttribute: (id: string, attributeId: string, body: Partial<ProductAttribute>) =>
    http.put<ProductAttribute>(`/Admin/Products/${id}/attributes/${attributeId}`, body),

  deleteAttribute: (id: string, attributeId: string) =>
    http.del<void>(`/Admin/Products/${id}/attributes/${attributeId}`),

  getRelations: (id: string) => http.get<Relation[]>(`/Admin/Products/${id}/relations`),

  addRelation: (id: string, body: Partial<Relation>) => http.post<Relation>(`/Admin/Products/${id}/relations`, body),

  deleteRelation: (id: string, relationId: string) => http.del<void>(`/Admin/Products/${id}/relations/${relationId}`),

  setMetadata: (id: string, metadata: KeyValue[]) => http.put<void>(`/Admin/Products/${id}/metadata`, { metadata }),

  setTranslations: (id: string, translations: ProductTranslation[]) =>
    http.put<void>(`/Admin/Products/${id}/translations`, { translations }),
};
