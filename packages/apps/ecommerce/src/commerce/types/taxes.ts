import type { Id } from "./common";

export interface TaxClassDto {
  id: Id;
  name: string;
  code: string;
  description?: string | null;
  isDefault: boolean;
  isActive: boolean;
  displayOrder: number;
  ratesCount: number;
  createdAt: string;
}

export interface TaxClassDetailDto {
  id: Id;
  name: string;
  code: string;
  description?: string | null;
  isDefault: boolean;
  isActive: boolean;
  displayOrder: number;
  rates: TaxRateDto[];
  createdAt: string;
}

export interface TaxRateDto {
  id: Id;
  taxClassId: Id;
  taxClassName?: string | null;
  name: string;
  rate: number;
  countryCode: string;
  stateCode?: string | null;
  postalCode?: string | null;
  priority: number;
  isCompound: boolean;
  isShippingTaxable: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface CreateTaxClassCommand {
  name: string;
  code: string;
  description?: string | null;
  isDefault?: boolean;
  displayOrder?: number;
}

export interface UpdateTaxClassRequest {
  name: string;
  code: string;
  description?: string | null;
  isDefault: boolean;
  displayOrder: number;
}

export interface CreateTaxRateCommand {
  taxClassId: Id;
  name: string;
  rate: number;
  countryCode: string;
  stateCode?: string | null;
  postalCode?: string | null;
  priority?: number;
  isCompound?: boolean;
  isShippingTaxable?: boolean;
}

export interface UpdateTaxRateRequest {
  taxClassId: Id;
  name: string;
  rate: number;
  countryCode: string;
  stateCode?: string | null;
  postalCode?: string | null;
  priority: number;
  isCompound: boolean;
  isShippingTaxable: boolean;
}

export interface TaxClassFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

export interface TaxRateFilters {
  page?: number;
  pageSize?: number;
  taxClassId?: string;
  countryCode?: string;
  isActive?: boolean;
}

export interface CalculateTaxQuery {
  taxClassId?: string | null;
  amount: number;
  countryCode: string;
  stateCode?: string | null;
  shippingAmount?: number;
  taxMode?: number; // 1 = Inclusive, 2 = Exclusive
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
