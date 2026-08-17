"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Table,
  Button,
  Space,
  Typography,
  Tooltip,
  Dropdown,
  Avatar,
  message,
} from "antd";
import {
  ShoppingOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  WhatsAppOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  DollarOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { CommerceShell } from "../../components/CommerceShell";
import { StatSkeleton } from "@repo/ui";
import { useOrders, useUpdateOrderStatus } from "../../hooks/useOrders";
import { OrderStatusTag } from "./order-status-tag";
import { OrderDetailDrawer } from "./order-detail-drawer";
import { EnumOrderStatus, type OrderSummaryDto } from "../../types/orders";

const { Title, Text } = Typography;

export function OrdersPage() {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EnumOrderStatus | undefined>();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: ordersData, isLoading, refetch, isFetching } = useOrders({
    page: 1,
    pageSize: 50,
    search: search || undefined,
    status: statusFilter,
  });

  const updateStatus = useUpdateOrderStatus();

  const orders = ordersData?.data || [];

  // KPIs
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(
      (o) =>
        o.status === EnumOrderStatus.AwaitingApproval ||
        o.status === EnumOrderStatus.AwaitingPayment,
    ).length;
    const processing = orders.filter(
      (o) =>
        o.status === EnumOrderStatus.Processing ||
        o.status === EnumOrderStatus.InCargo,
    ).length;
    const delivered = orders.filter(
      (o) => o.status === EnumOrderStatus.Delivered,
    ).length;
    const revenue = orders
      .filter((o) => o.status !== EnumOrderStatus.Cancelled)
      .reduce((sum, o) => sum + o.grandTotal, 0);

    return { total, pending, processing, delivered, revenue };
  }, [orders]);

  const handleOpenDetails = (id: string) => {
    setSelectedOrderId(id);
    setDrawerOpen(true);
  };

  const handleQuickStatus = async (id: string, status: EnumOrderStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      message.success(t("orders.detail.statusUpdated"));
    } catch (err: any) {
      message.error(err.message || "Failed to update status");
    }
  };

  const handleWhatsApp = (phone: string, code: string, customer: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (!cleanPhone) {
      message.warning("No phone number");
      return;
    }
    const text = encodeURIComponent(
      `مرحبًا ${customer}، نتواصل معك بخصوص طلبك #${code} من متجرنا.`,
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  const columns = [
    {
      title: t("orders.table.orderCode"),
      key: "code",
      render: (_: unknown, record: OrderSummaryDto) => (
        <Space direction="vertical" size={2}>
          <a
            onClick={() => handleOpenDetails(record.id)}
            style={{ fontWeight: 700, color: "#F7931E", fontSize: 13 }}
          >
            {record.code}
          </a>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {new Date(record.dateTime).toLocaleDateString()}
          </Text>
        </Space>
      ),
    },
    {
      title: t("orders.table.customer"),
      key: "customer",
      render: (_: unknown, record: OrderSummaryDto) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            style={{
              background: "linear-gradient(135deg, #F7931E 0%, #E67E00 100%)",
              fontSize: 12,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {record.customer?.charAt(0)?.toUpperCase() || "C"}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 13, display: "block" }}>
              {record.customer}
            </Text>
            <span dir="ltr" style={{ fontSize: 11, color: "#6B7280" }}>
              {record.phoneNumber}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: t("orders.table.total"),
      key: "total",
      align: "right" as const,
      render: (_: unknown, record: OrderSummaryDto) => (
        <div>
          <Text strong style={{ fontSize: 14, color: "#1F2937" }} dir="ltr">
            {record.grandTotal.toFixed(2)} {record.currency || "TRY"}
          </Text>
          {record.itemsCount && (
            <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
              {record.itemsCount} {t("orders.table.items")}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: t("orders.table.status"),
      key: "status",
      render: (_: unknown, record: OrderSummaryDto) => (
        <OrderStatusTag status={record.status} />
      ),
    },
    {
      title: t("orders.table.payment"),
      key: "paymentMethod",
      render: (_: unknown, record: OrderSummaryDto) => (
        <Text style={{ fontSize: 12, color: "#4B5563" }}>
          {record.paymentMethod || "الدفع عند الاستلام (COD)"}
        </Text>
      ),
    },
    {
      title: t("orders.table.actions"),
      key: "actions",
      align: "center" as const,
      render: (_: unknown, record: OrderSummaryDto) => (
        <Space size={6}>
          <Tooltip title={t("orders.table.viewDetails")}>
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleOpenDetails(record.id)}
              style={{ borderRadius: 6 }}
            />
          </Tooltip>

          {record.phoneNumber && (
            <Tooltip title={t("orders.detail.whatsappChat")}>
              <Button
                size="small"
                style={{
                  borderRadius: 6,
                  color: "#25D366",
                  borderColor: "#25D366",
                }}
                icon={<WhatsAppOutlined />}
                onClick={() =>
                  handleWhatsApp(record.phoneNumber, record.code, record.customer)
                }
              />
            </Tooltip>
          )}

          <Dropdown
            menu={{
              items: [
                {
                  key: "view",
                  label: t("orders.table.viewDetails"),
                  icon: <EyeOutlined />,
                  onClick: () => handleOpenDetails(record.id),
                },
                { type: "divider" },
                {
                  key: "approve",
                  label: t("orders.status.PaymentPaid"),
                  icon: <CheckCircleOutlined style={{ color: "#06b6d4" }} />,
                  onClick: () => handleQuickStatus(record.id, EnumOrderStatus.PaymentPaid),
                },
                {
                  key: "process",
                  label: t("orders.status.Processing"),
                  icon: <ClockCircleOutlined style={{ color: "#1890ff" }} />,
                  onClick: () => handleQuickStatus(record.id, EnumOrderStatus.Processing),
                },
                {
                  key: "cargo",
                  label: t("orders.status.InCargo"),
                  icon: <CarOutlined style={{ color: "#722ed1" }} />,
                  onClick: () => handleQuickStatus(record.id, EnumOrderStatus.InCargo),
                },
                {
                  key: "deliver",
                  label: t("orders.status.Delivered"),
                  icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
                  onClick: () => handleQuickStatus(record.id, EnumOrderStatus.Delivered),
                },
              ],
            }}
            trigger={["click"]}
          >
            <Button size="small" icon={<MoreOutlined />} style={{ borderRadius: 6 }} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <CommerceShell
      title={t("orders.title")}
      description={t("orders.description")}
      breadcrumbs={[{ title: t("orders.title") }]}
      actions={
        <Button
          icon={<ReloadOutlined spin={isFetching} />}
          onClick={() => refetch()}
          style={{ borderRadius: 8 }}
        >
          {t("orders.overview.refresh")}
        </Button>
      }
    >
      {/* KPI Cards */}
      {isLoading ? (
        <Row gutter={[20, 20]}>
          {[0, 1, 2, 3].map((i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <StatSkeleton />
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              label={t("orders.overview.totalOrders")}
              value={stats.total}
              icon={<ShoppingOutlined style={{ color: "#F7931E", fontSize: 22 }} />}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              label={t("orders.overview.pendingOrders")}
              value={stats.pending}
              icon={<ClockCircleOutlined style={{ color: "#fa8c16", fontSize: 22 }} />}
              subColor="#fa8c16"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              label={t("orders.overview.processingOrders")}
              value={stats.processing}
              icon={<CarOutlined style={{ color: "#1890ff", fontSize: 22 }} />}
              subColor="#1890ff"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              label={t("orders.overview.totalRevenue")}
              value={`${stats.revenue.toFixed(0)} TRY`}
              icon={<DollarOutlined style={{ color: "#52c41a", fontSize: 22 }} />}
              subColor="#52c41a"
            />
          </Col>
        </Row>
      )}

      {/* Filter & Search Bar */}
      <Card
        style={{
          borderRadius: 14,
          border: "1px solid var(--border-light)",
          marginTop: 20,
          marginBottom: 20,
        }}
        bodyStyle={{ padding: "16px 20px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <Space wrap size={12}>
            <Input
              placeholder={t("orders.overview.searchPlaceholder")}
              prefix={<SearchOutlined style={{ color: "#9CA3AF" }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 280, borderRadius: 8 }}
              allowClear
            />
            <Select
              placeholder={t("orders.overview.statusFilter")}
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
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
          </Space>

          <Text type="secondary" style={{ fontSize: 13 }}>
            {orders.length} {t("orders.title")}
          </Text>
        </div>
      </Card>

      {/* Table */}
      <Card
        style={{
          borderRadius: 14,
          border: "1px solid var(--border-light)",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 15, showSizeChanger: true }}
          locale={{
            emptyText: (
              <div style={{ padding: "48px 0", textAlign: "center" }}>
                <ShoppingOutlined style={{ fontSize: 40, color: "#D1D5DB" }} />
                <Title level={5} style={{ marginTop: 12, color: "#4B5563" }}>
                  {t("orders.table.noOrders")}
                </Title>
                <Text type="secondary">{t("orders.table.noOrdersDesc")}</Text>
              </div>
            ),
          }}
        />
      </Card>

      {/* Drawer */}
      <OrderDetailDrawer
        orderId={selectedOrderId}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedOrderId(null);
        }}
      />
    </CommerceShell>
  );
}

function KPICard({
  label,
  value,
  icon,
  subColor,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  subColor?: string;
}) {
  return (
    <Card
      style={{
        borderRadius: 14,
        border: "1px solid var(--border-light)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {label}
          </Text>
          <Title level={3} style={{ margin: "6px 0 0", fontSize: 26, color: subColor || "#1F2937" }}>
            {value}
          </Title>
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "#FAFBFC",
            border: "1px solid #F3F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
