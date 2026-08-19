import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { currenciesApi } from "../api/currencies";
import { useCommerce } from "../context/CommerceContext";
import type { UpdateTenantCurrencySettingsRequest, SetExchangeRateRequest } from "../types/currencies";

export function useAllCurrencies(activeOnly = true) {
  return useQuery({
    queryKey: ["currencies", "all", activeOnly],
    queryFn: () => currenciesApi.getAll(activeOnly),
    staleTime: 1000 * 60 * 10,
  });
}

export function useTenantCurrencySettings() {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["currencies", "tenant-settings", projectId],
    queryFn: () => currenciesApi.getTenantSettings(projectId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateTenantCurrencySettings() {
  const { projectId } = useCommerce();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTenantCurrencySettingsRequest) =>
      currenciesApi.updateTenantSettings(data, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies", "tenant-settings"] });
    },
  });
}

export function useExchangeRates() {
  return useQuery({
    queryKey: ["currencies", "exchange-rates"],
    queryFn: () => currenciesApi.getExchangeRates(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSetExchangeRate() {
  const { projectId } = useCommerce();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetExchangeRateRequest) =>
      currenciesApi.setExchangeRate(data, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
    },
  });
}
