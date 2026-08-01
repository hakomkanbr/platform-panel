"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Dropdown, message, Modal, Select, Space, Tag, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  ProductOutlined,
  StopOutlined,
  CheckCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { DataTable, EmptyState } from "@repo/ui";
import { formatDateTime, formatCurrency } from "@repo/utils";
import { CommerceShell } from "../../../components/CommerceShell";
import { StatusTag } from "../../../components/StatusTag";
import { enumLabel, enumOptions } from "../../../types/enums";
import type { ProductListItem } from "../../../types/catalog";
import {
  useDeleteProduct,
  useProducts,
  useSetProductStatus,
} from "../../../hooks/useProducts";
import { getApiErrorMessage } from "../../../api/http";

type ProductRow = ProductListItem & Record<string, unknown>;

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export function ProductsPage() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState<number | undefined>(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const query = useMemo(
    () => ({
      page,
      pageSize,
      search: search || undefined,
      status: status || undefined,
      type: type !== undefined ? String(type) : undefined,
    }),
    [page, pageSize, search, status, type],
  );

  const { data, isLoading, isError, error, refetch } = useProducts(query);
  const setStatusMutation = useSetProductStatus();
  const deleteMutation = useDeleteProduct();

  const total = data?.count ?? 0;
  const rows = (data?.data ?? []) as ProductRow[];

  const runBulk = async (action: "publish" | "unpublish" | "archive") => {
    if (selectedRowKeys.length === 0) return;
    try {
      for (const key of selectedRowKeys) {
        await setStatusMutation.mutateAsync({ id: String(key), action });
      }
      message.success(`${selectedRowKeys.length} product(s) updated`);
      setSelectedRowKeys([]);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: "Delete products",
      content: `This will permanently delete ${selectedRowKeys.length} product(s). This action cannot be undone.`,
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          for (const key of selectedRowKeys) {
            await deleteMutation.mutateAsync(String(key));
          }
          message.success("Products deleted");
          setSelectedRowKeys([]);
        } catch (e) {
          message.error(getApiErrorMessage(e));
        }
      },
    });
  };

  const columns: TableColumnsType<ProductRow> = [
    {
      title: "Product",
      key: "name",
      width: 320,
      render: (_, record) => (
        <Space>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "var(--border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {record.primaryImageUrl ? (
              <img
                src={record.primaryImageUrl}
                alt={record.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                }}
              />
            ) : (
              <ProductOutlined style={{ color: "var(--text-secondary)" }} />
            )}
          </div>
          <div>
            <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{record.name}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {record.sku || record.code || record.id.slice(0, 8)}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 140,
      render: (value) => (value ? enumLabel("productType", value) : "\u2014"),
    },
    {
      title: "Brand",
      dataIndex: "brandName",
      width: 140,
      render: (value) => value ?? "\u2014",
    },
    {
      title: "Price",
      key: "price",
      width: 130,
      render: (_, record) => formatCurrency(record.price, record.currency),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      width: 100,
      render: (value) => (value === undefined || value === null ? "\u2014" : value),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 130,
      render: (value) => <StatusTag value={value} />,
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      width: 170,
      render: (value) => <span style={{ color: "var(--text-secondary)" }}>{formatDateTime(value)}</span>,
    },
    {
      title: "",
      key: "actions",
      width: 60,
      render: () => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              { key: "edit", label: "Edit" },
              { key: "publish", label: "Publish" },
              { key: "unpublish", label: "Unpublish" },
              { key: "archive", label: "Archive" },
              { key: "delete", label: "Delete", danger: true },
            ],
            onClick: ({ key, domEvent }) => {
              domEvent.stopPropagation();
              // handled by onRowClick for edit; actions here
              void key;
            },
          }}
        >
          <Button type="text" size="small" onClick={(e) => e.stopPropagation()}>
            ...
          </Button>
        </Dropdown>
      ),
    },
  ];

  const filters = (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Select
        value={status}
        options={statusOptions}
        onChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        style={{ width: 160 }}
      />
      <Select
        value={type}
        allowClear
        placeholder="Product type"
        options={enumOptions("productType")}
        onChange={(v) => {
          setType(v);
          setPage(1);
        }}
        style={{ width: 180 }}
      />
    </div>
  );

  return (
    <CommerceShell
      title="Products"
      description="Create, organize and publish the products sold across your storefront."
      breadcrumbs={[{ title: "Catalog", href: "/admin/catalog" }, { title: "Products" }]}
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/admin/catalog/products/new")}>
          New product
        </Button>
      }
    >
      <DataTable<ProductRow>
        columns={columns}
        dataSource={rows}
        rowKey="id"
        loading={isLoading}
        error={error ? new Error(getApiErrorMessage(error)) : undefined}
        onRefresh={refetch}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={(p, ps) => {
          setPage(p);
          setPageSize(ps);
        }}
        searchable
        searchPlaceholder="Search by name, SKU or code..."
        onSearch={(term) => {
          setSearch(term);
          setPage(1);
        }}
        filters={filters}
        title={`${total} products`}
        onRowClick={(record) => router.push(`/admin/catalog/products/${record.id}`)}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        bulkActions={
          <>
            <Tooltip title="Publish selected">
              <Button icon={<CheckCircleOutlined />} onClick={() => runBulk("publish")}>
                Publish
              </Button>
            </Tooltip>
            <Tooltip title="Unpublish selected">
              <Button icon={<StopOutlined />} onClick={() => runBulk("unpublish")}>
                Unpublish
              </Button>
            </Tooltip>
            <Tooltip title="Archive selected">
              <Button icon={<InboxOutlined />} onClick={() => runBulk("archive")}>
                Archive
              </Button>
            </Tooltip>
            <Button danger icon={<DeleteOutlined />} onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
        emptyTitle="No products yet"
        emptyDescription="Create your first product to start building your catalog."
        emptyAction={{ label: "New product", onClick: () => router.push("/admin/catalog/products/new") }}
      />
    </CommerceShell>
  );
}
