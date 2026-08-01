import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../api/catalog/products";
import type { ProductFilters, ProductUpsertBody } from "../api/catalog/products";
import { useCommerce } from "../context/CommerceContext";
import type { ProductDetail, ProductListItem } from "../types/catalog";
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
    mutationFn: ({ id, body }: { id: string; body: Partial<ProductUpsertBody> }) =>
      productsApi.update(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "products"] });
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", undefined, id] });
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      entityId,
      body,
    }: {
      entityId?: string;
      body: unknown;
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
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", kind, undefined, productId] });
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", undefined, productId] });
    },
  });
}

export function useDeleteProductDetail<K extends "options" | "variants" | "media" | "relations">(
  kind: K,
  productId: string | null,
) {
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
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", kind, undefined, productId] });
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", undefined, productId] });
    },
  });
}

export function useAddProductRelation(productId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { productId: string; relationType?: number }) =>
      productsApi.addRelation(productId as string, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "product", "relations", undefined, productId] });
    },
  });
}
