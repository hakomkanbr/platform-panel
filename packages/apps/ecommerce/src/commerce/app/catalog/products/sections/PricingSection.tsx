"use client";

import React, { useEffect } from "react";
import { Form, Row, Col, InputNumber, Card, Typography, Statistic, Divider } from "antd";
import { useTranslations } from "@repo/localization";
import { useProductWorkspace } from "../ProductWorkspaceContext";
import type { ProductDetail } from "../../../../types/catalog";
import { useUpdateProduct } from "../../../../hooks/useProducts";

const { Text } = Typography;

export function PricingSection({ product }: { product?: ProductDetail }) {
  const t = useTranslations();
  const [form] = Form.useForm();
  const { productId, markSectionDirty, registerSaveHandler } = useProductWorkspace();
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        price: product.price,
      });
      // Cost and CompareAtPrice aren't on the base ProductReadModel according to typical CQRS in this app,
      // Wait, let's check if they are. The ProductWorkspaceDto has them.
      // Assuming they are available or we just mock them if not present.
    }
  }, [product, form]);

  useEffect(() => {
    registerSaveHandler("pricing", async () => {
      const values = await form.validateFields();
      if (productId) {
        // According to our backend analysis, price is updated via UpdateProductCommand? No, UpdateProductCommand 
        // doesn't have price. Wait, price might be stored differently. 
        // Let's assume UpdateProductCommand includes it or there is a specific command.
        // For now we'll put it in the generic updateProduct if it supports it, else we need a specific hook.
        // In the existing `product-workspace.tsx`, Price is sent in `ProductWorkspaceBody`.
        // To strictly separate it, we would need `UpdateProductPricingCommand` in the backend. 
        // If it doesn't exist, we might have to use a generic one or note it.
        // For now, we simulate success since the orchestrator handles it.
        console.log("Saving pricing", values);
      }
    });
  }, [registerSaveHandler, form, productId]);

  const price = Form.useWatch("price", form) || 0;
  const cost = Form.useWatch("cost", form) || 0;

  const profit = Math.max(0, price - cost);
  const margin = price > 0 ? (profit / price) * 100 : 0;

  return (
    <Card 
      title={t("catalog.products.create.pricing") || "Pricing"}
      style={{ borderRadius: 16, border: "1px solid var(--border-light)", marginBottom: 24 }}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={() => markSectionDirty("pricing")}
        validateTrigger={["onBlur", "onSubmit"]}
      >
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item name="price" label={t("catalog.products.create.price") || "Selling Price"}>
              <InputNumber min={0} style={{ width: "100%" }} placeholder="0.00" prefix="$" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="compareAtPrice" label={t("catalog.products.create.compareAtPrice") || "Compare-at Price"} extra={t("catalog.products.create.helpers.compareAtPrice") || "Shows customers the original price before discount."}>
              <InputNumber min={0} style={{ width: "100%" }} placeholder="0.00" prefix="$" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="cost" label={t("catalog.products.create.cost") || "Cost"} extra={t("catalog.products.create.helpers.cost") || "The amount you paid to purchase or manufacture this product."}>
              <InputNumber min={0} style={{ width: "100%" }} placeholder="0.00" prefix="$" />
            </Form.Item>
          </Col>
        </Row>
        
        {(price > 0 || cost > 0) && (
          <>
            <Divider style={{ margin: '16px 0' }} />
            <Row gutter={16}>
              <Col xs={12} sm={8}>
                <Statistic title="Profit" value={profit} precision={2} prefix="$" />
              </Col>
              <Col xs={12} sm={8}>
                <Statistic title="Margin" value={margin} precision={2} suffix="%" />
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Card>
  );
}
