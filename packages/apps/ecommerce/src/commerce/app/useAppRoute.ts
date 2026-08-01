"use client";

import { usePathname } from "next/navigation";

/**
 * Extracts the sub-route segments for a given app slug.
 * Handles both `/admin/{appSlug}/...` and `/admin/projects/{projectId}/{appSlug}/...`.
 */
export function useAppRoute(appSlug: string): string[] {
  const pathname = usePathname() ?? "";
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "admin") segments.shift();
  if (segments[0] === "projects") {
    segments.shift();
    segments.shift();
  }
  if (segments[0] === appSlug) segments.shift();
  return segments;
}
