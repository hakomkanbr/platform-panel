"use client";

import React from "react";
import { Checkbox, Popconfirm, Tooltip, Button, Skeleton } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import type { CdnFile } from "../types";
import { MediaThumb } from "./MediaThumb";
import { formatBytes } from "../utils/media";

export interface MediaGridProps {
  files: CdnFile[];
  selectedIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
  onPreview?: (file: CdnFile) => void;
  onDelete?: (file: CdnFile) => void;
  selectable?: boolean;
  loading?: boolean;
  empty?: React.ReactNode;
}

/** Card-based media grid with selection and quick actions. */
export const MediaGrid: React.FC<MediaGridProps> = ({
  files,
  selectedIds = [],
  onSelectionChange,
  onPreview,
  onDelete,
  selectable = true,
  loading = false,
  empty,
}) => {
  const t = useTranslations();

  const toggle = (id: number, checked: boolean) => {
    const next = checked
      ? [...selectedIds, id]
      : selectedIds.filter((i) => i !== id);
    onSelectionChange?.(next);
  };

  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ padding: 8, border: "1px solid var(--ant-color-border, #e5e7eb)", borderRadius: 12 }}>
            <Skeleton active paragraph={{ rows: 1 }} style={{ height: 88 }} />
          </div>
        ))}
      </div>
    );
  }

  if (!files.length) return empty ?? null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: 12,
      }}
    >
      {files.map((file) => {
        const selected = selectedIds.includes(file.id);
        return (
          <div
            key={file.id}
            role="button"
            tabIndex={0}
            onClick={() => {
              if (selectable && onSelectionChange) {
                toggle(file.id, !selected);
              } else if (onPreview) {
                onPreview(file);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                if (selectable && onSelectionChange) toggle(file.id, !selected);
              }
            }}
            style={{
              position: "relative",
              border: selected
                ? "2px solid var(--ant-color-primary, #1677ff)"
                : "1px solid var(--ant-color-border, #e5e7eb)",
              borderRadius: 12,
              padding: 8,
              background: selected ? "var(--ant-color-primary-bg, #f0f7ff)" : "var(--fill-secondary, #fff)",
              cursor: "pointer",
              transition: "all .15s ease",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", padding: 4 }}>
              <MediaThumb file={file} size={88} radius={8} />
            </div>
            <Tooltip title={file.originalName}>
              <div
                style={{
                  fontSize: 12,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}
              >
                {file.originalName || file.name}
              </div>
            </Tooltip>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-secondary, #64748b)",
                textAlign: "center",
              }}
            >
              {formatBytes(file.size)}
            </div>

            {selectable && (
              <Checkbox
                checked={selected}
                style={{ position: "absolute", top: 8, left: 8 }}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => toggle(file.id, e.target.checked)}
              />
            )}

            <div
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                display: "flex",
                gap: 4,
                opacity: 0.8,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {onDelete && (
                <Popconfirm
                  title={t("media.actions.confirmDelete")}
                  onConfirm={() => onDelete(file)}
                  okText={t("common.actions.delete")}
                  cancelText={t("common.actions.cancel")}
                >
                  <Button size="small" type="text" danger icon={<DeleteOutlined />} aria-label={t("media.actions.delete")} />
                </Popconfirm>
              )}
              {onPreview && (
                <Button
                  size="small"
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(file);
                  }}
                  aria-label={t("media.actions.preview")}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};