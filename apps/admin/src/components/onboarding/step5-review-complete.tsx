"use client";

import React from "react";
import {
  Button,
  Typography,
  Space,
  Alert,
  Card,
  Row,
  Col,
  Tag,
  Descriptions,
} from "antd";
import {
  FolderOutlined,
  ShopOutlined,
  GlobalOutlined,
  DollarOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { getStoreUrl } from "@repo/utils";
import type { OnboardingFormData } from "./types";

const { Title, Text } = Typography;

interface Step5ReviewCompleteProps {
  formData: OnboardingFormData;
  onComplete: () => Promise<void>;
  onBack: () => void;
  loading: boolean;
  error?: string | null;
}

export default function Step5ReviewComplete({
  formData,
  onComplete,
  onBack,
  loading,
  error,
}: Step5ReviewCompleteProps) {
  const t = useTranslations();

  const storeUrl = formData.storeSlug
    ? getStoreUrl(formData.storeSlug)
    : "—";

  const fullAddress = [
    formData.address,
    formData.city,
    formData.country,
    formData.postalCode,
  ]
    .filter(Boolean)
    .join("، ");

  return (
    <Card
      styles={{ body: { padding: 32 } }}
      style={{
        borderRadius: 16,
        border: "1px solid #E2E8F0",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        background: "#FFFFFF",
      }}
    >
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
            color: "#EA580C",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            marginBottom: 12,
            boxShadow: "0 4px 12px rgba(234, 88, 12, 0.15)",
          }}
        >
          <RocketOutlined />
        </div>
        <Title level={3} style={{ margin: 0, fontWeight: 800, color: "#0F172A" }}>
          {t("settings.onboarding.review.title")}
        </Title>
        <Text type="secondary" style={{ fontSize: 14, marginTop: 4, display: "block" }}>
          {t("settings.onboarding.review.desc")}
        </Text>
      </div>

      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          style={{ marginBottom: 20, borderRadius: 8 }}
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Project & Store Identity Card */}
        <Col xs={24} md={12}>
          <Card
            type="inner"
            title={
              <Space>
                <FolderOutlined style={{ color: "#F7931E" }} />
                <span>{t("settings.onboarding.review.projectInfo")}</span>
              </Space>
            }
            extra={
              <Tag color="green" icon={<CheckCircleOutlined />}>
                {t("settings.onboarding.review.readyBadge")}
              </Tag>
            }
            style={{ borderRadius: 12, height: "100%" }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t("settings.onboarding.review.projectName")}>
                <Text strong>{formData.projectName || "—"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t("settings.onboarding.review.storeName")}>
                <Text>{formData.storeName || "—"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t("settings.onboarding.review.storeSlug")}>
                <Text code style={{ color: "#EA580C", direction: "ltr" }}>
                  {storeUrl}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Localization & Currency Card */}
        <Col xs={24} md={12}>
          <Card
            type="inner"
            title={
              <Space>
                <GlobalOutlined style={{ color: "#7C3AED" }} />
                <span>{t("settings.onboarding.review.localizationInfo")}</span>
              </Space>
            }
            style={{ borderRadius: 12, height: "100%" }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t("settings.onboarding.review.defaultLanguage")}>
                <Space>
                  <span style={{ fontSize: 18 }}>{formData.defaultLanguageFlag || "🇸🇦"}</span>
                  <Text strong>{formData.defaultLanguageNativeName || formData.defaultLanguageName || "العربية"}</Text>
                  <Tag color="purple">{formData.defaultLanguageCode?.toUpperCase() || "AR"}</Tag>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label={t("settings.onboarding.review.defaultCurrency")}>
                <Space>
                  <span style={{ fontSize: 18 }}>{formData.defaultCurrencyFlag || "🇸🇦"}</span>
                  <Text strong>{formData.defaultCurrencyName || "ريال سعودي"}</Text>
                  <Tag color="gold" style={{ fontWeight: 700 }}>
                    {formData.defaultCurrencyCode || "SAR"} ({formData.defaultCurrencySymbol || "﷼"})
                  </Tag>
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Contact & Location Card */}
        <Col xs={24} md={12}>
          <Card
            type="inner"
            title={
              <Space>
                <PhoneOutlined style={{ color: "#2563EB" }} />
                <span>{t("settings.onboarding.review.contactInfo")}</span>
              </Space>
            }
            style={{ borderRadius: 12, height: "100%" }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t("settings.onboarding.review.phone")}>
                <Text style={{ direction: "ltr", unicodeBidi: "embed" }}>
                  {formData.phone || t("settings.onboarding.review.missingField")}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={t("settings.onboarding.review.whatsapp")}>
                {formData.whatsAppOrdersEnabled ? (
                  <Tag color="green" icon={<WhatsAppOutlined />}>
                    {formData.whatsAppOrderNumber || "—"}
                  </Tag>
                ) : (
                  <Tag color="default">{t("settings.whatsappDisabled")}</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label={t("settings.onboarding.review.location")}>
                <Text>
                  {fullAddress || t("settings.onboarding.review.missingField")}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Marketplace Membership Card */}
        <Col xs={24} md={12}>
          <Card
            type="inner"
            title={
              <Space>
                <ShopOutlined style={{ color: "#F7931E" }} />
                <span>{t("settings.onboarding.review.marketplaceInfo")}</span>
              </Space>
            }
            style={{ borderRadius: 12, height: "100%" }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t("settings.onboarding.review.marketplaceMembership")}>
                {formData.isMarketplaceMember ? (
                  <Tag color="purple" style={{ borderRadius: 6, fontWeight: 600 }}>
                    {t("settings.onboarding.marketplace.statusSubscribed")}
                  </Tag>
                ) : (
                  <Tag color="default" style={{ borderRadius: 6 }}>
                    {t("settings.onboarding.marketplace.statusNotSubscribed")}
                  </Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label={t("settings.status")}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {formData.isMarketplaceMember
                    ? t("settings.onboarding.marketplace.cardDesc")
                    : t("settings.onboarding.marketplace.enableDesc")}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
        <Button
          onClick={onBack}
          disabled={loading}
          size="large"
          style={{ borderRadius: 10, minWidth: 120, fontWeight: 600, height: 46 }}
        >
          <Space>
            <ArrowLeftOutlined />
            <span>{t("settings.onboarding.buttons.back")}</span>
          </Space>
        </Button>

        <Button
          type="primary"
          onClick={onComplete}
          loading={loading}
          disabled={loading}
          size="large"
          style={{
            borderRadius: 10,
            minWidth: 220,
            fontWeight: 800,
            background: "linear-gradient(135deg, #F7931E 0%, #EA580C 100%)",
            borderColor: "#EA580C",
            height: 48,
            boxShadow: "0 6px 16px rgba(234, 88, 12, 0.25)",
            fontSize: 15,
          }}
        >
          <Space size={8}>
            <RocketOutlined />
            <span>
              {loading
                ? t("settings.onboarding.buttons.verifying")
                : t("settings.onboarding.buttons.completeSetup")}
            </span>
          </Space>
        </Button>
      </div>
    </Card>
  );
}

export { Step5ReviewComplete as Step6ReviewComplete };
