"use client";

import { useQuery } from "@tanstack/react-query";
import { useMedia } from "../context/MediaProvider";
import type {
  CdnFile,
  CdnFileQuery,
  CdnFolder,
  CdnStats,
} from "../types";

function useEnabledClient() {
  const { client, projectId, connection } = useMedia();
  const enabled = !!client && !!projectId && !!connection;
  return { client, projectId, enabled, key: projectId ?? "no-project" };
}

export interface UseMediaFilesOptions extends CdnFileQuery {
  enabled?: boolean;
}

export function useMediaFiles(options: UseMediaFilesOptions = {}) {
  const { client, projectId, enabled } = useEnabledClient();
  const { enabled: optEnabled, ...query } = options;

  return useQuery({
    queryKey: ["media-files", projectId, query],
    queryFn: () => client!.listFiles(query),
    enabled: enabled && optEnabled !== false && !!client,
  });
}

export function useMediaStats(enabled = true) {
  const { client, projectId } = useEnabledClient();

  return useQuery({
    queryKey: ["media-stats", projectId],
    queryFn: () => client!.getStats(),
    enabled: enabled && !!client,
  });
}

export function useMediaFolders(parentId?: number | null) {
  const { client, projectId } = useEnabledClient();

  return useQuery<CdnFolder[]>({
    queryKey: ["media-folders", projectId, parentId ?? null],
    queryFn: () => client!.listFolders(parentId),
    enabled: !!client,
  });
}

export function useMediaFolder(id: number | null) {
  const { client, projectId } = useEnabledClient();

  return useQuery<CdnFolder>({
    queryKey: ["media-folder", projectId, id],
    queryFn: () => client!.getFolderById(id as number),
    enabled: !!client && id != null,
  });
}

export function useMediaFolderByName(name: string | null, parentId?: number | null) {
  const { client, projectId } = useEnabledClient();

  return useQuery<CdnFolder>({
    queryKey: ["media-folder-by-name", projectId, name, parentId ?? null],
    queryFn: () => client!.getFolderByName(name as string, parentId),
    enabled: !!client && !!name,
  });
}

export function useMediaFile(id: number | null) {
  const { client, projectId } = useEnabledClient();

  return useQuery<CdnFile>({
    queryKey: ["media-file", projectId, id],
    queryFn: () => client!.getFile(id as number),
    enabled: !!client && id != null,
  });
}

export function useMediaPublicFile(id: number | null) {
  const { client, projectId } = useEnabledClient();

  return useQuery({
    queryKey: ["media-public-file", projectId, id],
    queryFn: () => client!.accessPublic(id as number),
    enabled: !!client && id != null,
  });
}

export function useMediaSignedUrl(id: number | null, expiresIn = 3600, enabled = true) {
  const { client, projectId } = useEnabledClient();

  return useQuery({
    queryKey: ["media-signed-url", projectId, id, expiresIn],
    queryFn: () => client!.getSignedUrl(id as number, expiresIn),
    enabled: !!client && id != null && enabled,
  });
}

export function useMediaVariantSignedUrls(id: number | null, expiresIn = 3600, enabled = true) {
  const { client, projectId } = useEnabledClient();

  return useQuery({
    queryKey: ["media-variant-signed-urls", projectId, id, expiresIn],
    queryFn: () => client!.getVariantSignedUrls(id as number, expiresIn),
    enabled: !!client && id != null && enabled,
  });
}