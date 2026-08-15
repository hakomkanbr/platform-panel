"use client";

import React, { useEffect, useMemo } from "react";
import { Form, Row, Col, Select, TreeSelect, Card } from "antd";
import { useTranslations } from "@repo/localization";
import { useProductWorkspace } from "../ProductWorkspaceContext";
import type { ProductDetail, CategoryReadModel } from "../../../../types/catalog";
import { useBrands } from "../../../../hooks/useBrands";
import { useTags } from "../../../../hooks/useTags";
import { useCategoryTree } from "../../../../hooks/useCategories";
import { 
  useAddProductCategory, 
  useRemoveProductCategory,
  useAddProductTag,
  useRemoveProductTag,
  useUpdateProduct
} from "../../../../hooks/useProducts";

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
  const getName = (c: CategoryReadModel) => c.translations[0]?.name ?? c.path.split("/").pop() ?? c.id;
  const build = (cat: CategoryReadModel): CategoryTreeNode => ({
    title: getName(cat),
    value: cat.id,
    children: categories.filter((c) => c.parentId === cat.id).map(build) || undefined,
  });
  return roots.map(build);
}

export function OrganizationSection({ product }: { product?: ProductDetail }) {
  const t = useTranslations();
  const [form] = Form.useForm();
  const { productId, markSectionDirty, registerSaveHandler } = useProductWorkspace();
  
  const brands = useBrands({ page: 1, pageSize: 100 });
  const tags = useTags({ page: 1, pageSize: 100 });
  const categories = useCategoryTree();
  const categoryTreeData = useMemo(() => (categories.data ? toTreeData(categories.data) : []), [categories.data]);

  const addCategory = useAddProductCategory(productId);
  const removeCategory = useRemoveProductCategory(productId);
  const addTag = useAddProductTag(productId);
  const removeTag = useRemoveProductTag(productId);
  const updateProduct = useUpdateProduct();

  const brandOptions = useMemo(() => {
    return (brands.data?.data ?? []).map((b) => ({
      value: b.id,
      label: b.name || b.translations?.[0]?.name || b.id,
    }));
  }, [brands.data]);

  const tagOptions = useMemo(() => {
    return (tags.data?.data ?? []).map((tag) => ({
      value: tag.id,
      label: tag.name || tag.translations?.[0]?.name || tag.id,
    }));
  }, [tags.data]);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        brandId: product.brandId,
        categoryIds: product.categories?.map(c => c.categoryId) || [],
        tagIds: product.tags?.map(t => t.tagId) || [],
      });
    }
  }, [product, form]);

  useEffect(() => {
    registerSaveHandler("organization", async () => {
      const values = await form.validateFields();
      if (!productId) return;

      // 1. Brand Update
      if (values.brandId !== product?.brandId) {
        await updateProduct.mutateAsync({
           id: productId,
           body: { brandId: values.brandId, code: product?.code } // code is usually required in UpdateProductCommand
        });
      }

      // 2. Categories Diff
      const currentCats = product?.categories?.map(c => c.categoryId) || [];
      const newCats = (values.categoryIds || []) as string[];
      
      const catsToAdd = newCats.filter(id => !currentCats.includes(id));
      const catsToRemove = currentCats.filter(id => !newCats.includes(id));

      for (const catId of catsToAdd) {
        await addCategory.mutateAsync({ categoryId: catId, isPrimary: false, displayOrder: 0 });
      }
      for (const catId of catsToRemove) {
        await removeCategory.mutateAsync(catId);
      }

      // 3. Tags Diff
      const currentTags = product?.tags?.map(t => t.tagId) || [];
      const newTags = (values.tagIds || []) as string[];

      const tagsToAdd = newTags.filter(id => !currentTags.includes(id));
      const tagsToRemove = currentTags.filter(id => !newTags.includes(id));

      for (const tagId of tagsToAdd) {
        await addTag.mutateAsync({ tagId });
      }
      for (const tagId of tagsToRemove) {
        await removeTag.mutateAsync(tagId);
      }
    });
  }, [registerSaveHandler, form, productId, product, updateProduct.mutateAsync, addCategory.mutateAsync, removeCategory.mutateAsync, addTag.mutateAsync, removeTag.mutateAsync]);

  return (
    <Card 
      title={t("catalog.products.create.organization") || "Organization"}
      style={{ borderRadius: 16, border: "1px solid var(--border-light)", marginBottom: 24 }}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={() => markSectionDirty("organization")}
      >
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item name="brandId" label={t("catalog.products.list.brandColumn") || "Brand"} extra={t("catalog.products.create.helpers.brand") || "The manufacturer or brand associated with this product."}>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                loading={brands.isLoading}
                options={brandOptions}
                placeholder="Select or search a brand"
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="categoryIds" label={t("catalog.products.create.categories") || "Categories"} extra={t("catalog.products.create.helpers.categories") || "Used to organize products for navigation and filtering."}>
              <TreeSelect
                multiple
                treeCheckable
                treeData={categoryTreeData}
                loading={categories.isLoading}
                allowClear
                treeDefaultExpandAll
                placeholder="Select categories"
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="tagIds" label={t("catalog.products.create.tags") || "Tags"} extra={t("catalog.products.create.helpers.tags") || "Internal labels to help search and organization."}>
              <Select
                mode="multiple"
                allowClear
                showSearch
                optionFilterProp="label"
                loading={tags.isLoading}
                options={tagOptions}
                placeholder="Select tags"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
