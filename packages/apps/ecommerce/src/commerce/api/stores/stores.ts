import * as http from "../http";
import type { PaginatedResult } from "../../types/common";

export interface StoreSettingsReadModel {
  id?: string;
  currencyCode?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  whatsAppOrdersEnabled?: boolean;
  whatsAppOrderNumber?: string | null;
}

export interface StoreReadModel {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoMediaId?: string | null;
  logoUrl?: string | null;
  status: number;
  settings?: StoreSettingsReadModel | null;
}

export interface StoreFilters {
  search?: string;
  status?: number;
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}

export const storesApi = {
  list: (params?: StoreFilters) =>
    http.get<PaginatedResult<StoreReadModel>>("/Admin/v1/Stores", params),
  getById: (id: string) => http.get<StoreReadModel>(`/Admin/v1/Stores/${id}`),
};
