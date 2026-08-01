import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type { Category, CategoryFormData } from '@/types';

export const categoriesApi = {
  list: (params?: { search?: string }) => {
    const q = params?.search ? `?Search=${encodeURIComponent(params.search)}` : '';
    return apiGet<Category[]>(`/Admin/Categories${q}`);
  },

  create: (data: CategoryFormData) =>
    apiPost<number>('/Admin/Categories', data),

  update: (data: CategoryFormData & { id: number }) =>
    apiPut<number>('/Admin/Categories', data),

  delete: (id: number) =>
    apiDelete<number>(`/Admin/Categories/${id}`),
};
