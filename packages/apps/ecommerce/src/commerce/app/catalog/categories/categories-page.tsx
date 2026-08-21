"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Tooltip,
  Tree,
  Typography,
} from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SyncOutlined } from "@ant-design/icons";
import { AsyncBoundary, DrawerForm } from "@repo/ui";
import { useTranslations } from "@repo/localization";
import { ImagePicker, type CdnFile } from "@repo/media";
import { CommerceShell } from "../../../components/CommerceShell";
import { StatusTag } from "../../../components/StatusTag";
import { generateSlug, slugRule } from "../../../utils/slug";
import {
  useCategoryTree,
  useDeleteCategory,
  useSaveCategory,
  useSetCategoryStatus,
} from "../../../hooks/useCategories";
import { useCommerce } from "../../../context/CommerceContext";
import { useProjectLanguages } from "../../../hooks/useLanguages";
import { getApiErrorMessage } from "../../../api/http";
import type { CategoryReadModel as Category } from "../../../types/catalog";

const { Text } = Typography;

export function CategoriesPage() {
  const t = useTranslations();
  const tree = useCategoryTree();
  const save = useSaveCategory();
  const remove = useDeleteCategory();
  const setStatus = useSetCategoryStatus();

  const { projectId } = useCommerce();
  const { data: languages } = useProjectLanguages(projectId);
  const defaultLanguage = languages?.find((l) => l.isDefault) ?? languages?.[0];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [parentId, setParentId] = useState<string | undefined>(undefined);
  const [languageInitialized, setLanguageInitialized] = useState(false);
  const [treeLanguageId, setTreeLanguageId] = useState<string | undefined>(undefined);
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const currentImageUrl = Form.useWatch("imageUrl", form);

  useEffect(() => {
    if (defaultLanguage && !treeLanguageId) {
      setTreeLanguageId(defaultLanguage.id);
    }
  }, [defaultLanguage, treeLanguageId]);

  const selected = tree.data?.find((c) => c.id === selectedId) ?? null;

  const flatten = (cats: Category[]): Category[] =>
    (cats ?? []).flatMap((c) => [c, ...flatten(c.children ?? [])]);

  const all = tree.data ? flatten(tree.data) : [];

  useEffect(() => {
    if (defaultLanguage && !languageInitialized && !drawerOpen) {
      form.setFieldValue("languageId", defaultLanguage.id);
      setLanguageInitialized(true);
    }
  }, [defaultLanguage, form, languageInitialized, drawerOpen]);

  useEffect(() => {
    if (selected && !drawerOpen) {
      form.setFieldsValue({
        name: selected.name,
        slug: selected.slug,
        description: selected.description,
        sortOrder: selected.sortOrder,
        imageUrl: selected.imageUrl,
        languageId: treeLanguageId || defaultLanguage?.id,
      });
      setIsSlugCustomized(true);
    }
  }, [selected, drawerOpen, form, treeLanguageId, defaultLanguage]);

  const handleValuesChange = (changedValues: any) => {
    if (changedValues.name !== undefined && !isSlugCustomized) {
      const generated = generateSlug(changedValues.name);
      form.setFieldValue("slug", generated);
      form.validateFields(["slug"]).catch(() => {});
    }
    if (changedValues.slug !== undefined) {
      setIsSlugCustomized(true);
    }
  };

  const openCreate = (parent?: string) => {
    setEditing(null);
    setParentId(parent);
    form.resetFields();
    form.setFieldValue("languageId", treeLanguageId || defaultLanguage?.id);
    setIsSlugCustomized(false);
    setDrawerOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setParentId(category.parentId ?? undefined);
    const existingLangId = category.translations?.[0]?.languageId;
    form.setFieldsValue({
      name: category.name,
      slug: category.slug,
      description: category.description,
      sortOrder: category.sortOrder,
      imageUrl: category.imageUrl,
      status: category.status,
      languageId: existingLangId || treeLanguageId || defaultLanguage?.id,
    });
    setIsSlugCustomized(true);
    setDrawerOpen(true);
  };

  const onFinish = async (values: Record<string, unknown>) => {
    const selectedLanguageId =
      (values.languageId as string) ||
      editing?.translations?.[0]?.languageId ||
      defaultLanguage?.id;
    const selectedCulture =
      languages?.find((l) => l.id === selectedLanguageId)?.code ??
      editing?.translations?.[0]?.cultureCode ??
      (values.cultureCode as string) ??
      "ar-SA";
    try {
      await save.mutateAsync({
        id: editing?.id,
        body: {
          name: values.name as string,
          slug: (values.slug as string) || generateSlug(values.name as string),
          description: values.description as string | undefined,
          sortOrder: values.sortOrder as number | undefined,
          imageUrl: values.imageUrl as string | undefined,
          cultureCode: selectedCulture,
          languageId: selectedLanguageId || "4f7d8a31-2d4e-4b9c-a8f6-9e1d73c5b4a2",
          status: editing ? (values.status as number) : 1,
          parentId: editing ? undefined : parentId,
        },
      });
      message.success(editing ? t("catalog.categories.updated") : t("catalog.categories.created"));
      setDrawerOpen(false);
      setEditing(null);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const toggleStatus = async (category: Category) => {
    const next = category.status === 1 ? 2 : 1;
    try {
      await setStatus.mutateAsync({ id: category.id, status: next });
      message.success(t("catalog.categories.statusUpdated"));
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const onDrop: TreeProps['onDrop'] = async (info) => {
    const dropKey = info.node.key as string;
    const dragKey = info.dragNode.key as string;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const dragCategory = all.find(c => c.id === dragKey);
    if (!dragCategory) return;

    let newParentId: string | undefined = undefined;
    let newSortOrder = dragCategory.sortOrder;

    if (!info.dropToGap) {
      newParentId = dropKey;
      newSortOrder = 1; // Put at the top of children
    } else {
      const dropCategory = all.find(c => c.id === dropKey);
      if (dropCategory) {
        newParentId = dropCategory.parentId ?? undefined;
        newSortOrder = (dropCategory.sortOrder || 0) + (dropPosition > 0 ? 1 : -1);
      }
    }

    try {
      const defaultLang = dragCategory.translations?.[0]?.languageId || defaultLanguage?.id;
      const cultureCode = languages?.find(l => l.id === defaultLang)?.code || "en-US";
      
      await save.mutateAsync({
        id: dragKey,
        body: {
          name: dragCategory.name,
          slug: dragCategory.slug,
          description: dragCategory.description,
          sortOrder: newSortOrder,
          imageUrl: dragCategory.imageUrl,
          status: dragCategory.status,
          parentId: newParentId,
          languageId: defaultLang,
          cultureCode: cultureCode,
        }
      });
      message.success(t("catalog.categories.updated"));
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const getLocalizedName = (c: any) => {
    if (!treeLanguageId) return c.name;
    const translation = c.translations?.find((tr: any) => tr.languageId === treeLanguageId);
    return translation?.name || c.name;
  };

  const buildTreeData = (categories: Category[]): DataNode[] => {
    return (categories ?? []).map((c) => ({
      key: c.id,
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>{getLocalizedName(c)}</span>
          <StatusTag value={c.status} />
          {c.productCount ? (
            <Text type="secondary" style={{ fontSize: 12 }}>
              ({c.productCount})
            </Text>
          ) : null}
        </div>
      ),
      children: c.children && c.children.length ? buildTreeData(c.children) : undefined,
    }));
  };

  return (
    <CommerceShell
      title={t("catalog.categories.title")}
      description={t("catalog.categories.description")}
      breadcrumbs={[{ title: t("catalog.title"), href: "/admin/catalog" }, { title: t("catalog.categories.title") }]}
      actions={
        <Space>
          <Select
            value={treeLanguageId}
            onChange={setTreeLanguageId}
            loading={!languages && projectId ? true : undefined}
            placeholder={t("common.fields.selectLanguage")}
            style={{ width: 200 }}
            options={(languages ?? []).map((l) => ({
              value: l.id,
              label: `${l.flag ?? ""} ${l.nativeName || l.name} (${l.code})`,
            }))}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreate(undefined)}>
            {t("catalog.categories.new")}
          </Button>
        </Space>
      }
    >
      <AsyncBoundary
        loading={tree.isLoading}
        error={tree.error ? new Error(getApiErrorMessage(tree.error)) : undefined}
        retry={tree.refetch}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={10}>
            <Card
              title={t("catalog.categories.tree")}
              extra={
                <Button icon={<ReloadOutlined />} size="small" onClick={() => tree.refetch()} />
              }
              style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}
            >
              <Tree
                showLine
                draggable
                blockNode
                onDrop={onDrop}
                defaultExpandAll
                treeData={buildTreeData(tree.data ?? [])}
                selectedKeys={selectedId ? [selectedId] : []}
                onSelect={(keys) => setSelectedId(keys.length ? String(keys[0]) : null)}
              />
              {(all.length === 0) && (
                <Text type="secondary">{t("catalog.categories.noCategories")}</Text>
              )}
            </Card>
          </Col>
          <Col xs={24} lg={14}>
            <Card title={selected ? t("catalog.categories.details") : t("catalog.categories.select")} style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}>
              {!selected ? (
                <Text type="secondary" style={{ color: "var(--text-secondary)" }}>
                  {t("catalog.categories.selectHint")}
                </Text>
              ) : (
                <Form form={form} layout="vertical" onFinish={onFinish} onValuesChange={handleValuesChange}>
                  <Row gutter={16}>
                    <Col xs={24}>
                      <Form.Item name="languageId" label={t("common.fields.language")}>
                        <Select
                          loading={!languages && projectId ? true : undefined}
                          placeholder={t("common.fields.selectLanguage")}
                          options={(languages ?? []).map((l) => ({
                            value: l.id,
                            label: `${l.flag ?? ""} ${l.nativeName || l.name} (${l.code})`,
                          }))}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="name" label={t("common.fields.name")} rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="slug" label={t("common.fields.slug")} rules={[slugRule(t)]}>
                        <Input
                          placeholder={t("catalog.categories.placeholderSlug")}
                          suffix={
                            <Tooltip title={t("catalog.products.create.autoGenerateSlug") || "Auto-generate"}>
                              <Button
                                type="text"
                                size="small"
                                icon={<SyncOutlined />}
                                style={{ color: "var(--text-secondary)" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const currentName = form.getFieldValue("name") || "";
                                  const generated = generateSlug(currentName);
                                  form.setFieldValue("slug", generated);
                                  setIsSlugCustomized(false);
                                  form.validateFields(["slug"]).catch(() => {});
                                }}
                              />
                            </Tooltip>
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item name="description" label={t("common.fields.description")}>
                        <Input.TextArea rows={2} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Item name="sortOrder" label={t("catalog.categories.sortOrder")}>
                        <InputNumber style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Item name="status" label={t("common.fields.status")}>
                        <Select
                          options={[
                            { value: 1, label: t("catalog.status.active") },
                            { value: 2, label: t("catalog.status.inactive") },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item label={t("catalog.categories.imageUrl")}>
                        <Space direction="vertical" style={{ width: "100%" }} size={8}>
                          <Form.Item name="imageUrl" style={{ marginBottom: 0 }}>
                            <Input placeholder={t("catalog.categories.placeholderUrl")} allowClear />
                          </Form.Item>
                          <Space align="center">
                            {currentImageUrl && (
                              <div
                                style={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 8,
                                  overflow: "hidden",
                                  border: "1px solid var(--border-light)",
                                  background: "#fafafa",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <img
                                  src={currentImageUrl}
                                  alt="Category Image Preview"
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                            <Button
                              type="dashed"
                              onClick={() => setImagePickerOpen(true)}
                              icon={<PlusOutlined />}
                            >
                              {currentImageUrl
                                ? t("catalog.categories.changeImage") || "Change from Media Library"
                                : t("catalog.categories.selectImage") || "Choose from Media Library"}
                            </Button>
                            {currentImageUrl && (
                              <Button
                                type="text"
                                danger
                                size="small"
                                onClick={() => form.setFieldValue("imageUrl", "")}
                              >
                                {t("common.actions.clear") || "Clear"}
                              </Button>
                            )}
                          </Space>
                        </Space>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={save.isPending}>
                      {t("common.actions.saveChanges")}
                    </Button>
                    <Button icon={<PlusOutlined />} onClick={() => openCreate(selected.id)}>
                      {t("catalog.categories.addChild")}
                    </Button>
                    <Button icon={<EditOutlined />} onClick={() => openEdit(selected)}>
                      {t("common.actions.edit")}
                    </Button>
                    <Button onClick={() => toggleStatus(selected)}>
                      {selected.status === 1 ? t("common.actions.deactivate") : t("common.actions.activate")}
                    </Button>
                    <Popconfirm
                      title={t("catalog.categories.deleteConfirm")}
                      onConfirm={async () => {
                        try {
                          await remove.mutateAsync(selected.id);
                          setSelectedId(null);
                          message.success(t("catalog.categories.deleted"));
                        } catch (e) {
                          message.error(getApiErrorMessage(e));
                        }
                      }}
                    >
                      <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                </Form>
              )}
            </Card>
          </Col>
        </Row>
      </AsyncBoundary>

      <DrawerForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? t("catalog.categories.drawerEdit") : t("catalog.categories.drawerCreate")}
        width={520}
        form={form}
        loading={save.isPending}
        onFinish={onFinish}
        submitLabel={editing ? t("common.actions.saveChanges") : t("catalog.categories.submitCreate")}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} onValuesChange={handleValuesChange}>
          <Form.Item name="languageId" label={t("common.fields.language")}>
            <Select
              loading={!languages && projectId ? true : undefined}
              placeholder={t("common.fields.selectLanguage")}
              options={(languages ?? []).map((l) => ({
                value: l.id,
                label: `${l.flag ?? ""} ${l.nativeName || l.name} (${l.code})`,
              }))}
            />
          </Form.Item>
          {!editing && (
            <Form.Item label={t("catalog.categories.parentCategory")} name="parentId" initialValue={parentId}>
              <Select
                allowClear
                placeholder={t("catalog.categories.noParent")}
                options={all.map((c) => ({ value: c.id, label: getLocalizedName(c) }))}
              />
            </Form.Item>
          )}
          <Form.Item name="name" label={t("common.fields.name")} rules={[{ required: true, message: t("common.fields.nameRequired") }]}>
            <Input placeholder={t("catalog.categories.placeholderName")} />
          </Form.Item>
          <Form.Item name="slug" label={t("common.fields.slug")} rules={[slugRule(t)]}>
            <Input
              placeholder={t("catalog.categories.placeholderSlug")}
              suffix={
                <Tooltip title={t("catalog.products.create.autoGenerateSlug") || "Auto-generate"}>
                  <Button
                    type="text"
                    size="small"
                    icon={<SyncOutlined />}
                    style={{ color: "var(--text-secondary)" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentName = form.getFieldValue("name") || "";
                      const generated = generateSlug(currentName);
                      form.setFieldValue("slug", generated);
                      setIsSlugCustomized(false);
                      form.validateFields(["slug"]).catch(() => {});
                    }}
                  />
                </Tooltip>
              }
            />
          </Form.Item>
          <Form.Item name="description" label={t("common.fields.description")}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="sortOrder" label={t("catalog.categories.sortOrder")}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label={t("catalog.categories.imageUrl")}>
            <Space direction="vertical" style={{ width: "100%" }} size={8}>
              <Form.Item name="imageUrl" style={{ marginBottom: 0 }}>
                <Input placeholder={t("catalog.categories.placeholderUrl")} allowClear />
              </Form.Item>
              <Space align="center">
                {currentImageUrl && (
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid var(--border-light)",
                      background: "#fafafa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={currentImageUrl}
                      alt="Category Image Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <Button
                  type="dashed"
                  onClick={() => setImagePickerOpen(true)}
                  icon={<PlusOutlined />}
                >
                  {currentImageUrl
                    ? t("catalog.categories.changeImage") || "Change from Media Library"
                    : t("catalog.categories.selectImage") || "Choose from Media Library"}
                </Button>
                {currentImageUrl && (
                  <Button
                    type="text"
                    danger
                    size="small"
                    onClick={() => form.setFieldValue("imageUrl", "")}
                  >
                    {t("common.actions.clear") || "Clear"}
                  </Button>
                )}
              </Space>
            </Space>
          </Form.Item>
        </Form>
      </DrawerForm>

      <ImagePicker
        open={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onChange={(files: CdnFile[]) => {
          if (files[0]?.url) {
            form.setFieldValue("imageUrl", files[0].url);
          }
          setImagePickerOpen(false);
        }}
        multiple={false}
      />
    </CommerceShell>
  );
}

