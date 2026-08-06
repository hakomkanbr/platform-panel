import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../api/catalog/products";
import type { ProductFilters, ProductUpsertBody, ProductWorkspaceBody } from "../types/catalog";
import { useCommerce } from "../context/CommerceContext";
import type { 
  ProductDetail, 
  ProductListItem, 
  AddProductOptionValueBody, 
  AddProductRelationBody,
  UpdateProductTranslationBody,
  AddProductCategoryBody,
  AddProductTagBody,
  UpsertProductMetadataBody
} from "../types/catalog";
import type { PaginatedResult } from "../types/common";

export function useProducts(params: ProductFilters) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["catalog", "products", projectId, params],
    queryFn: async (): Promise<PaginatedResult<ProductListItem>> => {
      const res = await productsApi.list(params);
      return Array.isArray(res) ? { count: res.length, data: res } : res;
    },
    enabled: !!projectId,
    staleTime: 15_000,
  });
}

export function useProduct(id: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["catalog", "product", projectId, id],
    queryFn: () => productsApi.getById(id as string),
    enabled: !!projectId && !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ProductUpsertBody) => productsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      productsApi.update(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "products"] });
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", undefined, id] });
    },
  });
}

export function useSaveProductWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string | null; body: ProductWorkspaceBody }) => {
      if (id) {
        return productsApi.updateWorkspace(id, body);
      }
      return productsApi.createWorkspace(body);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "products"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["catalog", "product", undefined, id] });
      }
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "products"] });
    },
  });
}

export function useBulkDeleteProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => productsApi.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "products"] });
    },
  });
}

export function useSetProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: "publish" | "unpublish" | "archive" | "restore" }) => {
      if (action === "publish") return productsApi.publish(id);
      if (action === "unpublish") return productsApi.unpublish(id);
      if (action === "archive") return productsApi.archive(id);
      return productsApi.restore(id);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "products"] });
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", undefined, id] });
    },
  });
}

export function useBulkSetProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, action }: { ids: string[]; action: "publish" | "unpublish" | "archive" | "restore" }) => {
      if (action === "publish") return productsApi.bulkPublish(ids);
      if (action === "unpublish") return productsApi.bulkUnpublish(ids);
      if (action === "archive") return productsApi.bulkArchive(ids);
      return productsApi.bulkRestore(ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "products"] });
    },
  });
}

export function useProductOptions(productId: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["catalog", "product", "options", projectId, productId],
    queryFn: () => productsApi.getOptions(productId as string),
    enabled: !!projectId && !!productId,
  });
}

export function useProductVariants(productId: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["catalog", "product", "variants", projectId, productId],
    queryFn: () => productsApi.getVariants(productId as string),
    enabled: !!projectId && !!productId,
  });
}

export function useProductMedia(productId: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["catalog", "product", "media", projectId, productId],
    queryFn: () => productsApi.getMedia(productId as string),
    enabled: !!projectId && !!productId,
  });
}

export function useProductRelations(productId: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["catalog", "product", "relations", projectId, productId],
    queryFn: () => productsApi.getRelations(productId as string),
    enabled: !!projectId && !!productId,
  });
}

export function useSaveProductDetail<K extends "options" | "variants" | "media">(
  kind: K,
  productId: string | null,
) {
  const { projectId } = useCommerce();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      entityId,
      body,
      valuesToRestore,
    }: {
      entityId?: string;
      body: unknown;
      valuesToRestore?: { languageId: string; cultureCode: string; value: string; name?: string | null; displayOrder: number }[];
    }): Promise<unknown> => {
      if (!productId) throw new Error("Product not selected");
      if (kind === "options") {
        if (entityId) return productsApi.updateOption(productId, entityId, body as never);
        return productsApi.addOption(productId, body as never);
      }
      if (kind === "variants") {
        if (entityId) return productsApi.updateVariant(productId, entityId, body as never);
        return productsApi.addVariant(productId, body as never);
      }
      if (entityId) return productsApi.updateMedia(productId, entityId, body as never);
      return productsApi.addMedia(productId, body as never);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", kind] });
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", projectId, productId] });
    },
  });
}

export function useDeleteProductDetail<K extends "options" | "variants" | "media" | "relations">(
  kind: K,
  productId: string | null,
) {
  const { projectId } = useCommerce();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entityId: string) => {
      if (!productId) throw new Error("Product not selected");
      if (kind === "options") return productsApi.deleteOption(productId, entityId);
      if (kind === "variants") return productsApi.deleteVariant(productId, entityId);
      if (kind === "media") return productsApi.deleteMedia(productId, entityId);
      return productsApi.deleteRelation(productId, entityId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", kind] });
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", projectId, productId] });
    },
  });
}

export function useGenerateProductVariants(productId: string | null) {
  const { projectId } = useCommerce();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      if (!productId) throw new Error("Product not selected");
      return productsApi.generateVariants(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", "variants"] });
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", projectId, productId] });
    },
  });
}

export function useAddProductRelation(productId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddProductRelationBody) =>
      productsApi.addRelation(productId as string, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", "relations", undefined, productId] });
    },
  });
}

export function useAddProductOptionValue(productId: string | null) {
  const { projectId } = useCommerce();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ optionId, body }: { optionId: string; body: AddProductOptionValueBody }) =>
      productsApi.addOptionValue(productId as string, optionId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", "options"] });
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", projectId, productId] });
    },
  });
}

export function useDeleteProductOptionValue(productId: string | null) {
  const { projectId } = useCommerce();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ optionId, valueId }: { optionId: string; valueId: string }) =>
      productsApi.removeOptionValue(productId as string, optionId, valueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", "options"] });
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", projectId, productId] });
    },
  });
}

export function useDeleteProductRelation(productId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (relatedProductId: string) =>
      productsApi.deleteRelation(productId as string, relatedProductId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", "relations", undefined, productId] });
    },
  });
}

// Orchestrator Hooks for Independent Sections

export function useUpdateProductTranslation(productId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateProductTranslationBody) => productsApi.updateTranslation(productId as string, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", undefined, productId] });
    }
  });
}

export function useAddProductCategory(productId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddProductCategoryBody) => productsApi.addCategory(productId as string, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", undefined, productId] });
    }
  });
}

export function useRemoveProductCategory(productId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) => productsApi.removeCategory(productId as string, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", undefined, productId] });
    }
  });
}

export function useAddProductTag(productId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddProductTagBody) => productsApi.addTag(productId as string, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", undefined, productId] });
    }
  });
}

export function useRemoveProductTag(productId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tagId: string) => productsApi.removeTag(productId as string, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", undefined, productId] });
    }
  });
}

export function useUpsertProductMetadata(productId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpsertProductMetadataBody) => productsApi.upsertMetadata(productId as string, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", undefined, productId] });
    }
  });
}

export function useRemoveProductMetadata(productId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (key: string) => productsApi.removeMetadata(productId as string, key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", undefined, productId] });
    }
  });
}