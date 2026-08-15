"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Switch,
  TreeSelect,
  Typography,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { CommerceShell } from "../../../components/CommerceShell";
import { MetadataFormList } from "../../../components/MetadataFormList";
import { enumOptions } from "../../../types/enums";
import { useCreateProduct } from "../../../hooks/useProducts";
import { useCategoryTree } from "../../../hooks/useCategories";
import { useBrands } from "../../../hooks/useBrands";
import { useTags } from "../../../hooks/useTags";
import { useCommerce } from "../../../context/CommerceContext";
import { useProjectLanguages } from "../../../hooks/useLanguages";
import { getApiErrorMessage } from "../../../api/http";
import type { CategoryReadModel } from "../../../types/catalog";

const { Text } = Typography;

interface CategoryTreeNode {
  title: string;
  value: string;
  children?: CategoryTreeNode[];
}

function toTreeData(categories: CategoryReadModel[]): CategoryTreeNode[] {
  const byId = new Map<string, CategoryReadModel>();
  const roots: CategoryReadModel[] = [];
  for (const c of categories ?? []) {
    byId.set(c.id, c);
    if (!c.parentId) roots.push(c);
  }
  const getName = (c: CategoryReadModel) =>
    c.translations[0]?.name ?? c.path.split("/").pop() ?? c.id;
  const build = (cat: CategoryReadModel): CategoryTreeNode => ({
    title: getName(cat),
    value: cat.id,
    children:
      categories
        .filter((c) => c.parentId === cat.id)
        .map(build) || undefined,
  });
  return roots.map(build);
}

export function ProductCreatePage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const createMutation = useCreateProduct();
  const [saving, setSaving] = useState(false);

  const { projectId } = useCommerce();
  const categories = useCategoryTree();
  const brands = useBrands({ page: 1, pageSize: 100 });
  const tags = useTags({ page: 1, pageSize: 100 });
  const { data: languages } = useProjectLanguages(projectId);

  const categoryTreeData = useMemo(
    () => (categories.data ? toTreeData(categories.data) : []),
    [categories.data],
  );

  const defaultLanguage = languages?.find((l) => l.isDefault) ?? languages?.[0];

  const [languageInitialized, setLanguageInitialized] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);

  useEffect(() => {
    if (defaultLanguage && !languageInitialized) {
      form.setFieldValue("languageId", defaultLanguage.id);
      setLanguageInitialized(true);
    }
    if (languages && !isFormReady) setIsFormReady(true);
  }, [defaultLanguage, form, languageInitialized, isFormReady, languages]);

  const onFinish = async (values: Record<string, unknown>) => {
    setSaving(true);
    const selectedLanguageId = (values.languageId as string) || defaultLanguage?.id;
    const selectedCulture =
      languages?.find((l) => l.id === selectedLanguageId)?.code ??
      (values.CultureCode as string) ??
      "en-US";
    try {
      const created = await createMutation.mutateAsync({
        name: values.name as string,
        code: (values.code as string) || undefined,
        slug: (values.slug as string) || undefined,
        description: (values.description as string) || undefined,
        shortDescription: (values.shortDescription as string) || undefined,
        type: values.type as number | undefined,
        structure: values.structure as number | undefined,
        sku: (values.sku as string) || undefined,
        barcode: (values.barcode as string) || undefined,
        cultureCode: selectedCulture,
        languageId: selectedLanguageId || "4f7d8a31-2d4e-4b9c-a8f6-9e1d73c5b4a2",
        brandId: (values.brandId as string) || undefined,
        categoryIds: (values.categoryIds as string[]) ?? [],
        tagIds: (values.tagIds as string[]) ?? [],
        price: values.price as number | undefined,
        compareAtPrice: values.compareAtPrice as number | undefined,
        cost: values.cost as number | undefined,
        currency: (values.currency as string) || undefined,
        stock: values.stock as number | undefined,
        isTrackStock: values.isTrackStock as boolean | undefined,
        isFeatured: values.isFeatured as boolean | undefined,
        isVisible: values.isVisible as boolean | undefined,
        seoTitle: (values.seoTitle as string) || undefined,
        seoDescription: (values.seoDescription as string) || undefined,
        metadata: (values.metadata as { key: string; value: string }[])?.filter(
          (m) => m.key.trim(),
        ),
      });
      message.success("Product created");
      router.push(`/admin/catalog/products/${created.id}`);
    } catch (e) {
      message.error(getApiErrorMessage(e));
      setSaving(false);
    }
  };

  return (
    <CommerceShell
      title="New product"
      description="Add the essential details to create your product."
      breadcrumbs={[
        { title: "Catalog", href: "/admin/catalog" },
        { title: "Products", href: "/admin/catalog/products" },
        { title: "New product" },
      ]}
      actions={
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/admin/catalog/products")}>
          Back
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ currency: "USD", isTrackStock: true, isVisible: true }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              <Card title="General" style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}>
                <Row gutter={16}>
                  <Col xs={24}>
                    <Form.Item name="name" label="Product name" rules={[{ required: true, message: "Name is required" }]}>
                      <Input placeholder="e.g. Classic Cotton T-Shirt" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="code" label="Code">
                      <Input placeholder="Internal code" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="slug" label="Slug">
                      <Input placeholder="classic-cotton-tshirt" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item name="shortDescription" label="Short description">
                      <Input.TextArea rows={2} placeholder="One-line summary used in cards and lists" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item name="description" label="Description">
                      <Input.TextArea rows={5} placeholder="Full product description" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card title="Organization" style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="languageId" label="Language">
                      <Select
                        loading={!languages && projectId ? true : undefined}
                        placeholder="Select language"
                        options={(languages ?? []).map((l) => ({
                          value: l.id,
                          label: `${l.flag ?? ""} ${l.nativeName || l.name} (${l.code})`,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="type" label="Product type">
                      <Select allowClear placeholder="Select type" options={enumOptions("productType")} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="structure" label="Structure">
                      <Select allowClear placeholder="Select structure" options={enumOptions("productStructure")} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="brandId" label="Brand">
                      <Select
                        allowClear
                        showSearch
                        placeholder="Select brand"
                        optionFilterProp="label"
                        loading={brands.isLoading}
                        options={(brands.data?.data ?? []).map((b) => ({ value: b.id, label: b.name || b.translations?.[0]?.name || b.id }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="categoryIds" label="Categories">
                      <TreeSelect
                        multiple
                        treeCheckable
                        treeData={categoryTreeData}
                        placeholder="Select categories"
                        loading={categories.isLoading}
                        allowClear
                        treeDefaultExpandAll
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item name="tagIds" label="Tags">
                      <Select
                        mode="multiple"
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        loading={tags.isLoading}
                        placeholder="Select tags"
                        options={(tags.data?.data ?? []).map((t) => ({ value: t.id, label: t.name || t.translations?.[0]?.name || t.id }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card title="Pricing & inventory" style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}>
                <Row gutter={16}>
                  <Col xs={12} sm={6}>
                    <Form.Item name="price" label="Price">
                      <InputNumber min={0} style={{ width: "100%" }} placeholder="0.00" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Item name="compareAtPrice" label="Compare-at price">
                      <InputNumber min={0} style={{ width: "100%" }} placeholder="0.00" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Item name="cost" label="Cost">
                      <InputNumber min={0} style={{ width: "100%" }} placeholder="0.00" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Item name="currency" label="Currency">
                      <Select
                        options={["USD", "EUR", "GBP", "AED", "SAR", "TRY"].map((c) => ({ value: c, label: c }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Item name="sku" label="SKU">
                      <Input placeholder="Stock keeping unit" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Item name="barcode" label="Barcode">
                      <Input placeholder="GTIN / UPC" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Item name="stock" label="Stock quantity">
                      <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Item label="Track stock" name="isTrackStock" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card title="Visibility" style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}>
                <Space direction="vertical" size={12}>
                  <Form.Item name="isVisible" valuePropName="checked" style={{ marginBottom: 0 }}>
                    <Switch checkedChildren="Visible" unCheckedChildren="Hidden" />
                  </Form.Item>
                  <Form.Item name="isFeatured" valuePropName="checked" style={{ marginBottom: 0 }}>
                    <Switch checkedChildren="Featured" unCheckedChildren="Not featured" />
                  </Form.Item>
                </Space>
              </Card>
            </Space>
          </Col>

          <Col xs={24} lg={8}>
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              <Card title="SEO" style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}>
                <Form.Item name="seoTitle" label="Meta title">
                  <Input maxLength={70} showCount placeholder="Title tag" />
                </Form.Item>
                <Form.Item name="seoDescription" label="Meta description">
                  <Input.TextArea rows={3} maxLength={160} showCount placeholder="Meta description" />
                </Form.Item>
              </Card>

              <Card title="Custom fields" style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}>
                <Form.Item name="metadata" label="Metadata">
                  <MetadataFormList />
                </Form.Item>
              </Card>
            </Space>
          </Col>
        </Row>

        <div
          style={{
            position: "sticky",
            bottom: 0,
            marginTop: 24,
            padding: "12px 16px",
            background: "var(--bg-card, #fff)",
            borderRadius: 12,
            border: "1px solid var(--border-light)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <Button onClick={() => router.push("/admin/catalog/products")}>Cancel</Button>
          <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
            Create product
          </Button>
        </div>
      </Form>
    </CommerceShell>
  );
}
