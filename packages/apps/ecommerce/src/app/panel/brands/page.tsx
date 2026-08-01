"use client";
import React, { useState } from "react";
import { Table, Button, Space, Typography, Card, Input, Popconfirm, message, Tooltip } from "antd";
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useBrands } from "@/hooks/useBrands";
import { brandsApi } from "@/lib/api/brands";

const { Title } = Typography;

export default function BrandsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [params, setParams] = useState<{ search?: string; skip: number; pageSize: number }>({ skip: 0, pageSize: 20 });
  const { brands, count, loading, refetch } = useBrands({ ...params, search: params.search || undefined });

  const handleDelete = async (id: number) => {
    try { await brandsApi.delete(id); message.success("Brand deleted"); refetch(); }
    catch { message.error("Failed to delete brand"); }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    { title: "Description", dataIndex: "description", key: "description", ellipsis: true },
    {
      title: "Actions", key: "actions",
      render: (_: unknown, record: any) => (
        <Space>
          <Tooltip title="Edit"><Button size="small" icon={<EditOutlined />} onClick={() => router.push(`/panel/brands/${record.id}`)} /></Tooltip>
          <Popconfirm title="Delete this brand?" onConfirm={() => handleDelete(record.id)}>
            <Tooltip title="Delete"><Button size="small" danger icon={<DeleteOutlined />} /></Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <Title level={4} style={{ margin: 0 }}>Brands</Title>
          <p>Manage product brands</p>
        </div>
        <Space>
          <Input placeholder="Search..." prefix={<SearchOutlined />} value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={() => setParams((p) => ({ ...p, search }))} style={{ width: 200 }} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/panel/brands/new")}>
            Add Brand
          </Button>
        </Space>
      </div>
      <Card styles={{ body: { padding: 0 } }}>
        <Table dataSource={brands} columns={columns} rowKey="id" loading={loading}
          pagination={{
            current: params.skip / params.pageSize + 1, pageSize: params.pageSize, total: count,
            onChange: (page, pageSize) => setParams({ skip: (page - 1) * pageSize, pageSize }),
          }}
          size="middle" />
      </Card>
    </div>
  );
}
