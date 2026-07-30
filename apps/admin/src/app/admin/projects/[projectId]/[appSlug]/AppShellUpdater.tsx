"use client";

import { useEffect } from "react";
import { useNavigationContext } from "@repo/navigation";
import type { ApplicationDefinition } from "@repo/app-registry";

interface AppShellUpdaterProps {
  app: ApplicationDefinition;
  children: React.ReactNode;
}

export default function AppShellUpdater({ app, children }: AppShellUpdaterProps) {
  const { setApplication } = useNavigationContext();

  useEffect(() => {
    setApplication(app);
    return () => setApplication(null);
  }, [app, setApplication]);

  return <>{children}</>;
}
