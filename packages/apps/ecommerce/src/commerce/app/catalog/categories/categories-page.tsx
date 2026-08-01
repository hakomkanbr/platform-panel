"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Tree,
  Typography,
} from "antd";
import type { DataNode } from "antd/es/tree";
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { AsyncBoundary, DrawerForm } from "@repo/ui";
import { CommerceShell } from "../../../components/CommerceShell";
import { StatusTag } from "../../../components/StatusTag";
import {
  useCategoryTree,
  useDeleteCategory,
  useSaveCategory,
  useSetCategoryStatus,
} from "../../../hooks/useCategories";
import { getApiErrorMessage } from "../../../api/http";
import type { Category } from "../../../types/catalog";

const { Text } = Typography;

function buildTree(categories: Category[]): DataNode[] {
  return (categories ?? []).map((c) => ({
    key: c.id,
    title: (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span>{c.name}</span>
        <StatusTag value={c.status} />
        {c.productCount ? (
          <Text type="secondary" style={{ fontSize: 12 }}>
            ({c.productCount})
          </Text>
        ) : null}
      </div>
    ),
    children: c.children && c.children.length ? buildTree(c.children) : undefined,
  }));
}

export function CategoriesPage() {
  const tree = useCategoryTree();
  const save = useSaveCategory();
  const remove = useDeleteCategory();
  const setStatus = useSetCategoryStatus();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [parentId, setParentId] = useState<string | undefined>(undefined);

  const selected = tree.data?.find((c) => c.id === selectedId) ?? null;

  const flatten = (cats: Category[]): Category[] =>
    (cats ?? []).flatMap((c) => [c, ...flatten(c.children ?? [])]);

  const all = tree.data ? flatten(tree.data) : [];

  useEffect(() => {
    if (selected && !drawerOpen) {
      form.setFieldsValue({
        name: selected.name,
        slug: selected.slug,
        description: selected.description,
        sortOrder: selected.sortOrder,
        imageUrl: selected.imageUrl,
      });
    }
  }, [selected, drawerOpen, form]);

  const openCreate = (parent?: string) => {
    setEditing(null);
    setParentId(parent);
    form.resetFields();
    setDrawerOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setParentId(category.parentId ?? undefined);
    form.setFieldsValue({
      name: category.name,
      slug: category.slug,
      description: category.description,
      sortOrder: category.sortOrder,
      imageUrl: category.imageUrl,
      status: category.status,
    });
    setDrawerOpen(true);
  };

  const onFinish = async (values: Record<string, unknown>) => {
    try {
      await save.mutateAsync({
        id: editing?.id,
        body: {
          name: values.name as string,
          slug: values.slug as string | undefined,
          description: values.description as string | undefined,
          sortOrder: values.sortOrder as number | undefined,
          imageUrl: values.imageUrl as string | undefined,
          status: editing ? (values.status as number) : 1,
          parentId: editing ? undefined : parentId,
        },
      });
      message.success(editing ? "Category updated" : "Category created");
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
      message.success("Status updated");
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  return (
    <CommerceShell
      title="Categories"
      description="Organize products into a hierarchy that guides navigation and merchandising."
      breadcrumbs={[{ title: "Catalog", href: "/admin/catalog" }, { title: "Categories" }]}
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreate(undefined)}>
          New category
        </Button>
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
              title="Category tree"
              extra={
                <Button icon={<ReloadOutlined />} size="small" onClick={() => tree.refetch()} />
              }
              style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}
            >
              <Tree
                showLine
                defaultExpandAll
                treeData={buildTree(tree.data ?? [])}
                selectedKeys={selectedId ? [selectedId] : []}
                onSelect={(keys) => setSelectedId(keys.length ? String(keys[0]) : null)}
              />
              {(all.length === 0) && (
                <Text type="secondary">No categories yet.</Text>
              )}
            </Card>
          </Col>
          <Col xs={24} lg={14}>
            <Card title={selected ? "Category details" : "Select a category"} style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}>
              {!selected ? (
                <Text type="secondary" style={{ color: "var(--text-secondary)" }}>
                  Select a category from the tree to edit it, or create a new one.
                </Text>
              ) : (
                <Form form={form} layout="vertical" onFinish={onFinish}>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="slug" label="Slug">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item name="description" label="Description">
                        <Input.TextArea rows={2} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Item name="sortOrder" label="Sort order">
                        <InputNumber style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Item name="status" label="Status">
                        <Select
                          options={[
                            { value: 1, label: "Active" },
                            { value: 2, label: "Inactive" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item name="imageUrl" label="Image URL">
                        <Input placeholder="https://..." />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={save.isPending}>
                      Save changes
                    </Button>
                    <Button icon={<PlusOutlined />} onClick={() => openCreate(selected.id)}>
                      Add child
                    </Button>
                    <Button icon={<EditOutlined />} onClick={() => openEdit(selected)}>
                      Edit
                    </Button>
                    <Button onClick={() => toggleStatus(selected)}>
                      {selected.status === 1 ? "Deactivate" : "Activate"}
                    </Button>
                    <Popconfirm
                      title="Delete category?"
                      onConfirm={async () => {
                        try {
                          await remove.mutateAsync(selected.id);
                          setSelectedId(null);
                          message.success("Category deleted");
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
        title={editing ? "Edit category" : "New category"}
        width={520}
        form={form}
        loading={save.isPending}
        onFinish={onFinish}
        submitLabel={editing ? "Save changes" : "Create category"}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {!editing && (
            <Form.Item label="Parent category" name="parentId" initialValue={parentId}>
              <Select
                allowClear
                placeholder="No parent (top level)"
                options={all.map((c) => ({ value: c.id, label: c.name }))}
              />
            </Form.Item>
          )}
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name is required" }]}>
            <Input placeholder="e.g. Apparel" />
          </Form.Item>
          <Form.Item name="slug" label="Slug">
            <Input placeholder="apparel" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="sortOrder" label="Sort order">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </DrawerForm>
    </CommerceShell>
  );
}
