import { useState, useEffect, useCallback } from 'react';
import { customersApi } from '@/lib/api/customers';
import type { Customer, ListParams } from '@/types';

export function useCustomers(params?: ListParams) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await customersApi.list(params);
      setCustomers(res.data);
      setCount(res.count);
    } catch (e: any) {
      setError(e?.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { customers, count, loading, error, refetch: fetch };
}
