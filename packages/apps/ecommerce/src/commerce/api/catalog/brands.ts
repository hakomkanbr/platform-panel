import * as http from "../http";
import type { PaginatedResult, ListParams } from "../../types/common";
import type { BrandReadModel, BrandFilters, CreateBrandCommand, UpdateBrandRequest, ChangeBrandStatusRequest } from "../../types/catalog";

export const brandsApi = {
  list: (params?: BrandFilters) =>
    http.get<PaginatedResult<BrandReadModel>>("/Admin/v1/Brands", params),

  getById: (id: string) => http.get<BrandReadModel>(`/Admin/v1/Brands/${id}`),

  create: (body: CreateBrandCommand) => http.post<BrandReadModel>("/Admin/v1/Brands", body),

  update: (id: string, body: UpdateBrandRequest) =>
    http.put<BrandReadModel>(`/Admin/v1/Brands/${id}`, body),

  delete: (id: string) => http.del<void>(`/Admin/v1/Brands/${id}`),

  setStatus: (id: string, body: ChangeBrandStatusRequest) =>
    http.put<void>(`/Admin/v1/Brands/${id}/status`, body),
};