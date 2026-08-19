export interface TaxClass {
  id: string;
  name: string;
  code: string;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
  displayOrder: number;
  ratesCount: number;
  createdAt: string;
}

export interface TaxClassDetail extends TaxClass {
  rates: TaxRate[];
}

export interface TaxRate {
  id: string;
  taxClassId: string;
  taxClassName?: string;
  name: string;
  rate: number;
  countryCode: string;
  stateCode?: string;
  postalCode?: string;
  priority: number;
  isCompound: boolean;
  isShippingTaxable: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface TaxClassFormData {
  name: string;
  code: string;
  description?: string;
  isDefault?: boolean;
  displayOrder?: number;
}

export interface TaxRateFormData {
  taxClassId: string;
  name: string;
  rate: number;
  countryCode: string;
  stateCode?: string;
  postalCode?: string;
  priority?: number;
  isCompound?: boolean;
  isShippingTaxable?: boolean;
}

export interface TaxCalculationParams {
  taxClassId?: string;
  amount: number;
  countryCode: string;
  stateCode?: string;
  shippingAmount?: number;
}

export interface AppliedTaxDetail {
  taxRateId: string;
  name: string;
  rate: number;
  taxAmount: number;
  isCompound: boolean;
  isShippingTaxable: boolean;
}

export interface TaxCalculationResult {
  subtotal: number;
  taxAmount: number;
  effectiveRate: number;
  shippingTaxAmount: number;
  totalTax: number;
  totalWithTax: number;
  appliedTaxes: AppliedTaxDetail[];
}

export interface TaxClassSearchParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

export interface TaxRateSearchParams {
  taxClassId?: string;
  countryCode?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}
