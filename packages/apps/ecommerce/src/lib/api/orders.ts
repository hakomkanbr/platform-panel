import { apiGet, apiPut } from './client';
import type { Order, OrderDetail, PaginatedList, ListParams } from '@/types';

function buildQuery(params?: ListParams): string {
  const q = new URLSearchParams();
  if (params?.search) q.set('Search', params.search);
  if (params?.skip !== undefined) q.set('Skip', String(params.skip));
  if (params?.pageSize) q.set('PageSize', String(params.pageSize));
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const ordersApi = {
  list: (params?: ListParams) =>
    apiGet<PaginatedList<Order>>(`/Admin/Orders${buildQuery(params)}`),

  getById: (id: number) =>
    apiGet<OrderDetail>(`/Admin/Orders/${id}`),

  setStatus: (id: number, status: number) =>
    apiPut<number>(`/Admin/Orders/${id}/SetStatus/${status}`),
};
