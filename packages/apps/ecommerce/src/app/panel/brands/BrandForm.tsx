"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Typography, Space, message } from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useCreateBrand, useUpdateBrand } from "@/hooks/useBrands";
import { brandsApi } from "@/lib/api/brands";

const { Title } = Typography;

export default function BrandForm({ id }: { id?: number }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const isEdit = !!id;
  const { create, submitting: creating } = useCreateBrand();
  const { update, submitting: updating } = useUpdateBrand();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      brandsApi.list({ skip: 0, pageSize: 1 }).then((res) => {
        const brand = res.data.find((b: any) => b.id === id);
        if (brand) form.setFieldsValue({ name: brand.name, slug: brand.slug, description: brand.description, imageName: brand.imageName });
      }).finally(() => setLoading(false));
    }
  }, [id, isEdit, form]);

  const handleSubmit = async (values: any) => {
    try {
      if (isEdit && id) { await update({ ...values, id }); message.success("Brand updated"); }
      else { await create(values); message.success("Brand created"); }
      router.push("/panel/brands");
    } catch (e: any) { message.error(e?.message || "Failed to save brand"); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/panel/brands")} />
        <div>
          <Title level={4} style={{ margin: 0 }}>{isEdit ? "Edit Brand" : "New Brand"}</Title>
          <p style={{ color: "var(--text-secondary)", margin: "4px 0 0", fontSize: 14 }}>{isEdit ? "Update brand details" : "Create a new brand"}</p>
        </div>
      </div>
      <Card style={{ maxWidth: 600 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter a brand name" }]}>
            <Input placeholder="Brand name" />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true, message: "Please enter a slug" }]}>
            <Input placeholder="brand-slug" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Brand description" />
          </Form.Item>
          <Form.Item name="imageName" label="Image URL">
            <Input placeholder="https://example.com/image.png" />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={creating || updating}>
              {isEdit ? "Update" : "Create"}
            </Button>
            <Button onClick={() => router.push("/panel/brands")}>Cancel</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
