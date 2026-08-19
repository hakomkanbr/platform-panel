"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { EmptyState, DrawerForm } from "@repo/ui";
import { formatCurrency } from "@repo/utils";
import { useTranslations } from "@repo/localization";
import { ImagePicker, MediaProvider, type CdnFile } from "@repo/media";
import { enumLabel, enumOptions } from "../../../types/enums";
import type {
  MediaItem,
  OptionValue,
  ProductOption,
  ProductOptionReadModel,
  RelationType,
  Relation,
  Variant,
} from "../../../types/catalog";
import {
  useAddProductOptionValue,
  useAddProductRelation,
  useDeleteProductDetail,
  useProductMedia,
  useProductOptions,
  useProductRelations,
  useProductVariants,
  useSaveProductDetail,
  useGenerateProductVariants,
  useProducts,
} from "../../../hooks/useProducts";
import { getApiErrorMessage } from "../../../api/http";
import { ProductVariantsWorkspace } from "./variants-workspace";
import { useProductWorkspace } from "./ProductWorkspaceContext";

const { Text } = Typography;

function ErrorHint({ error }: { error: unknown }) {
  if (!error) return null;
  return <Text type="danger">{getApiErrorMessage(error)}</Text>;
}

/* ----------------------------------- Media ----------------------------------- */

export function ProductMediaTab({ productId }: { productId: string }) {
  const t = useTranslations();
  const { markSectionDirty, registerSaveHandler } = useProductWorkspace();
  const { data, isLoading, isError, error, refetch } = useProductMedia(productId);
  const save = useSaveProductDetail("media", productId);
  const remove = useDeleteProductDetail("media", productId);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [localItems, setLocalItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    if (data) setLocalItems(data);
  }, [data]);

  /**
   * Called when the user confirms selection in the ImagePicker modal.
   * Maps CDN files → product media API calls (stores full URL).
   */
  const handleMediaSelected = async (files: CdnFile[]) => {
    if (!files.length) return;
    try {
      markSectionDirty("media", "uploading");
      for (const file of files) {
        await save.mutateAsync({
          body: {
            mediaUrl: file.url ?? "",
            mediaType: 1, // IMAGE
            altText: file.originalName,
            isPrimary: localItems.length === 0, // first image becomes primary
          },
        });
      }
      message.success(
        t("catalog.products.tabs.media.added") || `${files.length} image(s) added`,
      );
      markSectionDirty("media", "clean");
      refetch();
    } catch (e) {
      message.error(getApiErrorMessage(e));
      markSectionDirty("media", "clean");
    }
  };

  const removeMedia = async (id: string) => {
    try {
      markSectionDirty("media", "uploading");
      await remove.mutateAsync(id);
      message.success(t("catalog.products.tabs.media.removed") || "Media removed");
      markSectionDirty("media", "clean");
    } catch (e) {
      message.error(getApiErrorMessage(e));
      markSectionDirty("media", "clean");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "20px 0" }}>
      {/* ── Add Media Button ── */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setPickerOpen(true)}
          loading={save.isPending}
        >
          {t("catalog.products.tabs.media.addFromLibrary") || "Add from Media Library"}
        </Button>
      </div>

      {/* ── ImagePicker Modal (from @repo/media) ── */}
      <ImagePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onChange={handleMediaSelected}
        multiple
      />

      {/* ── Error hint ── */}
      {isError && <ErrorHint error={error} />}

      {/* ── Media Grid ── */}
      {localItems.length === 0 && !isLoading ? (
        <EmptyState
          title={t("catalog.products.tabs.media.emptyTitle") || "No Media"}
          description={
            t("catalog.products.tabs.media.emptyDescription") ||
            "Upload product images to help customers understand your product."
          }
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {localItems.map((item, index) => (
            <div
              key={item.id ?? index}
              style={{
                border: item.isPrimary
                  ? "2px solid #1677ff"
                  : "1px solid var(--border-light)",
                borderRadius: 12,
                overflow: "hidden",
                background: "#fff",
                position: "relative",
              }}
            >
              {item.isPrimary && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    background: "#1677ff",
                    color: "#fff",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 10,
                    zIndex: 10,
                  }}
                >
                  Primary
                </div>
              )}
              <div
                style={{
                  height: 160,
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {item.type === 1 ? (
                  <img
                    src={item.url}
                    alt={item.altText || t("catalog.media.altFallback") || "Media"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                    }}
                  />
                ) : (
                  <Text type="secondary">{enumLabel("mediaType", item.type, t)}</Text>
                )}
              </div>
              <div
                style={{
                  padding: "12px 8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.altText || "Image"}
                </Text>
                <Popconfirm
                  title={
                    t("catalog.products.tabs.media.removeConfirm") ||
                    "Are you sure you want to remove this?"
                  }
                  onConfirm={() => removeMedia(item.id as string)}
                >
                  <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- Unified Variants Workspace ---------------------------------- */

export function ProductVariantsTab({
  productId,
  languageCode = "en-US",
  languageId = "4f7d8a31-2d4e-4b9c-a8f6-9e1d73c5b4a2",
}: {
  productId: string;
  languageCode?: string;
  languageId?: string;
}) {
  return (
    <ProductVariantsWorkspace
      productId={productId}
      languageCode={languageCode}
      languageId={languageId}
    />
  );
}

/* ---------------------------------- Relations ---------------------------------- */

export function ProductRelationsTab({ productId }: { productId: string }) {
  const t = useTranslations();
  const { data, isLoading, isError, error } = useProductRelations(productId);
  const addRelation = useAddProductRelation(productId);
  const remove = useDeleteProductDetail("relations", productId);

  const [productSearch, setProductSearch] = useState("");
  const products = useProducts({
    page: 1,
    pageSize: 50,
    search: productSearch || undefined,
  });
  const [relationType, setRelationType] = useState<RelationType>(1);
  const [targetProductId, setTargetProductId] = useState<string | undefined>(
    undefined,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const relations = (data ?? []) as Relation[];

  const add = async () => {
    if (!targetProductId) return;
    try {
      await addRelation.mutateAsync({
        relatedProductId: targetProductId,
        relationType: relationType as RelationType,
        quantity: 1,
      });
      message.success(t("catalog.products.tabs.relations.added"));
      setModalOpen(false);
      setTargetProductId(undefined);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const columns: TableColumnsType<Relation> = [
    {
      title: t("catalog.products.tabs.relations.productColumn"),
      dataIndex: "productName",
      render: (v) => v ?? "\u2014",
    },
    {
      title: t("catalog.products.tabs.relations.relationColumn"),
      dataIndex: "relationType",
      render: (v) => enumLabel("relationType", v, t),
    },
    {
      title: "",
      key: "actions",
      width: 100,
      render: (_, r) => (
        <Popconfirm
          title={t("catalog.products.tabs.relations.removeConfirm")}
          onConfirm={async () => {
            try {
              await remove.mutateAsync(r.id as string);
              message.success(t("catalog.products.tabs.relations.removed"));
            } catch (e) {
              message.error(getApiErrorMessage(e));
            }
          }}
        >
          <Button type="link" size="small" danger>
            {t("catalog.products.tabs.relations.remove")}
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          {t("catalog.products.tabs.relations.add")}
        </Button>
      </div>
      <ErrorHint error={isError ? error : null} />
      <Table<Relation>
        rowKey={(r) => r.id ?? r.productId}
        columns={columns}
        dataSource={relations}
        loading={isLoading}
        pagination={false}
        size="middle"
        locale={{
          emptyText: (
            <EmptyState
              title={t("catalog.products.tabs.relations.emptyTitle")}
              description={t(
                "catalog.products.tabs.relations.emptyDescription",
              )}
            />
          ),
        }}
      />

      <Modal
        open={modalOpen}
        title={t("catalog.products.tabs.relations.add")}
        onCancel={() => setModalOpen(false)}
        onOk={add}
        okText={t("catalog.products.tabs.media.add")}
        confirmLoading={addRelation.isPending}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Select
            showSearch
            placeholder={t("catalog.products.tabs.relations.searchPlaceholder")}
            style={{ width: "100%" }}
            value={targetProductId}
            onChange={setTargetProductId}
            onSearch={setProductSearch}
            optionFilterProp="label"
            loading={products.isLoading}
            options={(products.data?.data ?? []).map((p) => ({
              value: p.id,
              label: p.name,
            }))}
          />
          <Select
            value={relationType}
            onChange={setRelationType}
            options={enumOptions("relationType", t)}
            style={{ width: "100%" }}
          />
        </Space>
      </Modal>
    </>
  );
}
