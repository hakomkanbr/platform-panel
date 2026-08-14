import { apiGet } from './client';
import type { Customer, PaginatedList, ListParams } from '@/types';

function buildQuery(params?: ListParams): string {
  const q = new URLSearchParams();
  if (params?.search) q.set('Search', params.search);
  if (params?.skip !== undefined) q.set('Skip', String(params.skip));
  if (params?.pageSize) q.set('PageSize', String(params.pageSize));
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const customersApi = {
  list: (params?: ListParams) =>
    apiGet<PaginatedList<Customer>>(`/Admin/v1/Customer${buildQuery(params)}`),
};
