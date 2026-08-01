"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EmptyState } from "@repo/ui";
import { getCurrentProjectId } from "../../lib/api/project-storage";

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

  const value = useMemo(() => ({ projectId }), [projectId]);

  if (!projectId) {
    return (
      <div style={{ padding: 48 }}>
        <EmptyState
          title="Select a project"
          description="Pick a project to manage its catalog and pricing."
          action={{
            label: "Go to projects",
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
