import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type {
  TaxClass,
  TaxClassDetail,
  TaxRate,
  TaxClassFormData,
  TaxRateFormData,
  TaxCalculationParams,
  TaxCalculationResult,
  TaxClassSearchParams,
  TaxRateSearchParams,
  PaginatedList,
} from '@/types';

function buildClassQuery(params?: TaxClassSearchParams): string {
  const q = new URLSearchParams();
  if (params?.search) q.set('search', params.search);
  if (params?.isActive !== undefined) q.set('isActive', String(params.isActive));
  if (params?.page) q.set('page', String(params.page));
  if (params?.pageSize) q.set('pageSize', String(params.pageSize));
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

function buildRateQuery(params?: TaxRateSearchParams): string {
  const q = new URLSearchParams();
  if (params?.taxClassId) q.set('taxClassId', params.taxClassId);
  if (params?.countryCode) q.set('countryCode', params.countryCode);
  if (params?.isActive !== undefined) q.set('isActive', String(params.isActive));
  if (params?.page) q.set('page', String(params.page));
  if (params?.pageSize) q.set('pageSize', String(params.pageSize));
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const taxesApi = {
  // Tax Classes
  listClasses: (params?: TaxClassSearchParams) =>
    apiGet<PaginatedList<TaxClass>>(`/Admin/v1/Taxes/classes${buildClassQuery(params)}`),

  getClassById: (id: string) =>
    apiGet<TaxClassDetail>(`/Admin/v1/Taxes/classes/${id}`),

  createClass: (data: TaxClassFormData) =>
    apiPost<string>('/Admin/v1/Taxes/classes', data),

  updateClass: (id: string, data: TaxClassFormData) =>
    apiPut<void>(`/Admin/v1/Taxes/classes/${id}`, data),

  toggleClassStatus: (id: string, isActive: boolean) =>
    apiPut<boolean>(`/Admin/v1/Taxes/classes/${id}/status`, { isActive }),

  deleteClass: (id: string) =>
    apiDelete<void>(`/Admin/v1/Taxes/classes/${id}`),

  // Tax Rates
  listRates: (params?: TaxRateSearchParams) =>
    apiGet<PaginatedList<TaxRate>>(`/Admin/v1/Taxes/rates${buildRateQuery(params)}`),

  getRateById: (id: string) =>
    apiGet<TaxRate>(`/Admin/v1/Taxes/rates/${id}`),

  createRate: (data: TaxRateFormData) =>
    apiPost<string>('/Admin/v1/Taxes/rates', data),

  updateRate: (id: string, data: TaxRateFormData) =>
    apiPut<void>(`/Admin/v1/Taxes/rates/${id}`, data),

  toggleRateStatus: (id: string, isActive: boolean) =>
    apiPut<boolean>(`/Admin/v1/Taxes/rates/${id}/status`, { isActive }),

  deleteRate: (id: string) =>
    apiDelete<void>(`/Admin/v1/Taxes/rates/${id}`),

  // Calculation simulation
  calculate: (data: TaxCalculationParams) =>
    apiPost<TaxCalculationResult>('/Admin/v1/Taxes/calculate', data),
};
