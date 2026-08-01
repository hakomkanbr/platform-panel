import { useState, useEffect, useCallback } from 'react';
import { inventoryApi, warehousesApi } from '@/lib/api/inventory';
import type {
  InventoryItem, InventorySummary, InventoryListParams,
  Warehouse, WarehouseFormData, StockMovement,
} from '@/types';

export function useInventoryList(params?: InventoryListParams) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await inventoryApi.list(params);
      setItems(res.data as InventoryItem[]);
      setCount(res.count);
    } catch (e: any) {
      setError(e?.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { items, count, loading, error, refetch: fetch };
}

export function useInventorySummary() {
  const [summary, setSummary] = useState<InventorySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inventoryApi.getSummary()
      .then(setSummary)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { summary, loading };
}

export function useInventoryDetail(id: number) {
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      inventoryApi.getById(id),
      inventoryApi.getMovements(id),
    ]).then(([itemRes, movRes]) => {
      setItem(itemRes);
      setMovements(movRes.data as StockMovement[]);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  return { item, movements, loading };
}

export function useWarehouses(params?: { search?: string; skip?: number; pageSize?: number }) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await warehousesApi.list(params);
      setWarehouses(res.data as Warehouse[]);
      setCount(res.count);
    } catch {}
    setLoading(false);
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { warehouses, count, loading, refetch: fetch };
}

export function useCreateWarehouse() {
  const [submitting, setSubmitting] = useState(false);
  const create = async (data: WarehouseFormData) => {
    setSubmitting(true);
    try {
      return await warehousesApi.create(data);
    } finally {
      setSubmitting(false);
    }
  };
  return { create, submitting };
}
