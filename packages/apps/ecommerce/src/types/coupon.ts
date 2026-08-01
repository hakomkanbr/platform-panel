export interface Coupon {
  id: number;
  code: string;
  description: string | null;
  type: string;
  value: number;
  minPurchaseAmount: number | null;
  validFrom: string;
  validTo: string;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
}

export interface CouponFormData {
  code: string;
  description?: string;
  type: string;
  value: number;
  minPurchaseAmount?: number;
  validFrom?: string;
  validTo?: string;
  usageLimit?: number;
  isActive?: boolean;
}
