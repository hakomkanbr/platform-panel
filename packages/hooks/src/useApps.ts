import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appsApi } from "@repo/api-client";
import type {
  AppCatalogDto,
  ProjectDto,
  ProjectDetailDto,
  CreateProjectRequest,
  UpdateProjectRequest,
  EnableAppRequest,
  PlanCapability,
} from "@repo/shared-types";
import { message } from "antd";

export function useAppCatalog() {
  return useQuery<AppCatalogDto[], Error>({
    queryKey: ["app-catalog"],
    queryFn: () => appsApi.getAppCatalog(),
    retry: 2,
    staleTime: 60000,
  });
}

export function useAppCatalogById(id: string) {
  return useQuery<AppCatalogDto, Error>({
    queryKey: ["app-catalog", id],
    queryFn: () => appsApi.getAppCatalogById(id),
    retry: 2,
    enabled: !!id,
  });
}

export function useProjects(tenantId?: string) {
  return useQuery<ProjectDto[], Error>({
    queryKey: ["projects", tenantId],
    queryFn: () => appsApi.getProjects(tenantId),
    retry: 2,
    enabled: !!tenantId,
  });
}

export function useProject(id: string, tenantId?: string) {
  return useQuery<ProjectDetailDto, Error>({
    queryKey: ["project", id, tenantId],
    queryFn: () => appsApi.getProject(id, tenantId),
    retry: 2,
    enabled: !!id && !!tenantId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation<
    string,
    Error,
    { request: CreateProjectRequest; tenantId?: string }
  >({
    mutationFn: ({ request, tenantId }) =>
      appsApi.createProject(request, tenantId),
    onSuccess: () => {
      message.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      message.error(`Failed to create project: ${error.message}`);
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { id: string; request: UpdateProjectRequest; tenantId?: string }
  >({
    mutationFn: ({ id, request, tenantId }) =>
      appsApi.updateProject(id, request, tenantId),
    onSuccess: () => {
      message.success("Project updated successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
    onError: (error) => {
      message.error(`Failed to update project: ${error.message}`);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string; tenantId?: string }>({
    mutationFn: ({ id, tenantId }) => appsApi.deleteProject(id, tenantId),
    onSuccess: () => {
      message.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      message.error(`Failed to delete project: ${error.message}`);
    },
  });
}

export function useEnableApp() {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { projectId: string; request: EnableAppRequest; tenantId?: string }
  >({
    mutationFn: ({ projectId, request, tenantId }) =>
      appsApi.enableApp(projectId, request, tenantId),
    onSuccess: () => {
      message.success("App enabled");
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
    onError: (error) => {
      message.error(`Failed to enable app: ${error.message}`);
    },
  });
}

export function useDisableApp() {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { projectId: string; request: EnableAppRequest; tenantId?: string }
  >({
    mutationFn: ({ projectId, request, tenantId }) =>
      appsApi.disableApp(projectId, request, tenantId),
    onSuccess: () => {
      message.success("App disabled");
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
    onError: (error) => {
      message.error(`Failed to disable app: ${error.message}`);
    },
  });
}

export function useCurrentCapabilities(tenantId?: string) {
  return useQuery<Record<string, PlanCapability>, Error>({
    queryKey: ["current-capabilities", tenantId],
    queryFn: () => billingExtApi.getCurrentCapabilities(tenantId),
    retry: 2,
    enabled: !!tenantId,
    staleTime: 30000,
  });
}

import { billingExtApi } from "@repo/api-client";
import type { PlanCapability as _PlanCapability } from "@repo/shared-types";
