import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tagsApi } from "../api/catalog/tags";
import type { TagFilters } from "../api/catalog/tags";
import { useCommerce } from "../context/CommerceContext";
import type { Tag } from "../types/catalog";
import type { PaginatedResult } from "../types/common";

export function useTags(params?: TagFilters) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["catalog", "tags", projectId, params],
    queryFn: async (): Promise<PaginatedResult<Tag>> => {
      const res = await tagsApi.list(params);
      return Array.isArray(res) ? { count: res.length, data: res } : res;
    },
    enabled: !!projectId,
  });
}

export function useSaveTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id?: string; body: Partial<Tag> }) =>
      id ? tagsApi.update(id, body) : tagsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "tags"] });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tagsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "tags"] });
    },
  });
}

export function useSetTagStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: number }) => tagsApi.setStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "tags"] });
    },
  });
}
