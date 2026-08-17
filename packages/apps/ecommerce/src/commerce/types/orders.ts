import type { ListParams } from "./common";

export enum EnumOrderStatus {
  AwaitingApproval = 0,
  AwaitingPayment = 1,
  PaymentPaid = 2,
  InCargo = 3,
  Delivered = 4,
  Cancelled = 5,
  Processing = 6,
  PaymentFailed = 7,
  Refunded = 8,
  RefundFailed = 9,
}

export interface OrderItemOption {
  optionName: string;
  valueName: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  variantName?: string | null;
  sku?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  image?: string | null;
  options?: OrderItemOption[];
}

export interface RecipientInformationDto {
  unvan?: string;
  firstName?: string;
  lastName?: string;
  identityNo?: string;
  phoneNumber?: string;
  email?: string;
  type?: number;
  taxOffice?: string;
  taxNumber?: number;
}

export interface AddressDto {
  state?: string;
  city?: string;
  postalCode?: string;
  details?: string;
}

export interface RecipientAddress {
  recipientInformation?: RecipientInformationDto;
  address?: AddressDto;
  fullName?: string;
  phoneNumber?: string;
  city?: string;
  state?: string;
  addressLine1?: string;
  addressLine2?: string;
  postalCode?: string;
  country?: string;
}

export interface OrderPricing {
  type: number;
  name?: string;
  amount?: number;
  ammount?: number;
}

export interface OrderSummaryDto {
  id: string;
  code: string;
  status: EnumOrderStatus;
  grandTotal: number;
  currency?: string;
  dateTime: string;
  customer: string;
  phoneNumber: string;
  itemsCount?: number;
  paymentMethod?: string;
}

export interface OrderDetailDto {
  id: string;
  code: string;
  dateTime: string;
  status: EnumOrderStatus;
  grandTotal: number;
  subtotal?: number;
  shippingFee?: number;
  discountAmount?: number;
  taxAmount?: number;
  currency: string;
  note?: string | null;
  paymentType?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  paymentMethod?: string;
  orderAddress: RecipientAddress;
  billAddress?: RecipientAddress | null;
  items: OrderItem[];
  pricings?: OrderPricing[];
}

export interface OrderFilters extends ListParams {
  search?: string;
  status?: EnumOrderStatus;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
}
