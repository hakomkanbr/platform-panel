import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type {
  Warehouse, WarehouseFormData, InventoryItem, InventoryFormData,
  InventorySummary, InventoryListParams, StockMovement, PaginatedList,
} from '@/types';

function buildQuery(params?: Record<string, any>): string {
  const q = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        q.set(key, String(value));
      }
    });
  }
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const inventoryApi = {
  list: (params?: InventoryListParams) =>
    apiGet<PaginatedList<InventoryItem>>(`/Admin/v1/Inventory${buildQuery(params)}`),

  getById: (id: number) =>
    apiGet<InventoryItem>(`/Admin/v1/Inventory/${id}`),

  create: (data: InventoryFormData) =>
    apiPost<number>('/Admin/v1/Inventory', data),

  update: (id: number, data: Partial<InventoryFormData>) =>
    apiPut<number>(`/Admin/v1/Inventory/${id}`, data),

  delete: (id: number) =>
    apiDelete<number>(`/Admin/v1/Inventory/${id}`),

  getSummary: () =>
    apiGet<InventorySummary>('/Admin/v1/Inventory/summary'),

  getMovements: (inventoryId: number, params?: { skip?: number; pageSize?: number }) =>
    apiGet<PaginatedList<StockMovement>>(`/Admin/v1/Inventory/${inventoryId}/movements${buildQuery(params)}`),

  adjustStock: (id: number, quantity: number, note?: string) =>
    apiPost<number>(`/Admin/v1/Inventory/${id}/adjust`, { quantity, note }),

  transferStock: (fromId: number, toWarehouseId: number, quantity: number, note?: string) =>
    apiPost<number>('/Admin/v1/Inventory/transfer', { fromInventoryId: fromId, toWarehouseId, quantity, note }),
};

export const warehousesApi = {
  list: (params?: { search?: string; skip?: number; pageSize?: number }) =>
    apiGet<PaginatedList<Warehouse>>(`/Admin/v1/Warehouses${buildQuery(params)}`),

  getById: (id: number) =>
    apiGet<Warehouse>(`/Admin/v1/Warehouses/${id}`),

  create: (data: WarehouseFormData) =>
    apiPost<number>('/Admin/v1/Warehouses', data),

  update: (id: number, data: WarehouseFormData) =>
    apiPut<number>(`/Admin/v1/Warehouses/${id}`, data),

  delete: (id: number) =>
    apiDelete<number>(`/Admin/v1/Warehouses/${id}`),
};
