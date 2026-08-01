"use client";
import React, { useState } from "react";
import { Table, Button, Space, Typography, Card, Input, Tag, Tooltip } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useOrders } from "@/hooks/useOrders";
import dayjs from "dayjs";

const { Title } = Typography;

const STATUS_MAP: Record<number, { color: string; label: string }> = {
  0: { color: "orange", label: "Pending" }, 1: { color: "gold", label: "Awaiting Payment" },
  2: { color: "blue", label: "Paid" }, 3: { color: "cyan", label: "In Cargo" },
  4: { color: "green", label: "Delivered" }, 5: { color: "red", label: "Cancelled" },
  6: { color: "purple", label: "Processing" }, 7: { color: "red", label: "Payment Failed" },
  8: { color: "default", label: "Refunded" }, 9: { color: "red", label: "Refund Failed" },
};

const statusTag = (status: number) => {
  const s = STATUS_MAP[status] || { color: "default", label: `Status ${status}` };
  return <Tag color={s.color}>{s.label}</Tag>;
};

const formatCurrency = (v: number) => `SAR ${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [params, setParams] = useState<{ search?: string; skip: number; pageSize: number }>({ skip: 0, pageSize: 10 });
  const { orders, count, loading } = useOrders(params);

  const columns = [
    { title: "Code", dataIndex: "code", key: "code", width: 130 },
    { title: "Customer", dataIndex: "customer", key: "customer", ellipsis: true },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber", width: 120 },
    { title: "Total", dataIndex: "grandTotal", key: "grandTotal", width: 120, render: (v: number) => <Text strong>{formatCurrency(v)}</Text> },
    { title: "Status", dataIndex: "status", key: "status", width: 150, render: (v: number) => statusTag(v) },
    { title: "Date", dataIndex: "dateTime", key: "dateTime", width: 110, render: (v: string) => dayjs(v).format("YYYY-MM-DD") },
    {
      title: "Actions", key: "actions", width: 80,
      render: (_: unknown, record: any) => (
        <Tooltip title="View Order">
          <Button size="small" icon={<EyeOutlined />} onClick={() => router.push(`/panel/orders/${record.id}`)} />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <Title level={4} style={{ margin: 0 }}>Orders</Title>
          <p>Track and manage customer orders</p>
        </div>
        <Input placeholder="Search by code..." prefix={<SearchOutlined />} value={search}
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={() => setParams((p) => ({ ...p, search }))} style={{ width: 250 }} />
      </div>
      <Card styles={{ body: { padding: 0 } }}>
        <Table dataSource={orders} columns={columns} rowKey="id" loading={loading}
          pagination={{
            current: params.skip / params.pageSize + 1, pageSize: params.pageSize, total: count,
            onChange: (page, pageSize) => setParams({ skip: (page - 1) * pageSize, pageSize }),
          }}
          size="middle" />
      </Card>
    </div>
  );
}

const { Text } = Typography;
