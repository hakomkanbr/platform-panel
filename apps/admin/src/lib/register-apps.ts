"use client";

import { appRegistry } from "@repo/app-registry";
import { CmsApplication } from "@repo/apps-cms";

appRegistry.registerApp(CmsApplication);

export default function RegisterApps({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
