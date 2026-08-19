"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMedia } from "../context/MediaProvider";
import type {
  CdnBulkActionBody,
  CdnBulkActionResult,
  CdnFile,
  CdnFolder,
  CdnUpdateFileBody,
  CdnUploadOptions,
  CdnUploadResult,
  CdnVisibility,
  CdnVisibilityUpdateResult,
} from "../types";

export function useMediaUpload() {
  const { client, projectId } = useMedia();
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["media-files", projectId] });
    void queryClient.invalidateQueries({ queryKey: ["media-stats", projectId] });
  };

  return useMutation<
    CdnUploadResult,
    Error,
    { file: File; options?: CdnUploadOptions; onProgress?: (p: number) => void }
  >({
    mutationFn: ({ file, options = {}, onProgress }) => {
      if (!client) throw new Error("CDN is not connected.");
      return client.upload(file, options, onProgress);
    },
    onSuccess: invalidate,
  });
}

export function useMediaUploadMultiple() {
  const { client, projectId } = useMedia();
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["media-files", projectId] });
    void queryClient.invalidateQueries({ queryKey: ["media-stats", projectId] });
  };

  return useMutation<
    CdnUploadResult[],
    Error,
    { files: File[]; options?: CdnUploadOptions }
  >({
    mutationFn: async ({ files, options = {} }) => {
      if (!client) throw new Error("CDN is not connected.");
      const results: CdnUploadResult[] = [];
      for (const file of files) {
        results.push(await client.upload(file, options));
      }
      return results;
    },
    onSuccess: invalidate,
  });
}

export function useMediaDelete() {
  const { client, projectId } = useMedia();
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["media-files", projectId] });
    void queryClient.invalidateQueries({ queryKey: ["media-stats", projectId] });
  };

  return useMutation<void, Error, number>({
    mutationFn: (id) => {
      if (!client) throw new Error("CDN is not connected.");
      return client.deleteFile(id);
    },
    onSuccess: invalidate,
  });
}

export function useMediaBulk() {
  const { client, projectId } = useMedia();
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["media-files", projectId] });
    void queryClient.invalidateQueries({ queryKey: ["media-stats", projectId] });
  };

  return useMutation<CdnBulkActionResult, Error, CdnBulkActionBody>({
    mutationFn: (body) => {
      if (!client) throw new Error("CDN is not connected.");
      return client.bulkAction(body);
    },
    onSuccess: invalidate,
  });
}

export function useMediaUpdate() {
  const { client, projectId } = useMedia();
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["media-files", projectId] });
    void queryClient.invalidateQueries({ queryKey: ["media-file", projectId] });
  };

  return useMutation<CdnFile, Error, { id: number; body: CdnUpdateFileBody }>({
    mutationFn: ({ id, body }) => {
      if (!client) throw new Error("CDN is not connected.");
      return client.updateFile(id, body);
    },
    onSuccess: invalidate,
  });
}

export function useCreateFolder() {
  const { client, projectId } = useMedia();
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["media-folders", projectId] });
    void queryClient.invalidateQueries({ queryKey: ["media-folder", projectId] });
  };

  return useMutation<CdnFolder, Error, { name: string; parentId?: number | null }>({
    mutationFn: ({ name, parentId }) => {
      if (!client) throw new Error("CDN is not connected.");
      return client.createFolder(name, parentId);
    },
    onSuccess: invalidate,
  });
}

export function useDeleteFolder() {
  const { client, projectId } = useMedia();
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["media-folders", projectId] });
    void queryClient.invalidateQueries({ queryKey: ["media-files", projectId] });
  };

  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: (id) => {
      if (!client) throw new Error("CDN is not connected.");
      return client.deleteFolder(id);
    },
    onSuccess: invalidate,
  });
}

export function useUpdateVisibility() {
  const { client, projectId } = useMedia();
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["media-files", projectId] });
    void queryClient.invalidateQueries({ queryKey: ["media-file", projectId] });
    void queryClient.invalidateQueries({ queryKey: ["media-public-file", projectId] });
    void queryClient.invalidateQueries({ queryKey: ["media-variant-signed-urls", projectId] });
  };

  return useMutation<
    CdnVisibilityUpdateResult,
    Error,
    { id: number; visibility: CdnVisibility }
  >({
    mutationFn: ({ id, visibility }) => {
      if (!client) throw new Error("CDN is not connected.");
      return client.updateVisibility(id, visibility);
    },
    onSuccess: invalidate,
  });
}