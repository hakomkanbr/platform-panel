import * as http from "../http";
import type { PaginatedResult } from "../../types/common";

export interface StoreReadModel {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: number;
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
