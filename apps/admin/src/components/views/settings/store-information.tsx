"use client";

import React from "react";
import {
  Card,
  Descriptions,
  Typography,
  Space,
  Tag,
  Button,
  Image,
} from "antd";
import {
  ShopOutlined,
  EditOutlined,
  EnvironmentOutlined,
  WhatsAppOutlined,
  GlobalOutlined,
  DollarOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import type { ProjectDetailDto } from "@repo/shared-types";
import type { StoreDto } from "@/api/store-settings";
import { useTranslations } from "@repo/localization";

const { Text } = Typography;

interface StoreInformationProps {
  project: ProjectDetailDto;
  store?: StoreDto | null;
  onEdit: () => void;
}

export default function StoreInformation({
  project,
  store,
  onEdit,
}: StoreInformationProps) {
  const t = useTranslations();
  const settings = store?.settings;
  const whatsappEnabled = settings?.whatsAppOrdersEnabled ?? false;
  const phone = settings?.phone || settings?.whatsAppOrderNumber;
  const hasWhatsapp = whatsappEnabled && !!settings?.whatsAppOrderNumber;
  const currency = settings?.currencyCode
    ? `${settings.currencyCode}${settings.currencyCode === "USD" ? " ($)" : ""}`
    : "—";
  const logo = store?.logoUrl || project.logoUrl || project.logo;

  return (
    <Card
      title={
        <Space>
          <ShopOutlined style={{ color: "#F7931E" }} />
          <span>{t("settings.storeIdentity")}</span>
        </Space>
      }
      extra={
        <Button
          type="primary"
          ghost
          icon={<EditOutlined />}
          onClick={onEdit}
          style={{ borderRadius: 8, fontWeight: 600 }}
        >
          {t("settings.editDetails")}
        </Button>
      }
      style={{ borderRadius: 12, border: "1px solid #e2e8f0", height: "100%" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Store Logo block */}
        <div style={{ padding: 14, background: "#F8FAFC", borderRadius: 10 }}>
          <Space size={8} style={{ marginBottom: 8 }}>
            <PictureOutlined style={{ color: "#F7931E" }} />
            <Text strong style={{ fontSize: 13, color: "#334155" }}>
              {t("settings.logo") || "شعار المتجر"}
            </Text>
          </Space>
          <div>
            {logo ? (
              <Space align="center" size={14}>
                <Image
                  src={logo}
                  alt={project.name}
                  width={56}
                  height={56}
                  style={{
                    borderRadius: 10,
                    objectFit: "contain",
                    border: "1px solid #E2E8F0",
                    padding: 3,
                    background: "#FFFFFF",
                  }}
                />
                <Space direction="vertical" size={2}>
                  <Text strong style={{ fontSize: 13 }}>
                    {project.name}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12, wordBreak: "break-all" }}>
                    {logo.startsWith("data:")
                      ? t("settings.uploadOption") || "صورة مخصصة"
                      : logo.length > 35
                        ? `${logo.slice(0, 35)}...`
                        : logo}
                  </Text>
                </Space>
              </Space>
            ) : (
              <Space size={8}>
                <PictureOutlined style={{ color: "#9CA3AF", fontSize: 18 }} />
                <Text type="secondary">{t("settings.noLogo") || "لا يوجد شعار محدد"}</Text>
              </Space>
            )}
          </div>
        </div>

        {/* Address block */}
        <div style={{ padding: 14, background: "#F8FAFC", borderRadius: 10 }}>
          <Space size={8} style={{ marginBottom: 8 }}>
            <EnvironmentOutlined style={{ color: "#F7931E" }} />
            <Text strong style={{ fontSize: 13, color: "#334155" }}>
              {t("settings.storeAddress")}
            </Text>
          </Space>
          <Descriptions
            size="small"
            column={1}
            labelStyle={{ fontWeight: 500, width: 100, color: "#64748B" }}
          >
            <Descriptions.Item label={t("settings.country")}>
              <Text>{settings?.country || "—"}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={t("settings.city")}>
              <Text>{settings?.city || "—"}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={t("settings.streetAddress")}>
              <Text>{settings?.address || "—"}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={t("settings.postalCode")}>
              <Text code>{settings?.postalCode || "—"}</Text>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Contact block */}
        <div style={{ padding: 14, background: "#F8FAFC", borderRadius: 10 }}>
          <Space size={8} style={{ marginBottom: 8 }}>
            <GlobalOutlined style={{ color: "#F7931E" }} />
            <Text strong style={{ fontSize: 13, color: "#334155" }}>
              {t("settings.contactInfo")}
            </Text>
          </Space>
          <Descriptions
            size="small"
            column={1}
            labelStyle={{ fontWeight: 500, width: 100, color: "#64748B" }}
          >
            <Descriptions.Item label={t("settings.contactPhone")}>
              <Text style={{ direction: "ltr", unicodeBidi: "embed" }}>
                {phone || "—"}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label={t("settings.whatsappChannel")}>
              <Tag
                color={hasWhatsapp ? "green" : "default"}
                icon={hasWhatsapp ? <WhatsAppOutlined /> : undefined}
                style={{ borderRadius: 6 }}
              >
                {hasWhatsapp ? t("settings.whatsappActive") : t("settings.whatsappDisabled")}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t("settings.defaultCurrency")}>
              <Tag color="gold" icon={<DollarOutlined />} style={{ borderRadius: 6 }}>
                {currency}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Card>
  );
}