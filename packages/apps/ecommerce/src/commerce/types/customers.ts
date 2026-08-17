import type { ListParams } from "./common";

export enum EnumCustomerType {
  Individual = 1,
  Corporate = 2,
}

export interface CustomerSummaryDto {
  id: string;
  name: string;
  sureName: string;
  email: string;
  phoneNumber: string;
  type: EnumCustomerType;
  taxOffice?: string | null;
  taxNumber?: number | null;
  unvan?: string | null;
  ordersCount?: number;
  totalSpent?: number;
  createdAt?: string;
}

export interface CustomerAddressDto {
  id: string;
  customerId: string;
  title: string;
  fullName: string;
  phoneNumber: string;
  city: string;
  addressLine: string;
  isDefault: boolean;
}

export interface CustomerGroupDto {
  id: string;
  name: string;
  code: string;
  discountPercentage?: number;
  customersCount?: number;
}

export interface CustomerFilters extends ListParams {
  search?: string;
  type?: EnumCustomerType;
}
