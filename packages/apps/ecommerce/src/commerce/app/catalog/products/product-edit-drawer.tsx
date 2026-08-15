"use client";

import React, { useEffect } from "react";
import { Button, Col, Form, Input, InputNumber, message, Row, Select, Switch } from "antd";
import { DrawerForm } from "@repo/ui";
import { useTranslations } from "@repo/localization";
import { useUpdateProduct } from "../../../hooks/useProducts";
import { getApiErrorMessage } from "../../../api/http";
import type { ProductDetail } from "../../../types/catalog";

export interface ProductEditDrawerProps {
  open: boolean;
  product: ProductDetail | null;
  onClose: () => void;
}

export const ProductEditDrawer: React.FC<ProductEditDrawerProps> = ({ open, product, onClose }) => {
  const t = useTranslations();
  const [form] = Form.useForm();
  const updateMutation = useUpdateProduct();

  useEffect(() => {
    if (open && product) {
      form.setFieldsValue({
        name: product.name,
        code: product.code,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        sku: product.sku,
        barcode: product.barcode,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        cost: product.cost,
        currency: product.currency,
        stock: product.stock,
        isTrackStock: product.isTrackStock,
        isVisible: product.isVisible,
        isFeatured: product.isFeatured,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
      });
    }
  }, [open, product, form]);

  const onFinish = async (values: Record<string, unknown>) => {
    if (!product) return;
    try {
      await updateMutation.mutateAsync({ id: product.id, body: values as never });
      message.success("Product updated");
      onClose();
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  return (
    <DrawerForm
      open={open}
      onClose={onClose}
      title={t("catalog.products.edit.title") || "Edit product"}
      description={product?.name}
      width={620}
      form={form}
      loading={updateMutation.isPending}
      onFinish={onFinish}
      submitLabel={t("common.actions.saveChanges") || "Save changes"}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name is required" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="code" label="Code">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="slug" label="Slug">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="shortDescription" label="Short description">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="sku" label="SKU">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="barcode" label="Barcode">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="price" label="Price">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="compareAtPrice" label="Compare-at price">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="cost" label="Cost">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="currency" label="Currency">
              <Select
                options={["USD", "EUR", "GBP", "AED", "SAR", "TRY"].map((c) => ({ value: c, label: c }))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="stock" label="Stock">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="isTrackStock" label="Track stock" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="isVisible" label="Visible" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="isFeatured" label="Featured" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="seoTitle" label="SEO title">
              <Input maxLength={70} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="seoDescription" label="SEO description">
              <Input.TextArea rows={3} maxLength={160} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </DrawerForm>
  );
};
