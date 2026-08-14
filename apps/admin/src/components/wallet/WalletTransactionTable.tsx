"use client";

import React from "react";
import { Table, Tag, Typography, Empty, Tooltip, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { WalletTransactionDto } from "@repo/shared-types";
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface WalletTransactionTableProps {
  transactions: WalletTransactionDto[] | undefined;
  isLoading: boolean;
}

const sourceLabels: Record<string, { label: string; color: string }> = {
  refund: { label: "استرداد", color: "green" },
  adjustment: { label: "تعديل يدوي", color: "blue" },
  payment: { label: "عملية دفع", color: "orange" },
  subscription: { label: "اشتراك", color: "purple" },
  cardpayment: { label: "دفع بالبطاقة", color: "cyan" },
  topup: { label: "شحن رصيد", color: "geekblue" },
};

const statusConfig: Record<string, { color: string; label: string }> = {
  completed: { color: "green", label: "مكتمل" },
  pending: { color: "orange", label: "قيد المعالجة" },
  failed: { color: "red", label: "فشل" },
};

export default function WalletTransactionTable({
  transactions,
  isLoading,
}: WalletTransactionTableProps) {
  const columns: ColumnsType<WalletTransactionDto> = [
    {
      title: "النوع",
      dataIndex: "type",
      key: "type",
      width: 90,
      render: (type: string) =>
        type === "credit" ? (
          <Tag icon={<ArrowUpOutlined />} color="green">إيداع</Tag>
        ) : (
          <Tag icon={<ArrowDownOutlined />} color="red">خصم</Tag>
        ),
    },
    {
      title: "المصدر",
      dataIndex: "source",
      key: "source",
      width: 150,
      render: (source: string) => {
        const config = sourceLabels[source] || { label: source, color: "default" };
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "المبلغ",
      dataIndex: "amount",
      key: "amount",
      width: 130,
      render: (_amount: number, record: WalletTransactionDto) => (
        <Text strong style={{ color: record.signedAmount >= 0 ? "#52c41a" : "#ff4d4f", fontSize: 15 }}>
          {record.signedAmount >= 0 ? "+" : "-"}${Math.abs(record.signedAmount).toFixed(2)}{" "}
          <Text style={{ fontSize: 12 }}>{record.currency}</Text>
        </Text>
      ),
    },
    {
      title: "الوصف",
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
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      width: 120,
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
      title: "التاريخ",
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
      pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total, range) => `${range[0]}-${range[1]} من أصل ${total}` }}
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="لا توجد معاملات حتى الآن" /> }}
      scroll={{ x: 800 }}
      size="middle"
    />
  );
}
