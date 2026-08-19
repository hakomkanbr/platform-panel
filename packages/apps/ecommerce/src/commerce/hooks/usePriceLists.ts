import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { priceListsApi } from "../api/pricing/price-lists";

import { useCommerce } from "../context/CommerceContext";
import type { PriceListReadModel, PriceListFilters } from "../types/pricing";
import type { PaginatedResult } from "../types/common";

export function usePriceLists(params?: PriceListFilters) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["pricing", "price-lists", projectId, params],
    queryFn: async (): Promise<PaginatedResult<PriceListReadModel>> => {
      const res = await priceListsApi.list(params);
      return Array.isArray(res) ? { count: res.length, data: res } : res;
    },
    enabled: !!projectId,
  });
}

export function usePriceList(id: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["pricing", "price-list", projectId, id],
    queryFn: () => priceListsApi.getById(id as string),
    enabled: !!projectId && !!id,
  });
}

export function useSavePriceList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id?: string; body: any }) =>
      id ? priceListsApi.update(id, body) : priceListsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-lists"] });
    },
  });
}

export function useDeletePriceList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => priceListsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-lists"] });
    },
  });
}

export function usePublishPriceList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => priceListsApi.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-lists"] });
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list"] });
    },
  });
}

export function useActivatePriceList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => priceListsApi.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-lists"] });
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list"] });
    },
  });
}

export function useDeactivatePriceList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => priceListsApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-lists"] });
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list"] });
    },
  });
}

export function useArchivePriceList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => priceListsApi.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-lists"] });
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list"] });
    },
  });
}