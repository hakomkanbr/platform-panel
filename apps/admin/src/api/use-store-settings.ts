import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  storeSettingsApi,
  type StoreDto,
  type StoreSettingsDto,
  type CreateStoreRequest,
  type UpdateStoreSettingsRequest,
} from "@/api/store-settings";

export function useStoreSettings(projectId: string | undefined) {
  return useQuery<StoreDto | null, Error>({
    queryKey: ["store-settings", projectId],
    queryFn: () => storeSettingsApi.getStoreByProject(projectId!),
    enabled: !!projectId,
    retry: 1,
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();
  return useMutation<
    StoreDto,
    Error,
    { projectId: string; request: CreateStoreRequest }
  >({
    mutationFn: ({ projectId, request }) =>
      storeSettingsApi.createStore(projectId, request),
    onSuccess: (store) => {
      message.success("Store created successfully");
      queryClient.invalidateQueries({
        queryKey: ["store-settings", store.projectId],
      });
    },
    onError: (error) => {
      message.error(`Failed to create store: ${error.message}`);
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();
  return useMutation<
    StoreDto,
    Error,
    {
      storeId: string;
      projectId: string;
      request: import("@/api/store-settings").UpdateStoreRequest;
    }
  >({
    mutationFn: ({ storeId, projectId, request }) =>
      storeSettingsApi.updateStore(storeId, projectId, request),
    onSuccess: (store) => {
      queryClient.invalidateQueries({
        queryKey: ["store-settings", store.projectId],
      });
    },
    onError: (error) => {
      message.error(`Failed to update store: ${error.message}`);
    },
  });
}

export function useUpdateStoreSettings() {
  const queryClient = useQueryClient();
  return useMutation<
    StoreSettingsDto,
    Error,
    {
      storeId: string;
      projectId: string;
      request: UpdateStoreSettingsRequest;
    }
  >({
    mutationFn: ({ storeId, projectId, request }) =>
      storeSettingsApi.updateSettings(storeId, projectId, request),
    onSuccess: (settings) => {
      message.success("Store info saved successfully");
      queryClient.invalidateQueries({
        queryKey: ["store-settings", settings.projectId],
      });
    },
    onError: (error) => {
      message.error(`Failed to save store info: ${error.message}`);
    },
  });
}