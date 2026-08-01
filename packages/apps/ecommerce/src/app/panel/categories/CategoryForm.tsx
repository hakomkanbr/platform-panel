"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Card, Typography, Space, message } from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useCategories, useCreateCategory, useUpdateCategory } from "@/hooks/useCategories";
import { categoriesApi } from "@/lib/api/categories";
import type { Category } from "@/types";

const { Title } = Typography;

export default function CategoryForm({ id }: { id?: number }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const isEdit = !!id;
  const { categories } = useCategories();
  const { create, submitting: creating } = useCreateCategory();
  const { update, submitting: updating } = useUpdateCategory();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      categoriesApi.list().then((all) => {
        const find = (cats: Category[]): Category | null => {
          for (const c of cats) {
            if (c.id === id) return c;
            if (c.children) { const found = find(c.children); if (found) return found; }
          }
          return null;
        };
        const cat = find(all);
        if (cat) form.setFieldsValue({ name: cat.name, slug: cat.slug, parentId: cat.parentId, description: cat.description, imageName: cat.imageName });
      }).finally(() => setLoading(false));
    }
  }, [id, isEdit, form]);

  const handleSubmit = async (values: any) => {
    try {
      if (isEdit && id) { await update({ ...values, id }); message.success("Category updated"); }
      else { await create(values); message.success("Category created"); }
      router.push("/panel/categories");
    } catch (e: any) { message.error(e?.message || "Failed to save category"); }
  };

  const parentOptions = categories.map((c) => ({ label: c.name, value: c.id }));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/panel/categories")} />
        <div>
          <Title level={4} style={{ margin: 0 }}>{isEdit ? "Edit Category" : "New Category"}</Title>
          <p style={{ color: "var(--text-secondary)", margin: "4px 0 0", fontSize: 14 }}>{isEdit ? "Update category details" : "Create a new category"}</p>
        </div>
      </div>
      <Card style={{ maxWidth: 600 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter a category name" }]}>
            <Input placeholder="Category name" />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true, message: "Please enter a slug" }]}>
            <Input placeholder="category-slug" />
          </Form.Item>
          <Form.Item name="parentId" label="Parent Category">
            <Select options={parentOptions} placeholder="None (top level)" allowClear />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Category description" />
          </Form.Item>
          <Form.Item name="imageName" label="Image URL">
            <Input placeholder="https://example.com/image.png" />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={creating || updating}>
              {isEdit ? "Update" : "Create"}
            </Button>
            <Button onClick={() => router.push("/panel/categories")}>Cancel</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
