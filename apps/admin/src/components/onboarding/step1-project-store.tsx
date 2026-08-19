"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, Space, Alert, Card } from "antd";
import {
  FolderOutlined,
  ShopOutlined,
  LinkOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { getStoreUrl } from "@repo/utils";
import type { OnboardingFormData } from "./types";

const { Title, Text, Paragraph } = Typography;

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface Step1ProjectStoreProps {
  initialData: OnboardingFormData;
  onSubmit: (values: {
    projectName: string;
    storeName: string;
    storeSlug: string;
    projectDescription?: string;
  }) => Promise<void>;
  loading: boolean;
  error?: string | null;
}

export default function Step1ProjectStore({
  initialData,
  onSubmit,
  loading,
  error,
}: Step1ProjectStoreProps) {
  const t = useTranslations();
  const [form] = Form.useForm();
  const [slugPreview, setSlugPreview] = useState<string>(initialData.storeSlug || "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState<boolean>(
    !!initialData.storeSlug
  );

  useEffect(() => {
    form.setFieldsValue({
      projectName: initialData.projectName || "",
      storeName: initialData.storeName || initialData.projectName || "",
      storeSlug: initialData.storeSlug || "",
      projectDescription: initialData.projectDescription || "",
    });
    setSlugPreview(initialData.storeSlug || "");
  }, [initialData, form]);

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const currentStoreName = form.getFieldValue("storeName");

    if (!currentStoreName || currentStoreName === form.getFieldValue("projectName")) {
      form.setFieldsValue({ storeName: val });
    }

    if (!isSlugManuallyEdited) {
      const generated = generateSlug(val);
      form.setFieldsValue({ storeSlug: generated });
      setSlugPreview(generated);
    }
  };

  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isSlugManuallyEdited && !form.getFieldValue("projectName")) {
      const generated = generateSlug(val);
      form.setFieldsValue({ storeSlug: generated });
      setSlugPreview(generated);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    form.setFieldsValue({ storeSlug: cleaned });
    setSlugPreview(cleaned);
  };

  const handleFinish = async (values: any) => {
    await onSubmit({
      projectName: values.projectName,
      storeName: values.storeName || values.projectName,
      storeSlug: values.storeSlug,
      projectDescription: values.projectDescription,
    });
  };

  const publicUrl = slugPreview ? getStoreUrl(slugPreview) : "https://[your-store-slug]";

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
            background: "#FFF7ED",
            color: "#EA580C",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            marginBottom: 12,
          }}
        >
          <FolderOutlined />
        </div>
        <Title level={3} style={{ margin: 0, fontWeight: 800, color: "#0F172A" }}>
          {t("settings.onboarding.project.title")}
        </Title>
        <Text type="secondary" style={{ fontSize: 14, marginTop: 4, display: "block" }}>
          {t("settings.onboarding.project.desc")}
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
        <Form.Item
          name="projectName"
          label={
            <span style={{ fontWeight: 600 }}>
              {t("settings.onboarding.project.projectName")}
            </span>
          }
          rules={[
            {
              required: true,
              message: t("settings.onboarding.project.nameRequired"),
            },
          ]}
        >
          <Input
            prefix={<FolderOutlined style={{ color: "#94A3B8" }} />}
            placeholder={t("settings.onboarding.project.projectNamePlaceholder")}
            onChange={handleProjectNameChange}
            disabled={loading}
            style={{ borderRadius: 10 }}
          />
        </Form.Item>

        <Form.Item
          name="storeName"
          label={
            <span style={{ fontWeight: 600 }}>
              {t("settings.onboarding.project.storeName")}
            </span>
          }
          rules={[
            {
              required: true,
              message: t("settings.onboarding.project.storeNameRequired"),
            },
          ]}
        >
          <Input
            prefix={<ShopOutlined style={{ color: "#94A3B8" }} />}
            placeholder={t("settings.onboarding.project.storeNamePlaceholder")}
            onChange={handleStoreNameChange}
            disabled={loading}
            style={{ borderRadius: 10 }}
          />
        </Form.Item>

        <Form.Item
          name="storeSlug"
          label={
            <span style={{ fontWeight: 600 }}>
              {t("settings.onboarding.project.slug")}
            </span>
          }
          rules={[
            {
              required: true,
              message: t("settings.onboarding.project.slugRequired"),
            },
            {
              pattern: /^[a-z0-9-]+$/,
              message: t("settings.onboarding.project.slugInvalid"),
            },
          ]}
          help={
            <div style={{ marginTop: 6, fontSize: 12, color: "#64748B" }}>
              <span>{t("settings.onboarding.project.slugHelp")}</span>
              <Text code style={{ color: "#EA580C", fontWeight: 600, direction: "ltr" }}>
                {publicUrl}
              </Text>
            </div>
          }
        >
          <Input
            prefix={<LinkOutlined style={{ color: "#94A3B8" }} />}
            placeholder={t("settings.onboarding.project.slugPlaceholder")}
            onChange={handleSlugChange}
            disabled={loading}
            style={{ borderRadius: 10, direction: "ltr", textAlign: "left" }}
          />
        </Form.Item>

        <Form.Item
          name="projectDescription"
          label={
            <span style={{ fontWeight: 600 }}>
              {t("settings.onboarding.project.description")}
            </span>
          }
        >
          <Input.TextArea
            rows={3}
            placeholder={t("settings.onboarding.project.descriptionPlaceholder")}
            disabled={loading}
            style={{ borderRadius: 10 }}
          />
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
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
              <span>{t("settings.onboarding.buttons.createAndContinue")}</span>
              <ArrowRightOutlined />
            </Space>
          </Button>
        </div>
      </Form>
    </Card>
  );
}
