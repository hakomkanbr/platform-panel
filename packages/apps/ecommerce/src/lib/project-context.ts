import { createPlatformClient } from "./api/client";

export interface ProjectDto {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  slug: string;
  appCount: number;
  enabledAppCount: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface ProjectDetailDto {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string | null;
  apps: ProjectAppDto[];
}

export interface ProjectAppDto {
  id: string;
  appCatalogId: string;
  appName: string;
  appDisplayName: string;
  appIcon: string;
  appBaseUrl: string;
  appPort: number;
  capabilityCode: string;
  isEnabled: boolean;
  enabledAt: string | null;
  disabledAt: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export function getProjectIdFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("projectId");
}

export function getTenantIdFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("tenantId");
}

export function getTenantIdFromKeycloak(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const keycloak = (window as any).keycloak;
    if (keycloak?.tokenParsed?.tenant_id) {
      return keycloak.tokenParsed.tenant_id;
    }
    if (keycloak?.tokenParsed?.tenantId) {
      return keycloak.tokenParsed.tenantId;
    }
  } catch {
    // ignore
  }
  return null;
}

export async function fetchMyProjects(): Promise<ProjectDto[]> {
  const client = createPlatformClient();
  const res = await client.get<ApiResponse<ProjectDto[]>>("/api/v1/projects");
  return res.data.data;
}

export async function fetchProjects(tenantId: string): Promise<ProjectDto[]> {
  const client = createPlatformClient();
  const res = await client.get<ApiResponse<ProjectDto[]>>(
    `/api/v1/projects?tenantId=${tenantId}`
  );
  return res.data.data;
}

export async function fetchProject(projectId: string, tenantId?: string): Promise<ProjectDetailDto> {
  const client = createPlatformClient();
  const url = tenantId
    ? `/api/v1/projects/${projectId}?tenantId=${tenantId}`
    : `/api/v1/projects/${projectId}`;
  const res = await client.get<ApiResponse<ProjectDetailDto>>(url);
  return res.data.data;
}

export async function createMyProject(name: string, description?: string): Promise<string> {
  const client = createPlatformClient();
  const res = await client.post<ApiResponse<string>>(
    "/api/v1/projects",
    { name, description: description || "" }
  );
  return res.data.data;
}

export async function createProject(tenantId: string, name: string, description?: string): Promise<string> {
  const client = createPlatformClient();
  const res = await client.post<ApiResponse<string>>(
    `/api/v1/projects?tenantId=${tenantId}`,
    { name, description: description || "" }
  );
  return res.data.data;
}
