import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type { ProductListItem, ProductDetail, ProductFormData, ProductImages, ProductConfigurationDto, PaginatedList, ProductListParams } from '@/types';

function buildQuery(params?: ProductListParams): string {
  const q = new URLSearchParams();
  if (params?.categoryId) q.set('CategoryId', String(params.categoryId));
  if (params?.brandId) q.set('BrandId', String(params.brandId));
  if (params?.search) q.set('Search', params.search);
  if (params?.skip !== undefined) q.set('Skip', String(params.skip));
  if (params?.pageSize) q.set('PageSize', String(params.pageSize));
  if (params?.inStock !== undefined) q.set('InStock', String(params.inStock));
  if (params?.isPublishable !== undefined) q.set('IsPublishable', String(params.isPublishable));
  if (params?.sortField) q.set('SortField', params.sortField);
  if (params?.sortOrder) q.set('SortOrder', params.sortOrder);
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const productsApi = {
  list: (params?: ProductListParams) =>
    apiGet<PaginatedList<ProductListItem>>(`/Admin/v1/Products${buildQuery(params)}`),

  getById: (id: string | number) =>
    apiGet<ProductDetail>(`/Admin/v1/Products/${id}`),

  create: (data: ProductFormData) =>
    apiPost<number>('/Admin/v1/Products', data),

  update: (data: ProductFormData & { id: string | number }) =>
    apiPut<number>('/Admin/v1/Products', data),

  setPublishable: (id: number, state: boolean) =>
    apiPut<number>(`/Admin/v1/Products/${id}/SetIsPublishable/${state}`),

  setInStock: (id: number, state: boolean) =>
    apiPut<number>(`/Admin/v1/Products/${id}/SetInStock/${state}`),

  delete: (id: number) =>
    apiDelete<number>(`/Admin/v1/Products/${id}`),

  getImages: (productId: number, rowId?: string) =>
    apiGet<string[]>(`/Admin/v1/Products/${productId}/images${rowId ? `/${rowId}` : ''}`),

  updateImages: (productId: number, rowId: string, images: string[]) =>
    apiPut<number>(`/Admin/v1/Products/${productId}/images/${rowId}`, images),

  copy: (productId: number) =>
    apiPost<number>(`/Admin/v1/Products/${productId}/copy`),

  bulkDelete: (ids: number[]) =>
    apiDelete<number>('/Admin/v1/Products', { data: { ids } }),

  bulkPublish: (ids: number[], state: boolean) =>
    apiPut<number>('/Admin/v1/Products/bulk/publish', { ids, state }),

  bulkStock: (ids: number[], state: boolean) =>
    apiPut<number>('/Admin/v1/Products/bulk/stock', { ids, state }),

  addConfiguration: (data: ProductConfigurationDto) =>
    apiPost<number>('/Admin/v1/Products/configuration', data),

  exportCsv: async (params?: ProductListParams): Promise<Blob> => {
    const query = buildQuery(params);
    const response = await fetch(`/Admin/v1/Products/export${query}`, {
      headers: { Accept: 'text/csv' },
    });
    return response.blob();
  },
};
