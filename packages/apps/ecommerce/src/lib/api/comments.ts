import { apiGet, apiDelete } from './client';
import type { Comment, PaginatedList, ListParams } from '@/types';

function buildQuery(params?: ListParams): string {
  const q = new URLSearchParams();
  if (params?.search) q.set('Search', params.search);
  if (params?.skip !== undefined) q.set('Skip', String(params.skip));
  if (params?.pageSize) q.set('PageSize', String(params.pageSize));
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const commentsApi = {
  list: (params?: ListParams) =>
    apiGet<PaginatedList<Comment>>(`/Admin/Comments${buildQuery(params)}`),

  delete: (id: number) =>
    apiDelete<number>(`/Admin/Comments/${id}`),
};
