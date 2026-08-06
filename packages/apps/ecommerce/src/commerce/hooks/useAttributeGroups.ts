import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attributeGroupsApi } from "../api/catalog/attribute-groups";
import type { AttributeGroupFilters } from "../types/catalog";
import { useCommerce } from "../context/CommerceContext";
import type { AttributeGroupReadModel } from "../types/catalog";
import type { PaginatedResult } from "../types/common";

export function useAttributeGroups(params?: AttributeGroupFilters) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["catalog", "attribute-groups", projectId, params],
    queryFn: async (): Promise<PaginatedResult<AttributeGroupReadModel>> => {
      const res = await attributeGroupsApi.list(params);
      return Array.isArray(res) ? { count: res.length, data: res } : res;
    },
    enabled: !!projectId,
  });
}

export function useAttributeGroup(id: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["catalog", "attribute-group", projectId, id],
    queryFn: () => attributeGroupsApi.getById(id as string),
    enabled: !!projectId && !!id,
  });
}

export function useSaveAttributeGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id?: string; body: any }) =>
      id ? attributeGroupsApi.update(id, body) : attributeGroupsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "attribute-groups"] });
    },
  });
}

export function useDeleteAttributeGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => attributeGroupsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "attribute-groups"] });
    },
  });
}

export function useSaveAttributeDefinition(groupId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: any) =>
      attributeGroupsApi.addDefinition(groupId as string, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "attribute-groups"] });
      queryClient.invalidateQueries({ queryKey: ["catalog", "attribute-group"] });
    },
  });
}

export function useDeleteAttributeDefinition(groupId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (definitionId: string) => attributeGroupsApi.deleteDefinition(groupId as string, definitionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "attribute-groups"] });
      queryClient.invalidateQueries({ queryKey: ["catalog", "attribute-group"] });
    },
  });
}
