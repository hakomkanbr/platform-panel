"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EmptyState } from "@repo/ui";
import { useTranslations } from "@repo/localization";
import { getCurrentProjectId, STORAGE_KEY } from "../../lib/api/project-storage";

export interface CommerceContextValue {
  projectId: string | null;
}

const CommerceContext = createContext<CommerceContextValue>({ projectId: null });

export function readProjectIdFromCookies(): string | null {
  if (typeof window === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith("ProjectId="));
  return cookie ? cookie.split("=")[1] || null : null;
}

export function CommerceProvider({
  children,
  projectId: propProjectId,
}: {
  children: React.ReactNode;
  projectId?: string | null;
}) {
  const t = useTranslations();
  const params = useParams<{ projectId?: string }>();
  const routeProjectId = params?.projectId ?? null;
  const projectId =
    propProjectId ?? routeProjectId ?? readProjectIdFromCookies() ?? getCurrentProjectId();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 15,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  // Sync the resolved projectId into sessionStorage so that the axios interceptor
  // in http.ts can read it via getCurrentProjectId() and inject X-Project-Id on
  // every Catalog and Pricing API request — without any per-request manual work.
  useEffect(() => {
    if (typeof window === "undefined" || !projectId) return;
    try {
      const existingRaw = sessionStorage.getItem(STORAGE_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, projectId }));
    } catch {
      // sessionStorage may be unavailable in some iframe/privacy contexts — ignore
    }
  }, [projectId]);

  const value = useMemo(() => ({ projectId }), [projectId]);

  if (!projectId) {
    return (
      <div style={{ padding: 48 }}>
        <EmptyState
          title={t("catalog.project.title")}
          description={t("catalog.project.description")}
          action={{
            label: t("catalog.project.goToProjects"),
            onClick: () => {
              window.location.href = "/admin/projects";
            },
          }}
        />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>
    </QueryClientProvider>
  );
}

export function useCommerce(): CommerceContextValue {
  return useContext(CommerceContext);
}
