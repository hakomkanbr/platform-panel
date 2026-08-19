import { getGatewayClient } from "@repo/api-client";
import type {
  CurrencyItem,
  TenantCurrencySettings,
  UpdateTenantCurrencySettingsRequest,
  ExchangeRateItem,
  SetExchangeRateRequest,
  UpdateExchangeRateRequest,
} from "./types";

async function unwrap<T>(response: { data: unknown }): Promise<T> {
  const body = response.data as any;
  if (body && typeof body === "object" && "success" in body && body.success === false) {
    throw new Error(body.error || body.message || "Request failed");
  }
  return body as T;
}

function paramsWithProject(projectId?: string): Record<string, unknown> | undefined {
  return projectId ? { params: { projectId } } : undefined;
}

export const currenciesService = {
  async getCatalog(activeOnly = true): Promise<CurrencyItem[]> {
    const res = await getGatewayClient().get("/api/v1/currencies", {
      params: { activeOnly },
    });
    return unwrap<CurrencyItem[]>(res);
  },

  async getTenantSettings(projectId?: string): Promise<TenantCurrencySettings> {
    const res = await getGatewayClient().get(
      "/api/v1/tenant/currencies",
      paramsWithProject(projectId),
    );
    return unwrap<TenantCurrencySettings>(res);
  },

  async updateTenantSettings(
    data: UpdateTenantCurrencySettingsRequest,
    projectId?: string,
  ): Promise<TenantCurrencySettings> {
    const res = await getGatewayClient().put(
      "/api/v1/tenant/currencies",
      data,
      paramsWithProject(projectId),
    );
    return unwrap<TenantCurrencySettings>(res);
  },

  async getExchangeRates(): Promise<ExchangeRateItem[]> {
    const res = await getGatewayClient().get("/api/v1/exchange-rates");
    return unwrap<ExchangeRateItem[]>(res);
  },

  async setExchangeRate(
    data: SetExchangeRateRequest,
    projectId?: string,
  ): Promise<ExchangeRateItem> {
    const res = await getGatewayClient().post(
      "/api/v1/exchange-rates",
      data,
      paramsWithProject(projectId),
    );
    return unwrap<ExchangeRateItem>(res);
  },

  async updateExchangeRate(
    id: string,
    data: UpdateExchangeRateRequest,
  ): Promise<ExchangeRateItem> {
    const res = await getGatewayClient().put(`/api/v1/exchange-rates/${id}`, data);
    return unwrap<ExchangeRateItem>(res);
  },

  async deleteExchangeRate(id: string): Promise<void> {
    await getGatewayClient().delete(`/api/v1/exchange-rates/${id}`);
  },

  async syncExchangeRates(): Promise<{
    fetchedQuotes: number;
    upsertedRates: number;
    skippedUnchanged: number;
    skippedUnknownCurrency: number;
    syncedAt: string;
  }> {
    const res = await getGatewayClient().post("/api/v1/exchange-rates/sync");
    return unwrap<{
      fetchedQuotes: number;
      upsertedRates: number;
      skippedUnchanged: number;
      skippedUnknownCurrency: number;
      syncedAt: string;
    }>(res);
  },
};