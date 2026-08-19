import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taxesApi } from "../api/pricing/taxes";
import { useCommerce } from "../context/CommerceContext";
import type {
  TaxClassDto,
  TaxRateDto,
  TaxClassFilters,
  TaxRateFilters,
  CalculateTaxQuery,
  TaxCalculationResult,
} from "../types/taxes";
import type { PaginatedResult } from "../types/common";

export function useTaxClasses(params?: TaxClassFilters) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["pricing", "taxes", "classes", projectId, params],
    queryFn: async (): Promise<PaginatedResult<TaxClassDto>> => {
      const res: any = await taxesApi.listClasses(params);
      if (Array.isArray(res)) return { count: res.length, data: res };
      if (res && Array.isArray(res.items)) return { count: res.totalCount ?? res.items.length, data: res.items };
      if (res && Array.isArray(res.data)) return { count: res.count ?? res.totalCount ?? res.data.length, data: res.data };
      return { count: 0, data: [] };
    },
    enabled: !!projectId,
  });
}

export function useTaxClass(id: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["pricing", "taxes", "class", projectId, id],
    queryFn: () => taxesApi.getClassById(id as string),
    enabled: !!projectId && !!id,
  });
}

export function useSaveTaxClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id?: string; body: any }) =>
      id ? taxesApi.updateClass(id, body) : taxesApi.createClass(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "taxes", "classes"] });
    },
  });
}

export function useToggleTaxClassStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      taxesApi.toggleClassStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "taxes", "classes"] });
    },
  });
}

export function useDeleteTaxClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taxesApi.deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "taxes", "classes"] });
    },
  });
}

export function useTaxRates(params?: TaxRateFilters) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["pricing", "taxes", "rates", projectId, params],
    queryFn: async (): Promise<PaginatedResult<TaxRateDto>> => {
      const res: any = await taxesApi.listRates(params);
      if (Array.isArray(res)) return { count: res.length, data: res };
      if (res && Array.isArray(res.items)) return { count: res.totalCount ?? res.items.length, data: res.items };
      if (res && Array.isArray(res.data)) return { count: res.count ?? res.totalCount ?? res.data.length, data: res.data };
      return { count: 0, data: [] };
    },
    enabled: !!projectId,
  });
}

export function useTaxRate(id: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["pricing", "taxes", "rate", projectId, id],
    queryFn: () => taxesApi.getRateById(id as string),
    enabled: !!projectId && !!id,
  });
}

export function useSaveTaxRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id?: string; body: any }) =>
      id ? taxesApi.updateRate(id, body) : taxesApi.createRate(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "taxes", "rates"] });
      queryClient.invalidateQueries({ queryKey: ["pricing", "taxes", "classes"] });
    },
  });
}

export function useToggleTaxRateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      taxesApi.toggleRateStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "taxes", "rates"] });
    },
  });
}

export function useDeleteTaxRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taxesApi.deleteRate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "taxes", "rates"] });
      queryClient.invalidateQueries({ queryKey: ["pricing", "taxes", "classes"] });
    },
  });
}

export function useCalculateTax() {
  return useMutation({
    mutationFn: (query: CalculateTaxQuery): Promise<TaxCalculationResult> =>
      taxesApi.calculate(query),
  });
}
