"use client";

import React from "react";
import { Card, Typography, Space } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { CommerceShell } from "../../components/CommerceShell";

const { Title, Text } = Typography;

export function ReturnsPage() {
  const t = useTranslations();

  return (
    <CommerceShell
      title={t("orders.returns.title")}
      description={t("orders.returns.description")}
      breadcrumbs={[
        { title: t("orders.title"), href: "/admin/orders" },
        { title: t("orders.returns.title") },
      ]}
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
              background: "#FFF3E0",
              color: "#F7931E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            <RollbackOutlined />
          </div>
          <Title level={4} style={{ margin: 0 }}>
            {t("orders.returns.noReturns")}
          </Title>
          <Text type="secondary" style={{ maxWidth: 450 }}>
            {t("orders.returns.noReturnsDesc")}
          </Text>
        </Space>
      </Card>
    </CommerceShell>
  );
}
