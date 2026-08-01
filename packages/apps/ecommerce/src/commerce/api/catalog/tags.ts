import * as http from "../http";
import type { PaginatedResult, ListParams, KeyValue } from "../../types/common";
import type { Tag } from "../../types/catalog";

export interface TagFilters extends ListParams {
  status?: string;
}

export const tagsApi = {
  list: (params?: TagFilters) => http.get<PaginatedResult<Tag> | Tag[]>("/Admin/Tags", params),

  getById: (id: string) => http.get<Tag>(`/Admin/Tags/${id}`),

  create: (body: Partial<Tag>) => http.post<Tag>("/Admin/Tags", body),

  update: (id: string, body: Partial<Tag>) => http.put<Tag>(`/Admin/Tags/${id}`, body),

  delete: (id: string) => http.del<void>(`/Admin/Tags/${id}`),

  setStatus: (id: string, status: number) => http.put<void>(`/Admin/Tags/${id}/status`, { status }),

  setMetadata: (id: string, metadata: KeyValue[]) => http.put<void>(`/Admin/Tags/${id}/metadata`, { metadata }),
};
