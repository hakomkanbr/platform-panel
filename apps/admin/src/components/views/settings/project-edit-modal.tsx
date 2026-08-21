"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Space,
  Divider,
  Button,
  Image,
  Typography,
} from "antd";
import {
  FolderOpenOutlined,
  PictureOutlined,
  LinkOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ProjectDetailDto } from "@repo/shared-types";
import { useTranslations } from "@repo/localization";
import { ImagePicker, type CdnFile } from "@repo/media";

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
  const [logoPickerOpen, setLogoPickerOpen] = useState(false);
  const currentLogoUrl = Form.useWatch("logoUrl", form);

  useEffect(() => {
    if (!open || !project) return;
    const currentLogo = project.logoUrl || project.logo || "";
    form.setFieldsValue({
      name: project.name,
      description: project.description,
      logoUrl: currentLogo,
    });
  }, [open, project, form]);

  const handleClearLogo = () => {
    form.setFieldValue("logoUrl", "");
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit({
        name: values.name,
        description: values.description,
        logo: values.logoUrl ?? "",
      });
    } catch {
      // form validation error
    }
  };

  return (
    <>
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

          <div style={{ marginBottom: 12 }}>
            <span style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>
              <PictureOutlined style={{ marginRight: 6, color: "#F7931E" }} />
              {t("settings.logo")}
            </span>

            <Space direction="vertical" style={{ width: "100%" }} size={10}>
              <Form.Item name="logoUrl" style={{ marginBottom: 0 }}>
                <Input
                  size="large"
                  placeholder={t("settings.logoPlaceholder") || "https://..."}
                  prefix={<LinkOutlined style={{ color: "#9CA3AF" }} />}
                  allowClear
                />
              </Form.Item>

              <Space align="center" wrap>
                {currentLogoUrl && (
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid #E5E7EB",
                      background: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src={currentLogoUrl}
                      alt="Logo preview"
                      width={52}
                      height={52}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                )}

                <Button
                  type="dashed"
                  onClick={() => setLogoPickerOpen(true)}
                  icon={<PictureOutlined />}
                  style={{ borderRadius: 8 }}
                >
                  {currentLogoUrl
                    ? t("settings.changeLogo") || t("catalog.brands.changeLogo") || "تغيير من مكتبة الوسائط"
                    : t("settings.selectLogo") || t("catalog.brands.selectLogo") || "اختيار من مكتبة الوسائط"}
                </Button>

                {currentLogoUrl && (
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={handleClearLogo}
                  >
                    {t("settings.removeLogo")}
                  </Button>
                )}
              </Space>
            </Space>
          </div>
        </Form>
      </Modal>

      <ImagePicker
        open={logoPickerOpen}
        onClose={() => setLogoPickerOpen(false)}
        onChange={(files: CdnFile[]) => {
          if (files[0]?.url) {
            form.setFieldValue("logoUrl", files[0].url);
          }
          setLogoPickerOpen(false);
        }}
        multiple={false}
      />
    </>
  );
}