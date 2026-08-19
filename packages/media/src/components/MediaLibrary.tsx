"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button, Input, Segmented, Space, Select, Popconfirm, message,
  Typography, Modal, Form, Breadcrumb, Card, Row, Col,
} from "antd";
import {
  SearchOutlined, UploadOutlined, DeleteOutlined, EyeOutlined,
  ReloadOutlined, FolderOutlined, FolderFilled, FolderAddOutlined,
  HomeOutlined, FolderOpenOutlined,
} from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { PageHeader, AsyncBoundary } from "@repo/ui";
import type { CdnFile, CdnFolder, CdnVisibility } from "../types";
import { useMediaFiles, useMediaFolders, useMediaStats } from "../hooks/useMediaData";
import {
  useMediaBulk,
  useMediaDelete,
  useMediaUpdate,
  useCreateFolder,
  useDeleteFolder,
} from "../hooks/useMediaMutations";
import { MediaGrid } from "./MediaGrid";
import { MediaList } from "./MediaList";
import { MediaUploader } from "./MediaUploader";
import { MediaPreview } from "./MediaPreview";

const { Text } = Typography;

export interface MediaLibraryProps {
  title?: string;
  description?: string;
  banner?: React.ReactNode;
}

interface BreadcrumbItem {
  id: number | null;
  name: string;
}

/** Full Media & Files library: browse, search, upload, select, manage. */
export const MediaLibrary: React.FC<MediaLibraryProps> = ({ title, description, banner }) => {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mimeFilter, setMimeFilter] = useState<string | undefined>();
  const [visibilityFilter, setVisibilityFilter] = useState<CdnVisibility | undefined>();
  const [sortBy, setSortBy] = useState<"createdAt" | "size" | "name">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<number[]>([]);
  const [previewFile, setPreviewFile] = useState<CdnFile | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  // Folder navigation state
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: null, name: "" },
  ]);

  // Folder modal state
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [targetFolderId, setTargetFolderId] = useState<number | null>(null);

  const { data, isLoading, refetch } = useMediaFiles({
    page,
    limit: pageSize,
    folderId: currentFolderId ?? undefined,
    search: debouncedSearch || undefined,
    mimeType: mimeFilter,
    visibility: visibilityFilter,
    sortBy,
    sortOrder,
  });

  const { data: subFolders = [], isLoading: foldersLoading, refetch: refetchFolders } =
    useMediaFolders(currentFolderId);

  const { data: allProjectFolders = [] } = useMediaFolders(null);

  const stats = useMediaStats(!debouncedSearch && !mimeFilter && !visibilityFilter);
  const bulk = useMediaBulk();
  const remove = useMediaDelete();
  const update = useMediaUpdate();
  const createFolder = useCreateFolder();
  const deleteFolder = useDeleteFolder();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setSelected((prev) => prev.filter((id) => (data?.data ?? []).some((f) => f.id === id)));
  }, [data]);

  const files = useMemo(() => data?.data ?? [], [data]);

  const handleOpenFolder = (folder: CdnFolder) => {
    setCurrentFolderId(folder.id);
    setBreadcrumbs((prev) => [...prev, { id: folder.id, name: folder.name }]);
    setPage(1);
  };

  const handleBreadcrumbClick = (target: BreadcrumbItem, index: number) => {
    setCurrentFolderId(target.id);
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
    setPage(1);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await createFolder.mutateAsync({
        name: newFolderName.trim(),
        parentId: currentFolderId,
      });
      message.success(t("media.folderCreated") || "Folder created successfully");
      setNewFolderName("");
      setNewFolderOpen(false);
      void refetchFolders();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to create folder");
    }
  };

  const handleDeleteFolder = async (folder: CdnFolder) => {
    try {
      await deleteFolder.mutateAsync(folder.id);
      message.success(t("media.folderDeleted") || "Folder deleted successfully");
      void refetchFolders();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to delete folder");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulk.mutateAsync({ ids: selected, action: "delete" });
      message.success(t("media.toasts.bulkDeleted", { count: selected.length }));
      setSelected([]);
    } catch (error) {
      message.error(error instanceof Error ? error.message : t("media.errors.actionFailed"));
    }
  };

  const handleBulkVisibility = async (visibility: CdnVisibility) => {
    try {
      await bulk.mutateAsync({ ids: selected, action: "visibility", visibility });
      message.success(t("media.toasts.visibilityUpdated"));
    } catch (error) {
      message.error(error instanceof Error ? error.message : t("media.errors.actionFailed"));
    }
  };

  const handleBulkMove = async () => {
    try {
      await bulk.mutateAsync({
        ids: selected,
        action: "move",
        folderId: targetFolderId ?? undefined,
      });
      message.success(t("media.movedToFolder") || "Files moved successfully");
      setMoveModalOpen(false);
      setSelected([]);
      void refetch();
      void refetchFolders();
    } catch (error) {
      message.error(error instanceof Error ? error.message : t("media.errors.actionFailed"));
    }
  };

  const handleDelete = async (file: CdnFile) => {
    try {
      await remove.mutateAsync(file.id);
      message.success(t("media.toasts.deleted"));
      setSelected((prev) => prev.filter((id) => id !== file.id));
    } catch (error) {
      message.error(error instanceof Error ? error.message : t("media.errors.actionFailed"));
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {banner}
      <PageHeader
        title={title ?? t("media.title")}
        description={description ?? t("media.description")}
        extra={
          <Space>
            <Button
              icon={<FolderAddOutlined />}
              onClick={() => setNewFolderOpen(true)}
            >
              {t("media.newFolder") || "New Folder"}
            </Button>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => setUploadOpen((o) => !o)}
            >
              {t("media.actions.upload")}
            </Button>
          </Space>
        }
      />

      {uploadOpen && (
        <div style={{ marginBottom: 16 }}>
          <MediaUploader
            folderId={currentFolderId ?? undefined}
            onCompleted={(urls) => {
              void urls;
              message.success(t("media.toasts.uploaded"));
              void refetch();
              void refetchFolders();
            }}
          />
        </div>
      )}

      {/* Breadcrumb Folder Navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "var(--fill-quaternary, #f9fafb)",
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Breadcrumb
          items={breadcrumbs.map((item, idx) => ({
            title: (
              <span
                style={{
                  cursor: "pointer",
                  fontWeight: idx === breadcrumbs.length - 1 ? 600 : 400,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
                onClick={() => handleBreadcrumbClick(item, idx)}
              >
                {idx === 0 ? <HomeOutlined /> : <FolderOutlined />}
                {idx === 0 ? t("media.allFiles") || "All Files" : item.name}
              </span>
            ),
          }))}
        />
        <Text type="secondary" style={{ fontSize: 12 }}>
          {subFolders.length} {t("media.folders") || "folders"} · {data?.meta?.total ?? 0} {t("media.files") || "files"}
        </Text>
      </div>

      {/* Sub-Folders Grid */}
      {subFolders.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <Row gutter={[12, 12]}>
            {subFolders.map((folder) => (
              <Col xs={12} sm={8} md={6} lg={4} key={folder.id}>
                <Card
                  hoverable
                  size="small"
                  style={{
                    borderRadius: 8,
                    cursor: "pointer",
                    border: "1px solid var(--border-color-split, #f0f0f0)",
                  }}
                  bodyStyle={{ padding: "10px 12px" }}
                  onClick={() => handleOpenFolder(folder)}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Space style={{ minWidth: 0, flex: 1 }}>
                      <FolderFilled style={{ color: "#faad14", fontSize: 20 }} />
                      <Text
                        ellipsis
                        style={{ maxWidth: 120, fontWeight: 500, fontSize: 13 }}
                        title={folder.name}
                      >
                        {folder.name}
                      </Text>
                    </Space>
                    <Popconfirm
                      title={t("media.deleteFolderConfirm") || "Delete this empty folder?"}
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        void handleDeleteFolder(folder);
                      }}
                      onCancel={(e) => e?.stopPropagation()}
                      okText={t("common.actions.yes") || "Yes"}
                      cancelText={t("common.actions.no") || "No"}
                    >
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined style={{ fontSize: 12 }} />}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Popconfirm>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Filters */}
      <Space wrap style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }}>
        <Space wrap size={8}>
          <Input
            prefix={<SearchOutlined />}
            placeholder={t("media.searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            allowClear
            style={{ width: 240 }}
          />
          <Select
            allowClear
            placeholder={t("media.filters.type") || "Type"}
            style={{ width: 140 }}
            value={mimeFilter}
            onChange={(v) => {
              setMimeFilter(v);
              setPage(1);
            }}
            options={[
              { value: "image", label: t("media.kinds.images") || "Images" },
              { value: "video", label: t("media.kinds.videos") || "Videos" },
              { value: "audio", label: t("media.kinds.audio") || "Audio" },
              { value: "application/pdf", label: "PDF" },
              { value: "application", label: t("media.kinds.documents") || "Docs" },
            ]}
          />
          <Select
            allowClear
            placeholder={t("media.filters.visibility") || "Visibility"}
            style={{ width: 130 }}
            value={visibilityFilter}
            onChange={(v) => {
              setVisibilityFilter(v);
              setPage(1);
            }}
            options={[
              { value: "PUBLIC", label: t("media.visibility.public") || "Public" },
              { value: "PRIVATE", label: t("media.visibility.private") || "Private" },
              { value: "RESTRICTED", label: t("media.visibility.restricted") || "Restricted" },
            ]}
          />
          <Button icon={<ReloadOutlined />} onClick={() => { void refetch(); void refetchFolders(); }} />
        </Space>

        <Segmented
          value={view}
          onChange={(v) => setView(v as "grid" | "list")}
          options={[
            { value: "grid", label: t("media.filters.grid") || "Grid" },
            { value: "list", label: t("media.filters.list") || "List" },
          ]}
        />
      </Space>

      <AsyncBoundary
        loading={isLoading || foldersLoading}
        error={undefined}
        empty={!isLoading && files.length === 0 && subFolders.length === 0}
        emptyTitle={t("media.empty.noFiles") || "No files or folders"}
        emptyDescription={t("media.empty.description") || "Upload your first file or create a folder"}
      >
        {/* Stats bar */}
        {stats.data && (
          <Space style={{ marginBottom: 12, color: "var(--text-secondary)", fontSize: 13 }} wrap>
            <span>{`${t("media.stats.total") || "Files"}: ${stats.data.total}`}</span>
            <span>•</span>
            <span>{`${t("media.stats.totalSize") || "Total size"}: ${stats.data.totalSizeMB} MB`}</span>
          </Space>
        )}

        {view === "grid" ? (
          <MediaGrid
            files={files}
            selectedIds={selected}
            onSelectionChange={setSelected}
            onPreview={setPreviewFile}
            onDelete={(f) => {
              void handleDelete(f);
            }}
          />
        ) : (
          <MediaList
            files={files}
            total={data?.meta.total ?? 0}
            page={page}
            pageSize={pageSize}
            loading={isLoading}
            selectedRowKeys={selected}
            onSelectionChange={setSelected}
            onPageChange={(p, ps) => {
              setPage(p);
              setPageSize(ps);
            }}
            onPreview={setPreviewFile}
            onDelete={(f) => {
              void handleDelete(f);
            }}
          />
        )}

        {/* Bulk actions bar */}
        {selected.length > 0 && (
          <div
            style={{
              position: "sticky",
              bottom: 16,
              marginTop: 16,
              background: "var(--fill-tertiary, #fffbeb)",
              borderRadius: 12,
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              boxShadow: "0 4px 16px rgba(0,0,0,.08)",
            }}
          >
            <Typography.Text>
              {selected.length} {t("media.selected") || "selected"}
            </Typography.Text>
            <Space>
              <Button
                size="small"
                icon={<FolderOpenOutlined />}
                onClick={() => setMoveModalOpen(true)}
              >
                {t("media.moveToFolder") || "Move to Folder"}
              </Button>
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  const first = files.find((f) => f.id === selected[0]);
                  if (first) setPreviewFile(first);
                }}
              >
                {t("media.actions.preview") || "Preview"}
              </Button>
              <Button
                size="small"
                onClick={() => void handleBulkVisibility("PUBLIC")}
              >
                {t("media.visibility.public") || "Public"}
              </Button>
              <Button
                size="small"
                onClick={() => void handleBulkVisibility("PRIVATE")}
              >
                {t("media.visibility.private") || "Private"}
              </Button>
              <Popconfirm
                title={t("media.deleteConfirm") || "Delete selected files?"}
                okText={t("common.actions.yes") || "Yes"}
                cancelText={t("common.actions.no") || "No"}
                onConfirm={() => void handleBulkDelete()}
              >
                <Button size="small" danger icon={<DeleteOutlined />}>
                  {t("media.actions.delete") || "Delete"}
                </Button>
              </Popconfirm>
            </Space>
          </div>
        )}
      </AsyncBoundary>

      {/* Media Preview Modal with Access Control & Signed URLs */}
      <MediaPreview
        file={previewFile}
        files={files}
        onClose={() => setPreviewFile(null)}
        onNavigate={setPreviewFile}
      />

      {/* New Folder Modal */}
      <Modal
        title={t("media.newFolder") || "New Folder"}
        open={newFolderOpen}
        onOk={handleCreateFolder}
        onCancel={() => {
          setNewFolderName("");
          setNewFolderOpen(false);
        }}
        confirmLoading={createFolder.isPending}
        okText={t("common.actions.create") || "Create"}
        cancelText={t("common.actions.cancel") || "Cancel"}
      >
        <Form layout="vertical" onFinish={handleCreateFolder}>
          <Form.Item label={t("media.folderName") || "Folder Name"} required>
            <Input
              placeholder={t("media.enterFolderName") || "e.g. products, banners, avatars"}
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Move to Folder Modal */}
      <Modal
        title={t("media.moveToFolder") || "Move to Folder"}
        open={moveModalOpen}
        onOk={handleBulkMove}
        onCancel={() => setMoveModalOpen(false)}
        confirmLoading={bulk.isPending}
        okText={t("common.actions.move") || "Move"}
        cancelText={t("common.actions.cancel") || "Cancel"}
      >
        <Form layout="vertical">
          <Form.Item label={t("media.selectDestinationFolder") || "Destination Folder"}>
            <Select
              placeholder="Select destination folder"
              value={targetFolderId}
              onChange={(val) => setTargetFolderId(val)}
              allowClear
              options={[
                { value: null, label: `📁 ${t("media.rootFolder") || "Root / All"}` },
                ...allProjectFolders.map((f) => ({
                  value: f.id,
                  label: `📁 ${f.path || f.name}`,
                })),
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};