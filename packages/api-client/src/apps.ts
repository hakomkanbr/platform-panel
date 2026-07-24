import { getGatewayClient } from "./gateway-client";
import type {
  AppCatalogDto,
  ProjectDto,
  ProjectDetailDto,
  ProjectAppDto,
  CreateProjectRequest,
  UpdateProjectRequest,
  EnableAppRequest,
} from "@repo/shared-types";

export const appsApi = {
  getAppCatalog: async (): Promise<AppCatalogDto[]> => {
    const client = getGatewayClient();
    const response = await client.get<{
      success: boolean;
      data: AppCatalogDto[];
    }>("/api/v1/app-catalog");
    return response.data.data;
  },

  getAppCatalogById: async (id: string): Promise<AppCatalogDto> => {
    const client = getGatewayClient();
    const response = await client.get<{
      success: boolean;
      data: AppCatalogDto;
    }>(`/api/v1/app-catalog/${id}`);
    return response.data.data;
  },

  getProjects: async (tenantId?: string): Promise<ProjectDto[]> => {
    const client = getGatewayClient();
    const url = tenantId
      ? `/api/v1/projects?tenantId=${tenantId}`
      : "/api/v1/projects";
    const response = await client.get<{ success: boolean; data: ProjectDto[] }>(url);
    return response.data.data;
  },

  getProject: async (id: string, tenantId?: string): Promise<ProjectDetailDto> => {
    const client = getGatewayClient();
    const url = tenantId
      ? `/api/v1/projects/${id}?tenantId=${tenantId}`
      : `/api/v1/projects/${id}`;
    const response = await client.get<{ success: boolean; data: ProjectDetailDto }>(url);
    return response.data.data;
  },

  createProject: async (request: CreateProjectRequest, tenantId?: string): Promise<string> => {
    const client = getGatewayClient();
    const url = tenantId
      ? `/api/v1/projects?tenantId=${tenantId}`
      : "/api/v1/projects";
    const response = await client.post<{ success: boolean; data: string }>(url, request);
    return response.data.data;
  },

  updateProject: async (id: string, request: UpdateProjectRequest, tenantId?: string): Promise<void> => {
    const client = getGatewayClient();
    const url = tenantId
      ? `/api/v1/projects/${id}?tenantId=${tenantId}`
      : `/api/v1/projects/${id}`;
    await client.put(url, request);
  },

  deleteProject: async (id: string, tenantId?: string): Promise<void> => {
    const client = getGatewayClient();
    const url = tenantId
      ? `/api/v1/projects/${id}?tenantId=${tenantId}`
      : `/api/v1/projects/${id}`;
    await client.delete(url);
  },

  getProjectApps: async (projectId: string, tenantId?: string): Promise<ProjectAppDto[]> => {
    const client = getGatewayClient();
    const url = tenantId
      ? `/api/v1/projects/${projectId}/apps?tenantId=${tenantId}`
      : `/api/v1/projects/${projectId}/apps`;
    const response = await client.get<{ success: boolean; data: ProjectAppDto[] }>(url);
    return response.data.data;
  },

  enableApp: async (projectId: string, request: EnableAppRequest, tenantId?: string): Promise<void> => {
    const client = getGatewayClient();
    const url = tenantId
      ? `/api/v1/projects/${projectId}/apps/enable?tenantId=${tenantId}`
      : `/api/v1/projects/${projectId}/apps/enable`;
    await client.post(url, request);
  },

  disableApp: async (projectId: string, request: EnableAppRequest, tenantId?: string): Promise<void> => {
    const client = getGatewayClient();
    const url = tenantId
      ? `/api/v1/projects/${projectId}/apps/disable?tenantId=${tenantId}`
      : `/api/v1/projects/${projectId}/apps/disable`;
    await client.post(url, request);
  },
};
