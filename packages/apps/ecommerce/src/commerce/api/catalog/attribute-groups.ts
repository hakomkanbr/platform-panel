import * as http from "../http";
import type { PaginatedResult, ListParams } from "../../types/common";
import type { AttributeGroupReadModel, AttributeGroupFilters, CreateAttributeGroupCommand, UpdateAttributeGroupRequest, AddAttributeDefinitionCommand, AddDefinitionValueBody } from "../../types/catalog";

export const attributeGroupsApi = {
  list: (params?: AttributeGroupFilters) =>
    http.get<PaginatedResult<AttributeGroupReadModel>>("/Admin/AttributeGroups", params),

  getById: (id: string) => http.get<AttributeGroupReadModel>(`/Admin/AttributeGroups/${id}`),

  create: (body: CreateAttributeGroupCommand) => http.post<AttributeGroupReadModel>("/Admin/AttributeGroups", body),

  update: (id: string, body: UpdateAttributeGroupRequest) =>
    http.put<AttributeGroupReadModel>(`/Admin/AttributeGroups/${id}`, body),

  delete: (id: string) => http.del<void>(`/Admin/AttributeGroups/${id}`),

  addDefinition: (id: string, body: AddAttributeDefinitionCommand) =>
    http.post<AttributeGroupReadModel>(`/Admin/AttributeGroups/${id}/definitions`, body),

  deleteDefinition: (id: string, definitionId: string) =>
    http.del<void>(`/Admin/AttributeGroups/${id}/definitions/${definitionId}`),

  addDefinitionValue: (id: string, definitionId: string, body: AddDefinitionValueBody) =>
    http.post<AttributeGroupReadModel>(`/Admin/AttributeGroups/${id}/definitions/${definitionId}/values`, body),
};