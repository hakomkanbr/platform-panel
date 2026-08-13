import { getGatewayClient } from "@repo/api-client";
import api_points from "@/api/points";
import type {
  ProjectLanguageDto,
  CreateProjectLanguageRequest,
  UpdateProjectLanguageRequest,
} from "./types";

interface BackendLanguageDto {
  id: string;
  projectId: string | null;
  code: string;
  name: string;
  nativeName: string;
  direction: string;
  flagIcon: string | null;
  region?: string | null;
  isDefault: boolean;
  isEnabled: boolean;
  displayOrder: number;
  version: string;
  versionDate: string;
  translationCount: number;
  translationCompletionPercent: number;
}

interface BackendCreateRequest {
  projectId?: string;
  code: string;
  name: string;
  nativeName: string;
  direction: number;
  flagIcon: string | null;
  region?: string | null;
  displayOrder?: number;
}

function mapBackendToFrontend(b: BackendLanguageDto): ProjectLanguageDto {
  return {
    id: b.id,
    projectId: b.projectId ?? "",
    code: b.code,
    name: b.name,
    nativeName: b.nativeName,
    flag: b.flagIcon ?? "🏳️",
    rtl: b.direction === "RTL",
    enabled: b.isEnabled,
    isDefault: b.isDefault,
    order: b.displayOrder,
    translationCompletion: b.translationCompletionPercent,
    createdAt: b.versionDate,
    updatedAt: undefined,
  };
}

function mapCreateToBackend(
  projectId: string,
  f: CreateProjectLanguageRequest,
): BackendCreateRequest {
  return {
    projectId,
    code: f.code,
    name: f.name,
    nativeName: f.nativeName,
    direction: f.rtl,
    flagIcon: f.flag || null,
  };
}

function mapUpdateToBackend(
  f: UpdateProjectLanguageRequest,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (f.name !== undefined) result.name = f.name;
  if (f.nativeName !== undefined) result.nativeName = f.nativeName;
  if (f.rtl !== undefined) result.direction = f.rtl ? "RTL" : "LTR";
  if (f.flag !== undefined) result.flagIcon = f.flag;
  if (f.order !== undefined) result.displayOrder = f.order;
  if (f.enabled !== undefined) result.isEnabled = f.enabled;
  return result;
}

function buildUrl(template: string, projectId?: string, id?: string): string {
  let url = template;
  if (projectId) url = url.replace("{projectId}", projectId);
  if (id) url = url.replace("{id}", id);
  return url;
}

async function unwrap<T>(response: any): Promise<T> {
  const body = response.data;
  if (body.success === false)
    throw new Error(body.error || body.message || "Unknown error");
  return body.data as T;
}

export const languageService = {
  async list(projectId: string): Promise<ProjectLanguageDto[]> {
    const res = await getGatewayClient().get(
      buildUrl(api_points.projectLanguages.list, projectId),
    );
    const data = await unwrap<BackendLanguageDto[]>(res);
    return data.map(mapBackendToFrontend);
  },

  async create(
    projectId: string,
    request: CreateProjectLanguageRequest,
  ): Promise<ProjectLanguageDto> {
    const res = await getGatewayClient().post(
      buildUrl(api_points.projectLanguages.create),
      mapCreateToBackend(projectId, request),
    );
    const data = await unwrap<BackendLanguageDto>(res);
    return mapBackendToFrontend(data);
  },

  async update(
    projectId: string,
    id: string,
    request: UpdateProjectLanguageRequest,
  ): Promise<ProjectLanguageDto> {
    const res = await getGatewayClient().put(
      buildUrl(api_points.projectLanguages.update, undefined, id),
      mapUpdateToBackend(request),
    );
    const data = await unwrap<BackendLanguageDto>(res);
    return mapBackendToFrontend(data);
  },

  async delete(projectId: string, id: string): Promise<void> {
    await getGatewayClient().delete(
      buildUrl(api_points.projectLanguages.delete, undefined, id),
    );
  },

  async setDefault(projectId: string, id: string): Promise<void> {
    await getGatewayClient().put(
      buildUrl(api_points.projectLanguages.setDefault, undefined, id),
    );
  },

  async enable(projectId: string, id: string): Promise<void> {
    await getGatewayClient().put(
      buildUrl(api_points.projectLanguages.enable, undefined, id),
    );
  },

  async disable(projectId: string, id: string): Promise<void> {
    await getGatewayClient().put(
      buildUrl(api_points.projectLanguages.disable, undefined, id),
    );
  },
};
