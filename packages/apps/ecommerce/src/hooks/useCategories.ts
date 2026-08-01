import { useState, useEffect, useCallback } from 'react';
import { categoriesApi } from '@/lib/api/categories';
import type { Category, CategoryFormData } from '@/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await categoriesApi.list();
      setCategories(res);
    } catch (e: any) {
      setError(e?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { categories, loading, error, refetch: fetch };
}

export function useCreateCategory() {
  const [submitting, setSubmitting] = useState(false);
  const create = async (data: CategoryFormData) => {
    setSubmitting(true);
    try {
      return await categoriesApi.create(data);
    } finally {
      setSubmitting(false);
    }
  };
  return { create, submitting };
}

export function useUpdateCategory() {
  const [submitting, setSubmitting] = useState(false);
  const update = async (data: CategoryFormData & { id: number }) => {
    setSubmitting(true);
    try {
      return await categoriesApi.update(data);
    } finally {
      setSubmitting(false);
    }
  };
  return { update, submitting };
}
