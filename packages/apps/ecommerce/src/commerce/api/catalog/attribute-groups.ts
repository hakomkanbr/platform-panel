import * as http from "../http";
import type { PaginatedResult, ListParams } from "../../types/common";
import type { AttributeGroupReadModel, AttributeGroupFilters, CreateAttributeGroupCommand, UpdateAttributeGroupRequest, AddAttributeDefinitionCommand, AddDefinitionValueBody } from "../../types/catalog";

export const attributeGroupsApi = {
  list: (params?: AttributeGroupFilters) =>
    http.get<PaginatedResult<AttributeGroupReadModel>>("/Admin/v1/AttributeGroups", params as Record<string, unknown>),

  getById: (id: string) => http.get<AttributeGroupReadModel>(`/Admin/v1/AttributeGroups/${id}`),

  create: (body: CreateAttributeGroupCommand) => http.post<AttributeGroupReadModel>("/Admin/v1/AttributeGroups", body),

  update: (id: string, body: UpdateAttributeGroupRequest) =>
    http.put<AttributeGroupReadModel>(`/Admin/v1/AttributeGroups/${id}`, body),

  delete: (id: string) => http.del<void>(`/Admin/v1/AttributeGroups/${id}`),

  addDefinition: (id: string, body: AddAttributeDefinitionCommand) =>
    http.post<AttributeGroupReadModel>(`/Admin/v1/AttributeGroups/${id}/definitions`, body),

  deleteDefinition: (id: string, definitionId: string) =>
    http.del<void>(`/Admin/v1/AttributeGroups/${id}/definitions/${definitionId}`),

  addDefinitionValue: (id: string, definitionId: string, body: AddDefinitionValueBody) =>
    http.post<AttributeGroupReadModel>(`/Admin/v1/AttributeGroups/${id}/definitions/${definitionId}/values`, body),
};