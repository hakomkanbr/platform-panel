export enum DiscountType {
  Percentage = "Percentage",
  FixedAmount = "FixedAmount",
}

export enum DiscountTargetType {
  Cart = "Cart",
  Product = "Product",
  Category = "Category",
  Shipping = "Shipping",
  BuyXGetY = "BuyXGetY",
}

export enum DiscountPriority {
  Low = 10,
  Normal = 50,
  High = 100,
  Critical = 1000,
}

export const DISCOUNT_PRIORITY_OPTIONS: { value: DiscountPriority; label: string }[] = [
  { value: DiscountPriority.Low, label: "🟢 Low Priority" },
  { value: DiscountPriority.Normal, label: "🔵 Normal Priority" },
  { value: DiscountPriority.High, label: "🟠 High Priority" },
  { value: DiscountPriority.Critical, label: "🔴 Critical Priority" },
];

export const DISCOUNT_TARGET_OPTIONS: { value: DiscountTargetType; label: string; description: string }[] = [
  { value: DiscountTargetType.Cart, label: "Cart Discount", description: "Apply to entire cart (e.g. 10% off all)" },
  { value: DiscountTargetType.Product, label: "Product Discount", description: "Apply to specific products" },
  { value: DiscountTargetType.Category, label: "Category Discount", description: "Apply to all products in a category" },
  { value: DiscountTargetType.Shipping, label: "Free Shipping", description: "Free shipping on orders" },
  { value: DiscountTargetType.BuyXGetY, label: "Buy X Get Y", description: "Buy certain items, get others free/discounted" },
];

export interface Discount {
  id: number;
  name: string;
  code: string;
  type: DiscountType;
  targetType: DiscountTargetType;
  value: number;
  priority: DiscountPriority;
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  usageCount: number;
  minQuantity: number | null;
  maxQuantity: number | null;
  minCartAmount: number | null;
  isActive: boolean;
  productIds: number[];
  categoryIds: number[];
  appliesToAll: boolean;
  buyXQty: number;
  getYQty: number;
  getYDiscountPercent: number;
  maxDiscountAmount: number | null;
  oncePerCustomer: boolean;
}

export interface DiscountFormData {
  name: string;
  code: string;
  type: DiscountType;
  targetType: DiscountTargetType;
  value: number;
  priority: DiscountPriority;
  startDate?: string;
  endDate?: string;
  usageLimit?: number | null;
  minQuantity?: number | null;
  maxQuantity?: number | null;
  minCartAmount?: number | null;
  isActive?: boolean;
  productIds?: number[];
  categoryIds?: number[];
  appliesToAll?: boolean;
  buyXQty?: number;
  getYQty?: number;
  getYDiscountPercent?: number;
  maxDiscountAmount?: number | null;
  oncePerCustomer?: boolean;
}

export interface DiscountSummary {
  totalDiscounts: number;
  activeDiscounts: number;
  cartDiscounts: number;
  productDiscounts: number;
  categoryDiscounts: number;
  totalUsage: number;
}
