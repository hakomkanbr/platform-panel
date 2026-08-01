import type { ProductPrice, ProductPriceReadDto } from './product';

export type OrderStatus =
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface Order {
  id: number;
  code: string;
  status: OrderStatus;
  grandTotal: number;
  dateTime: string;
  customer: string;
  phoneNumber: string;
}

export interface OrderDetail {
  code: string;
  dateTime: string;
  status: OrderStatus;
  grandTotal: number;
  note: string;
  orderAddress: RecipientAddress;
  billAddress: RecipientAddress | null;
  items: OrderItem[];
  pricings: OrderPricing[];
}

export interface RecipientInformation {
  unvan: string;
  firstName: string;
  lastName: string;
  identityNo: string;
  phoneNumber: string;
  email: string;
  type: number;
  taxOffice: string;
  taxNumber: number;
}

export interface Address {
  state: string;
  city: string;
  postalCode: string;
  details: string;
}

export interface RecipientAddress {
  recipientInformation: RecipientInformation;
  address: Address;
}

export interface OrderItem {
  id: number;
  code: string;
  productId: number;
  title: string;
  slug: string;
  brand: string;
  category: string;
  image: string;
  quantity: number;
  price: ProductPriceReadDto;
  _price: ProductPrice;
  options: OrderItemOption[];
}

export interface OrderItemOption {
  title: string;
  value: string;
}

export interface OrderPricing {
  type: number;
  ammount: number;
}
