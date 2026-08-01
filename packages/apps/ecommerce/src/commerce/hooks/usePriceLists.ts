import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { priceListsApi } from "../api/pricing/price-lists";
import type { PriceListFilters, PriceListUpsertBody } from "../api/pricing/price-lists";
import { useCommerce } from "../context/CommerceContext";
import type { PriceList } from "../types/pricing";
import type { PaginatedResult } from "../types/common";

export function usePriceLists(params?: PriceListFilters) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["pricing", "price-lists", projectId, params],
    queryFn: async (): Promise<PaginatedResult<PriceList>> => {
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
    mutationFn: ({ id, body }: { id?: string; body: PriceListUpsertBody }) =>
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

export function usePriceListChannels(priceListId: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["pricing", "price-list", "channels", projectId, priceListId],
    queryFn: () => priceListsApi.getChannels(priceListId as string),
    enabled: !!projectId && !!priceListId,
  });
}

export function useSavePriceListChannel(priceListId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id?: string; body: unknown }) =>
      id
        ? priceListsApi.updateChannel(priceListId as string, id, body as never)
        : priceListsApi.addChannel(priceListId as string, body as never),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", "channels", undefined, priceListId] });
    },
  });
}

export function useDeletePriceListChannel(priceListId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => priceListsApi.deleteChannel(priceListId as string, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", "channels", undefined, priceListId] });
    },
  });
}

export function usePriceListCustomerGroups(priceListId: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["pricing", "price-list", "customer-groups", projectId, priceListId],
    queryFn: () => priceListsApi.getCustomerGroups(priceListId as string),
    enabled: !!projectId && !!priceListId,
  });
}

export function useSavePriceListCustomerGroup(priceListId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { customerGroupId: string; customerGroupName?: string }) =>
      priceListsApi.addCustomerGroup(priceListId as string, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", "customer-groups", undefined, priceListId] });
    },
  });
}

export function useDeletePriceListCustomerGroup(priceListId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => priceListsApi.deleteCustomerGroup(priceListId as string, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", "customer-groups", undefined, priceListId] });
    },
  });
}

export function usePriceListRegions(priceListId: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["pricing", "price-list", "regions", projectId, priceListId],
    queryFn: () => priceListsApi.getRegions(priceListId as string),
    enabled: !!projectId && !!priceListId,
  });
}

export function useSavePriceListRegion(priceListId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { regionId: string; regionName?: string }) =>
      priceListsApi.addRegion(priceListId as string, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", "regions", undefined, priceListId] });
    },
  });
}

export function useDeletePriceListRegion(priceListId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => priceListsApi.deleteRegion(priceListId as string, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", "regions", undefined, priceListId] });
    },
  });
}

export function usePriceListStores(priceListId: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["pricing", "price-list", "stores", projectId, priceListId],
    queryFn: () => priceListsApi.getStores(priceListId as string),
    enabled: !!projectId && !!priceListId,
  });
}

export function useSavePriceListStore(priceListId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { storeId: string; storeName?: string }) =>
      priceListsApi.addStore(priceListId as string, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", "stores", undefined, priceListId] });
    },
  });
}

export function useDeletePriceListStore(priceListId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => priceListsApi.deleteStore(priceListId as string, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", "stores", undefined, priceListId] });
    },
  });
}
