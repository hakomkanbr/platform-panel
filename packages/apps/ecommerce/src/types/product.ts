export enum ProductUnit {
  Adet = 0, Kilogram = 1, Paket = 2, Metre = 3, Kutu = 4,
  Metrekare = 5, Metrekup = 6, Kilometre = 7, Litre = 8, Koli = 9,
  Cuval = 10, Kwatt = 11, Duzine = 12, Saat = 13, Torba = 14,
  Takim = 15, Servis = 16, Ay = 17, Cilt = 18, Cift = 19,
  Gram = 20, Ton = 21, Serit = 22, Set = 23, Gun = 24, Yil = 25,
}

export interface ProductPrice {
  basePrice: number;
  taxRate: number;
  discountRate: number;
  eftDiscountRate: number;
  taxAmount: number;
  price: number;
  finalPrice: number;
}

export interface ProductPriceReadDto {
  basePrice: number;
  taxRate: number;
  dynamicDiscountRate: number;
  dynamicDiscountType: number;
  discountAmount: number;
  subTotal: number;
  taxAmount: number;
  finalPrice: number;
}

export interface ProductProperty {
  key: string;
  value: string;
}

export interface ProductOptionValue {
  id?: number;
  value: string;
  image?: string;
}

export interface ProductOption {
  id?: number;
  title: string;
  values: ProductOptionValue[];
}

export interface VariationTypeDto {
  id: string | number;
  name: string;
  display: string;
  values: string[];
}

export interface DiscountRuleDto {
  id: string | number;
  scope: string;
  target: string;
  useRange: boolean;
  from: string | null;
  to: string | null;
  rate: number;
  active: boolean;
}

export interface SpecialDiscountDto {
  active: boolean;
  title: string;
  type: string;
  value: number;
  combine: boolean;
  maxTotalRate: number;
  useRange: boolean;
  from: string | null;
  to: string | null;
}

export interface CombinationRowDto {
  attrs: Record<string, string>;
  sku: string;
  overridePrice: number | null;
  stock: boolean;
  active: boolean;
  imagee: string | null;
  images: string[];
  dynamicDiscountRate: number;
  taxRate: number;
}

export interface ProductConfigurationDto {
  minQty: number;
  startQty: number;
  stepQty: number;
  types: VariationTypeDto[];
  effects: Record<string, number>;
  globalDiscountIds: string[];
  specialDiscount: SpecialDiscountDto;
  discountRules: DiscountRuleDto[];
  generatedRows: CombinationRowDto[];
}

export interface ProductImages {
  productId: string | number;
  url: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductListItem {
  id: string;
  category: string;
  brand: string | null;
  code: string;
  title: string;
  slug: string;
  isPublishable: boolean;
  inStock: boolean;
  summary: string | null;
  description: string | null;
  unit: ProductUnit;
  image: string | null;
  price: ProductPriceReadDto;
  images: ProductImages[];
  configuration: ProductConfigurationDto | null;
}

export interface ProductDetail {
  id: string;
  category: { id: string; name: string };
  brand: { id: string; name: string } | null;
  code: string;
  title: string;
  slug: string;
  isPublishable: boolean;
  inStock: boolean;
  summary: string | null;
  description: string | null;
  unit: ProductUnit;
  note: string | null;
  image: string | null;
  price: ProductPriceReadDto;
  images: ProductImages[];
  properties: ProductProperty[] | null;
  options: ProductOption[];
  configuration: ProductConfigurationDto | null;
}

export interface ProductFormData {
  categoryId: number;
  brandId?: number | null;
  code: string;
  title: string;
  slug: string;
  isPublishable: boolean;
  inStock: boolean;
  summary?: string;
  description?: string;
  unit: ProductUnit;
  not?: string;
  image?: string;
  price: ProductPrice;
  properties?: ProductProperty[];
  options?: ProductOption[];
}

export interface ProductSetupData {
  name: string;
  categoryId: number | null;
  category: string | null;
  brandId: number | null;
  vatRate: number;
  not: string;
  minQty: number;
  startQty: number;
  unit: number;
  stepQty: number;
  basePrice: number;
  properties: ProductProperty[];
  globalDiscountIds: string[];
  description: string;
  image: string;
}

export interface VariantType {
  id: string;
  name: string;
  display: "button" | "dropdown" | "image";
  values: string[];
}

export interface VariantRow {
  attrs: Record<string, string>;
  sku: string;
  overridePrice: string;
  stock: boolean;
  active: boolean;
  imagee: string | null;
  images: string[];
  dynamicDiscountRate: number;
  globalDiscountIds?: string[];
}

export interface ProductFormState {
  product: ProductSetupData;
  types: VariantType[];
  valueImages: Record<string, string>;
  effects: Record<string, number>;
  rows: VariantRow[];
  discounts: DiscountRuleDto[];
  specialDiscount: SpecialDiscountDto;
  productImages: ProductImages[];
}

export interface DiscountRuleForm {
  id: string | number;
  scope: string;
  target: string;
  useRange: boolean;
  from: string | null;
  to: string | null;
  rate: number;
  active: boolean;
  minQuantity: number | null;
  maxQuantity: number | null;
}

export type ProductSortField = "code" | "title" | "price" | "createdAt" | "inStock" | "isPublishable";
export type SortOrder = "asc" | "desc";

export interface ProductListParams {
  search?: string;
  skip?: number;
  pageSize?: number;
  categoryId?: number;
  brandId?: number;
  inStock?: boolean;
  isPublishable?: boolean;
  sortField?: ProductSortField;
  sortOrder?: SortOrder;
}
