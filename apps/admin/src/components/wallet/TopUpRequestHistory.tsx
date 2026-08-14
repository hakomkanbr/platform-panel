"use client";

import React from "react";
import { Table, Tag, Typography, Empty, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TopUpRequestDto } from "@repo/shared-types";
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface TopUpRequestHistoryProps {
  requests: TopUpRequestDto[] | undefined;
  isLoading: boolean;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  Pending: { color: "orange", icon: <ClockCircleOutlined />, label: "قيد المراجعة" },
  Approved: { color: "green", icon: <CheckCircleOutlined />, label: "تمت الموافقة" },
  Rejected: { color: "red", icon: <CloseCircleOutlined />, label: "مرفوض" },
};

export default function TopUpRequestHistory({
  requests,
  isLoading,
}: TopUpRequestHistoryProps) {
  const columns: ColumnsType<TopUpRequestDto> = [
    {
      title: "المبلغ",
      dataIndex: "amount",
      key: "amount",
      width: 130,
      render: (amount: number) => (
        <Text strong style={{ fontSize: 15 }}>${amount.toFixed(2)}</Text>
      ),
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      width: 140,
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
      title: "ملاحظات الإدارة",
      dataIndex: "adminNotes",
      key: "adminNotes",
      render: (notes: string) => notes || "-",
    },
    {
      title: "تمت الموافقة بواسطة",
      dataIndex: "approvedBy",
      key: "approvedBy",
      width: 160,
      render: (by: string) => by || "-",
    },
    {
      title: "التاريخ",
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
      pagination={{ pageSize: 5, showSizeChanger: true, showTotal: (total, range) => `${range[0]}-${range[1]} من أصل ${total}` }}
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="لا توجد طلبات شحن حتى الآن" /> }}
      scroll={{ x: 700 }}
      size="middle"
    />
  );
}
