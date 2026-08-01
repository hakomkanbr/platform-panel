import { useState, useEffect, useCallback } from 'react';
import { brandsApi } from '@/lib/api/brands';
import type { Brand, BrandFormData, ListParams } from '@/types';

export function useBrands(params?: ListParams) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await brandsApi.list(params);
      setBrands(res.data);
      setCount(res.count);
    } catch (e: any) {
      setError(e?.message || 'Failed to load brands');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { brands, count, loading, error, refetch: fetch };
}

export function useCreateBrand() {
  const [submitting, setSubmitting] = useState(false);
  const create = async (data: BrandFormData) => {
    setSubmitting(true);
    try {
      return await brandsApi.create(data);
    } finally {
      setSubmitting(false);
    }
  };
  return { create, submitting };
}

export function useUpdateBrand() {
  const [submitting, setSubmitting] = useState(false);
  const update = async (data: BrandFormData & { id: number }) => {
    setSubmitting(true);
    try {
      return await brandsApi.update(data);
    } finally {
      setSubmitting(false);
    }
  };
  return { update, submitting };
}
