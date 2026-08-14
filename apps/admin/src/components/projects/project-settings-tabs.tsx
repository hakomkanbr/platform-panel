"use client";

import React, { useState } from "react";
import {
  Tabs,
  Typography,
  Space,
  Card,
  Button,
  Tag,
  Row,
  Col,
  Descriptions,
  message,
  Tooltip,
  Alert,
} from "antd";
import {
  ShopOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
  KeyOutlined,
  TranslationOutlined,
  WhatsAppOutlined,
  PictureOutlined,
  ExportOutlined,
  CopyOutlined,
  EditOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { getStoreUrl } from "@repo/utils";
import type { ProjectDetailDto } from "@repo/shared-types";
import { Image } from "antd";
import EcommerceTab from "@/components/views/settings/tabs/ecommerce-tab";
import ApiKeysTab from "@/components/views/settings/tabs/api-keys-tab";
import LanguagesTab from "@/components/views/settings/tabs/languages-tab";

const { Title, Text, Paragraph } = Typography;

interface ProjectSettingsTabsProps {
  project: ProjectDetailDto;
  onOpenEditModal?: () => void;
}

/**
 * 1. Profile & Identity Tab
 */
function StoreProfileTab({
  project,
  onOpenEditModal,
}: {
  project: ProjectDetailDto;
  onOpenEditModal?: () => void;
}) {
  const t = useTranslations();
  const logo = project.logoUrl || project.logo;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "4px 0" }}>
      {/* Informational Alert */}
      <Alert
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        message={t("settings.storeIdentity")}
        description={t("settings.storeIdentityDesc")}
        style={{
          borderRadius: 10,
          background: "#F0FDF4",
          borderColor: "#DCFCE7",
          color: "#166534",
        }}
      />

      {/* Storefront URL Preview Card */}
      {project.slug && (
        <Card
          bordered={false}
          style={{
            background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
            border: "1px solid #FED7AA",
            borderRadius: 12,
            boxShadow: "0 2px 6px rgba(247, 147, 30, 0.08)",
          }}
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
            <Space align="center" size={14}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "#F7931E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: 24,
                  boxShadow: "0 3px 8px rgba(247, 147, 30, 0.35)",
                }}
              >
                <ShopOutlined />
              </div>
              <div>
                <Text
                  strong
                  style={{
                    fontSize: 15,
                    color: "#9A3412",
                    display: "block",
                    marginBottom: 2,
                  }}
                >
                  {t("settings.storeUrl")}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#C2410C",
                    fontWeight: 600,
                    wordBreak: "break-all",
                  }}
                >
                  {getStoreUrl(project.slug)}
                </Text>
              </div>
            </Space>

            <Space size={10}>
              <Button
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(getStoreUrl(project.slug));
                  message.success(t("settings.storeCopied"));
                }}
                style={{ borderRadius: 8, fontWeight: 500 }}
              >
                {t("settings.copyStoreUrl")}
              </Button>
              <Button
                type="primary"
                icon={<ExportOutlined />}
                onClick={() => window.open(getStoreUrl(project.slug), "_blank")}
                style={{
                  borderRadius: 8,
                  background: "#F7931E",
                  borderColor: "#F7931E",
                  fontWeight: 600,
                }}
              >
                {t("settings.visitStore")}
              </Button>
            </Space>
          </div>
        </Card>
      )}

      {/* Basic Identity Details */}
      <Card
        title={
          <Space>
            <ShopOutlined style={{ color: "#F7931E" }} />
            <span>{t("settings.general.projectInfo")}</span>
          </Space>
        }
        extra={
          onOpenEditModal && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={onOpenEditModal}
              style={{ fontWeight: 600 }}
            >
              {t("settings.editDetails")}
            </Button>
          )
        }
        style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
      >
        <Descriptions
          bordered
          column={{ xs: 1, sm: 2, md: 2 }}
          size="middle"
          labelStyle={{ fontWeight: 600, width: 160, background: "#F8FAFC" }}
        >
          <Descriptions.Item label={t("settings.projectName")}>
            <Text strong>{project.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={t("common.fields.slug")}>
            <Tag color="blue" style={{ fontSize: 13, borderRadius: 6 }}>
              {project.slug}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t("settings.logo")}>
            {logo ? (
              <Space align="center" size={12}>
                <Image
                  src={logo}
                  alt={project.name}
                  width={44}
                  height={44}
                  style={{
                    borderRadius: 8,
                    objectFit: "contain",
                    border: "1px solid #e2e8f0",
                    padding: 2,
                    background: "#FFFFFF",
                  }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {logo.startsWith("data:")
                    ? t("settings.uploadOption")
                    : logo.length > 30
                    ? `${logo.slice(0, 30)}...`
                    : logo}
                </Text>
              </Space>
            ) : (
              <Space>
                <PictureOutlined style={{ color: "#9CA3AF" }} />
                <Text type="secondary">{t("settings.noLogo")}</Text>
              </Space>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t("common.fields.status")}>
            <Tag color="green" icon={<CheckCircleOutlined />} style={{ borderRadius: 6 }}>
              {t("settings.statusActive")}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t("common.fields.description")} span={2}>
            <Paragraph style={{ margin: 0, color: "#475569" }}>
              {project.description || t("settings.noDescription")}
            </Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}

/**
 * 2. Store Address & Contact Tab (module.store)
 */
function StoreAddressTab({
  project,
  onOpenEditModal,
}: {
  project: ProjectDetailDto;
  onOpenEditModal?: () => void;
}) {
  const t = useTranslations();
  const phone = project.whatsappPhone || project.phone;
  const hasWhatsapp = !!project.whatsappPhone;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "4px 0" }}>
      {/* Header Helper */}
      <Alert
        type="info"
        showIcon
        icon={<EnvironmentOutlined />}
        message={t("settings.storeAddress")}
        description={t("settings.storeAddressDesc")}
        style={{
          borderRadius: 10,
          background: "#F8FAFC",
          borderColor: "#E2E8F0",
        }}
      />

      <Row gutter={[20, 20]}>
        {/* Physical Address Card */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <EnvironmentOutlined style={{ color: "#F7931E" }} />
                <span>{t("settings.storeAddress")}</span>
              </Space>
            }
            extra={
              onOpenEditModal && (
                <Button type="link" icon={<EditOutlined />} onClick={onOpenEditModal}>
                  {t("settings.editDetails")}
                </Button>
              )
            }
            style={{ borderRadius: 12, border: "1px solid #e2e8f0", height: "100%" }}
          >
            <Descriptions
              bordered
              column={1}
              size="middle"
              labelStyle={{ fontWeight: 600, width: 140, background: "#F8FAFC" }}
            >
              <Descriptions.Item label={t("settings.country")}>
                <Text strong>{project.country || t("settings.countryPlaceholder")}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t("settings.city")}>
                <Text>{project.city || "—"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t("settings.streetAddress")}>
                <Text>{project.address || "—"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t("settings.postalCode")}>
                <Text code>{project.postalCode || "—"}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* WhatsApp Direct Ordering & Contact Card */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <WhatsAppOutlined style={{ color: "#25D366", fontSize: 18 }} />
                <span>{t("settings.whatsappChannel")}</span>
              </Space>
            }
            extra={
              <Tag color={hasWhatsapp ? "green" : "default"} style={{ borderRadius: 6 }}>
                {hasWhatsapp ? t("settings.whatsappActive") : t("settings.whatsappDisabled")}
              </Tag>
            }
            style={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              height: "100%",
              background: hasWhatsapp ? "#F0FDF4" : "#FAFAFA",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Paragraph style={{ margin: 0, color: "#4B5563", fontSize: 13 }}>
                {t("settings.whatsappChannelDesc")}
              </Paragraph>

              <div
                style={{
                  padding: 16,
                  borderRadius: 10,
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                }}
              >
                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 6 }}>
                  {t("settings.whatsappNumber")}
                </Text>
                {phone ? (
                  <Space align="center" size={10}>
                    <WhatsAppOutlined style={{ color: "#25D366", fontSize: 22 }} />
                    <Text
                      strong
                      style={{
                        fontSize: 17,
                        color: "#111827",
                        direction: "ltr",
                        letterSpacing: 0.5,
                      }}
                    >
                      {phone}
                    </Text>
                    <Tooltip title="Test WhatsApp Chat">
                      <Button
                        size="small"
                        type="link"
                        icon={<ExportOutlined />}
                        onClick={() =>
                          window.open(`https://wa.me/${phone.replace(/[^0-9]/g, "")}`, "_blank")
                        }
                      />
                    </Tooltip>
                  </Space>
                ) : (
                  <Text type="secondary" italic>
                    {t("settings.noPhone")}
                  </Text>
                )}
                <Text
                  type="secondary"
                  style={{ fontSize: 11, display: "block", marginTop: 8, color: "#6B7280" }}
                >
                  {t("settings.whatsappOrderHelper")}
                </Text>
              </div>

              {onOpenEditModal && (
                <Button
                  icon={<EditOutlined />}
                  onClick={onOpenEditModal}
                  style={{ alignSelf: "flex-start", borderRadius: 8 }}
                >
                  {t("settings.editDetails")}
                </Button>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

/**
 * Main Project & Store Settings Tabs Component
 */
export default function ProjectSettingsTabs({
  project,
  onOpenEditModal,
}: ProjectSettingsTabsProps) {
  const t = useTranslations();
  const [activeKey, setActiveKey] = useState("profile");

  const items = [
    {
      key: "profile",
      label: (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <ShopOutlined />
          <bdi>{t("settings.tabs.profile")}</bdi>
        </span>
      ),
      children: <StoreProfileTab project={project} onOpenEditModal={onOpenEditModal} />,
    },
    {
      key: "address",
      label: (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <EnvironmentOutlined />
          <bdi>{t("settings.tabs.address")}</bdi>
        </span>
      ),
      children: <StoreAddressTab project={project} onOpenEditModal={onOpenEditModal} />,
    },
    {
      key: "ecommerce",
      label: (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <ShoppingOutlined />
          <bdi>{t("settings.tabs.ecommerce")}</bdi>
        </span>
      ),
      children: <EcommerceTab project={project} />,
    },
    {
      key: "api-keys",
      label: (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <KeyOutlined />
          <bdi>{t("settings.tabs.apiKeys")}</bdi>
        </span>
      ),
      children: <ApiKeysTab project={project} />,
    },
    {
      key: "languages",
      label: (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <TranslationOutlined />
          <bdi>{t("settings.tabs.languages")}</bdi>
        </span>
      ),
      children: <LanguagesTab project={project} />,
    },
  ];

  return (
    <Tabs
      activeKey={activeKey}
      onChange={setActiveKey}
      tabPosition="top"
      items={items}
      size="large"
      tabBarGutter={20}
      tabBarStyle={{
        marginBottom: 20,
        borderBottom: "2px solid #f1f5f9",
      }}
      animated={{ inkBar: true, tabPane: true }}
    />
  );
}
