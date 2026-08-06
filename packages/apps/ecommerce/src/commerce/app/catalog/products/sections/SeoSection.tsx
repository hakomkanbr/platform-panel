"use client";

import React, { useEffect, useState } from "react";
import { Form, Row, Col, Input, Card, Typography, Space, Progress } from "antd";
import { useTranslations } from "@repo/localization";
import { useProductWorkspace } from "../ProductWorkspaceContext";
import type { ProductDetail } from "../../../../types/catalog";
import { useUpdateProductTranslation } from "../../../../hooks/useProducts";
import { useProjectLanguages } from "../../../../hooks/useLanguages";
import { useCommerce } from "../../../../context/CommerceContext";

const { Text, Title } = Typography;

export function SeoSection({ product }: { product?: ProductDetail }) {
  const t = useTranslations();
  const [form] = Form.useForm();
  const { productId, markSectionDirty, registerSaveHandler } = useProductWorkspace();
  
  const { projectId } = useCommerce();
  const { data: languages } = useProjectLanguages(projectId);
  const updateTranslation = useUpdateProductTranslation(productId);

  const [titleScore, setTitleScore] = useState(0);
  const [descScore, setDescScore] = useState(0);
  
  const title = Form.useWatch("seoTitle", form) || "";
  const desc = Form.useWatch("seoDescription", form) || "";
  const slug = Form.useWatch("slug", form) || product?.slug || "product-url";

  useEffect(() => {
    // Basic Scoring Logic
    let ts = 0;
    if (title.length > 30 && title.length <= 60) ts = 100;
    else if (title.length > 0 && title.length <= 30) ts = 50;
    else if (title.length > 60) ts = 30;
    setTitleScore(ts);

    let ds = 0;
    if (desc.length > 120 && desc.length <= 160) ds = 100;
    else if (desc.length > 0 && desc.length <= 120) ds = 60;
    else if (desc.length > 160) ds = 40;
    setDescScore(ds);
  }, [title, desc]);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        seoTitle: product.translations?.[0]?.metaTitle || "",
        seoDescription: product.translations?.[0]?.metaDescription || "",
        slug: product.slug || ""
      });
    }
  }, [product, form]);

  useEffect(() => {
    registerSaveHandler("seo", async () => {
      const values = await form.validateFields();
      if (!productId) return;

      const languageId = product?.translations?.[0]?.languageId || languages?.[0]?.id || "00000000-0000-0000-0000-000000000001";
      
      // UpdateTranslation command takes all fields, we must preserve name/desc from product
      await updateTranslation.mutateAsync({
         languageId,
         name: product?.name || "",
         slug: values.slug || product?.slug || "",
         description: product?.translations?.[0]?.description,
         metaTitle: values.seoTitle,
         metaDescription: values.seoDescription,
         metaKeywords: product?.translations?.[0]?.metaKeywords,
      });
    });
  }, [registerSaveHandler, form, productId, product, updateTranslation.mutateAsync, languages]);

  return (
    <Card 
      title={t("catalog.products.create.seo") || "Search Engine Optimization (SEO)"}
      style={{ borderRadius: 16, border: "1px solid var(--border-light)", marginBottom: 24 }}
    >
      <Row gutter={32}>
        <Col xs={24} lg={12}>
          <Form
            form={form}
            layout="vertical"
            onValuesChange={() => markSectionDirty("seo")}
          >
            <Form.Item name="seoTitle" label={t("catalog.products.create.metaTitle") || "Meta Title"}>
              <Input maxLength={70} showCount placeholder={t("catalog.products.create.titleTag")} />
            </Form.Item>
            {title.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Title Quality</Text>
                <Progress percent={titleScore} showInfo={false} size="small" status={titleScore === 100 ? "success" : "normal"} />
                {titleScore === 30 && <Text type="danger" style={{ fontSize: 12 }}>Title is too long. Keep it under 60 characters.</Text>}
                {titleScore === 50 && <Text type="warning" style={{ fontSize: 12 }}>Title is a bit short. Add more keywords.</Text>}
              </div>
            )}
            
            <Form.Item name="slug" label={t("catalog.products.create.slug") || "URL Slug"} extra={t("catalog.products.create.helpers.slug") || "The last part of the product URL. Customers will see this in the browser."}>
              <Input placeholder={t("catalog.products.create.placeholderSlug")} />
            </Form.Item>
            
            <Form.Item name="seoDescription" label={t("catalog.products.create.metaDescription") || "Meta Description"} extra={t("catalog.products.create.helpers.seoTitle") || "A short summary displayed below the title on search engines."}>
              <Input.TextArea rows={3} maxLength={160} showCount placeholder={t("catalog.products.create.metaDescription")} />
            </Form.Item>
            {desc.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Description Quality</Text>
                <Progress percent={descScore} showInfo={false} size="small" status={descScore === 100 ? "success" : "normal"} />
                {descScore === 40 && <Text type="danger" style={{ fontSize: 12 }}>Description is too long. Keep it under 160 characters.</Text>}
              </div>
            )}
          </Form>
        </Col>

        {/* Live Preview */}
        <Col xs={24} lg={12}>
           <div style={{ padding: 20, background: '#f8f9fa', borderRadius: 8, border: '1px solid #e9ecef', marginTop: 30 }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontWeight: 500 }}>Live Google Preview</Text>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                 <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e0e0e0' }}></div>
                 <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ fontSize: 14, color: '#202124' }}>Your Store Name</Text>
                    <Text style={{ fontSize: 12, color: '#4d5156' }}>https://yourstore.com/products/{slug}</Text>
                 </div>
              </div>
              
              <h4 style={{ color: '#1a0dab', margin: '4px 0', fontSize: 20, fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {title || product?.name || "Product Title"}
              </h4>
              
              <Text style={{ color: '#4d5156', fontSize: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                 {desc || product?.translations?.[0]?.description?.replace(/<[^>]+>/g, '').substring(0, 160) || "Add a meta description to see how your product will appear in search results."}
              </Text>
           </div>
        </Col>
      </Row>
    </Card>
  );
}
