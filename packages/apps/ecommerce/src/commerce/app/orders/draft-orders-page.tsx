"use client";

import React from "react";
import { Card, Typography, Space, Button } from "antd";
import { FileTextOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { CommerceShell } from "../../components/CommerceShell";

const { Title, Text } = Typography;

export function DraftOrdersPage() {
  const t = useTranslations();

  return (
    <CommerceShell
      title={t("orders.draftOrders.title")}
      description={t("orders.draftOrders.description")}
      breadcrumbs={[
        { title: t("orders.title"), href: "/admin/orders" },
        { title: t("orders.draftOrders.title") },
      ]}
      actions={
        <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 8 }}>
          {t("orders.draftOrders.createDraft")}
        </Button>
      }
    >
      <Card
        style={{
          borderRadius: 16,
          border: "1px solid var(--border-light)",
          textAlign: "center",
          padding: "60px 24px",
        }}
      >
        <Space direction="vertical" size={16} align="center">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#EFF6FF",
              color: "#3B82F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            <FileTextOutlined />
          </div>
          <Title level={4} style={{ margin: 0 }}>
            {t("orders.draftOrders.noDrafts")}
          </Title>
          <Text type="secondary" style={{ maxWidth: 450 }}>
            {t("orders.draftOrders.noDraftsDesc")}
          </Text>
        </Space>
      </Card>
    </CommerceShell>
  );
}
