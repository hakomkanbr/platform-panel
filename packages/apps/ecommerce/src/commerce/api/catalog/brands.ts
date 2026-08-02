import * as http from "../http";
import type { PaginatedResult, ListParams } from "../../types/common";
import type { BrandReadModel, BrandFilters, CreateBrandCommand, UpdateBrandRequest, ChangeBrandStatusRequest } from "../../types/catalog";

export const brandsApi = {
  list: (params?: BrandFilters) =>
    http.get<PaginatedResult<BrandReadModel>>("/Admin/Brands", params),

  getById: (id: string) => http.get<BrandReadModel>(`/Admin/Brands/${id}`),

  create: (body: CreateBrandCommand) => http.post<BrandReadModel>("/Admin/Brands", body),

  update: (id: string, body: UpdateBrandRequest) =>
    http.put<BrandReadModel>(`/Admin/Brands/${id}`, body),

  delete: (id: string) => http.del<void>(`/Admin/Brands/${id}`),

  setStatus: (id: string, body: ChangeBrandStatusRequest) =>
    http.put<void>(`/Admin/Brands/${id}/status`, body),
};