import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type { Discount, DiscountFormData, PaginatedList, ListParams } from '@/types';

function buildQuery(params?: ListParams): string {
  const q = new URLSearchParams();
  if (params?.search) q.set('Search', params.search);
  if (params?.skip !== undefined) q.set('Skip', String(params.skip));
  if (params?.pageSize) q.set('PageSize', String(params.pageSize));
  if (params?.field) q.set('Field', params.field);
  if (params?.order) q.set('Order', params.order);
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const discountsApi = {
  list: (params?: ListParams) =>
    apiGet<PaginatedList<Discount>>(`/Admin/v1/Discounts${buildQuery(params)}`),

  getById: (id: number) =>
    apiGet<Discount>(`/Admin/v1/Discounts/${id}`),

  create: (data: DiscountFormData) =>
    apiPost<number>('/Admin/v1/Discounts', data),

  update: (data: DiscountFormData & { id: number }) =>
    apiPut<number>(`/Admin/v1/Discounts`, data),

  delete: (id: number) =>
    apiDelete<number>(`/Admin/v1/Discounts/${id}`),

  toggleActive: (id: number, isActive: boolean) =>
    apiPut<boolean>(`/Admin/v1/Discounts/${id}/status`, { isActive }),
};
