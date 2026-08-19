"use client";

import React from "react";
import { MediaProvider, MediaLibrary } from "@repo/media";

/**
 * Platform-level Media Library page — /admin/media
 *
 * MediaProvider reads projectId from:
 *   1. ProjectId cookie (set when user selects a project)
 *   2. sessionStorage project-storage key
 *
 * The CDN connection is fetched automatically from
 *   GET /api/v1/cdn/connections/{projectId}
 * and provisioned idempotently on first access.
 */
export default function MediaPage() {
  return (
    <MediaProvider showEmptyState>
      <MediaLibrary />
    </MediaProvider>
  );
}