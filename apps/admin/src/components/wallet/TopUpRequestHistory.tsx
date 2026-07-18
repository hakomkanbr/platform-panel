"use client";

import React from "react";
import { Table, Tag, Typography, Empty, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TopUpRequestDto } from "@/types";
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface TopUpRequestHistoryProps {
  requests: TopUpRequestDto[] | undefined;
  isLoading: boolean;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  Pending: { color: "orange", icon: <ClockCircleOutlined />, label: "Pending" },
  Approved: { color: "green", icon: <CheckCircleOutlined />, label: "Approved" },
  Rejected: { color: "red", icon: <CloseCircleOutlined />, label: "Rejected" },
};

export default function TopUpRequestHistory({
  requests,
  isLoading,
}: TopUpRequestHistoryProps) {
  const columns: ColumnsType<TopUpRequestDto> = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 130,
      render: (amount: number) => (
        <Text strong style={{ fontSize: 15 }}>${amount.toFixed(2)}</Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const config = statusConfig[status] || { color: "default", icon: null, label: status };
        return (
          <Tag color={config.color} style={{ borderRadius: 6 }}>
            <Space size={4}>{config.icon}{config.label}</Space>
          </Tag>
        );
      },
    },
    {
      title: "Admin Notes",
      dataIndex: "adminNotes",
      key: "adminNotes",
      render: (notes: string) => notes || "-",
    },
    {
      title: "Approved By",
      dataIndex: "approvedBy",
      key: "approvedBy",
      width: 140,
      render: (by: string) => by || "-",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date: string) => (
        <Text type="secondary">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
          })}
        </Text>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={requests || []}
      rowKey="id"
      loading={isLoading}
      pagination={{ pageSize: 5, showSizeChanger: true }}
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No top-up requests yet" /> }}
      scroll={{ x: 700 }}
      size="middle"
    />
  );
}
