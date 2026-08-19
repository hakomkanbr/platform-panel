import { useState, useEffect, useCallback } from 'react';
import { taxesApi } from '@/lib/api/taxes';
import type {
  TaxClass,
  TaxRate,
  TaxClassFormData,
  TaxRateFormData,
  TaxClassSearchParams,
  TaxRateSearchParams,
} from '@/types';

export function useTaxClasses(params?: TaxClassSearchParams) {
  const [classes, setClasses] = useState<TaxClass[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await taxesApi.listClasses(params);
      setClasses(res?.data || []);
      setCount(res?.count || 0);
    } catch (e: any) {
      setError(e?.message || 'Failed to load tax classes');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { classes, count, loading, error, refetch: fetch };
}

export function useTaxRates(params?: TaxRateSearchParams) {
  const [rates, setRates] = useState<TaxRate[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await taxesApi.listRates(params);
      setRates(res?.data || []);
      setCount(res?.count || 0);
    } catch (e: any) {
      setError(e?.message || 'Failed to load tax rates');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { rates, count, loading, error, refetch: fetch };
}

export function useCreateTaxClass() {
  const [submitting, setSubmitting] = useState(false);
  const create = async (data: TaxClassFormData) => {
    setSubmitting(true);
    try {
      return await taxesApi.createClass(data);
    } finally {
      setSubmitting(false);
    }
  };
  return { create, submitting };
}

export function useUpdateTaxClass() {
  const [submitting, setSubmitting] = useState(false);
  const update = async (id: string, data: TaxClassFormData) => {
    setSubmitting(true);
    try {
      return await taxesApi.updateClass(id, data);
    } finally {
      setSubmitting(false);
    }
  };
  return { update, submitting };
}

export function useCreateTaxRate() {
  const [submitting, setSubmitting] = useState(false);
  const create = async (data: TaxRateFormData) => {
    setSubmitting(true);
    try {
      return await taxesApi.createRate(data);
    } finally {
      setSubmitting(false);
    }
  };
  return { create, submitting };
}

export function useUpdateTaxRate() {
  const [submitting, setSubmitting] = useState(false);
  const update = async (id: string, data: TaxRateFormData) => {
    setSubmitting(true);
    try {
      return await taxesApi.updateRate(id, data);
    } finally {
      setSubmitting(false);
    }
  };
  return { update, submitting };
}
