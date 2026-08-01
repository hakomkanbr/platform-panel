"use client";
import React, { useState } from "react";
import { Table, Typography, Card, Input, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useCustomers } from "@/hooks/useCustomers";

const { Title, Text } = Typography;

const customerTypeLabel = (type: number) =>
  type === 0 ? <Tag color="blue">Individual</Tag> : <Tag color="purple">Institutional</Tag>;

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [params, setParams] = useState<{ search?: string; skip: number; pageSize: number }>({ skip: 0, pageSize: 10 });
  const { customers, count, loading } = useCustomers({ ...params, search: params.search || undefined });

  const columns = [
    {
      title: "Name", key: "name", width: 180,
      render: (_: unknown, record: any) => <Text strong>{`${record.name || ""} ${record.sureName || ""}`}</Text>,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber", width: 120 },
    { title: "Type", dataIndex: "type", key: "type", width: 120, render: (v: number) => customerTypeLabel(v) },
    { title: "Tax Office", dataIndex: "taxOffice", key: "taxOffice", width: 120 },
    { title: "Tax Number", dataIndex: "taxNumber", key: "taxNumber", width: 100 },
    { title: "Company", dataIndex: "unvan", key: "unvan", ellipsis: true },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <Title level={4} style={{ margin: 0 }}>Customers</Title>
          <p>View your customer base</p>
        </div>
        <Input placeholder="Search by email..." prefix={<SearchOutlined />} value={search}
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={() => setParams((p) => ({ ...p, search }))} style={{ width: 250 }} />
      </div>
      <Card styles={{ body: { padding: 0 } }}>
        <Table dataSource={customers} columns={columns} rowKey="id" loading={loading}
          pagination={{
            current: params.skip / params.pageSize + 1, pageSize: params.pageSize, total: count,
            onChange: (page, pageSize) => setParams({ skip: (page - 1) * pageSize, pageSize }),
          }}
          size="middle" />
      </Card>
    </div>
  );
}
