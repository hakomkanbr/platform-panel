"use client";
import React, { useState } from "react";
import { Table, Button, Space, Typography, Card, Input, Popconfirm, message, Tag, Tooltip, Rate, Select } from "antd";
import { SearchOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useComments } from "@/hooks/useComments";
import { commentsApi } from "@/lib/api/comments";
import type { Comment } from "@/types";

const { Title } = Typography;

export default function CommentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [params, setParams] = useState<{ search?: string; skip: number; pageSize: number }>({ skip: 0, pageSize: 10 });
  const { comments, count, loading, refetch } = useComments(params);

  const handleDelete = async (id: number) => {
    try { await commentsApi.delete(id); message.success("Comment deleted"); refetch(); }
    catch { message.error("Failed to delete comment"); }
  };

  const filtered = comments.filter((c) => {
    if (filter === "approved") return c.isApproved;
    if (filter === "pending") return !c.isApproved;
    return true;
  });

  const columns = [
    { title: "Customer", dataIndex: "customerName", key: "customerName", width: 150, ellipsis: true },
    {
      title: "Rating", dataIndex: "rating", key: "rating", width: 150,
      render: (v: number) => <Rate disabled value={v} allowHalf style={{ fontSize: 14 }} />,
    },
    { title: "Content", dataIndex: "content", key: "content", ellipsis: true },
    { title: "Date", dataIndex: "date", key: "date", width: 110, render: (v: string) => v ? dayjs(v).format("YYYY-MM-DD") : "-" },
    {
      title: "Status", dataIndex: "isApproved", key: "isApproved", width: 100,
      render: (v: boolean) => <Tag color={v ? "green" : "orange"}>{v ? "Approved" : "Pending"}</Tag>,
    },
    {
      title: "Actions", key: "actions", width: 100,
      render: (_: unknown, record: Comment) => (
        <Space>
          <Tooltip title="View"><Button size="small" icon={<EyeOutlined />} onClick={() => router.push(`/panel/comments/${record.id}`)} /></Tooltip>
          <Popconfirm title="Delete this comment?" onConfirm={() => handleDelete(record.id)}>
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
          <Title level={4} style={{ margin: 0 }}>Comments</Title>
          <p>Review and manage customer feedback</p>
        </div>
        <Space>
          <Select value={filter} onChange={(v) => setFilter(v)} style={{ width: 140 }}
            options={[
              { value: "all", label: "All Comments" },
              { value: "approved", label: "Approved" },
              { value: "pending", label: "Pending" },
            ]}
          />
          <Input placeholder="Search comments..." prefix={<SearchOutlined />} value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={() => setParams((p) => ({ ...p, search }))} style={{ width: 250 }} />
        </Space>
      </div>
      <Card styles={{ body: { padding: 0 } }}>
        <Table dataSource={filtered} columns={columns} rowKey="id" loading={loading}
          pagination={{
            current: params.skip / params.pageSize + 1, pageSize: params.pageSize, total: count,
            onChange: (page, pageSize) => setParams({ skip: (page - 1) * pageSize, pageSize }),
          }}
          size="middle"
        />
      </Card>
    </div>
  );
}
