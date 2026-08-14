"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Space,
  Divider,
  Button,
  Segmented,
  Upload,
  Image,
  Typography,
} from "antd";
import {
  EditOutlined,
  FolderOpenOutlined,
  PictureOutlined,
  UploadOutlined,
  LinkOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ProjectDetailDto } from "@repo/shared-types";
import { useTranslations } from "@repo/localization";

const { Text } = Typography;

interface ProjectEditModalProps {
  open: boolean;
  project: ProjectDetailDto;
  onCancel: () => void;
  onSubmit: (values: { name: string; description?: string; logo: string }) => Promise<void>;
  submitting: boolean;
}

export default function ProjectEditModal({
  open,
  project,
  onCancel,
  onSubmit,
  submitting,
}: ProjectEditModalProps) {
  const t = useTranslations();
  const [form] = Form.useForm();
  const [logoSourceType, setLogoSourceType] = useState<"upload" | "url">("upload");
  const [logoPreview, setLogoPreview] = useState<string>("");

  useEffect(() => {
    if (!open || !project) return;
    const currentLogo = project.logoUrl || project.logo || "";
    setLogoPreview(currentLogo);
    setLogoSourceType(currentLogo.startsWith("data:") ? "upload" : "url");
    form.setFieldsValue({
      name: project.name,
      description: project.description,
      logoUrl: currentLogo.startsWith("data:") ? "" : currentLogo,
    });
  }, [open, project, form]);

  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return false;
    }
    if (file.size / 1024 / 1024 >= 2) {
      return false;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoPreview(result);
      form.setFieldValue("logoUrl", result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleClearLogo = () => {
    setLogoPreview("");
    form.setFieldValue("logoUrl", "");
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit({
        name: values.name,
        description: values.description,
        logo: logoPreview || values.logoUrl || "",
      });
    } catch {
      // form validation error
    }
  };

  return (
    <Modal
      title={
        <Space>
          <FolderOpenOutlined style={{ color: "#F7931E" }} />
          <span>{t("settings.editProject")}</span>
        </Space>
      }
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={submitting}
      okText={t("common.actions.saveChanges")}
      cancelText={t("common.actions.cancel")}
      width={580}
      style={{ top: 20 }}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Divider orientation="left" style={{ margin: "8px 0 16px" }}>
          <Space size={6}>
            <FolderOpenOutlined style={{ color: "#F7931E" }} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {t("settings.projectDetails")}
            </span>
          </Space>
        </Divider>

        <Form.Item
          name="name"
          label={t("settings.projectName")}
          rules={[{ required: true, message: t("common.fields.nameRequired") }]}
        >
          <Input size="large" placeholder={t("settings.projectName")} />
        </Form.Item>

        <Form.Item name="description" label={t("common.fields.description")}>
          <Input.TextArea
            rows={3}
            placeholder={t("settings.noDescriptionProvided")}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span style={{ fontWeight: 600 }}>
              <PictureOutlined style={{ marginRight: 6, color: "#F7931E" }} />
              {t("settings.logo")}
            </span>
            <Segmented
              size="small"
              value={logoSourceType}
              onChange={(val) => setLogoSourceType(val as "upload" | "url")}
              options={[
                { label: t("settings.uploadOption"), value: "upload", icon: <UploadOutlined /> },
                { label: t("settings.urlOption"), value: "url", icon: <LinkOutlined /> },
              ]}
            />
          </div>

          {logoSourceType === "upload" ? (
            <div
              style={{
                border: "1px dashed #D1D5DB",
                borderRadius: 10,
                padding: 16,
                textAlign: "center",
                background: "#F9FAFB",
              }}
            >
              <Upload accept="image/*" showUploadList={false} beforeUpload={handleLogoUpload}>
                <Button icon={<UploadOutlined />}>{t("settings.uploadLogo")}</Button>
              </Upload>
              <div style={{ marginTop: 6, fontSize: 12, color: "#9CA3AF" }}>
                PNG, JPG, SVG, WebP (Max 2MB)
              </div>
            </div>
          ) : (
            <Form.Item name="logoUrl" style={{ marginBottom: 0 }}>
              <Input
                size="large"
                placeholder={t("settings.logoPlaceholder")}
                prefix={<LinkOutlined style={{ color: "#9CA3AF" }} />}
                onChange={(e) => setLogoPreview(e.target.value)}
              />
            </Form.Item>
          )}

          {logoPreview && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 12,
                padding: 10,
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
              }}
            >
              <Space align="center" size={12}>
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  width={48}
                  height={48}
                  style={{ borderRadius: 6, objectFit: "contain", border: "1px solid #F3F4F6" }}
                />
                <Text strong style={{ fontSize: 13 }}>
                  {t("settings.logo")}
                </Text>
              </Space>
              <Button danger type="text" icon={<DeleteOutlined />} size="small" onClick={handleClearLogo}>
                {t("settings.removeLogo")}
              </Button>
            </div>
          )}
        </div>
      </Form>
    </Modal>
  );
}