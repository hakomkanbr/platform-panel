"use client";

import React from "react";
import {
  Drawer,
  Descriptions,
  Table,
  Space,
  Button,
  Select,
  Typography,
  Divider,
  Card,
  Avatar,
  message,
  Spin,
} from "antd";
import {
  PhoneOutlined,
  WhatsAppOutlined,
  PrinterOutlined,
  ShoppingOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { useOrderDetail, useUpdateOrderStatus } from "../../hooks/useOrders";
import { OrderStatusTag } from "./order-status-tag";
import { EnumOrderStatus } from "../../types/orders";

const { Title, Text } = Typography;

interface OrderDetailDrawerProps {
  orderId: string | null;
  open: boolean;
  onClose: () => void;
}

export function OrderDetailDrawer({ orderId, open, onClose }: OrderDetailDrawerProps) {
  const t = useTranslations();
  const { data: order, isLoading } = useOrderDetail(orderId);
  const updateStatus = useUpdateOrderStatus();

  if (!open) return null;

  const handleStatusChange = async (newStatus: EnumOrderStatus) => {
    if (!orderId) return;
    try {
      await updateStatus.mutateAsync({ id: orderId, status: newStatus });
      message.success(t("orders.detail.statusUpdated"));
    } catch (err: any) {
      message.error(err.message || "Failed to update status");
    }
  };

  const handleOpenWhatsApp = () => {
    if (!order) return;
    const phone = (
      order.customerPhone ||
      order.orderAddress?.recipientInformation?.phoneNumber ||
      order.orderAddress?.phoneNumber ||
      ""
    ).replace(/[^0-9]/g, "");
    if (!phone) {
      message.warning("No phone number available");
      return;
    }
    const customerName =
      order.customerName ||
      (order.orderAddress?.recipientInformation
        ? `${order.orderAddress.recipientInformation.firstName || ""} ${order.orderAddress.recipientInformation.lastName || ""}`.trim()
        : order.orderAddress?.fullName) ||
      "";
    const text = encodeURIComponent(
      `مرحبًا ${customerName}، نتواصل معك بخصوص طلبك #${order.code} من متجرنا.`,
    );
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  const customerName =
    order?.customerName ||
    (order?.orderAddress?.recipientInformation
      ? `${order.orderAddress.recipientInformation.firstName || ""} ${order.orderAddress.recipientInformation.lastName || ""}`.trim()
      : order?.orderAddress?.fullName) ||
    "—";

  const customerPhone =
    order?.customerPhone ||
    order?.orderAddress?.recipientInformation?.phoneNumber ||
    order?.orderAddress?.phoneNumber ||
    "—";

  const customerEmail =
    order?.customerEmail ||
    order?.orderAddress?.recipientInformation?.email;

  const addressCity =
    order?.orderAddress?.address?.city ||
    order?.orderAddress?.city ||
    "—";

  const addressState =
    order?.orderAddress?.address?.state ||
    order?.orderAddress?.state ||
    "";

  const addressDetails =
    order?.orderAddress?.address?.details ||
    order?.orderAddress?.addressLine1 ||
    "—";

  const paymentDisplay =
    order?.paymentMethod ||
    (order?.paymentType === 0
      ? "بطاقة بنكية / ائتمانية (Credit Card)"
      : order?.paymentType === 1
        ? "تحويل بنكي / EFT"
        : "الدفع عند الاستلام (COD)");

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={720}
      title={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Space>
            <ShoppingOutlined style={{ color: "#F7931E", fontSize: 18 }} />
            <span>
              {t("orders.detail.title")}: <strong style={{ color: "#1F2937" }}>{order?.code || orderId}</strong>
            </span>
          </Space>
          {order && <OrderStatusTag status={order.status} />}
        </div>
      }
      extra={
        <Space>
          <Button icon={<PrinterOutlined />} onClick={handlePrint} style={{ borderRadius: 8 }}>
            {t("orders.detail.printInvoice")}
          </Button>
          <Button
            type="primary"
            style={{
              borderRadius: 8,
              background: "#25D366",
              borderColor: "#25D366",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            icon={<WhatsAppOutlined />}
            onClick={handleOpenWhatsApp}
          >
            {t("orders.detail.whatsappChat")}
          </Button>
        </Space>
      }
    >
      {isLoading || !order ? (
        <div style={{ textAlign: "center", padding: 80 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          {/* Status Bar */}
          <Card
            size="small"
            style={{
              borderRadius: 12,
              border: "1px solid var(--border-light)",
              background: "#FAFBFC",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                  {t("orders.table.status")}
                </Text>
                <OrderStatusTag status={order.status} style={{ marginTop: 4 }} />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: 500 }}>
                  {t("orders.table.changeStatus")}:
                </Text>
                <Select
                  value={order.status}
                  onChange={handleStatusChange}
                  loading={updateStatus.isPending}
                  style={{ width: 200 }}
                  options={[
                    { value: EnumOrderStatus.AwaitingApproval, label: t("orders.status.AwaitingApproval") },
                    { value: EnumOrderStatus.AwaitingPayment, label: t("orders.status.AwaitingPayment") },
                    { value: EnumOrderStatus.PaymentPaid, label: t("orders.status.PaymentPaid") },
                    { value: EnumOrderStatus.Processing, label: t("orders.status.Processing") },
                    { value: EnumOrderStatus.InCargo, label: t("orders.status.InCargo") },
                    { value: EnumOrderStatus.Delivered, label: t("orders.status.Delivered") },
                    { value: EnumOrderStatus.Cancelled, label: t("orders.status.Cancelled") },
                  ]}
                />
              </div>
            </div>
          </Card>

          {/* Customer & Address Details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card
              size="small"
              title={
                <Space>
                  <PhoneOutlined style={{ color: "#F7931E" }} />
                  <span>{t("orders.detail.customerInfo")}</span>
                </Space>
              }
              style={{ borderRadius: 12, border: "1px solid var(--border-light)" }}
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label={t("orders.table.customer")}>
                  <Text strong>{customerName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={t("orders.table.phone")}>
                  <span dir="ltr">{customerPhone}</span>
                </Descriptions.Item>
                {customerEmail && (
                  <Descriptions.Item label="Email">
                    {customerEmail}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label={t("orders.table.payment")}>
                  {paymentDisplay}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card
              size="small"
              title={
                <Space>
                  <EnvironmentOutlined style={{ color: "#F7931E" }} />
                  <span>{t("orders.detail.shippingAddress")}</span>
                </Space>
              }
              style={{ borderRadius: 12, border: "1px solid var(--border-light)" }}
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="المدينة / المحافظة">
                  <Text strong>
                    {addressCity}{addressState ? ` - ${addressState}` : ""}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="العنوان">
                  {addressDetails}
                </Descriptions.Item>
                <Descriptions.Item label={t("orders.table.date")}>
                  <Space size={4}>
                    <CalendarOutlined style={{ color: "#9CA3AF" }} />
                    <span dir="ltr">{new Date(order.dateTime).toLocaleString()}</span>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>

          {/* Notes */}
          {order.note && (
            <Card
              size="small"
              title={t("orders.detail.notes")}
              style={{ borderRadius: 12, border: "1px solid var(--border-light)", background: "#FFFBEB" }}
            >
              <Text style={{ color: "#92400E" }}>{order.note}</Text>
            </Card>
          )}

          {/* Items Table */}
          <Card
            size="small"
            title={t("orders.detail.itemsTitle", { count: order.items?.length || 0 })}
            style={{ borderRadius: 12, border: "1px solid var(--border-light)" }}
          >
            <Table
              dataSource={order.items}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: "المنتج",
                  key: "product",
                  render: (_, item) => (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar
                        shape="square"
                        size={44}
                        src={item.image}
                        icon={<ShoppingOutlined />}
                        style={{ borderRadius: 8, background: "#F3F4F6", flexShrink: 0 }}
                      />
                      <div>
                        <Text strong style={{ fontSize: 13, display: "block" }}>
                          {item.productName}
                        </Text>
                        {item.variantName && (
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {item.variantName}
                          </Text>
                        )}
                        {item.options && item.options.length > 0 && (
                          <div style={{ fontSize: 11, color: "#6B7280" }}>
                            {item.options.map((o) => `${o.optionName}: ${o.valueName}`).join(" | ")}
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                },
                {
                  title: "سعر الوحدة",
                  dataIndex: "unitPrice",
                  key: "unitPrice",
                  align: "right",
                  render: (price: number, item) => (
                    <span dir="ltr">{price.toFixed(2)} {item.currency || order.currency}</span>
                  ),
                },
                {
                  title: "الكمية",
                  dataIndex: "quantity",
                  key: "quantity",
                  align: "center",
                  render: (qty: number) => <Text strong>{qty}</Text>,
                },
                {
                  title: "المجموع",
                  dataIndex: "totalPrice",
                  key: "totalPrice",
                  align: "right",
                  render: (total: number, item) => (
                    <Text strong dir="ltr" style={{ color: "var(--primary)" }}>
                      {total.toFixed(2)} {item.currency || order.currency}
                    </Text>
                  ),
                },
              ]}
            />

            {/* Financial Summary */}
            <div style={{ marginTop: 16, padding: "12px 16px", background: "#F9FAFB", borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                <Text type="secondary">{t("orders.detail.subtotal")}</Text>
                <span dir="ltr">{(order.subtotal ?? order.grandTotal).toFixed(2)} {order.currency}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                <Text type="secondary">{t("orders.detail.shipping")}</Text>
                <span>
                  {order.shippingFee && order.shippingFee > 0
                    ? `${order.shippingFee.toFixed(2)} ${order.currency}`
                    : t("orders.detail.freeShipping")}
                </span>
              </div>
              <Divider style={{ margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text strong style={{ fontSize: 15 }}>
                  {t("orders.detail.grandTotal")}
                </Text>
                <Title level={4} style={{ margin: 0, color: "#F7931E" }} dir="ltr">
                  {order.grandTotal.toFixed(2)} {order.currency}
                </Title>
              </div>
            </div>
          </Card>
        </Space>
      )}
    </Drawer>
  );
}
