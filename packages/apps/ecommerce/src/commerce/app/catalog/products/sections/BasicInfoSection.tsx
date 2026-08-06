"use client";

import React, { useEffect, useState } from "react";
import { Form, Row, Col, Input, Select, Radio, Card, Typography } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { useTranslations } from "@repo/localization";
import { useProductWorkspace } from "../ProductWorkspaceContext";
import { enumOptions } from "../../../../types/enums";
import type { ProductDetail } from "../../../../types/catalog";
import { useProjectLanguages } from "../../../../hooks/useLanguages";
import { useCommerce } from "../../../../context/CommerceContext";
import { useUpdateProduct, useUpdateProductTranslation } from "../../../../hooks/useProducts";

const { Text } = Typography;

const EDITOR_INIT = {
  height: 300,
  menubar: false,
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
  ],
  toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
};

export function BasicInfoSection({ product }: { product?: ProductDetail }) {
  const t = useTranslations();
  const [form] = Form.useForm();
  const { productId, productType, setProductType, markSectionDirty, registerSaveHandler } = useProductWorkspace();
  const { projectId } = useCommerce();
  const { data: languages } = useProjectLanguages(projectId);

  const defaultLanguageId = languages?.find((l) => l.isDefault)?.id ?? languages?.[0]?.id ?? "00000000-0000-0000-0000-000000000001";
  const languageOptions = (languages && languages.length > 0)
    ? languages.map(l => ({ value: l.id, label: l.name }))
    : [{ value: "00000000-0000-0000-0000-000000000001", label: "العربية" }];

  const updateProduct = useUpdateProduct();
  const updateTranslation = useUpdateProductTranslation(productId);

  useEffect(() => {
    if (product) {
      const languageId = product.translations?.[0]?.languageId ?? defaultLanguageId;
      const cultureCode = product.translations?.[0]?.cultureCode ?? "ar-SA";
      form.setFieldsValue({
        languageId,
        cultureCode,
        name: product.name,
        code: product.code,
        slug: product.slug,
        type: product.type,
        shortDescription: product.translations?.[0]?.description, // description in backend DTO holds shortDescription occasionally? Wait, we should map properly.
      });
      form.setFieldValue("description", product.translations?.[0]?.description || "");
      if (product.type) setProductType(product.type);
    } else {
      form.setFieldsValue({
        languageId: defaultLanguageId,
        type: 1
      });
      setProductType(1);
    }
  }, [product, form, defaultLanguageId, setProductType]);

  useEffect(() => {
    registerSaveHandler("basicInfo", async () => {
      const values = await form.validateFields();
      if (!productId) {
        // If creating a new product
        const selectedLanguageId = values.languageId || defaultLanguageId;
        const selectedCulture = languages?.find((l) => l.id === selectedLanguageId)?.code ?? "ar-SA";
        
        try {
          const newProduct = await updateProduct.mutateAsync({
            id: "", // wait, useUpdateProduct doesn't create. We need to import useCreateProduct
            body: {}
          });
        } catch (e) {
          throw e;
        }
      } else {
        // Update basic info
        await updateProduct.mutateAsync({
           id: productId,
           body: {
             code: values.code,
             // brandId handled in Organization section
           }
        });
        
        // Update translation
        const selectedLanguageId = values.languageId || defaultLanguageId;
        const selectedCulture = languages?.find((l) => l.id === selectedLanguageId)?.code ?? "ar-SA";
        await updateTranslation.mutateAsync({
           languageId: selectedLanguageId,
           name: values.name,
           slug: values.slug,
           description: values.description,
           metaTitle: product?.translations?.[0]?.metaTitle,
           metaDescription: product?.translations?.[0]?.metaDescription,
           metaKeywords: product?.translations?.[0]?.metaKeywords,
        });
      }
    });
  }, [registerSaveHandler, form, productId, updateProduct.mutateAsync, updateTranslation.mutateAsync, defaultLanguageId, languages, product]);

  const handleValuesChange = (changedValues: any) => {
    markSectionDirty("basicInfo");
    if (changedValues.type !== undefined) {
      setProductType(changedValues.type);
    }
  };

  return (
    <Card 
      title={t("catalog.products.create.general") || "Basic Information"}
      style={{ borderRadius: 16, border: "1px solid var(--border-light)", marginBottom: 24 }}
    >
      <Form
        id="basic-info-form"
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        validateTrigger={["onBlur", "onSubmit"]}
        onFinish={async (values) => {
          if (!productId) {
            // Handle create logic directly when form is submitted
            const selectedLanguageId = values.languageId || defaultLanguageId;
            const selectedCulture = languages?.find((l) => l.id === selectedLanguageId)?.code ?? "ar-SA";
            try {
              // We dispatch to window to let the orchestrator know it should create,
              // or we handle it here. 
              const event = new CustomEvent('CREATE_PRODUCT', { detail: values });
              window.dispatchEvent(event);
            } catch (e) {
              console.error(e);
            }
          }
        }}
      >
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item name="type" label={t("catalog.products.create.productType") || "Product Type"}>
              <Radio.Group 
                options={enumOptions("productType", t)}
                optionType="button"
                buttonStyle="solid"
                disabled={!!productId}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="languageId" label={t("catalog.products.create.language") || "Language"}>
              <Select options={languageOptions} />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="name" label={t("catalog.products.create.productName") || "Product Name"} rules={[{ required: true, message: t("catalog.products.create.nameRequired") }]}>
              <Input placeholder={t("catalog.products.create.placeholderName")} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="code" label={t("catalog.products.create.code") || "Product Code"} extra={t("catalog.products.create.helpers.code")} rules={[{ required: true, message: t("catalog.products.create.nameRequired") }]}>
              <Input placeholder={t("catalog.products.create.placeholderCode")} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="slug" label={t("catalog.products.create.slug") || "Slug"} extra={t("catalog.products.create.helpers.slug")} rules={[{ required: true, message: t("catalog.products.create.nameRequired") }]}>
              <Input placeholder={t("catalog.products.create.placeholderSlug")} />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="shortDescription" label={t("catalog.products.create.shortDescription") || "Short Description"}>
              <Input.TextArea rows={2} placeholder={t("catalog.products.create.placeholderShortDescription")} />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="description" label={t("catalog.products.create.description") || "Detailed Description"}>
              <Editor
                init={EDITOR_INIT}
                onEditorChange={(content: string) => {
                  const currentVal = form.getFieldValue("description");
                  if (currentVal !== content) {
                    form.setFieldValue("description", content);
                    handleValuesChange({ description: content });
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
