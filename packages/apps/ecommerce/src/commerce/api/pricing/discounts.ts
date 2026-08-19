import * as http from "../http";
import type { PaginatedResult } from "../../types/common";
import type {
  DiscountDto,
  CreateDiscountCommand,
  UpdateDiscountCommand,
  DiscountFilters,
  CouponDto,
  CreateCouponCommand,
  UpdateCouponCommand,
  CouponFilters,
} from "../../types/discounts";

export const discountsApi = {
  list: (params?: DiscountFilters) =>
    http.get<PaginatedResult<DiscountDto>>("/Admin/v1/Discounts", params),

  getById: (id: string) =>
    http.get<DiscountDto>(`/Admin/v1/Discounts/${id}`),

  create: (body: CreateDiscountCommand) =>
    http.post<string>("/Admin/v1/Discounts", body),

  update: (id: string, body: UpdateDiscountCommand) =>
    http.put<string>(`/Admin/v1/Discounts/${id}`, body),

  toggleStatus: (id: string, isActive: boolean) =>
    http.put<boolean>(`/Admin/v1/Discounts/${id}/status`, { isActive }),

  delete: (id: string) =>
    http.del<string>(`/Admin/v1/Discounts/${id}`),
};

export const couponsApi = {
  list: (params?: CouponFilters) =>
    http.get<PaginatedResult<CouponDto>>("/Admin/v1/Coupons", params),

  getById: (id: string) =>
    http.get<CouponDto>(`/Admin/v1/Coupons/${id}`),

  create: (body: CreateCouponCommand) =>
    http.post<string>("/Admin/v1/Coupons", body),

  update: (id: string, body: UpdateCouponCommand) =>
    http.put<string>(`/Admin/v1/Coupons/${id}`, body),

  delete: (id: string) =>
    http.del<string>(`/Admin/v1/Coupons/${id}`),
};
