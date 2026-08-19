"use client";

import React, { useState } from "react";
import { Upload, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { useMediaUpload, useMediaUploadMultiple } from "../hooks/useMediaMutations";
import type { CdnUploadOptions } from "../types";
import { getMediaKind } from "../utils/media";

export interface QueuedUpload {
  file: File;
  key: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "failed";
  error?: string;
}

export interface MediaUploaderProps {
  onCompleted?: (urls: string[], files: { url: string; name: string; mimeType: string }[]) => void;
  folderId?: number;
  uploadOptions?: CdnUploadOptions;
  maxCount?: number;
  multiple?: boolean;
  listType?: "picture" | "text";
  /** When false, hide the standalone dropzone (used inside pickers). */
  showDropzone?: boolean;
}

/**
 * Reusable drag & drop + tap-to-browse upload surface with per-file progress,
 * completion status and retry — for the Media Library and the Media Picker.
 */
export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onCompleted,
  folderId,
  uploadOptions,
  maxCount,
  multiple = true,
  showDropzone = true,
}) => {
  const t = useTranslations();
  const uploadSingle = useMediaUpload();
  const uploadMany = useMediaUploadMultiple();
  const [queue, setQueue] = useState<QueuedUpload[]>([]);

  const effectiveOptions: CdnUploadOptions = {
    ...uploadOptions,
    ...(folderId != null ? { folderId } : {}),
  };

  const patch = (key: string, patchData: Partial<QueuedUpload>) => {
    setQueue((prev) => prev.map((u) => (u.key === key ? { ...u, ...patchData } : u)));
  };

  const runSingle = async (upload: QueuedUpload) => {
    patch(upload.key, { status: "uploading", progress: 0, error: undefined });
    try {
      const result = await uploadSingle.mutateAsync({
        file: upload.file,
        options: effectiveOptions,
        onProgress: (p) => patch(upload.key, { progress: p }),
      });
      patch(upload.key, { status: "done", progress: 100 });
      onCompleted?.([result.url ?? ""], [
        { url: result.url ?? "", name: result.originalName, mimeType: result.mimeType },
      ]);
    } catch (error) {
      patch(upload.key, {
        status: "failed",
        error: error instanceof Error ? error.message : "Upload failed",
      });
    }
  };

  const runMany = async (items: QueuedUpload[]) => {
    setQueue((prev) =>
      prev.map((u) =>
        items.some((i) => i.key === u.key) ? { ...u, status: "uploading" as const } : u,
      ),
    );
    try {
      const results = await uploadMany.mutateAsync({ files: items.map((i) => i.file), options: uploadOptions });
      const delta: { url: string; name: string; mimeType: string }[] = [];
      setQueue((prev) =>
        prev.map((u) =>
          items.some((i) => i.key === u.key)
            ? { ...u, status: "done" as const, progress: 100 }
            : u,
        ),
      );
      results.forEach((r) =>
        delta.push({ url: r.url ?? "", name: r.originalName, mimeType: r.mimeType }),
      );
      onCompleted?.(delta.map((d) => d.url), delta);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      setQueue((prev) =>
        prev.map((u) => (items.some((i) => i.key === u.key) ? { ...u, status: "failed" as const, error: message } : u)),
      );
    }
  };

  const handleFiles = (files: File[]) => {
    const existingKeys = new Set(queue.map((u) => u.key));
    const accepted = files
      .filter((f) => !existingKeys.has(`${f.name}-${f.size}-${f.lastModified}`))
      .map((file) => ({
        file,
        key: `${file.name}-${file.size}-${file.lastModified}`,
        progress: 0,
        status: "pending" as const,
      }));

    if (accepted.length === 0) return;

    const next = [...queue, ...accepted];
    setQueue(next);

    // Resolve the CDN magic of small-single vs big-chunked internally.
    if (accepted.length === 1 && accepted[0]) {
      void runSingle(accepted[0]);
    } else if (accepted.length > 1) {
      void runMany(accepted);
    }
  };

  const retry = (key: string) => {
    const upload = queue.find((u) => u.key === key);
    if (!upload) return;
    const fresh = { ...upload, progress: 0, status: "pending" as const, error: undefined };
    setQueue((prev) => prev.map((u) => (u.key === key ? fresh : u)));
    void runSingle(fresh);
  };

  const clear = (key: string) => {
    setQueue((prev) => prev.filter((u) => u.key !== key));
  };

  return (
    <div style={{ width: "100%" }}>
      {showDropzone && (
        <Upload.Dragger
          multiple={multiple}
          showUploadList={false}
          beforeUpload={(file, fileList) => {
            const list = fileList && fileList.length > 0 ? (fileList as File[]) : [file as File];
            handleFiles(list);
            return false;
          }}
          accept="image/*,video/*,audio/*,application/pdf,text/*,application/zip,.doc,.docx,.xls,.xlsx,.csv"
          style={{
            border: "1px dashed var(--ant-color-border, #d9d9d9)",
            borderRadius: 12,
            padding: 24,
            textAlign: "center",
            background: "var(--fill-secondary, #fafafa)",
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ fontSize: 36, color: "#1677ff" }} />
          </p>
          <p className="ant-upload-text" style={{ fontSize: 16, fontWeight: 500, margin: "8px 0" }}>
            {t("media.uploader.dropTitle")}
          </p>
          <p className="ant-upload-hint" style={{ color: "var(--text-secondary)" }}>
            {t("media.uploader.dropHint")}
          </p>
        </Upload.Dragger>
      )}

      {queue.length > 0 && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {queue.map((item) => {
            const kind = getMediaKind(item.file.type);
            const isImage = kind === "image";
            return (
              <div
                key={item.key}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", background: "var(--fill-secondary, #fafafa)", borderRadius: 10 }}
              >
                {isImage && item.file.type ? (
                  <img
                    src={URL.createObjectURL(item.file)}
                    alt={item.file.name}
                    width={40}
                    height={40}
                    style={{ borderRadius: 6, objectFit: "cover" }}
                  />
                ) : null}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.file.name}
                  </div>
                  {item.status === "failed" && (
                    <div style={{ fontSize: 12, color: "#ef4444" }}>{item.error}</div>
                  )}
                </div>
                {item.status === "uploading" || item.status === "pending" ? (
                  <Button size="small">{`${item.progress}%`}</Button>
                ) : item.status === "failed" ? (
                  <Button size="small" type="primary" onClick={() => retry(item.key)}>
                    {t("media.uploader.retry")}
                  </Button>
                ) : (
                  <Button size="small" onClick={() => clear(item.key)}>
                    {t("media.uploader.done")}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};