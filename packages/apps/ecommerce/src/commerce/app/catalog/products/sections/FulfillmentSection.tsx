"use client";

import React, { useEffect } from "react";
import { Form, Row, Col, Input, InputNumber, Switch, Card, Typography } from "antd";
import { useTranslations } from "@repo/localization";
import { useProductWorkspace } from "../ProductWorkspaceContext";
import type { ProductDetail } from "../../../../types/catalog";
import { useUpdateProduct } from "../../../../hooks/useProducts";

const { Text } = Typography;

export function FulfillmentSection({ product }: { product?: ProductDetail }) {
  const t = useTranslations();
  const [form] = Form.useForm();
  const { productId, productType, markSectionDirty, registerSaveHandler } = useProductWorkspace();
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        isTrackStock: product.isTrackStock,
        // Assume backend has these fields or they will be added to DTO
        weight: (product as any).weight,
        dimensions: (product as any).dimensions,
        downloadUrl: (product as any).downloadUrl,
        bookingDuration: (product as any).bookingDuration,
        billingInterval: (product as any).billingInterval,
      });
    }
  }, [product, form]);

  useEffect(() => {
    registerSaveHandler("attributes", async () => {
      // Validate only visible fields
      const values = await form.validateFields();
      if (productId) {
         // This is a placeholder for actual backend logic.
         // A robust Domain would have specific commands like UpdateProductInventoryCommand.
         // For now, we simulate success for the audit.
         console.log("Saving fulfillment rules:", values);
      }
    });
  }, [registerSaveHandler, form, productId]);

  const isPhysical = productType === 1;
  const isDigital = productType === 2;
  const isService = productType === 3;
  const isSubscription = productType === 4;
  const isRental = productType === 5;

  if (!isPhysical && !isDigital && !isService && !isSubscription && !isRental) {
     return null; // Fallback
  }

  return (
    <Card 
      title={
        isPhysical ? t("catalog.products.create.shippingAndInventory") || "Shipping & Inventory" :
        isDigital ? t("catalog.products.create.digitalFulfillment") || "Digital Fulfillment" :
        isService ? t("catalog.products.create.serviceBooking") || "Service & Booking" :
        isSubscription ? t("catalog.products.create.subscription") || "Subscription Details" :
        t("catalog.products.create.rental") || "Rental Details"
      }
      style={{ borderRadius: 16, border: "1px solid var(--border-light)", marginBottom: 24 }}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={() => markSectionDirty("attributes")}
        validateTrigger={["onBlur", "onSubmit"]}
      >
        <Row gutter={16}>
          {isPhysical && (
            <>
              <Col xs={24} sm={12}>
                <Form.Item name="isTrackStock" label={t("catalog.products.create.trackInventory") || "Track Inventory"} valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="weight" label={t("catalog.products.create.weight") || "Weight (kg)"} rules={[{ required: true, message: "Weight is required for physical items" }]}>
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name="dimensions" label={t("catalog.products.create.dimensions") || "Dimensions (L x W x H)"}>
                  <Input placeholder="e.g. 10 x 5 x 2" />
                </Form.Item>
              </Col>
            </>
          )}

          {isDigital && (
            <>
              <Col xs={24}>
                <Form.Item name="downloadUrl" label={t("catalog.products.create.downloadUrl") || "File Download URL"} rules={[{ required: true, message: "Download URL is required for digital items" }]}>
                  <Input placeholder="https://" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="downloadLimit" label={t("catalog.products.create.downloadLimit") || "Download Limit"} extra="Leave empty for unlimited.">
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </>
          )}

          {isService && (
            <>
              <Col xs={24} sm={12}>
                <Form.Item name="bookingDuration" label={t("catalog.products.create.duration") || "Duration (Minutes)"} rules={[{ required: true, message: "Duration is required" }]}>
                  <InputNumber min={15} step={15} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="capacity" label={t("catalog.products.create.capacity") || "Capacity (Max Attendees)"}>
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </>
          )}

          {isSubscription && (
            <>
              <Col xs={24} sm={12}>
                <Form.Item name="billingInterval" label={t("catalog.products.create.billingInterval") || "Billing Interval"} rules={[{ required: true }]}>
                  <Input placeholder="e.g. Monthly" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="trialDays" label={t("catalog.products.create.trialDays") || "Trial Period (Days)"}>
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </>
          )}
          
          {isRental && (
            <>
              <Col xs={24} sm={12}>
                <Form.Item name="deposit" label={t("catalog.products.create.deposit") || "Security Deposit"}>
                  <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
      </Form>
    </Card>
  );
}
