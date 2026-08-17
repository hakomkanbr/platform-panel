"use client";

import React from "react";
import { Card, Typography, Space, Button } from "antd";
import { TeamOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { CommerceShell } from "../../components/CommerceShell";

const { Title, Text } = Typography;

export function CustomerGroupsPage() {
  const t = useTranslations();

  return (
    <CommerceShell
      title={t("customers.groups.title")}
      description={t("customers.groups.description")}
      breadcrumbs={[
        { title: t("customers.title"), href: "/admin/customers" },
        { title: t("customers.groups.title") },
      ]}
      actions={
        <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 8 }}>
          إضافة مجموعة
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
              background: "#F5F3FF",
              color: "#8B5CF6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            <TeamOutlined />
          </div>
          <Title level={4} style={{ margin: 0 }}>
            {t("customers.groups.noGroups")}
          </Title>
          <Text type="secondary" style={{ maxWidth: 450 }}>
            {t("customers.groups.noGroupsDesc")}
          </Text>
        </Space>
      </Card>
    </CommerceShell>
  );
}
