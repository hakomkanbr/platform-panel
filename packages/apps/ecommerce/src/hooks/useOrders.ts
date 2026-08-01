import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '@/lib/api/orders';
import type { Order, OrderDetail, ListParams } from '@/types';

export function useOrders(params?: ListParams) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ordersApi.list(params);
      setOrders(res.data);
      setCount(res.count);
    } catch (e: any) {
      setError(e?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { orders, count, loading, error, refetch: fetch };
}

export function useOrderDetail(id: number) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    ordersApi.getById(id)
      .then(setOrder)
      .catch((e) => setError(e?.message || 'Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  return { order, loading, error };
}
