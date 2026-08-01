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
    apiGet<PaginatedList<InventoryItem>>(`/Admin/Inventory${buildQuery(params)}`),

  getById: (id: number) =>
    apiGet<InventoryItem>(`/Admin/Inventory/${id}`),

  create: (data: InventoryFormData) =>
    apiPost<number>('/Admin/Inventory', data),

  update: (id: number, data: Partial<InventoryFormData>) =>
    apiPut<number>(`/Admin/Inventory/${id}`, data),

  delete: (id: number) =>
    apiDelete<number>(`/Admin/Inventory/${id}`),

  getSummary: () =>
    apiGet<InventorySummary>('/Admin/Inventory/summary'),

  getMovements: (inventoryId: number, params?: { skip?: number; pageSize?: number }) =>
    apiGet<PaginatedList<StockMovement>>(`/Admin/Inventory/${inventoryId}/movements${buildQuery(params)}`),

  adjustStock: (id: number, quantity: number, note?: string) =>
    apiPost<number>(`/Admin/Inventory/${id}/adjust`, { quantity, note }),

  transferStock: (fromId: number, toWarehouseId: number, quantity: number, note?: string) =>
    apiPost<number>('/Admin/Inventory/transfer', { fromInventoryId: fromId, toWarehouseId, quantity, note }),
};

export const warehousesApi = {
  list: (params?: { search?: string; skip?: number; pageSize?: number }) =>
    apiGet<PaginatedList<Warehouse>>(`/Admin/Warehouses${buildQuery(params)}`),

  getById: (id: number) =>
    apiGet<Warehouse>(`/Admin/Warehouses/${id}`),

  create: (data: WarehouseFormData) =>
    apiPost<number>('/Admin/Warehouses', data),

  update: (id: number, data: WarehouseFormData) =>
    apiPut<number>(`/Admin/Warehouses/${id}`, data),

  delete: (id: number) =>
    apiDelete<number>(`/Admin/Warehouses/${id}`),
};
