import { useState, useEffect, useCallback } from 'react';
import { productsApi } from '@/lib/api/products';
import type { ProductListItem, ProductDetail, ProductFormData, ProductListParams } from '@/types';

export function useProducts(params?: ProductListParams) {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.list(params);
      setProducts(res.data);
      setCount(res.count);
    } catch (e: any) {
      setError(e?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { products, count, loading, error, refetch: fetch };
}

export function useProductDetail(id: number) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productsApi.getById(id)
      .then(setProduct)
      .catch((e) => setError(e?.message || 'Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
}

export function useCreateProduct() {
  const [submitting, setSubmitting] = useState(false);
  const create = async (data: ProductFormData) => {
    setSubmitting(true);
    try {
      return await productsApi.create(data);
    } finally {
      setSubmitting(false);
    }
  };
  return { create, submitting };
}

export function useUpdateProduct() {
  const [submitting, setSubmitting] = useState(false);
  const update = async (data: ProductFormData & { id: number }) => {
    setSubmitting(true);
    try {
      return await productsApi.update(data);
    } finally {
      setSubmitting(false);
    }
  };
  return { update, submitting };
}
