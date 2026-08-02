import * as http from "../http";
import type { PaginatedResult, ListParams } from "../../types/common";
import type {
  ProductFilters,
  ProductUpsertBody,
  ProductReadModel,
  ProductSummaryReadModel,
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
  Relation,
  Variant,
} from "../../types/catalog";

export const productsApi = {
  list: (params?: ProductFilters) =>
    http.get<PaginatedResult<ProductSummaryReadModel>>("/Admin/Products", params),

  getById: (id: string, languageId?: string) =>
    http.get<ProductReadModel>(`/Admin/Products/${id}`, languageId ? { languageId } : undefined),

  create: (body: ProductUpsertBody) => http.post<ProductReadModel>("/Admin/Products", body),

  update: (id: string, body: Partial<ProductUpsertBody>) =>
    http.put<ProductReadModel>(`/Admin/Products/${id}`, body),

  delete: (id: string) => http.del<void>(`/Admin/Products/${id}`),

  publish: (id: string) => http.put<void>(`/Admin/Products/${id}/publish`),

  unpublish: (id: string) => http.put<void>(`/Admin/Products/${id}/unpublish`),

  archive: (id: string) => http.put<void>(`/Admin/Products/${id}/archive`),

  restore: (id: string) => http.put<void>(`/Admin/Products/${id}/restore`),

  addTranslation: (id: string, body: AddProductTranslationBody) =>
    http.post<ProductReadModel>(`/Admin/Products/${id}/translations`, body),

  updateTranslation: (id: string, body: UpdateProductTranslationBody) =>
    http.put<ProductReadModel>(`/Admin/Products/${id}/translations`, body),

  addMedia: (id: string, body: AddProductMediaBody) =>
    http.post<ProductReadModel>(`/Admin/Products/${id}/media`, body),

  setPrimaryMedia: (id: string, mediaId: string) =>
    http.put<void>(`/Admin/Products/${id}/media/${mediaId}/primary`),

  removeMedia: (id: string, mediaId: string) =>
    http.del<void>(`/Admin/Products/${id}/media/${mediaId}`),

  reorderMedia: (id: string, mediaIds: string[]) =>
    http.put<void>(`/Admin/Products/${id}/media/reorder`, mediaIds),

  addVariant: (id: string, body: AddProductVariantBody) =>
    http.post<ProductReadModel>(`/Admin/Products/${id}/variants`, body),

  removeVariant: (id: string, variantId: string) =>
    http.del<void>(`/Admin/Products/${id}/variants/${variantId}`),

  setDefaultVariant: (id: string, variantId: string) =>
    http.put<void>(`/Admin/Products/${id}/variants/${variantId}/default`),

  changeVariantActive: (id: string, variantId: string, isActive: boolean) =>
    http.put<void>(`/Admin/Products/${id}/variants/${variantId}/active/${isActive}`),

  assignVariantOption: (id: string, variantId: string, body: AssignVariantOptionBody) =>
    http.post<ProductReadModel>(`/Admin/Products/${id}/variants/${variantId}/options`, body),

  addOption: (id: string, body: AddProductOptionBody) =>
    http.post<ProductReadModel>(`/Admin/Products/${id}/options`, body),

  removeOption: (id: string, optionId: string) =>
    http.del<void>(`/Admin/Products/${id}/options/${optionId}`),

  addOptionValue: (id: string, optionId: string, body: AddProductOptionValueBody) =>
    http.post<ProductReadModel>(`/Admin/Products/${id}/options/${optionId}/values`, body),

  removeOptionValue: (id: string, optionId: string, valueId: string) =>
    http.del<void>(`/Admin/Products/${id}/options/${optionId}/values/${valueId}`),

  addCategory: (id: string, body: AddProductCategoryBody) =>
    http.post<ProductReadModel>(`/Admin/Products/${id}/categories`, body),

  removeCategory: (id: string, categoryId: string) =>
    http.del<void>(`/Admin/Products/${id}/categories/${categoryId}`),

  setPrimaryCategory: (id: string, categoryId: string) =>
    http.put<void>(`/Admin/Products/${id}/categories/${categoryId}/primary`),

  addTag: (id: string, body: AddProductTagBody) =>
    http.post<ProductReadModel>(`/Admin/Products/${id}/tags`, body),

  removeTag: (id: string, tagId: string) =>
    http.del<void>(`/Admin/Products/${id}/tags/${tagId}`),

  addRelation: (id: string, body: AddProductRelationBody) =>
    http.post<ProductReadModel>(`/Admin/Products/${id}/relations`, body),

  removeRelation: (id: string, relatedProductId: string, relationType: number) =>
    http.del<void>(`/Admin/Products/${id}/relations/${relatedProductId}/${relationType}`),

  getOptions: (id: string) => http.get<ProductOption[]>(`/Admin/Products/${id}/options`),

  updateOption: (id: string, optionId: string, body: Partial<ProductOption>) =>
    http.put<ProductOption>(`/Admin/Products/${id}/options/${optionId}`, body),

  deleteOption: (id: string, optionId: string) =>
    http.del<void>(`/Admin/Products/${id}/options/${optionId}`),

  getVariants: (id: string) => http.get<Variant[]>(`/Admin/Products/${id}/variants`),

  updateVariant: (id: string, variantId: string, body: Partial<Variant>) =>
    http.put<Variant>(`/Admin/Products/${id}/variants/${variantId}`, body),

  deleteVariant: (id: string, variantId: string) =>
    http.del<void>(`/Admin/Products/${id}/variants/${variantId}`),

  getMedia: (id: string) => http.get<MediaItem[]>(`/Admin/Products/${id}/media`),

  updateMedia: (id: string, mediaId: string, body: Partial<MediaItem>) =>
    http.put<MediaItem>(`/Admin/Products/${id}/media/${mediaId}`, body),

  deleteMedia: (id: string, mediaId: string) =>
    http.del<void>(`/Admin/Products/${id}/media/${mediaId}`),

  getRelations: (id: string) => http.get<Relation[]>(`/Admin/Products/${id}/relations`),

  deleteRelation: (id: string, relationId: string) =>
    http.del<void>(`/Admin/Products/${id}/relations/${relationId}`),

  upsertMetadata: (id: string, body: UpsertProductMetadataBody) =>
    http.put<void>(`/Admin/Products/${id}/metadata`, body),

  removeMetadata: (id: string, key: string) =>
    http.del<void>(`/Admin/Products/${id}/metadata/${key}`),

  addAttribute: (id: string, body: AddProductAttributeBody) =>
    http.post<ProductReadModel>(`/Admin/Products/${id}/attributes`, body),

  setAttributeValues: (id: string, attributeId: string, body: SetAttributeValuesBody) =>
    http.put<ProductReadModel>(`/Admin/Products/${id}/attributes/${attributeId}/values`, body),

  removeAttribute: (id: string, attributeId: string) =>
    http.del<void>(`/Admin/Products/${id}/attributes/${attributeId}`),
};