import { useState, useEffect, useCallback } from 'react';
import { discountsApi } from '@/lib/api/discounts';
import type { Discount, DiscountFormData, ListParams } from '@/types';

export function useDiscounts(params?: ListParams) {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await discountsApi.list(params);
      setDiscounts(res.data);
      setCount(res.count);
    } catch (e: any) {
      setError(e?.message || 'Failed to load discounts');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { discounts, count, loading, error, refetch: fetch };
}

export function useCreateDiscount() {
  const [submitting, setSubmitting] = useState(false);
  const create = async (data: DiscountFormData) => {
    setSubmitting(true);
    try {
      return await discountsApi.create(data);
    } finally {
      setSubmitting(false);
    }
  };
  return { create, submitting };
}

export function useUpdateDiscount() {
  const [submitting, setSubmitting] = useState(false);
  const update = async (data: DiscountFormData & { id: number }) => {
    setSubmitting(true);
    try {
      return await discountsApi.update(data);
    } finally {
      setSubmitting(false);
    }
  };
  return { update, submitting };
}
