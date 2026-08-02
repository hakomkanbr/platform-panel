import * as http from "../http";
import type { PaginatedResult, ListParams } from "../../types/common";
import type { CategoryReadModel, CategoryFilters, CreateCategoryCommand, UpdateCategoryRequest, ChangeCategoryStatusRequest } from "../../types/catalog";

export const categoriesApi = {
  list: (params?: CategoryFilters) =>
    http.get<PaginatedResult<CategoryReadModel>>("/Admin/Categories", params),

  tree: () => http.get<CategoryReadModel[]>("/Admin/Categories/tree"),

  getById: (id: string) => http.get<CategoryReadModel>(`/Admin/Categories/${id}`),

  create: (body: CreateCategoryCommand) => http.post<CategoryReadModel>("/Admin/Categories", body),

  update: (id: string, body: UpdateCategoryRequest) =>
    http.put<CategoryReadModel>(`/Admin/Categories/${id}`, body),

  delete: (id: string) => http.del<void>(`/Admin/Categories/${id}`),

  setStatus: (id: string, body: ChangeCategoryStatusRequest) =>
    http.put<void>(`/Admin/Categories/${id}/status`, body),
};