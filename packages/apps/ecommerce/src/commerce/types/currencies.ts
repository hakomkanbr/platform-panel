export interface CurrencyItem {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  symbol: string;
  flagIcon: string;
  decimalPlaces: number;
  isSystemDefined: boolean;
  isActive: boolean;
}

export interface TenantCurrencySettings {
  id: string;
  tenantId: string;
  projectId?: string | null;
  baseCurrencyCode: string;
  allowMultiCurrency: boolean;
  autoUpdateExchangeRates: boolean;
  exchangeRateProvider: number;
  enabledCurrencies: TenantEnabledCurrency[];
}

export interface TenantEnabledCurrency {
  id: string;
  currencyCode: string;
  nameAr: string;
  nameEn: string;
  symbol: string;
  flagIcon: string;
  isPaymentEnabled: boolean;
  customExchangeRate?: number | null;
  effectiveExchangeRate: number;
}

export interface UpdateTenantCurrencySettingsRequest {
  baseCurrencyCode: string;
  allowMultiCurrency: boolean;
  autoUpdateExchangeRates: boolean;
  exchangeRateProvider: number;
  enabledCurrencies: {
    currencyCode: string;
    isPaymentEnabled: boolean;
    customExchangeRate?: number | null;
  }[];
}

export interface ExchangeRateItem {
  id: string;
  tenantId?: string | null;
  projectId?: string | null;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  source: number;
  effectiveDate: string;
  isCurrent: boolean;
}

export interface SetExchangeRateRequest {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  source?: number;
}
