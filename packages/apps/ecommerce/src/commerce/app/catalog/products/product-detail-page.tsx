"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Descriptions,
  message,
  Modal,
  Space,
  Tabs,
  Tag,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  StopOutlined,
  CaretUpOutlined,
} from "@ant-design/icons";
import { AsyncBoundary } from "@repo/ui";
import { formatCurrency, formatDateTime } from "@repo/utils";
import { CommerceShell } from "../../../components/CommerceShell";
import { StatusTag } from "../../../components/StatusTag";
import { enumLabel } from "../../../types/enums";
import { useDeleteProduct, useProduct, useSetProductStatus } from "../../../hooks/useProducts";
import { getApiErrorMessage } from "../../../api/http";
import { ProductEditDrawer } from "./product-edit-drawer";
import {
  ProductMediaTab,
  ProductOptionsTab,
  ProductRelationsTab,
  ProductVariantsTab,
} from "./product-tabs";

const { Text } = Typography;

export function ProductDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { data: product, isLoading, isError, error, refetch } = useProduct(id);
  const setStatus = useSetProductStatus();
  const remove = useDeleteProduct();
  const [editOpen, setEditOpen] = useState(false);

  const runStatus = async (action: "publish" | "unpublish" | "archive" | "restore") => {
    try {
      await setStatus.mutateAsync({ id, action });
      message.success("Product updated");
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: "Delete product",
      content: "This will permanently delete the product. This action cannot be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await remove.mutateAsync(id);
          message.success("Product deleted");
          router.push("/admin/catalog/products");
        } catch (e) {
          message.error(getApiErrorMessage(e));
        }
      },
    });
  };

  return (
    <CommerceShell
      title={product?.name ?? "Product"}
      description={product?.slug ? `/${product.slug}` : undefined}
      breadcrumbs={[
        { title: "Catalog", href: "/admin/catalog" },
        { title: "Products", href: "/admin/catalog/products" },
        { title: product?.name ?? "Loading..." },
      ]}
      actions={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/admin/catalog/products")}>
            Back
          </Button>
          {product?.status !== "published" && (
            <Button type="primary" icon={<CaretUpOutlined />} onClick={() => runStatus("publish")}>
              Publish
            </Button>
          )}
          {product?.status === "published" && (
            <Button icon={<StopOutlined />} onClick={() => runStatus("unpublish")}>
              Unpublish
            </Button>
          )}
          {product?.status === "archived" ? (
            <Button icon={<CaretUpOutlined />} onClick={() => runStatus("restore")}>
              Restore
            </Button>
          ) : (
            <Button icon={<InboxOutlined />} onClick={() => runStatus("archive")}>
              Archive
            </Button>
          )}
          <Button icon={<EditOutlined />} onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={confirmDelete} />
        </Space>
      }
    >
      <AsyncBoundary loading={isLoading} error={error ? new Error(getApiErrorMessage(error)) : undefined} retry={refetch}>
        {product && (
          <>
            <Card style={{ borderRadius: 16, border: "1px solid var(--border-light)", marginBottom: 24 }}>
              <Descriptions column={{ xs: 1, sm: 2, lg: 4 }} size="middle">
                <Descriptions.Item label="Status">
                  <StatusTag value={product.status} />
                </Descriptions.Item>
                <Descriptions.Item label="Type">{enumLabel("productType", product.type)}</Descriptions.Item>
                <Descriptions.Item label="Structure">
                  {enumLabel("productStructure", product.structure)}
                </Descriptions.Item>
                <Descriptions.Item label="SKU">{product.sku || "\u2014"}</Descriptions.Item>
                <Descriptions.Item label="Price">{formatCurrency(product.price, product.currency)}</Descriptions.Item>
                <Descriptions.Item label="Compare-at">
                  {formatCurrency(product.compareAtPrice, product.currency)}
                </Descriptions.Item>
                <Descriptions.Item label="Cost">{formatCurrency(product.cost, product.currency)}</Descriptions.Item>
                <Descriptions.Item label="Stock">{product.stock ?? "\u2014"}</Descriptions.Item>
                <Descriptions.Item label="Brand">{product.brandName ?? "\u2014"}</Descriptions.Item>
                <Descriptions.Item label="Published">{formatDateTime(product.publishedAt)}</Descriptions.Item>
                <Descriptions.Item label="Created">{formatDateTime(product.createdAt)}</Descriptions.Item>
                <Descriptions.Item label="Updated">{formatDateTime(product.updatedAt)}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Tabs
              defaultActiveKey="overview"
              items={[
                {
                  key: "overview",
                  label: "Overview",
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {product.description && (
                        <Card
                          title="Description"
                          style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}
                        >
                          <Text>{product.description}</Text>
                        </Card>
                      )}
                      {(product.categories?.length ?? 0) > 0 && (
                        <Card title="Categories" style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}>
                          <Space wrap>
                            {(product.categories ?? []).map((c) => (
                              <Tag key={c.categoryId}>{c.categoryName ?? c.categoryId}</Tag>
                            ))}
                          </Space>
                        </Card>
                      )}
                      {(product.tags?.length ?? 0) > 0 && (
                        <Card title="Tags" style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}>
                          <Space wrap>
                            {(product.tags ?? []).map((t) => (
                              <Tag key={t.id} color="orange">
                                {t.name}
                              </Tag>
                            ))}
                          </Space>
                        </Card>
                      )}
                      {(product.attributes?.length ?? 0) > 0 && (
                        <Card title="Attributes" style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}>
                          <Space wrap>
                            {(product.attributes ?? []).map((a, i) => (
                              <Tag key={`${a.definitionId}-${i}`}>
                                {a.definitionName ?? a.definitionKey}: <Text strong>{a.value}</Text>
                              </Tag>
                            ))}
                          </Space>
                        </Card>
                      )}
                    </div>
                  ),
                },
                { key: "media", label: `Media (${product.media?.length ?? 0})`, children: <ProductMediaTab productId={id} /> },
                { key: "options", label: `Options (${product.options?.length ?? 0})`, children: <ProductOptionsTab productId={id} /> },
                { key: "variants", label: `Variants (${product.variants?.length ?? 0})`, children: <ProductVariantsTab productId={id} /> },
                { key: "relations", label: "Relations", children: <ProductRelationsTab productId={id} /> },
              ]}
            />
          </>
        )}
      </AsyncBoundary>

      <ProductEditDrawer open={editOpen} product={product ?? null} onClose={() => setEditOpen(false)} />
    </CommerceShell>
  );
}
