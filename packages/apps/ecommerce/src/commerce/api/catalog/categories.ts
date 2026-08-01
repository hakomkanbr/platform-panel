import * as http from "../http";
import type { PaginatedResult, ListParams, KeyValue, TranslationField } from "../../types/common";
import type { Category } from "../../types/catalog";

export interface CategoryFilters extends ListParams {
  status?: string;
  parentId?: string;
}

export const categoriesApi = {
  list: (params?: CategoryFilters) =>
    http.get<PaginatedResult<Category> | Category[]>("/Admin/Categories", params),

  tree: () => http.get<Category[]>("/Admin/Categories/tree"),

  getById: (id: string) => http.get<Category>(`/Admin/Categories/${id}`),

  create: (body: Partial<Category>) => http.post<Category>("/Admin/Categories", body),

  update: (id: string, body: Partial<Category>) => http.put<Category>(`/Admin/Categories/${id}`, body),

  delete: (id: string) => http.del<void>(`/Admin/Categories/${id}`),

  setStatus: (id: string, status: number) => http.put<void>(`/Admin/Categories/${id}/status`, { status }),

  move: (id: string, parentId?: string | null, sortOrder?: number) =>
    http.put<void>(`/Admin/Categories/${id}/move`, { parentId, sortOrder }),

  setImages: (id: string, imageUrl?: string, icon?: string) =>
    http.put<void>(`/Admin/Categories/${id}/images`, { imageUrl, icon }),

  setMetadata: (id: string, metadata: KeyValue[]) => http.put<void>(`/Admin/Categories/${id}/metadata`, { metadata }),

  setTranslations: (id: string, translations: TranslationField[]) =>
    http.put<void>(`/Admin/Categories/${id}/translations`, { translations }),
};
