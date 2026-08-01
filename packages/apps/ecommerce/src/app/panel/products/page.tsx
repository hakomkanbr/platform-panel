"use client";
import React, { useState, useCallback, useMemo } from "react";
import {
  Table, Button, Space, Tag, Typography, Card, Input, Popconfirm,
  message, Switch, Tooltip, Row, Col, Select, Dropdown, Badge,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";
import {
  PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined,
  EyeOutlined, CopyOutlined, DownloadOutlined, FilterOutlined,
  SortAscendingOutlined, ClearOutlined, CheckOutlined, CloseOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { productsApi } from "@/lib/api/products";
import type { ProductListItem, ProductListParams, ProductSortField, SortOrder } from "@/types";

const { Title, Text } = Typography;

const formatCurrency = (v: number) =>
  `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [params, setParams] = useState<ProductListParams>({
    skip: 0, pageSize: 10, sortField: "createdAt", sortOrder: "desc",
  });
  const { products, count, loading, refetch } = useProducts(params);
  const [deleting, setDeleting] = useState(false);

  const handleSearch = useCallback((value: string) => {
    setParams((prev) => ({ ...prev, search: value || undefined, skip: 0 }));
  }, []);

  const handleTableChange = useCallback(
    (pagination: TablePaginationConfig, _filters: any, sorter: SorterResult<ProductListItem> | SorterResult<ProductListItem>[]) => {
      const s = Array.isArray(sorter) ? sorter[0] : sorter;
      setParams((prev) => ({
        ...prev,
        skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 10),
        pageSize: pagination.pageSize || 10,
        sortField: (s?.field as ProductSortField) || prev.sortField,
        sortOrder: (s?.order === "ascend" ? "asc" : s?.order === "descend" ? "desc" : prev.sortOrder) as SortOrder,
      }));
    },
    [],
  );

  const clearFilters = () => {
    setParams({ skip: 0, pageSize: 10, sortField: "createdAt", sortOrder: "desc" });
    setSearch("");
    setSelectedRowKeys([]);
  };

  const handleCopy = async (id: number) => {
    try {
      await productsApi.copy(id);
      message.success("Product duplicated");
      refetch();
    } catch { message.error("Failed to copy product"); }
  };

  const handleDelete = async (id: number) => {
    try {
      await productsApi.delete(id);
      message.success("Product deleted");
      refetch();
    } catch { message.error("Failed to delete product"); }
  };

  const handleBulkDelete = async () => {
    try {
      await productsApi.bulkDelete(selectedRowKeys as number[]);
      message.success(`${selectedRowKeys.length} products deleted`);
      setSelectedRowKeys([]);
      refetch();
    } catch { message.error("Failed to delete products"); }
  };

  const handleBulkPublish = async (state: boolean) => {
    try {
      await productsApi.bulkPublish(selectedRowKeys as number[], state);
      message.success(state ? "Products published" : "Products unpublished");
      refetch();
    } catch { message.error("Failed to update products"); }
  };

  const handleTogglePublish = async (id: number, state: boolean) => {
    try {
      await productsApi.setPublishable(id, state);
      refetch();
    } catch { message.error("Failed to update product"); }
  };

  const handleExport = async () => {
    try {
      const blob = await productsApi.exportCsv(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `products-export-${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      message.success("Products exported");
    } catch { message.error("Export failed"); }
  };

  const columns: ColumnsType<ProductListItem> = [
    {
      title: "Code", dataIndex: "code", key: "code", width: 100,
      sorter: true, showSorterTooltip: false,
    },
    {
      title: "Title", dataIndex: "title", key: "title", ellipsis: true,
      sorter: true, showSorterTooltip: false,
    },
    { title: "Category", dataIndex: "category", key: "category", width: 120 },
    { title: "Brand", dataIndex: "brand", key: "brand", width: 120 },
    {
      title: "Price", key: "price", width: 120,
      sorter: true, showSorterTooltip: false,
      render: (_: any, record: ProductListItem) => (
        <Text strong>{record.price ? formatCurrency(record.price.finalPrice) : "—"}</Text>
      ),
    },
    {
      title: "Published", dataIndex: "isPublishable", key: "isPublishable", width: 90,
      render: (v: boolean, record: ProductListItem) => (
        <Switch checked={v} size="small"
          onChange={(checked) => handleTogglePublish(Number(record.id), checked)} />
      ),
    },
    {
      title: "Stock", dataIndex: "inStock", key: "inStock", width: 80,
      render: (v: boolean) => (
        <Badge status={v ? "success" : "error"} text={v ? "In Stock" : "Out"} />
      ),
    },
    {
      title: "Actions", key: "actions", width: 180,
      render: (_: unknown, record: ProductListItem) => (
        <Space size={0}>
          <Tooltip title="View"><Button size="small" type="text" icon={<EyeOutlined />}
            onClick={() => router.push(`/panel/products/${record.id}`)} /></Tooltip>
          <Tooltip title="Edit"><Button size="small" type="text" icon={<EditOutlined />}
            onClick={() => router.push(`/panel/products/${record.id}?tab=edit`)} /></Tooltip>
          <Tooltip title="Duplicate"><Button size="small" type="text" icon={<CopyOutlined />}
            onClick={() => handleCopy(Number(record.id))} /></Tooltip>
          <Popconfirm title="Delete this product?" onConfirm={() => handleDelete(Number(record.id))}>
            <Tooltip title="Delete"><Button size="small" type="text" danger icon={<DeleteOutlined />} /></Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const bulkActions = [
    { key: "publish", label: "Publish Selected", icon: <CheckOutlined />, onClick: () => handleBulkPublish(true) },
    { key: "unpublish", label: "Unpublish Selected", icon: <CloseOutlined />, onClick: () => handleBulkPublish(false) },
    { key: "delete", label: `Delete (${selectedRowKeys.length})`, icon: <DeleteOutlined />, danger: true, onClick: handleBulkDelete },
  ];

  const hasActiveFilters = params.search || params.categoryId || params.brandId || params.inStock !== undefined || params.isPublishable !== undefined;

  return (
    <div>
      <div className="page-header">
        <div>
          <Title level={4} style={{ margin: 0 }}>Products</Title>
          <p>Manage your product inventory ({count} total)</p>
        </div>
        <Space wrap>
          <Input.Search
            placeholder="Search by name, code, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={handleSearch}
            onPressEnter={(e: any) => handleSearch(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />
          {selectedRowKeys.length > 0 && (
            <Dropdown menu={{ items: bulkActions }} trigger={["click"]}>
              <Button>
                Bulk ({selectedRowKeys.length}) <FilterOutlined />
              </Button>
            </Dropdown>
          )}
          {hasActiveFilters && (
            <Tooltip title="Clear all filters">
              <Button icon={<ClearOutlined />} onClick={clearFilters}>Clear</Button>
            </Tooltip>
          )}
          <Tooltip title="Export to CSV">
            <Button icon={<DownloadOutlined />} onClick={handleExport}>Export</Button>
          </Tooltip>
          <Button type="primary" icon={<PlusOutlined />}
            onClick={() => router.push("/panel/products/new")}>
            Add Product
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Select placeholder="Filter by category" allowClear style={{ width: "100%" }}
            onChange={(v) => setParams((p) => ({ ...p, categoryId: v, skip: 0 }))} />
        </Col>
        <Col span={6}>
          <Select placeholder="Filter by brand" allowClear style={{ width: "100%" }}
            onChange={(v) => setParams((p) => ({ ...p, brandId: v, skip: 0 }))} />
        </Col>
        <Col span={6}>
          <Select placeholder="Stock status" allowClear style={{ width: "100%" }}
            onChange={(v) => setParams((p) => ({ ...p, inStock: v, skip: 0 }))}
            options={[
              { value: true, label: "In Stock" },
              { value: false, label: "Out of Stock" },
            ]} />
        </Col>
        <Col span={6}>
          <Select placeholder="Publish status" allowClear style={{ width: "100%" }}
            onChange={(v) => setParams((p) => ({ ...p, isPublishable: v, skip: 0 }))}
            options={[
              { value: true, label: "Published" },
              { value: false, label: "Unpublished" },
            ]} />
        </Col>
      </Row>

      <Card styles={{ body: { padding: 0 } }}>
        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          onChange={handleTableChange}
          pagination={{
            current: (params.skip || 0) / (params.pageSize || 10) + 1,
            pageSize: params.pageSize || 10,
            total: count,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          }}
          size="middle"
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}
