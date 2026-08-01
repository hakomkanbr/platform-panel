import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type { Brand, BrandFormData, PaginatedList, ListParams } from '@/types';

function buildQuery(params?: ListParams): string {
  const q = new URLSearchParams();
  if (params?.search) q.set('Search', params.search);
  if (params?.skip !== undefined) q.set('Skip', String(params.skip));
  if (params?.pageSize) q.set('PageSize', String(params.pageSize));
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const brandsApi = {
  list: (params?: ListParams) =>
    apiGet<PaginatedList<Brand>>(`/Admin/Brands${buildQuery(params)}`),

  create: (data: BrandFormData) =>
    apiPost<number>('/Admin/Brands', data),

  update: (data: BrandFormData & { id: number }) =>
    apiPut<number>('/Admin/Brands', data),

  delete: (id: number) =>
    apiDelete<number>(`/Admin/Brands/${id}`),
};
