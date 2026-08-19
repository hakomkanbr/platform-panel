import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { discountsApi, couponsApi } from "../api/pricing/discounts";
import { useCommerce } from "../context/CommerceContext";
import type {
  DiscountDto,
  DiscountFilters,
  CouponDto,
  CouponFilters,
  CreateDiscountCommand,
  UpdateDiscountCommand,
  CreateCouponCommand,
  UpdateCouponCommand,
} from "../types/discounts";
import type { PaginatedResult } from "../types/common";

export function useDiscounts(params?: DiscountFilters) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["pricing", "discounts", projectId, params],
    queryFn: async (): Promise<PaginatedResult<DiscountDto>> => {
      const res: any = await discountsApi.list(params);
      if (Array.isArray(res)) return { count: res.length, data: res };
      if (res && Array.isArray(res.items)) return { count: res.totalCount ?? res.items.length, data: res.items };
      if (res && Array.isArray(res.data)) return { count: res.count ?? res.totalCount ?? res.data.length, data: res.data };
      return { count: 0, data: [] };
    },
    enabled: !!projectId,
  });
}

export function useDiscount(id: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["pricing", "discount", projectId, id],
    queryFn: () => discountsApi.getById(id as string),
    enabled: !!projectId && !!id,
  });
}

export function useSaveDiscount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id?: string; body: CreateDiscountCommand | UpdateDiscountCommand }) =>
      id ? discountsApi.update(id, body as UpdateDiscountCommand) : discountsApi.create(body as CreateDiscountCommand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "discounts"] });
    },
  });
}

export function useToggleDiscountStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      discountsApi.toggleStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "discounts"] });
    },
  });
}

export function useDeleteDiscount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => discountsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "discounts"] });
    },
  });
}

export function useCoupons(params?: CouponFilters) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["pricing", "coupons", projectId, params],
    queryFn: async (): Promise<PaginatedResult<CouponDto>> => {
      const res: any = await couponsApi.list(params);
      if (Array.isArray(res)) return { count: res.length, data: res };
      if (res && Array.isArray(res.items)) return { count: res.totalCount ?? res.items.length, data: res.items };
      if (res && Array.isArray(res.data)) return { count: res.count ?? res.totalCount ?? res.data.length, data: res.data };
      return { count: 0, data: [] };
    },
    enabled: !!projectId,
  });
}

export function useCoupon(id: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["pricing", "coupon", projectId, id],
    queryFn: () => couponsApi.getById(id as string),
    enabled: !!projectId && !!id,
  });
}

export function useSaveCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id?: string; body: CreateCouponCommand | UpdateCouponCommand }) =>
      id ? couponsApi.update(id, body as UpdateCouponCommand) : couponsApi.create(body as CreateCouponCommand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "coupons"] });
    },
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => couponsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing", "coupons"] });
    },
  });
}
