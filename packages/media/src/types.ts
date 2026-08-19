/** Visibility values supported by the CDN. */
export type CdnVisibility = "PUBLIC" | "PRIVATE" | "RESTRICTED";

/** Processing status of a file on the CDN. */
export type CdnFileStatus = "PROCESSING" | "READY" | "FAILED";

/** A generated image variant (e.g. thumb / sm / md / lg / webp). */
export interface CdnFileVariant {
  id: number;
  fileId: number;
  name: string;
  path: string;
  url?: string | null;
  width?: number | null;
  height?: number | null;
  size: number;
  mimeType: string;
}

export interface CdnTag {
  id: number;
  name: string;
}

export interface CdnFolderRef {
  id: number;
  name: string;
  path: string;
}

/** The canonical CDN File payload returned by the Assets Manager API. */
export interface CdnFile {
  id: number;
  name: string;
  originalName: string;
  mimeType: string;
  extension: string;
  size: number;
  width?: number | null;
  height?: number | null;
  hash: string;
  path: string;
  url?: string | null;
  provider: string;
  status: CdnFileStatus;
  visibility: CdnVisibility;
  folderId?: number | null;
  projectId?: number;
  tags: CdnTag[];
  variants: CdnFileVariant[];
  metadata?: Record<string, unknown> | null;
  folder?: CdnFolderRef | null;
  createdAt: string;
  updatedAt: string;
}

export interface CdnPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Response of GET /files (list). */
export interface CdnFileList {
  data: CdnFile[];
  meta: CdnPaginationMeta;
}

export interface CdnStats {
  total: number;
  totalSize: number;
  totalSizeMB: number;
  byType: { mimeType: string; count: number; size: number }[];
  byStatus: { status: CdnFileStatus; count: number }[];
}

export interface CdnFolder {
  id: number;
  name: string;
  path: string;
  parentId?: number | null;
  projectId?: number;
  _count?: { files: number; children?: number };
  createdAt?: string;
}

/** Single-file upload result (may be a duplicate of an existing file). */
export interface CdnUploadResult extends CdnFile {
  duplicate?: boolean;
}

/** Multi-file upload result. */
export interface CdnMultiUploadResult {
  success: CdnFile[];
  failed: string[];
}

export type CdnChunkStatus = "pending" | "complete";

export interface CdnChunkPending {
  status: "pending";
  received: number;
  total: number;
  uploadId: string;
}

export interface CdnChunkComplete {
  status: "complete";
  file: CdnFile;
}

/** Update file metadata. */
export interface CdnUpdateFileBody {
  name?: string;
  visibility?: CdnVisibility;
  folderId?: number;
  tags?: string;
}

export type CdnBulkAction = "delete" | "move" | "visibility";

export interface CdnBulkActionBody {
  ids: number[];
  action: CdnBulkAction;
  folderId?: number;
  visibility?: CdnVisibility;
}

export interface CdnBulkActionResult {
  success: boolean;
  affected: number;
}

export interface CdnPublicFileResult {
  id: number;
  url: string | null;
  name: string;
  mimeType: string;
  size: number;
  variants: Array<{ name: string; url: string | null }>;
}

export interface CdnSignedUrlResult {
  url: string;
  expiresAt: string | null;
  type?: string;
}

export interface CdnVariantSignedUrlsResult {
  fileId: number;
  urls: Record<string, string>;
  expiresAt: string | null;
}

export interface CdnVisibilityUpdateResult {
  id: number;
  visibility: CdnVisibility;
  url?: string | null;
  updatedAt: string;
}

/**
 * CDN connection for a platform project, returned by the platform API
 * (`GET /api/v1/cdn/connections/{projectId}`) and provisioned on first use.
 */
export interface CdnConnection {
  projectId: string;
  cdnProjectId: number;
  cdnProjectSlug: string;
  provider: string;
  apiKey: string;
  cdnBaseUrl: string;
  provisioned: boolean;
}

/** File query options for GET /files. */
export interface CdnFileQuery {
  page?: number;
  limit?: number;
  search?: string;
  folderId?: number;
  mimeType?: string;
  visibility?: CdnVisibility;
  tags?: string;
  sortBy?: "createdAt" | "size" | "name";
  sortOrder?: "asc" | "desc";
}

/** Upload options shared by single/multiple/chunked uploads. */
export interface CdnUploadOptions {
  folderId?: number;
  visibility?: CdnVisibility;
  tags?: string;
}