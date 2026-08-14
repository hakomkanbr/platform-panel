import * as http from "../http";
import type { PaginatedResult, ListParams } from "../../types/common";
import type { CategoryReadModel, CategoryFilters, CreateCategoryCommand, UpdateCategoryRequest, ChangeCategoryStatusRequest } from "../../types/catalog";

export const categoriesApi = {
  list: (params?: CategoryFilters) =>
    http.get<PaginatedResult<CategoryReadModel>>("/Admin/v1/Categories", params),

  tree: () => http.get<CategoryReadModel[]>("/Admin/v1/Categories/tree"),

  getById: (id: string) => http.get<CategoryReadModel>(`/Admin/v1/Categories/${id}`),

  create: (body: CreateCategoryCommand) => http.post<CategoryReadModel>("/Admin/v1/Categories", body),

  update: (id: string, body: UpdateCategoryRequest) =>
    http.put<CategoryReadModel>(`/Admin/v1/Categories/${id}`, body),

  delete: (id: string) => http.del<void>(`/Admin/v1/Categories/${id}`),

  setStatus: (id: string, body: ChangeCategoryStatusRequest) =>
    http.put<void>(`/Admin/v1/Categories/${id}/status`, body),
};