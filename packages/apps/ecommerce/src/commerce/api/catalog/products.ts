import * as http from "../http";
import type { PaginatedResult, ListParams } from "../../types/common";
import type {
  ProductFilters,
  ProductUpsertBody,
  ProductWorkspaceBody,
  ProductReadModel,
  ProductSummaryReadModel,
  ProductDetail,
  AddProductTranslationBody,
  UpdateProductTranslationBody,
  AddProductMediaBody,
  AddProductVariantBody,
  AssignVariantOptionBody,
  AddProductOptionBody,
  AddProductOptionValueBody,
  AddProductCategoryBody,
  AddProductTagBody,
  AddProductRelationBody,
  UpsertProductMetadataBody,
  AddProductAttributeBody,
  SetAttributeValuesBody,
  MediaItem,
  ProductOption,
  ProductOptionReadModel,
  Relation,
  Variant,
} from "../../types/catalog";

// Re-export types that other modules import from this file
export type { ProductFilters, ProductUpsertBody, ProductWorkspaceBody };

export const productsApi = {
  list: (params?: ProductFilters) =>
    http.get<PaginatedResult<ProductSummaryReadModel>>(
      "/Admin/v1/Products",
      params as Record<string, unknown> | undefined,
    ),

  getById: (id: string, languageId?: string) =>
    http.get<ProductDetail>(`/Admin/v1/Products/${id}`, languageId ? { languageId } : undefined),

  create: (body: ProductUpsertBody) => http.post<ProductReadModel>("/Admin/v1/Products", body),

  createWorkspace: (body: ProductWorkspaceBody) => http.post<ProductReadModel>("/Admin/v1/Products/workspace", body),

  update: (id: string, body: Partial<ProductUpsertBody>) =>
    http.put<ProductReadModel>(`/Admin/v1/Products/${id}`, body),

  updateWorkspace: (id: string, body: ProductWorkspaceBody) =>
    http.put<ProductReadModel>(`/Admin/v1/Products/${id}/workspace`, body),

  delete: (id: string) => http.del<void>(`/Admin/v1/Products/${id}`),

  publish: (id: string) => http.put<void>(`/Admin/v1/Products/${id}/publish`),

  unpublish: (id: string) => http.put<void>(`/Admin/v1/Products/${id}/unpublish`),

  archive: (id: string) => http.put<void>(`/Admin/v1/Products/${id}/archive`),

  restore: (id: string) => http.put<void>(`/Admin/v1/Products/${id}/restore`),

  bulkPublish: (ids: string[]) => http.put<void>(`/Admin/v1/Products/bulk-publish`, { ids }),

  bulkUnpublish: (ids: string[]) => http.put<void>(`/Admin/v1/Products/bulk-unpublish`, { ids }),

  bulkArchive: (ids: string[]) => http.put<void>(`/Admin/v1/Products/bulk-archive`, { ids }),

  bulkRestore: (ids: string[]) => http.put<void>(`/Admin/v1/Products/bulk-restore`, { ids }),

  bulkDelete: (ids: string[]) => http.del<void>(`/Admin/v1/Products/bulk`, { data: { ids } }),

  addTranslation: (id: string, body: AddProductTranslationBody) =>
    http.post<ProductReadModel>(`/Admin/v1/Products/${id}/translations`, body),

  updateTranslation: (id: string, body: UpdateProductTranslationBody) =>
    http.put<ProductReadModel>(`/Admin/v1/Products/${id}/translations`, body),

  addMedia: (id: string, body: AddProductMediaBody) =>
    http.post<ProductReadModel>(`/Admin/v1/Products/${id}/media`, body),

  setPrimaryMedia: (id: string, mediaId: string) =>
    http.put<void>(`/Admin/v1/Products/${id}/media/${mediaId}/primary`),

  removeMedia: (id: string, mediaId: string) =>
    http.del<void>(`/Admin/v1/Products/${id}/media/${mediaId}`),

  reorderMedia: (id: string, mediaIds: string[]) =>
    http.put<void>(`/Admin/v1/Products/${id}/media/reorder`, mediaIds),

  addVariant: (id: string, body: AddProductVariantBody) =>
    http.post<ProductReadModel>(`/Admin/v1/Products/${id}/variants`, body),

  generateVariants: (id: string) =>
    http.post<void>(`/Admin/v1/Products/${id}/variants/generate`),

  removeVariant: (id: string, variantId: string) =>
    http.del<void>(`/Admin/v1/Products/${id}/variants/${variantId}`),

  setDefaultVariant: (id: string, variantId: string) =>
    http.put<void>(`/Admin/v1/Products/${id}/variants/${variantId}/default`),

  changeVariantActive: (id: string, variantId: string, isActive: boolean) =>
    http.put<void>(`/Admin/v1/Products/${id}/variants/${variantId}/active/${isActive}`),

  assignVariantOption: (id: string, variantId: string, body: AssignVariantOptionBody) =>
    http.post<ProductReadModel>(`/Admin/v1/Products/${id}/variants/${variantId}/options`, body),

  addOption: (id: string, body: AddProductOptionBody) =>
    http.post<ProductReadModel>(`/Admin/v1/Products/${id}/options`, body),

  removeOption: (id: string, optionId: string) =>
    http.del<void>(`/Admin/v1/Products/${id}/options/${optionId}`),

  addOptionValue: (id: string, optionId: string, body: AddProductOptionValueBody) =>
    http.post<ProductReadModel>(`/Admin/v1/Products/${id}/options/${optionId}/values`, body),

  removeOptionValue: (id: string, optionId: string, valueId: string) =>
    http.del<void>(`/Admin/v1/Products/${id}/options/${optionId}/values/${valueId}`),

  addCategory: (id: string, body: AddProductCategoryBody) =>
    http.post<ProductReadModel>(`/Admin/v1/Products/${id}/categories`, body),

  removeCategory: (id: string, categoryId: string) =>
    http.del<void>(`/Admin/v1/Products/${id}/categories/${categoryId}`),

  setPrimaryCategory: (id: string, categoryId: string) =>
    http.put<void>(`/Admin/v1/Products/${id}/categories/${categoryId}/primary`),

  addTag: (id: string, body: AddProductTagBody) =>
    http.post<ProductReadModel>(`/Admin/v1/Products/${id}/tags`, body),

  removeTag: (id: string, tagId: string) =>
    http.del<void>(`/Admin/v1/Products/${id}/tags/${tagId}`),

  addRelation: (id: string, body: AddProductRelationBody) =>
    http.post<ProductReadModel>(`/Admin/v1/Products/${id}/relations`, body),

  removeRelation: (id: string, relatedProductId: string, relationType: number) =>
    http.del<void>(`/Admin/v1/Products/${id}/relations/${relatedProductId}/${relationType}`),

  getOptions: (id: string) => http.get<ProductOptionReadModel[]>(`/Admin/v1/Products/${id}/options`),
  
  updateOption: (id: string, optionId: string, body: AddProductOptionBody) =>
    http.put<void>(`/Admin/v1/Products/${id}/options/${optionId}`, body),

  deleteOption: (id: string, optionId: string) =>
    http.del<void>(`/Admin/v1/Products/${id}/options/${optionId}`),

  getVariants: (id: string) => http.get<Variant[]>(`/Admin/v1/Products/${id}/variants`),

  updateVariant: (id: string, variantId: string, body: Partial<Variant>) =>
    http.put<Variant>(`/Admin/v1/Products/${id}/variants/${variantId}`, body),

  deleteVariant: (id: string, variantId: string) =>
    http.del<void>(`/Admin/v1/Products/${id}/variants/${variantId}`),

  getMedia: (id: string) => http.get<MediaItem[]>(`/Admin/v1/Products/${id}/media`),

  updateMedia: (id: string, mediaId: string, body: Partial<MediaItem>) =>
    http.put<MediaItem>(`/Admin/v1/Products/${id}/media/${mediaId}`, body),

  deleteMedia: (id: string, mediaId: string) =>
    http.del<void>(`/Admin/v1/Products/${id}/media/${mediaId}`),

  getRelations: (id: string) => http.get<Relation[]>(`/Admin/v1/Products/${id}/relations`),

  deleteRelation: (id: string, relationId: string) =>
    http.del<void>(`/Admin/v1/Products/${id}/relations/${relationId}`),

  upsertMetadata: (id: string, body: UpsertProductMetadataBody) =>
    http.put<void>(`/Admin/v1/Products/${id}/metadata`, body),

  removeMetadata: (id: string, key: string) =>
    http.del<void>(`/Admin/v1/Products/${id}/metadata/${key}`),

  addAttribute: (id: string, body: AddProductAttributeBody) =>
    http.post<ProductReadModel>(`/Admin/v1/Products/${id}/attributes`, body),

  setAttributeValues: (id: string, attributeId: string, body: SetAttributeValuesBody) =>
    http.put<ProductReadModel>(`/Admin/v1/Products/${id}/attributes/${attributeId}/values`, body),

  removeAttribute: (id: string, attributeId: string) =>
    http.del<void>(`/Admin/v1/Products/${id}/attributes/${attributeId}`),
};