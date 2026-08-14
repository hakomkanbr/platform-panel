import * as http from "../http";
import type { PaginatedResult, ListParams } from "../../types/common";
import type { TagReadModel, TagFilters, CreateTagCommand, UpdateTagRequest, ChangeTagStatusRequest } from "../../types/catalog";

export const tagsApi = {
  list: (params?: TagFilters) =>
    http.get<PaginatedResult<TagReadModel>>("/Admin/v1/Tags", params),

  getById: (id: string) => http.get<TagReadModel>(`/Admin/v1/Tags/${id}`),

  create: (body: CreateTagCommand) => http.post<TagReadModel>("/Admin/v1/Tags", body),

  update: (id: string, body: UpdateTagRequest) =>
    http.put<TagReadModel>(`/Admin/v1/Tags/${id}`, body),

  delete: (id: string) => http.del<void>(`/Admin/v1/Tags/${id}`),

  setStatus: (id: string, body: ChangeTagStatusRequest) =>
    http.put<void>(`/Admin/v1/Tags/${id}/status`, body),
};