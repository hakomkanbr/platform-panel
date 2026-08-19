"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Modal, Input, Segmented, Button, Space, Empty, Pagination, message } from "antd";
import { SearchOutlined, CheckOutlined } from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import type { CdnFile } from "../types";
import { useMediaFiles } from "../hooks/useMediaData";
import { MediaGrid } from "./MediaGrid";
import { MediaList } from "./MediaList";
import { MediaUploader } from "./MediaUploader";
import { MediaPreview } from "./MediaPreview";

export interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  /** Currently picked files (selection state). */
  value?: CdnFile[];
  /** Called when the picker confirms the selection. */
  onChange?: (files: CdnFile[]) => void;
  multiple?: boolean;
  onlyImages?: boolean;
  title?: string;
}

/** Modal picker to browse / search / upload and select CDN files. */
export const MediaPicker: React.FC<MediaPickerProps> = ({
  open,
  onClose,
  value = [],
  onChange,
  multiple = true,
  onlyImages = false,
  title,
}) => {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selection, setSelection] = useState<number[]>(() => value.map((f) => f.id));
  const [previewFile, setPreviewFile] = useState<CdnFile | null>(null);

  const { data, isLoading } = useMediaFiles({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
    mimeType: onlyImages ? "image" : undefined,
  });

  useEffect(() => {
    if (open) {
      setSelection(value?.map((f) => f.id) ?? []);
    }
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const files = useMemo(() => data?.data ?? [], [data]);

  const toggle = (ids: number[]) => {
    let next: number[];
    if (!multiple) {
      next = ids.slice(0, 1);
    } else {
      const set = new Set(selection);
      ids.forEach((id) => (set.has(id) ? set.delete(id) : set.add(id)));
      next = Array.from(set);
    }
    setSelection(next);
  };

  const confirm = () => {
    const picked = files.filter((f) => selection.includes(f.id)) as CdnFile[];
    if (value.length > 0) {
      // Preserve previously picked items not on the current page.
      const known = new Map([...files, ...value].map((f) => [f.id, f]));
      onChange?.(Array.from(new Set(selection)).map((id) => known.get(id)).filter(Boolean) as CdnFile[]);
    } else {
      onChange?.(picked);
    }
    message.success(t("media.picker.selected", { count: selection.length }));
    onClose();
  };

  const removePicked = (id: number) => {
    onChange?.(value.filter((f) => f.id !== id));
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        width={960}
        title={title ?? t("media.picker.title")}
        footer={
          <Space>
            <Button onClick={onClose}>{t("common.actions.cancel")}</Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              disabled={selection.length === 0}
              onClick={confirm}
            >
              {t("media.picker.select", { count: selection.length })}
            </Button>
          </Space>
        }
      >
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {/* Selected summary */}
          {value.length > 0 && (
            <Space wrap size={[8, 8]}>
              {value.map((f) => (
                <Button key={f.id} size="small" onClick={() => removePicked(f.id)}>
                  {f.originalName || f.name} ✕
                </Button>
              ))}
            </Space>
          )}

          <Space.Compact style={{ width: "100%" }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder={t("media.picker.searchPlaceholder")}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              allowClear
            />
            <Segmented
              options={[
                { value: "grid", label: t("media.picker.gridView") },
                { value: "list", label: t("media.picker.listView") },
              ]}
              value={view}
              onChange={(v) => setView(v as "grid" | "list")}
            />
          </Space.Compact>

          <MediaUploader
            onCompleted={(urls, items) => {
              void urls;
              message.success(t("media.picker.uploadDone", { count: items.length }));
            }}
            multiple={multiple}
          />

          {isLoading ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-secondary)" }}>…</div>
          ) : files.length === 0 ? (
            <Empty description={t("media.empty.noFiles")} style={{ padding: 24 }} />
          ) : view === "grid" ? (
            <div style={{ maxHeight: 420, overflowY: "auto" }}>
              <MediaGrid
                files={files}
                selectedIds={selection}
                onSelectionChange={toggle}
                onPreview={setPreviewFile}
              />
            </div>
          ) : (
            <div style={{ maxHeight: 420, overflowY: "auto" }}>
              <MediaList
                files={files}
                total={data?.meta.total ?? 0}
                page={page}
                pageSize={pageSize}
                loading={isLoading}
                selectedRowKeys={selection}
                onSelectionChange={(ids) => setSelection(multiple ? ids : ids.slice(0, 1))}
                onPreview={setPreviewFile}
                rowSelectionEnabled={multiple}
              />
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
              {t("media.picker.total", { count: data?.meta.total ?? 0 })}
            </span>
            <Pagination
              simple
              current={page}
              pageSize={pageSize}
              total={data?.meta.total ?? 0}
              onChange={(p, ps) => {
                setPage(p);
                setPageSize(ps);
              }}
            />
          </div>
        </Space>
      </Modal>

      <MediaPreview
        file={previewFile}
        files={files}
        onClose={() => setPreviewFile(null)}
        onNavigate={setPreviewFile}
      />
    </>
  );
};