"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { EmptyState } from "@repo/ui";
import { useTranslations } from "@repo/localization";
import { CdnApiClient } from "../client/cdn-api-client";
import {
  CdnConnectionError,
  fetchCdnConnection,
  DEFAULT_PLATFORM_URL,
  type TokenSource,
} from "../client/platform-connection";
import type { CdnConnection } from "../types";

export interface MediaContextValue {
  projectId: string | null;
  connection: CdnConnection | null;
  client: CdnApiClient | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const MediaContext = createContext<MediaContextValue>({
  projectId: null,
  connection: null,
  client: null,
  isLoading: false,
  error: null,
  refetch: () => undefined,
});

export function readMediaProjectIdFromCookies(): string | null {
  if (typeof window === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith("ProjectId=") || c.startsWith("projectId="));
  return cookie ? decodeURIComponent(cookie.split("=")[1] || "") || null : null;
}

function readMediaProjectIdFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      sessionStorage.getItem("project-storage") ||
      sessionStorage.getItem("ProjectId") ||
      sessionStorage.getItem("projectId") ||
      localStorage.getItem("ProjectId") ||
      localStorage.getItem("projectId");
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.projectId === "string") return parsed.projectId;
      if (typeof parsed?.id === "string") return parsed.id;
    } catch {}
    return raw;
  } catch {
    return null;
  }
}

export function MediaProvider({
  children,
  projectId: propProjectId,
  connection: propConnection,
  platformBaseUrl,
  tokenSource,
  showEmptyState = true,
}: {
  children: React.ReactNode;
  projectId?: string | null;
  connection?: CdnConnection | null;
  platformBaseUrl?: string;
  tokenSource?: TokenSource;
  showEmptyState?: boolean;
}) {
  const t = useTranslations();
  const params = useParams<{ projectId?: string }>();
  const routeProjectId = params?.projectId ?? null;
  const projectId =
    propProjectId ??
    routeProjectId ??
    readMediaProjectIdFromCookies() ??
    readMediaProjectIdFromStorage();

  const connectionQuery = useQuery<CdnConnection, CdnConnectionError>({
    queryKey: ["cdn-connection", projectId],
    queryFn: () =>
      fetchCdnConnection(projectId as string, { platformBaseUrl, tokenSource }),
    enabled: !!projectId && !propConnection,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const client = useMemo(() => {
    const conn = connectionQuery.data ?? propConnection ?? null;
    if (!conn) return null;
    return new CdnApiClient(conn.cdnBaseUrl, conn.apiKey);
  }, [connectionQuery.data, propConnection]);

  const value = useMemo<MediaContextValue>(
    () => ({
      projectId,
      connection: connectionQuery.data ?? propConnection ?? null,
      client,
      isLoading: connectionQuery.isLoading,
      error: connectionQuery.error instanceof Error ? connectionQuery.error : null,
      refetch: () => connectionQuery.refetch(),
    }),
    [
      projectId,
      connectionQuery.data,
      connectionQuery.isLoading,
      connectionQuery.error,
      connectionQuery.refetch,
      propConnection,
      client,
    ],
  );

  if (!projectId) {
    if (!showEmptyState) {
      return <>{children}</>;
    }
    return (
      <div style={{ padding: 48 }}>
        <EmptyState
          title={t("media.noProject.title")}
          description={t("media.noProject.description")}
          action={{
            label: t("media.noProject.goToProjects"),
            onClick: () => {
              window.location.href = "/admin/projects";
            },
          }}
        />
      </div>
    );
  }

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

export function useMedia(): MediaContextValue {
  return useContext(MediaContext);
}

export { DEFAULT_PLATFORM_URL, CdnConnectionError };

// Silence unused-var in toolchains that flag the re-export.
void CdnConnectionError;