"use client";

import React from "react";
import { Card, Descriptions, Space, Switch, Tag, Typography, Alert } from "antd";
import { ShopOutlined, DollarOutlined, WhatsAppOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useSetMarketplaceMember, useTenantId } from "@repo/hooks";
import type { ProjectDetailDto } from "@repo/shared-types";
import type { StoreDto } from "@/api/store-settings";
import { useTranslations } from "@repo/localization";

const { Text } = Typography;

interface EcommerceTabProps {
  project: ProjectDetailDto;
  store?: StoreDto | null;
}

export default function EcommerceTab({ project, store }: EcommerceTabProps) {
  const t = useTranslations();
  const tenantId = useTenantId();
  const setMarketplaceMember = useSetMarketplaceMember();
  const settings = store?.settings;
  const hasWhatsapp =
    settings?.whatsAppOrdersEnabled && !!settings?.whatsAppOrderNumber;

  const handleToggleMarketplace = async (enabled: boolean) => {
    try {
      await setMarketplaceMember.mutateAsync({
        projectId: project.id,
        tenantId: tenantId || undefined,
        enabled,
      });
    } catch {
      // error handled in hook
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "4px 0" }}>
      <Alert
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        message={t("settings.tabs.ecommerce")}
        description={t("settings.tabDescriptions.ecommerce")}
        style={{ borderRadius: 10, background: "#F8FAFC", borderColor: "#E2E8F0" }}
      />

      {/* Marketplace Card */}
      <Card
        title={
          <Space>
            <ShopOutlined style={{ color: "#F7931E" }} />
            <span>{t("settings.marketplaceMembership")}</span>
          </Space>
        }
        style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ maxWidth: 650 }}>
            <Text strong style={{ fontSize: 15, display: "block", marginBottom: 4 }}>
              {t("settings.marketplaceMembership")}
            </Text>
            <Text type="secondary">{t("settings.marketplaceMembershipDesc")}</Text>
          </div>

          <Space size={12}>
            {project.isMarketplaceMember && (
              <Tag color="purple" style={{ borderRadius: 6, padding: "4px 10px" }}>
                {t("settings.subscribed")}
              </Tag>
            )}
            <Switch
              checked={project.isMarketplaceMember}
              onChange={handleToggleMarketplace}
              loading={setMarketplaceMember.isPending}
            />
          </Space>
        </div>
      </Card>

      {/* Currency & Trade Preferences */}
      <Card
        title={
          <Space>
            <DollarOutlined style={{ color: "#F7931E" }} />
            <span>{t("settings.currency")}</span>
          </Space>
        }
        style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
      >
        <Descriptions
          bordered
          column={{ xs: 1, sm: 2 }}
          size="middle"
          labelStyle={{ fontWeight: 600, width: 180, background: "#F8FAFC" }}
        >
          <Descriptions.Item label={t("settings.defaultCurrency")}>
            <Tag color="gold" style={{ fontSize: 13, borderRadius: 6, fontWeight: 600 }}>
              {settings?.currencyCode || "USD ($)"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t("settings.whatsappChannel")}>
            {hasWhatsapp ? (
              <Tag color="green" icon={<WhatsAppOutlined />} style={{ borderRadius: 6 }}>
                {t("settings.whatsappActive")}
              </Tag>
            ) : (
              <Tag color="default" style={{ borderRadius: 6 }}>
                {t("settings.whatsappDisabled")}
              </Tag>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}