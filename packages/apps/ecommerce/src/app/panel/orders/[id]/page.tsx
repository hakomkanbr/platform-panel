"use client";
import React, { useState } from "react";
import { Card, Descriptions, Table, Tag, Typography, Space, Button, Spin, message, Divider, Row, Col, Select } from "antd";
import { ArrowLeftOutlined, ShoppingOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import { useOrderDetail } from "@/hooks/useOrders";
import { ordersApi } from "@/lib/api/orders";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const STATUS_MAP: Record<number, { color: string; label: string }> = {
  0: { color: "orange", label: "Pending" }, 1: { color: "gold", label: "Awaiting Payment" },
  2: { color: "blue", label: "Paid" }, 3: { color: "cyan", label: "In Cargo" },
  4: { color: "green", label: "Delivered" }, 5: { color: "red", label: "Cancelled" },
  6: { color: "purple", label: "Processing" }, 7: { color: "red", label: "Payment Failed" },
  8: { color: "default", label: "Refunded" }, 9: { color: "red", label: "Refund Failed" },
};

const statusOptions = Object.entries(STATUS_MAP).map(([k, v]) => ({ value: Number(k), label: v.label }));

const formatCurrency = (v: number) => `SAR ${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const pricingLabels: Record<number, string> = {
  0: "Subtotal", 1: "Tax", 2: "Shipping", 3: "Free Shipping",
  4: "Product Discount", 5: "Order Discount", 6: "EFT Discount", 7: "Coupon",
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const { order, loading } = useOrderDetail(id);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleStatusChange = async (status: number) => {
    setUpdatingStatus(true);
    try { await ordersApi.setStatus(id, status); message.success("Order status updated"); window.location.reload(); }
    catch { message.error("Failed to update status"); }
    finally { setUpdatingStatus(false); }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>;
  if (!order) return <div style={{ textAlign: "center", padding: 80, color: "var(--text-tertiary)" }}>Order not found</div>;

  const itemColumns = [
    { title: "Product", dataIndex: "title", key: "title" },
    { title: "Code", dataIndex: "code", key: "code", width: 100 },
    { title: "Qty", dataIndex: "quantity", key: "quantity", width: 60 },
    { title: "Price", dataIndex: "price", key: "price", width: 100, render: (v: number) => formatCurrency(v) },
    { title: "Options", dataIndex: "options", key: "options", width: 150, render: (opts: any[]) => opts?.map((o) => `${o.title}: ${o.value}`).join(", ") || "-" },
  ];

  const ri = order.orderAddress?.recipientInformation;
  const addr = order.orderAddress?.address;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/panel/orders")} />
        <div>
          <Title level={4} style={{ margin: 0 }}>Order {order.code}</Title>
        </div>
        <Tag color={STATUS_MAP[order.status]?.color}>{STATUS_MAP[order.status]?.label}</Tag>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Order Items" style={{ borderRadius: 12 }}>
            <Table dataSource={order.items} columns={itemColumns} rowKey="id" pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Pricing" style={{ borderRadius: 12 }}>
            {order.pricings?.map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <Text>{pricingLabels[p.type] || `Pricing #${p.type}`}</Text>
                <Text strong>{formatCurrency(p.ammount)}</Text>
              </div>
            ))}
            <Divider style={{ margin: "8px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Grand Total</Text>
              <Text strong style={{ color: "#6366f1", fontSize: 16 }}>{formatCurrency(order.grandTotal)}</Text>
            </div>
          </Card>

          <Card title="Update Status" style={{ borderRadius: 12, marginTop: 16 }}>
            <Space>
              <Select options={statusOptions} value={order.status} onChange={handleStatusChange} style={{ width: 180 }} loading={updatingStatus} />
              <Button icon={<CheckCircleOutlined />} type="primary" onClick={() => handleStatusChange(order.status)}>
                Apply
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title={<Space><ShoppingOutlined /> Shipping Address</Space>} style={{ borderRadius: 12 }}>
            {ri ? (
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Name">{ri.firstName} {ri.lastName}</Descriptions.Item>
                <Descriptions.Item label="Phone">{ri.phoneNumber}</Descriptions.Item>
                <Descriptions.Item label="Email">{ri.email}</Descriptions.Item>
                <Descriptions.Item label="Address">{addr?.details}, {addr?.city}, {addr?.state} {addr?.postalCode}</Descriptions.Item>
                <Descriptions.Item label="Tax">{ri.taxOffice} - {ri.taxNumber}</Descriptions.Item>
                <Descriptions.Item label="Company">{ri.unvan}</Descriptions.Item>
              </Descriptions>
            ) : <Text type="secondary">No address information</Text>}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Order Info" style={{ borderRadius: 12 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Code">{order.code}</Descriptions.Item>
              <Descriptions.Item label="Date">{dayjs(order.dateTime).format("YYYY-MM-DD HH:mm")}</Descriptions.Item>
              <Descriptions.Item label="Note">{order.note || "-"}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
