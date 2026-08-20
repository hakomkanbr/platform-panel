"use client";

import React from "react";
import { Table, Tag, Tooltip, Button } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import type { CdnFile } from "../types";
import { MediaThumb } from "./MediaThumb";
import { formatBytes, formatDate } from "../utils/media";

export interface MediaListProps {
  files: CdnFile[];
  total: number;
  page: number;
  pageSize: number;
  loading?: boolean;
  selectedRowKeys?: React.Key[];
  onSelectionChange?: (ids: number[]) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  onPreview?: (file: CdnFile) => void;
  onDelete?: (file: CdnFile) => void;
  rowSelectionEnabled?: boolean;
}

/** Table/`list` view of media with server-side pagination. */
export const MediaList: React.FC<MediaListProps> = ({
  files,
  total,
  page,
  pageSize,
  loading,
  selectedRowKeys = [],
  onSelectionChange,
  onPageChange,
  onPreview,
  onDelete,
  rowSelectionEnabled = true,
}) => {
  const t = useTranslations();

  return (
    <Table<CdnFile>
      rowKey={(r) => r.id}
      size="middle"
      loading={loading}
      dataSource={files}
      scroll={{ x: true }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        onChange: onPageChange,
      }}
      rowSelection={
        rowSelectionEnabled
          ? {
              selectedRowKeys,
              onChange: (keys) => onSelectionChange?.(keys.map(Number)),
            }
          : undefined
      }
      columns={[
        {
          title: t("media.list.name"),
          dataIndex: "originalName",
          render: (_, file) => (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <MediaThumb file={file} size={40} radius={6} />
              <Tooltip title={file.originalName}>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 300 }}>
                  {file.originalName || file.name}
                </span>
              </Tooltip>
            </div>
          ),
        },
        {
          title: t("media.list.type"),
          dataIndex: "mimeType",
          width: 140,
          render: (mime: string) => <Tag>{mime}</Tag>,
        },
        {
          title: t("media.list.size"),
          dataIndex: "size",
          width: 100,
          render: (size: number) => formatBytes(size),
        },
        {
          title: t("media.list.visibility"),
          dataIndex: "visibility",
          width: 110,
          render: (v: string) => t(`media.visibility.${v.toLowerCase()}`),
        },
        {
          title: t("media.list.created"),
          dataIndex: "createdAt",
          width: 160,
          render: (v: string) => formatDate(v),
        },
        {
          title: "",
          key: "actions",
          width: 90,
          render: (_, file) => (
            <div style={{ display: "flex", gap: 4 }}>
              {onPreview && (
                <Button size="small" type="text" icon={<EyeOutlined />} aria-label={t("media.actions.preview")} onClick={() => onPreview(file)} />
              )}
              {onDelete && (
                <Button
                  size="small"
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  aria-label={t("media.actions.delete")}
                  onClick={() => {
                    if (onDelete) onDelete(file);
                  }}
                />
              )}
            </div>
          ),
        },
      ]}
    />
  );
};