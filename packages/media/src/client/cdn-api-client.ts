import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  CdnBulkActionBody,
  CdnBulkActionResult,
  CdnChunkComplete,
  CdnChunkPending,
  CdnFile,
  CdnFileList,
  CdnFileQuery,
  CdnFolder,
  CdnMultiUploadResult,
  CdnSignedUrlResult,
  CdnStats,
  CdnUpdateFileBody,
  CdnUploadOptions,
  CdnUploadResult,
  CdnPublicFileResult,
  CdnVariantSignedUrlsResult,
  CdnVisibilityUpdateResult,
  CdnVisibility,
} from "../types";

export class CdnApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "CdnApiError";
  }
}

interface CdnEnvelope<T> {
  success: boolean;
  data?: T;
  statusCode?: number;
  message?: string;
  errors?: unknown;
}

function unwrap<T>(body: CdnEnvelope<T>): T {
  if (body && (body.success === false || body.success === undefined)) {
    const message =
      (body.message as string) ||
      (Array.isArray(body.errors)
        ? (body.errors as string[]).join(", ")
        : typeof body.errors === "string"
          ? body.errors
          : "CDN request failed");
    throw new CdnApiError(body.statusCode ?? 400, message, body.errors);
  }
  return body.data as T;
}

/**
 * Adapter over the Assets Manager CDN REST API. Every project-scoped call
 * authenticates with the x-api-key issued for the current platform project,
 * so tenants can never access another project's media.
 */
export class CdnApiClient {
  private readonly client: AxiosInstance;

  constructor(baseUrl: string, apiKey: string) {
    this.client = axios.create({
      baseURL: baseUrl.replace(/\/$/, ""),
      headers: { "x-api-key": apiKey },
    });
  }

  // ── Files ────────────────────────────────────────────────────────────
  async listFiles(query: CdnFileQuery = {}): Promise<CdnFileList> {
    const res = await this.client.get("/files", { params: query });
    const body = res.data as CdnEnvelope<CdnFileList>;
    const list = unwrap<CdnFileList>(body);
    return {
      data: list?.data ?? [],
      meta: list?.meta ?? { total: 0, page: 1, limit: query.limit ?? 20, totalPages: 0 },
    };
  }

  async getFile(id: number): Promise<CdnFile> {
    const res = await this.client.get(`/files/${id}`);
    return unwrap<CdnFile>(res.data);
  }

  async updateFile(id: number, body: CdnUpdateFileBody): Promise<CdnFile> {
    const res = await this.client.patch(`/files/${id}`, body);
    return unwrap<CdnFile>(res.data);
  }

  async deleteFile(id: number): Promise<void> {
    await this.client.delete(`/files/${id}`);
  }

  async bulkAction(body: CdnBulkActionBody): Promise<CdnBulkActionResult> {
    const res = await this.client.post("/files/bulk", body);
    return unwrap<CdnBulkActionResult>(res.data);
  }

  async getStats(): Promise<CdnStats> {
    const res = await this.client.get("/files/stats");
    return unwrap<CdnStats>(res.data);
  }

  // ── Uploads ──────────────────────────────────────────────────────────
  async uploadSingle(
    file: File | Blob,
    fileName: string,
    options: CdnUploadOptions = {},
    onProgress?: (percent: number) => void,
  ): Promise<CdnUploadResult> {
    const form = new FormData();
    form.append("file", file, fileName);
    if (options.folderId !== undefined) form.append("folderId", String(options.folderId));
    if (options.visibility) form.append("visibility", options.visibility);
    if (options.tags) form.append("tags", options.tags);

    const config: AxiosRequestConfig = {};
    if (onProgress) {
      config.onUploadProgress = (e) => {
        if (e.total) onProgress(Math.round((e.loaded / e.total) * 100));
      };
    }

    const res = await this.client.post("/upload/single", form, config);
    return unwrap<CdnUploadResult>(res.data);
  }

  async uploadMultiple(
    files: Array<{ file: File | Blob; name: string }>,
    options: CdnUploadOptions = {},
    onProgress?: (percent: number) => void,
  ): Promise<CdnMultiUploadResult> {
    const form = new FormData();
    files.forEach(({ file, name }) => form.append("files", file, name));
    if (options.folderId !== undefined) form.append("folderId", String(options.folderId));
    if (options.visibility) form.append("visibility", options.visibility);
    if (options.tags) form.append("tags", options.tags);

    const config: AxiosRequestConfig = {};
    if (onProgress) {
      config.onUploadProgress = (e) => {
        if (e.total) onProgress(Math.round((e.loaded / e.total) * 100));
      };
    }

    const res = await this.client.post("/upload/multiple", form, config);
    return unwrap<CdnMultiUploadResult>(res.data);
  }

  /** Chunked upload for large files. */
  async uploadChunks(
    file: File,
    options: CdnUploadOptions = {},
    onProgress?: (percent: number) => void,
    chunkSize = 5 * 1024 * 1024,
  ): Promise<CdnUploadResult> {
    const uploadId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const totalChunks = Math.ceil(file.size / chunkSize);

    let uploadedBytes = 0;
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const chunk = file.slice(start, start + chunkSize);
      const form = new FormData();
      form.append("chunk", chunk);
      form.append("uploadId", uploadId);
      form.append("chunkIndex", String(i));
      form.append("totalChunks", String(totalChunks));
      form.append("fileName", file.name);

      const res = await this.client.post("/upload/chunk", form);
      const body = res.data as CdnEnvelope<CdnChunkPending | CdnChunkComplete>;
      const result = unwrap<CdnChunkPending | CdnChunkComplete>(body);

      if (result.status === "complete") return result.file as CdnUploadResult;

      uploadedBytes += chunk.size;
      if (onProgress) {
        onProgress(totalChunks > 0 ? Math.round((uploadedBytes / file.size) * 100) : 100);
      }
    }

    throw new CdnApiError(500, "Chunked upload did not complete.");
  }

  /** Smart upload: chunked for files &gt; 8 MB, single request otherwise. */
  async upload(
    file: File,
    options: CdnUploadOptions = {},
    onProgress?: (percent: number) => void,
  ): Promise<CdnUploadResult> {
    if (file.size > 8 * 1024 * 1024) {
      return this.uploadChunks(file, options, onProgress);
    }
    return this.uploadSingle(file, file.name, options, onProgress);
  }

  // ── Folders ──────────────────────────────────────────────────────────
  async listFolders(parentId?: number | null): Promise<CdnFolder[]> {
    const res = await this.client.get("/folders", {
      params: parentId != null ? { parentId } : undefined,
    });
    const folders = unwrap<CdnFolder[]>(res.data);
    return Array.isArray(folders) ? folders : [];
  }

  async createFolder(name: string, parentId?: number | null): Promise<CdnFolder> {
    const res = await this.client.post("/folders", {
      name,
      ...(parentId != null ? { parentId } : {}),
    });
    return unwrap<CdnFolder>(res.data);
  }

  async getFolderByName(name: string, parentId?: number | null): Promise<CdnFolder> {
    const res = await this.client.get("/folders/by-name", {
      params: {
        name,
        ...(parentId != null ? { parentId } : {}),
      },
    });
    return unwrap<CdnFolder>(res.data);
  }

  async getFolderById(id: number): Promise<CdnFolder> {
    const res = await this.client.get(`/folders/${id}`);
    return unwrap<CdnFolder>(res.data);
  }

  async deleteFolder(id: number): Promise<{ success: boolean }> {
    const res = await this.client.delete(`/folders/${id}`);
    return unwrap<{ success: boolean }>(res.data);
  }

  // ── Access Control ───────────────────────────────────────────────────
  async accessPublic(id: number): Promise<CdnPublicFileResult> {
    const res = await this.client.get(`/access/public/${id}`);
    return unwrap<CdnPublicFileResult>(res.data);
  }

  async getSignedUrl(id: number, expiresIn: number = 3600): Promise<CdnSignedUrlResult> {
    const res = await this.client.get(`/access/${id}/signed-url`, {
      params: { expiresIn },
    });
    return unwrap<CdnSignedUrlResult>(res.data);
  }

  async getVariantSignedUrls(id: number, expiresIn: number = 3600): Promise<CdnVariantSignedUrlsResult> {
    const res = await this.client.get(`/access/${id}/variants/signed-urls`, {
      params: { expiresIn },
    });
    return unwrap<CdnVariantSignedUrlsResult>(res.data);
  }

  async updateVisibility(id: number, visibility: CdnVisibility): Promise<CdnVisibilityUpdateResult> {
    const res = await this.client.patch(`/access/${id}/visibility`, { visibility });
    return unwrap<CdnVisibilityUpdateResult>(res.data);
  }
}