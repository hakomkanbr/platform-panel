import * as http from "../http";
import type { PaginatedResult, ListParams, KeyValue, TranslationField } from "../../types/common";
import type { Brand } from "../../types/catalog";

export interface BrandFilters extends ListParams {
  status?: string;
}

export const brandsApi = {
  list: (params?: BrandFilters) => http.get<PaginatedResult<Brand> | Brand[]>("/Admin/Brands", params),

  getById: (id: string) => http.get<Brand>(`/Admin/Brands/${id}`),

  create: (body: Partial<Brand>) => http.post<Brand>("/Admin/Brands", body),

  update: (id: string, body: Partial<Brand>) => http.put<Brand>(`/Admin/Brands/${id}`, body),

  delete: (id: string) => http.del<void>(`/Admin/Brands/${id}`),

  setStatus: (id: string, status: number) => http.put<void>(`/Admin/Brands/${id}/status`, { status }),

  setMetadata: (id: string, metadata: KeyValue[]) => http.put<void>(`/Admin/Brands/${id}/metadata`, { metadata }),

  setTranslations: (id: string, translations: TranslationField[]) =>
    http.put<void>(`/Admin/Brands/${id}/translations`, { translations }),
};
