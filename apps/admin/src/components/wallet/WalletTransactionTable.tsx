"use client";

import React from "react";
import { Table, Tag, Typography, Empty, Tooltip, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { WalletTransactionDto } from "@/types";
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface WalletTransactionTableProps {
  transactions: WalletTransactionDto[] | undefined;
  isLoading: boolean;
}

const sourceLabels: Record<string, { label: string; color: string }> = {
  refund: { label: "Refund", color: "green" },
  adjustment: { label: "Manual Adjustment", color: "blue" },
  payment: { label: "Payment", color: "orange" },
  subscription: { label: "Subscription", color: "purple" },
  cardpayment: { label: "Card Payment", color: "cyan" },
  topup: { label: "Top-Up", color: "geekblue" },
};

const statusConfig: Record<string, { color: string; label: string }> = {
  completed: { color: "green", label: "Completed" },
  pending: { color: "orange", label: "Pending" },
  failed: { color: "red", label: "Failed" },
};

export default function WalletTransactionTable({
  transactions,
  isLoading,
}: WalletTransactionTableProps) {
  const columns: ColumnsType<WalletTransactionDto> = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 80,
      render: (type: string) =>
        type === "credit" ? (
          <Tag icon={<ArrowUpOutlined />} color="green">Credit</Tag>
        ) : (
          <Tag icon={<ArrowDownOutlined />} color="red">Debit</Tag>
        ),
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      width: 150,
      render: (source: string) => {
        const config = sourceLabels[source] || { label: source, color: "default" };
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (_amount: number, record: WalletTransactionDto) => (
        <Text strong style={{ color: record.signedAmount >= 0 ? "#52c41a" : "#ff4d4f", fontSize: 15 }}>
          {record.signedAmount >= 0 ? "+" : "-"}${Math.abs(record.signedAmount).toFixed(2)}{" "}
          <Text style={{ fontSize: 12 }}>{record.currency}</Text>
        </Text>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (desc: string) => (
        <Tooltip title={desc}>
          <Text ellipsis={{ tooltip: desc }} style={{ maxWidth: 250, display: "inline-block" }}>
            {desc || "-"}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: string) => {
        const config = statusConfig[status] || { color: "default", label: status };
        return (
          <Tag color={config.color}>
            <Space size={4}>
              {status === "completed" && <InfoCircleOutlined />}
              {config.label}
            </Space>
          </Tag>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date: string) => (
        <Text type="secondary">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={transactions || []}
      rowKey="id"
      loading={isLoading}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No transactions yet" /> }}
      scroll={{ x: 800 }}
      size="middle"
    />
  );
}
