import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../api/catalog/categories";

import { useCommerce } from "../context/CommerceContext";
import type { CategoryReadModel, CategoryFilters } from "../types/catalog";
import type { PaginatedResult } from "../types/common";

export function useCategories(params?: CategoryFilters) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["catalog", "categories", projectId, params],
    queryFn: async (): Promise<PaginatedResult<CategoryReadModel>> => {
      const res = await categoriesApi.list(params);
      return Array.isArray(res) ? { count: res.length, data: res } : res;
    },
    enabled: !!projectId,
  });
}

export function useCategoryTree() {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["catalog", "category-tree", projectId],
    queryFn: () => categoriesApi.tree(),
    enabled: !!projectId,
  });
}

export function useCategory(id: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["catalog", "category", projectId, id],
    queryFn: () => categoriesApi.getById(id as string),
    enabled: !!projectId && !!id,
  });
}

export function useSaveCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id?: string; body: any }) =>
      id ? categoriesApi.update(id, body) : categoriesApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["catalog", "category-tree"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["catalog", "category-tree"] });
    },
  });
}

export function useSetCategoryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: number }) => categoriesApi.setStatus(id, { status: status as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["catalog", "category-tree"] });
    },
  });
}
