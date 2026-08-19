"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Space,
  Alert,
  Card,
  Row,
  Col,
  Switch,
  Divider,
} from "antd";
import {
  ShopOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import type { OnboardingFormData } from "./types";

const { Title, Text } = Typography;

interface Step2StoreInfoProps {
  initialData: OnboardingFormData;
  onSubmit: (values: {
    phone?: string;
    whatsAppOrdersEnabled: boolean;
    whatsAppOrderNumber?: string;
    country?: string;
    city?: string;
    address?: string;
    postalCode?: string;
  }) => Promise<void>;
  onBack: () => void;
  loading: boolean;
  error?: string | null;
}

export default function Step2StoreInfo({
  initialData,
  onSubmit,
  onBack,
  loading,
  error,
}: Step2StoreInfoProps) {
  const t = useTranslations();
  const [form] = Form.useForm();
  const [whatsappEnabled, setWhatsappEnabled] = useState<boolean>(
    initialData.whatsAppOrdersEnabled ?? false
  );

  useEffect(() => {
    setWhatsappEnabled(initialData.whatsAppOrdersEnabled ?? false);
    form.setFieldsValue({
      phone: initialData.phone || "",
      whatsAppOrderNumber:
        initialData.whatsAppOrderNumber || initialData.phone || "",
      country: initialData.country || "",
      city: initialData.city || "",
      address: initialData.address || "",
      postalCode: initialData.postalCode || "",
    });
  }, [initialData, form]);

  const handleFinish = async (values: any) => {
    await onSubmit({
      phone: values.phone,
      whatsAppOrdersEnabled: whatsappEnabled,
      whatsAppOrderNumber: whatsappEnabled ? values.whatsAppOrderNumber : "",
      country: values.country,
      city: values.city,
      address: values.address,
      postalCode: values.postalCode,
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
          {t("settings.onboarding.store.title")}
        </Title>
        <Text type="secondary" style={{ fontSize: 14, marginTop: 4, display: "block" }}>
          {t("settings.onboarding.store.desc")}
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

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark="optional"
        size="large"
      >
        {/* Section 1: Contact & WhatsApp */}
        <Divider orientation="left" style={{ margin: "16px 0 20px", color: "#475569" }}>
          <Space size={8}>
            <PhoneOutlined style={{ color: "#F7931E" }} />
            <span style={{ fontSize: 14, fontWeight: 700 }}>
              {t("settings.onboarding.store.contactSection")}
            </span>
          </Space>
        </Divider>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label={
                <span style={{ fontWeight: 600 }}>
                  {t("settings.onboarding.store.phone")}
                </span>
              }
            >
              <Input
                prefix={<PhoneOutlined style={{ color: "#94A3B8" }} />}
                placeholder={t("settings.onboarding.store.phonePlaceholder")}
                disabled={loading}
                style={{ borderRadius: 10, direction: "ltr", textAlign: "left" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <div
              style={{
                padding: "12px 16px",
                background: whatsappEnabled ? "#F0FDF4" : "#F8FAFC",
                borderRadius: 10,
                border: `1px solid ${whatsappEnabled ? "#BBF7D0" : "#E2E8F0"}`,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: whatsappEnabled ? 12 : 0,
                }}
              >
                <div>
                  <Text strong style={{ fontSize: 13, display: "block" }}>
                    <WhatsAppOutlined style={{ color: "#25D366", marginInlineEnd: 6 }} />
                    {t("settings.onboarding.store.enableWhatsapp")}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {t("settings.onboarding.store.enableWhatsappDesc")}
                  </Text>
                </div>
                <Switch
                  checked={whatsappEnabled}
                  onChange={(val) => setWhatsappEnabled(val)}
                  checkedChildren={<CheckCircleOutlined />}
                  disabled={loading}
                />
              </div>

              {whatsappEnabled && (
                <Form.Item
                  name="whatsAppOrderNumber"
                  label={
                    <span style={{ fontWeight: 600, fontSize: 12 }}>
                      {t("settings.onboarding.store.whatsappNumber")}
                    </span>
                  }
                  rules={[
                    {
                      required: whatsappEnabled,
                      message: t("settings.onboarding.store.whatsappNumberRequired"),
                    },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    prefix={<WhatsAppOutlined style={{ color: "#25D366" }} />}
                    placeholder={t("settings.onboarding.store.whatsappNumberPlaceholder")}
                    disabled={loading}
                    style={{ borderRadius: 8, direction: "ltr", textAlign: "left" }}
                  />
                </Form.Item>
              )}
            </div>
          </Col>
        </Row>

        {/* Section 2: Address */}
        <Divider orientation="left" style={{ margin: "20px 0", color: "#475569" }}>
          <Space size={8}>
            <EnvironmentOutlined style={{ color: "#F7931E" }} />
            <span style={{ fontSize: 14, fontWeight: 700 }}>
              {t("settings.onboarding.store.addressSection")}
            </span>
          </Space>
        </Divider>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="country"
              label={
                <span style={{ fontWeight: 600 }}>
                  {t("settings.onboarding.store.country")}
                </span>
              }
            >
              <Input
                prefix={<GlobalOutlined style={{ color: "#94A3B8" }} />}
                placeholder={t("settings.onboarding.store.countryPlaceholder")}
                disabled={loading}
                style={{ borderRadius: 10 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="city"
              label={
                <span style={{ fontWeight: 600 }}>
                  {t("settings.onboarding.store.city")}
                </span>
              }
            >
              <Input
                placeholder={t("settings.onboarding.store.cityPlaceholder")}
                disabled={loading}
                style={{ borderRadius: 10 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={16}>
            <Form.Item
              name="address"
              label={
                <span style={{ fontWeight: 600 }}>
                  {t("settings.onboarding.store.address")}
                </span>
              }
            >
              <Input
                placeholder={t("settings.onboarding.store.addressPlaceholder")}
                disabled={loading}
                style={{ borderRadius: 10 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="postalCode"
              label={
                <span style={{ fontWeight: 600 }}>
                  {t("settings.onboarding.store.postalCode")}
                </span>
              }
            >
              <Input
                placeholder={t("settings.onboarding.store.postalCodePlaceholder")}
                disabled={loading}
                style={{ borderRadius: 10, direction: "ltr", textAlign: "left" }}
              />
            </Form.Item>
          </Col>
        </Row>

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
            htmlType="submit"
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
      </Form>
    </Card>
  );
}
