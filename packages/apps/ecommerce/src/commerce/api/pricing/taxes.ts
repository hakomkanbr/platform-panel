import * as http from "../http";
import type { PaginatedResult } from "../../types/common";
import type {
  TaxClassDto,
  TaxClassDetailDto,
  TaxRateDto,
  CreateTaxClassCommand,
  UpdateTaxClassRequest,
  CreateTaxRateCommand,
  UpdateTaxRateRequest,
  TaxClassFilters,
  TaxRateFilters,
  CalculateTaxQuery,
  TaxCalculationResult,
} from "../../types/taxes";

export const taxesApi = {
  // Tax Classes
  listClasses: (params?: TaxClassFilters) =>
    http.get<PaginatedResult<TaxClassDto>>("/Admin/v1/Taxes/classes", params),

  getClassById: (id: string) =>
    http.get<TaxClassDetailDto>(`/Admin/v1/Taxes/classes/${id}`),

  createClass: (body: CreateTaxClassCommand) =>
    http.post<TaxClassDto>("/Admin/v1/Taxes/classes", body),

  updateClass: (id: string, body: UpdateTaxClassRequest) =>
    http.put<TaxClassDto>(`/Admin/v1/Taxes/classes/${id}`, body),

  toggleClassStatus: (id: string, isActive: boolean) =>
    http.put<void>(`/Admin/v1/Taxes/classes/${id}/status`, { isActive }),

  deleteClass: (id: string) =>
    http.del<void>(`/Admin/v1/Taxes/classes/${id}`),

  // Tax Rates
  listRates: (params?: TaxRateFilters) =>
    http.get<PaginatedResult<TaxRateDto>>("/Admin/v1/Taxes/rates", params),

  getRateById: (id: string) =>
    http.get<TaxRateDto>(`/Admin/v1/Taxes/rates/${id}`),

  createRate: (body: CreateTaxRateCommand) =>
    http.post<TaxRateDto>("/Admin/v1/Taxes/rates", body),

  updateRate: (id: string, body: UpdateTaxRateRequest) =>
    http.put<TaxRateDto>(`/Admin/v1/Taxes/rates/${id}`, body),

  toggleRateStatus: (id: string, isActive: boolean) =>
    http.put<void>(`/Admin/v1/Taxes/rates/${id}/status`, { isActive }),

  deleteRate: (id: string) =>
    http.del<void>(`/Admin/v1/Taxes/rates/${id}`),

  // Tax Calculator / Simulator
  calculate: (query: CalculateTaxQuery) =>
    http.post<TaxCalculationResult>("/Admin/v1/Taxes/calculate", query),
};
