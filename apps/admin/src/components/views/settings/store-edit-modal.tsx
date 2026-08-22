"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Space,
  Divider,
  Row,
  Col,
  Switch,
  Button,
  Image,
  Typography,
} from "antd";
import {
  ShopOutlined,
  EnvironmentOutlined,
  WhatsAppOutlined,
  GlobalOutlined,
  PictureOutlined,
  LinkOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { ProjectDetailDto } from "@repo/shared-types";
import type { StoreDto } from "@/api/store-settings";
import { useTranslations } from "@repo/localization";
import { ImagePicker, type CdnFile } from "@repo/media";

const { Text } = Typography;

export interface StoreInfoFormValues {
  whatsappPhone?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  logoUrl?: string;
  currency?: string;
}

interface StoreEditModalProps {
  open: boolean;
  project: ProjectDetailDto;
  store?: StoreDto | null;
  onCancel: () => void;
  onSubmit: (values: StoreInfoFormValues) => Promise<void>;
  submitting: boolean;
}

export default function StoreEditModal({
  open,
  project,
  store,
  onCancel,
  onSubmit,
  submitting,
}: StoreEditModalProps) {
  const t = useTranslations();
  const [form] = Form.useForm();
  const [whatsappEnabled, setWhatsappEnabled] = useState<boolean>(false);
  const [logoPickerOpen, setLogoPickerOpen] = useState<boolean>(false);
  const currentLogoUrl = Form.useWatch("logoUrl", form);
  const settings = store?.settings;

  useEffect(() => {
    if (!open || !project) return;
    const currentPhone = settings?.phone || settings?.whatsAppOrderNumber || "";
    const currentLogo = store?.logoUrl || project.logoUrl || project.logo || "";
    setWhatsappEnabled(settings?.whatsAppOrdersEnabled ?? false);
    form.setFieldsValue({
      whatsappPhone: settings?.whatsAppOrderNumber || currentPhone,
      phone: settings?.phone || currentPhone,
      address: settings?.address || "",
      city: settings?.city || "",
      country: settings?.country || "",
      postalCode: settings?.postalCode || "",
      logoUrl: currentLogo,
    });
  }, [open, project, store, settings, form]);

  const handleClearLogo = () => {
    form.setFieldValue("logoUrl", "");
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit({
        whatsappPhone: whatsappEnabled ? values.whatsappPhone || "" : "",
        phone: values.phone || values.whatsappPhone || "",
        address: values.address || "",
        city: values.city || "",
        country: values.country || "",
        postalCode: values.postalCode || "",
        logoUrl: values.logoUrl ?? "",
        currency: settings?.currencyCode || "USD",
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
            <ShopOutlined style={{ color: "#F7931E" }} />
            <span>{t("settings.editStoreInfo")}</span>
          </Space>
        }
        open={open}
        onCancel={onCancel}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText={t("common.actions.saveChanges")}
        cancelText={t("common.actions.cancel")}
        width={680}
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          {/* Section: Store Logo */}
          <Divider orientation="left" style={{ margin: "8px 0 16px" }}>
            <Space size={6}>
              <PictureOutlined style={{ color: "#F7931E" }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{t("settings.logo") || "Store Logo"}</span>
            </Space>
          </Divider>

          <div style={{ marginBottom: 16 }}>
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

          {/* Section: Store Address */}
          <Divider orientation="left" style={{ margin: "12px 0 16px" }}>
            <Space size={6}>
              <EnvironmentOutlined style={{ color: "#F7931E" }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{t("settings.storeAddress")}</span>
            </Space>
          </Divider>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="country" label={t("settings.country")}>
                <Input
                  size="large"
                  placeholder={t("settings.countryPlaceholder")}
                  prefix={<GlobalOutlined style={{ color: "#9CA3AF" }} />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="city" label={t("settings.city")}>
                <Input size="large" placeholder={t("settings.cityPlaceholder")} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={16}>
              <Form.Item name="address" label={t("settings.streetAddress")}>
                <Input size="large" placeholder={t("settings.streetAddressPlaceholder")} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="postalCode" label={t("settings.postalCode")}>
                <Input size="large" placeholder={t("settings.postalCodePlaceholder")} />
              </Form.Item>
            </Col>
          </Row>

          {/* Section: Store Contact */}
          <Divider orientation="left" style={{ margin: "16px 0" }}>
            <Space size={6}>
              <GlobalOutlined style={{ color: "#F7931E" }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{t("settings.contactInfo")}</span>
            </Space>
          </Divider>

          <Form.Item name="phone" label={t("settings.contactPhone")}>
            <Input
              size="large"
              placeholder={t("settings.phonePlaceholder")}
              style={{ direction: "ltr", textAlign: "left" }}
            />
          </Form.Item>

          {/* Section: Direct WhatsApp Ordering */}
          <Divider orientation="left" style={{ margin: "16px 0" }}>
            <Space size={6}>
              <WhatsAppOutlined style={{ color: "#25D366" }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{t("settings.whatsappChannel")}</span>
            </Space>
          </Divider>

          <div
            style={{
              padding: 16,
              background: whatsappEnabled ? "#F0FDF4" : "#F8FAFC",
              borderRadius: 10,
              border: `1px solid ${whatsappEnabled ? "#DCFCE7" : "#E2E8F0"}`,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div>
                <Text strong style={{ fontSize: 14, display: "block" }}>
                  {t("settings.enableWhatsappOrders")}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t("settings.whatsappChannelDesc")}
                </Text>
              </div>
              <Switch
                checked={whatsappEnabled}
                onChange={(val) => setWhatsappEnabled(val)}
                checkedChildren={<CheckCircleOutlined />}
              />
            </div>

            {whatsappEnabled && (
              <Form.Item
                name="whatsappPhone"
                label={t("settings.whatsappNumber")}
                rules={[
                  {
                    required: whatsappEnabled,
                    message: t("settings.whatsappNumberRequired"),
                  },
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input
                  size="large"
                  placeholder={t("settings.whatsappNumberPlaceholder")}
                  prefix={<WhatsAppOutlined style={{ color: "#25D366" }} />}
                  style={{ direction: "ltr", textAlign: "left" }}
                />
              </Form.Item>
            )}
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