import { http } from "./http";
import type {
  CurrencyItem,
  TenantCurrencySettings,
  UpdateTenantCurrencySettingsRequest,
  ExchangeRateItem,
  SetExchangeRateRequest,
} from "../types/currencies";

export const currenciesApi = {
  getAll: (activeOnly = true) =>
    http.get<CurrencyItem[]>(`/api/v1/currencies?activeOnly=${activeOnly}`),

  getCurrency: (code: string) =>
    http.get<CurrencyItem>(`/api/v1/currencies/${encodeURIComponent(code)}`),

  getTenantSettings: (projectId?: string | null) =>
    http.get<TenantCurrencySettings>(
      `/api/v1/tenant/currencies${projectId ? `?projectId=${encodeURIComponent(projectId)}` : ""}`
    ),

  updateTenantSettings: (
    data: UpdateTenantCurrencySettingsRequest,
    projectId?: string | null
  ) =>
    http.put<TenantCurrencySettings>(
      `/api/v1/tenant/currencies${projectId ? `?projectId=${encodeURIComponent(projectId)}` : ""}`,
      data
    ),

  getExchangeRates: () =>
    http.get<ExchangeRateItem[]>("/api/v1/exchange-rates"),

  setExchangeRate: (data: SetExchangeRateRequest, projectId?: string | null) =>
    http.post<ExchangeRateItem>(
      `/api/v1/exchange-rates${projectId ? `?projectId=${encodeURIComponent(projectId)}` : ""}`,
      data
    ),
};
