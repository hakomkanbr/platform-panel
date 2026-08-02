import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productPricesApi } from "../api/pricing/product-prices";
import type { ProductPriceFilters } from "../api/pricing/product-prices";
import { useCommerce } from "../context/CommerceContext";
import type { ProductPriceReadModel } from "../types/pricing";
import type { PaginatedResult } from "../types/common";

export function useProductPrices(params?: ProductPriceFilters) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["pricing", "product-prices", projectId, params],
    queryFn: async (): Promise<PaginatedResult<ProductPriceReadModel>> => {
      const res = await productPricesApi.list(params);
      return Array.isArray(res) ? { count: res.length, data: res } : res;
    },
    enabled: !!projectId,
  });
}

export function useProductPrice(id: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["pricing", "product-price", projectId, id],
    queryFn: () => productPricesApi.getById(id as string),
    enabled: !!projectId && !!id,
  });
}

export function useSaveProductPrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id?: string; body: unknown }) =>
      id ? productPricesApi.update(id, body) : productPricesApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "product-prices"] });
    },
  });
}

export function useDeleteProductPrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productPricesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "product-prices"] });
    },
  });
}

export function useSavePriceTier(priceId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id?: string; body: unknown }) =>
      id
        ? productPricesApi.updateTier(priceId as string, id, body)
        : productPricesApi.addTier(priceId as string, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "product-price", undefined, priceId] });
    },
  });
}

export function useDeletePriceTier(priceId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tierId: string) => productPricesApi.deleteTier(priceId as string, tierId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "product-price", undefined, priceId] });
    },
  });
}

export function useSavePriceConstraint(priceId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id?: string; body: unknown }) =>
      id
        ? productPricesApi.updateConstraint(priceId as string, id, body)
        : productPricesApi.addConstraint(priceId as string, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "product-price", undefined, priceId] });
    },
  });
}

export function useDeletePriceConstraint(priceId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (constraintId: string) =>
      productPricesApi.deleteConstraint(priceId as string, constraintId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "product-price", undefined, priceId] });
    },
  });
}