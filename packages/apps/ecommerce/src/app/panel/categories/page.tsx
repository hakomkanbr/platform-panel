"use client";
import React, { useState } from "react";
import { Table, Button, Space, Typography, Card, Input, Popconfirm, message, Tag, Tooltip } from "antd";
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import { categoriesApi } from "@/lib/api/categories";
import type { Category } from "@/types";

const { Title } = Typography;

export default function CategoriesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { categories, loading, refetch } = useCategories();

  const handleDelete = async (id: number) => {
    try { await categoriesApi.delete(id); message.success("Category deleted"); refetch(); }
    catch { message.error("Failed to delete category"); }
  };

  const flattenCategories = (cats: Category[], level = 0): (Category & { level: number })[] =>
    cats.flatMap((c) => [{ ...c, level }, ...flattenCategories(c.children || [], level + 1)]);

  const flatData = flattenCategories(categories);

  const columns = [
    {
      title: "Name", dataIndex: "name", key: "name",
      render: (v: string, record: any) => (
        <span style={{ paddingLeft: record.level * 20 }}>
          {record.level > 0 && <Tag style={{ marginRight: 4 }}>Sub</Tag>}
          {v}
        </span>
      ),
    },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    { title: "Description", dataIndex: "description", key: "description", ellipsis: true },
    {
      title: "Actions", key: "actions",
      render: (_: unknown, record: Category) => (
        <Space>
          <Tooltip title="Edit"><Button size="small" icon={<EditOutlined />} onClick={() => router.push(`/panel/categories/${record.id}`)} /></Tooltip>
          <Popconfirm title="Delete this category?" onConfirm={() => handleDelete(record.id)}>
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
          <Title level={4} style={{ margin: 0 }}>Categories</Title>
          <p>Organize your product categories</p>
        </div>
        <Space>
          <Input placeholder="Search..." prefix={<SearchOutlined />} value={search}
            onChange={(e) => setSearch(e.target.value)} style={{ width: 200 }} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/panel/categories/new")}>
            Add Category
          </Button>
        </Space>
      </div>
      <Card styles={{ body: { padding: 0 } }}>
        <Table dataSource={flatData} columns={columns} rowKey="id" loading={loading} size="middle" pagination={false} />
      </Card>
    </div>
  );
}
