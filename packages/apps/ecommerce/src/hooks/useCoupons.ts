import { useState, useEffect, useCallback } from 'react';
import { couponsApi } from '@/lib/api/coupons';
import type { Coupon, CouponFormData, ListParams } from '@/types';

export function useCoupons(params?: ListParams) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await couponsApi.list(params);
      setCoupons(res.data);
      setCount(res.count);
    } catch (e: any) {
      setError(e?.message || 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { coupons, count, loading, error, refetch: fetch };
}

export function useCreateCoupon() {
  const [submitting, setSubmitting] = useState(false);
  const create = async (data: CouponFormData) => {
    setSubmitting(true);
    try {
      return await couponsApi.create(data);
    } finally {
      setSubmitting(false);
    }
  };
  return { create, submitting };
}

export function useUpdateCoupon() {
  const [submitting, setSubmitting] = useState(false);
  const update = async (data: CouponFormData & { id: number }) => {
    setSubmitting(true);
    try {
      return await couponsApi.update(data);
    } finally {
      setSubmitting(false);
    }
  };
  return { update, submitting };
}
