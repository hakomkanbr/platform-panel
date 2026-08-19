import { useQuery } from "@tanstack/react-query";
import { storesApi, type StoreFilters, type StoreReadModel } from "../api/stores/stores";
import { useCommerce } from "../context/CommerceContext";
import type { PaginatedResult } from "../types/common";

export function useStores(params?: StoreFilters) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["stores", "list", projectId, params],
    queryFn: async (): Promise<PaginatedResult<StoreReadModel>> => {
      const res = await storesApi.list(params);
      return Array.isArray(res) ? { count: res.length, data: res } : res;
    },
    enabled: !!projectId,
  });
}
