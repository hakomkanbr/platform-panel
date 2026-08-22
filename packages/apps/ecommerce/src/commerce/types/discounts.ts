import type { Id } from "./common";

export enum DiscountType {
  Percentage = 0,
  FixedAmount = 1,
  FreeShipping = 2,
}

export enum DiscountTargetType {
  Cart = 0,
  Product = 1,
  Category = 2,
  Shipping = 3,
  BuyXGetY = 4,
}

export enum DiscountPriority {
  Low = 10,
  Normal = 50,
  High = 100,
  Critical = 1000,
}

export interface DiscountDto {
  id: Id;
  name: string;
  code: string;
  type: DiscountType;
  targetType: DiscountTargetType;
  value: number;
  priority: DiscountPriority;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  minQuantity?: number | null;
  maxQuantity?: number | null;
  minCartAmount?: number | null;
  maxDiscountAmount?: number | null;
  oncePerCustomer: boolean;
  appliesToAll: boolean;
  buyXQty: number;
  getYQty: number;
  getYDiscountPercent: number;
  productIds?: Id[];
  categoryIds?: Id[];
  combinationRowIds?: Id[];
}

export interface CreateDiscountCommand {
  name: string;
  code: string;
  type: DiscountType;
  targetType?: DiscountTargetType;
  value: number;
  priority?: DiscountPriority;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  isActive?: boolean;
  minQuantity?: number | null;
  maxQuantity?: number | null;
  minCartAmount?: number | null;
  maxDiscountAmount?: number | null;
  oncePerCustomer?: boolean;
  appliesToAll?: boolean;
  buyXQty?: number;
  getYQty?: number;
  getYDiscountPercent?: number;
  productIds?: Id[];
  categoryIds?: Id[];
  combinationRowIds?: Id[];
}

export interface UpdateDiscountCommand {
  id: Id;
  name: string;
  code: string;
  type: DiscountType;
  targetType: DiscountTargetType;
  value: number;
  priority: DiscountPriority;
  startDate: string;
  endDate: string;
  usageLimit: number;
  isActive: boolean;
  minQuantity?: number | null;
  maxQuantity?: number | null;
  minCartAmount?: number | null;
  maxDiscountAmount?: number | null;
  oncePerCustomer: boolean;
  appliesToAll: boolean;
  buyXQty: number;
  getYQty: number;
  getYDiscountPercent: number;
  productIds?: Id[];
  categoryIds?: Id[];
  combinationRowIds?: Id[];
}

export interface DiscountFilters {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  type?: DiscountType;
  targetType?: DiscountTargetType;
  priority?: DiscountPriority;
}

export interface CouponDto {
  id: Id;
  code: string;
  description?: string | null;
  type: string;
  value: number;
  minPurchaseAmount?: number | null;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
}

export interface CreateCouponCommand {
  code: string;
  description?: string | null;
  type: string;
  value: number;
  minPurchaseAmount?: number | null;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  isActive?: boolean;
}

export interface UpdateCouponCommand {
  id: Id;
  code: string;
  description?: string | null;
  type: string;
  value: number;
  minPurchaseAmount?: number | null;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  isActive: boolean;
}

export interface CouponFilters {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}
