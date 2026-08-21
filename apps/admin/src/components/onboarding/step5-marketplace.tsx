"use client";

import React, { useState } from "react";
import {
  Button,
  Typography,
  Space,
  Alert,
  Card,
  Row,
  Col,
  Tag,
  Switch,
} from "antd";
import {
  ShopOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CheckCircleFilled,
  ThunderboltOutlined,
  AppstoreOutlined,
  ApiOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import type { OnboardingFormData } from "./types";

const { Title, Text, Paragraph } = Typography;

interface Step5MarketplaceProps {
  initialData: OnboardingFormData;
  onSubmit: (data: { isMarketplaceMember: boolean }) => Promise<void>;
  onBack: () => void;
  loading: boolean;
  error?: string | null;
}

export default function Step5Marketplace({
  initialData,
  onSubmit,
  onBack,
  loading,
  error,
}: Step5MarketplaceProps) {
  const t = useTranslations();
  const [isMember, setIsMember] = useState<boolean>(
    initialData.isMarketplaceMember ?? true
  );

  const handleContinue = async () => {
    await onSubmit({
      isMarketplaceMember: isMember,
    });
  };

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
      {/* Header */}
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "#EFF6FF",
            color: "#2563EB",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            marginBottom: 12,
          }}
        >
          <ShopOutlined />
        </div>
        <Title level={3} style={{ margin: 0, fontWeight: 800, color: "#0F172A" }}>
          {t("settings.onboarding.marketplace.title")}
        </Title>
        <Text type="secondary" style={{ fontSize: 14, marginTop: 4, display: "block" }}>
          {t("settings.onboarding.marketplace.desc")}
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

      {/* Main Interactive Option Card */}
      <div
        onClick={() => setIsMember(true)}
        style={{
          padding: "20px 24px",
          borderRadius: 14,
          border: `2px solid ${isMember ? "#2563EB" : "#E2E8F0"}`,
          background: isMember ? "#F8FAFC" : "#FFFFFF",
          cursor: "pointer",
          transition: "all 0.2s ease",
          marginBottom: 16,
          boxShadow: isMember
            ? "0 6px 18px rgba(37, 99, 235, 0.08)"
            : "0 1px 3px rgba(0,0,0,0.02)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <Space size={14} align="start">
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: isMember ? "#2563EB" : "#F1F5F9",
                color: isMember ? "#FFFFFF" : "#64748B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              <AppstoreOutlined />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Text strong style={{ fontSize: 16, color: "#0F172A" }}>
                  {t("settings.onboarding.marketplace.joinOption")}
                </Text>
                {isMember && (
                  <Tag color="purple" style={{ borderRadius: 6, fontWeight: 600, margin: 0 }}>
                    {t("settings.subscribed")}
                  </Tag>
                )}
              </div>
              <Paragraph
                type="secondary"
                style={{ fontSize: 13, margin: "4px 0 0 0", maxWidth: 580 }}
              >
                {t("settings.onboarding.marketplace.cardDesc")}
              </Paragraph>
            </div>
          </Space>

          <Switch
            checked={isMember}
            onChange={(checked) => setIsMember(checked)}
            style={{
              background: isMember ? "#2563EB" : undefined,
            }}
          />
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <Row gutter={[14, 14]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <div
            style={{
              padding: "16px",
              borderRadius: 12,
              border: "1px solid #F1F5F9",
              background: "#F8FAFC",
              height: "100%",
            }}
          >
            <Space size={10} style={{ marginBottom: 6 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "#EFF6FF",
                  color: "#2563EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                }}
              >
                <ThunderboltOutlined />
              </div>
              <Text strong style={{ fontSize: 13, color: "#1E293B" }}>
                {t("settings.onboarding.marketplace.benefit1Title")}
              </Text>
            </Space>
            <Text type="secondary" style={{ fontSize: 12, display: "block", lineHeight: 1.4 }}>
              {t("settings.onboarding.marketplace.benefit1Desc")}
            </Text>
          </div>
        </Col>

        <Col xs={24} md={8}>
          <div
            style={{
              padding: "16px",
              borderRadius: 12,
              border: "1px solid #F1F5F9",
              background: "#F8FAFC",
              height: "100%",
            }}
          >
            <Space size={10} style={{ marginBottom: 6 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "#ECFDF5",
                  color: "#059669",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                }}
              >
                <ApiOutlined />
              </div>
              <Text strong style={{ fontSize: 13, color: "#1E293B" }}>
                {t("settings.onboarding.marketplace.benefit2Title")}
              </Text>
            </Space>
            <Text type="secondary" style={{ fontSize: 12, display: "block", lineHeight: 1.4 }}>
              {t("settings.onboarding.marketplace.benefit2Desc")}
            </Text>
          </div>
        </Col>

        <Col xs={24} md={8}>
          <div
            style={{
              padding: "16px",
              borderRadius: 12,
              border: "1px solid #F1F5F9",
              background: "#F8FAFC",
              height: "100%",
            }}
          >
            <Space size={10} style={{ marginBottom: 6 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "#F5F3FF",
                  color: "#7C3AED",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                }}
              >
                <SafetyCertificateOutlined />
              </div>
              <Text strong style={{ fontSize: 13, color: "#1E293B" }}>
                {t("settings.onboarding.marketplace.benefit3Title")}
              </Text>
            </Space>
            <Text type="secondary" style={{ fontSize: 12, display: "block", lineHeight: 1.4 }}>
              {t("settings.onboarding.marketplace.benefit3Desc")}
            </Text>
          </div>
        </Col>
      </Row>

      {/* Alternative choice: Skip */}
      <div
        onClick={() => setIsMember(false)}
        style={{
          padding: "12px 18px",
          borderRadius: 10,
          border: `1px dashed ${!isMember ? "#94A3B8" : "#E2E8F0"}`,
          background: !isMember ? "#F8FAFC" : "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.2s ease",
          marginBottom: 8,
        }}
      >
        <Text type={!isMember ? undefined : "secondary"} strong={!isMember} style={{ fontSize: 13 }}>
          {t("settings.onboarding.marketplace.skipOption")}
        </Text>
        {!isMember && (
          <CheckCircleFilled style={{ color: "#64748B", fontSize: 16 }} />
        )}
      </div>

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
          onClick={handleContinue}
          loading={loading}
          disabled={loading}
          size="large"
          style={{
            borderRadius: 10,
            minWidth: 160,
            fontWeight: 700,
            background: "#F7931E",
            borderColor: "#F7931E",
            height: 46,
          }}
        >
          <Space>
            <span>{t("settings.onboarding.buttons.saveAndContinue")}</span>
            <ArrowRightOutlined />
          </Space>
        </Button>
      </div>
    </Card>
  );
}
