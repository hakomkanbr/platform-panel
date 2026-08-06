import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { brandsApi } from "../api/catalog/brands";

import { useCommerce } from "../context/CommerceContext";
import type { BrandReadModel, BrandFilters } from "../types/catalog";
import type { PaginatedResult } from "../types/common";

export function useBrands(params?: BrandFilters) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["catalog", "brands", projectId, params],
    queryFn: async (): Promise<PaginatedResult<BrandReadModel>> => {
      const res = await brandsApi.list(params);
      return Array.isArray(res) ? { count: res.length, data: res } : res;
    },
    enabled: !!projectId,
  });
}

export function useBrand(id: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["catalog", "brand", projectId, id],
    queryFn: () => brandsApi.getById(id as string),
    enabled: !!projectId && !!id,
  });
}

export function useSaveBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id?: string; body: any }) =>
      id ? brandsApi.update(id, body) : brandsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "brands"] });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => brandsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "brands"] });
    },
  });
}

export function useSetBrandStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: number }) => brandsApi.setStatus(id, { status: status as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "brands"] });
    },
  });
}
