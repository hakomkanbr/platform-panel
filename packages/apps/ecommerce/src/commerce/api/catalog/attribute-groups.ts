import * as http from "../http";
import type { PaginatedResult, ListParams } from "../../types/common";
import type { AttributeGroup, AttributeDefinition, AttributeValue } from "../../types/catalog";

export interface AttributeGroupFilters extends ListParams {
  key?: string;
}

export const attributeGroupsApi = {
  list: (params?: AttributeGroupFilters) =>
    http.get<PaginatedResult<AttributeGroup> | AttributeGroup[]>("/Admin/AttributeGroups", params),

  getById: (id: string) => http.get<AttributeGroup>(`/Admin/AttributeGroups/${id}`),

  create: (body: Partial<AttributeGroup>) => http.post<AttributeGroup>("/Admin/AttributeGroups", body),

  update: (id: string, body: Partial<AttributeGroup>) =>
    http.put<AttributeGroup>(`/Admin/AttributeGroups/${id}`, body),

  delete: (id: string) => http.del<void>(`/Admin/AttributeGroups/${id}`),

  addDefinition: (id: string, body: Partial<AttributeDefinition>) =>
    http.post<AttributeDefinition>(`/Admin/AttributeGroups/${id}/definitions`, body),

  updateDefinition: (id: string, definitionId: string, body: Partial<AttributeDefinition>) =>
    http.put<AttributeDefinition>(`/Admin/AttributeGroups/${id}/definitions/${definitionId}`, body),

  deleteDefinition: (id: string, definitionId: string) =>
    http.del<void>(`/Admin/AttributeGroups/${id}/definitions/${definitionId}`),

  addValue: (id: string, definitionId: string, body: Partial<AttributeValue>) =>
    http.post<AttributeValue>(`/Admin/AttributeGroups/${id}/definitions/${definitionId}/values`, body),

  updateValue: (id: string, definitionId: string, valueId: string, body: Partial<AttributeValue>) =>
    http.put<AttributeValue>(`/Admin/AttributeGroups/${id}/definitions/${definitionId}/values/${valueId}`, body),

  deleteValue: (id: string, definitionId: string, valueId: string) =>
    http.del<void>(`/Admin/AttributeGroups/${id}/definitions/${definitionId}/values/${valueId}`),
};
