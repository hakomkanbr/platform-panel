"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Space, Input, Tabs, Empty, Pagination, message } from "antd";
import { SearchOutlined, CheckOutlined, UploadOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import type { CdnFile } from "../types";
import { useMediaFiles } from "../hooks/useMediaData";
import { isImageFile } from "../utils/media";
import { MediaGrid } from "./MediaGrid";
import { MediaUploader } from "./MediaUploader";
import { MediaPreview } from "./MediaPreview";

export interface ImagePickerProps {
  open: boolean;
  onClose: () => void;
  /** Currently selected image(s). */
  value?: CdnFile[];
  onChange?: (files: CdnFile[]) => void;
  multiple?: boolean;
  title?: string;
  selectText?: string;
}

/**
 * Image-focused picker: browse, search, upload, and select images with thumbnails.
 */
export const ImagePicker: React.FC<ImagePickerProps> = ({
  open,
  onClose,
  value = [],
  onChange,
  multiple = false,
  title,
}) => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(24);
  const [selection, setSelection] = useState<number[]>(() => value.map((f) => f.id));
  const [previewFile, setPreviewFile] = useState<CdnFile | null>(null);

  const { data, isLoading, refetch } = useMediaFiles({
    page,
    limit,
    search: debouncedSearch || undefined,
    mimeType: "image",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Only initialize state when the modal opens
  useEffect(() => {
    if (open) {
      setSelection(value?.map((f) => f.id) ?? []);
      setActiveTab("library");
    }
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const images = useMemo(() => (data?.data ?? []).filter(isImageFile), [data]);

  // Prefer thumb/webp variants for the grid when available.
  const display: CdnFile[] = useMemo(
    () =>
      images.map((img) => {
        const variant =
          img.variants?.find((v) => v.name === "thumb") ??
          img.variants?.find((v) => v.name === "webp") ??
          img.variants?.[0];
        return variant ? { ...img, url: variant.url ?? img.url } : img;
      }),
    [images]
  );

  const confirm = () => {
    const picked = images.filter((f) => selection.includes(f.id)) as CdnFile[];
    onChange?.(multiple ? picked : picked.slice(0, 1));
    message.success(t("media.picker.selected", { count: selection.length }) || `Selected ${selection.length} image(s)`);
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        width={960}
        title={title ?? t("media.imagePicker.title") ?? "Select Images"}
        footer={
          <Space>
            <Button onClick={onClose}>{t("common.actions.cancel") || "Cancel"}</Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              disabled={selection.length === 0}
              onClick={confirm}
            >
              {multiple
                ? t("media.picker.select", { count: selection.length }) || `Select (${selection.length})`
                : t("media.imagePicker.select") || "Select"}
            </Button>
          </Space>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k as "library" | "upload")}
          items={[
            {
              key: "library",
              label: (
                <span>
                  <AppstoreOutlined /> {t("media.allFiles") || "Browse Library"}
                </span>
              ),
              children: (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Search Bar */}
                  <Input
                    prefix={<SearchOutlined />}
                    placeholder={t("media.searchPlaceholder") || "Search images..."}
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    allowClear
                  />

                  {/* Grid or Empty */}
                  {isLoading ? (
                    <div style={{ padding: 48, textAlign: "center", color: "var(--text-secondary)" }}>
                      ...
                    </div>
                  ) : display.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "32px 0" }}>
                      <Empty
                        description={t("media.empty.noFiles") || "No images in the library yet"}
                      />
                      <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        style={{ marginTop: 16 }}
                        onClick={() => setActiveTab("upload")}
                      >
                        {t("media.actions.upload") || "Upload Images"}
                      </Button>
                    </div>
                  ) : (
                    <div style={{ maxHeight: 420, overflowY: "auto", paddingRight: 4 }}>
                      <MediaGrid
                        files={display}
                        selectedIds={selection}
                        onSelectionChange={(ids) =>
                          setSelection(multiple ? ids : ids.slice(0, 1))
                        }
                        onPreview={setPreviewFile}
                      />
                    </div>
                  )}

                  {/* Pagination */}
                  {(data?.meta?.total ?? 0) > limit && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <Pagination
                        size="small"
                        current={page}
                        pageSize={limit}
                        total={data?.meta?.total ?? 0}
                        onChange={(p, ps) => {
                          setPage(p);
                          setLimit(ps);
                        }}
                      />
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: "upload",
              label: (
                <span>
                  <UploadOutlined /> {t("media.actions.upload") || "Upload"}
                </span>
              ),
              children: (
                <div style={{ padding: "12px 0" }}>
                  <MediaUploader
                    multiple={multiple}
                    onCompleted={(urls, items) => {
                      void urls;
                      message.success(t("media.toasts.uploaded") || "Images uploaded successfully");
                      void refetch().then((res) => {
                        if (res.data?.data) {
                          // Auto-select the newly uploaded files
                          const newIds = res.data.data
                            .filter((f) => items.some((it) => it.url === f.url || it.name === f.originalName))
                            .map((f) => f.id);
                          if (newIds.length > 0) {
                            setSelection((prev) => Array.from(new Set([...prev, ...newIds])));
                          }
                        }
                        setActiveTab("library");
                      });
                    }}
                  />
                </div>
              ),
            },
          ]}
        />
      </Modal>

      <MediaPreview
        file={previewFile}
        files={display}
        onClose={() => setPreviewFile(null)}
        onNavigate={setPreviewFile}
      />
    </>
  );
};