import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type { Coupon, CouponFormData, PaginatedList, ListParams } from '@/types';

function buildQuery(params?: ListParams): string {
  const q = new URLSearchParams();
  if (params?.search) q.set('Search', params.search);
  if (params?.skip !== undefined) q.set('Skip', String(params.skip));
  if (params?.pageSize) q.set('PageSize', String(params.pageSize));
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const couponsApi = {
  list: (params?: ListParams) =>
    apiGet<PaginatedList<Coupon>>(`/Admin/Coupons${buildQuery(params)}`),

  create: (data: CouponFormData) =>
    apiPost<number>('/Admin/Coupons', data),

  update: (data: CouponFormData & { id: number }) =>
    apiPut<number>('/Admin/Coupons', data),

  delete: (id: number) =>
    apiDelete<number>(`/Admin/Coupons/${id}`),
};
