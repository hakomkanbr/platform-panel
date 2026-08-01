"use client";

import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import { DeleteOutlined, PlusOutlined, TagsOutlined } from "@ant-design/icons";
import { DataTable, DrawerForm } from "@repo/ui";
import { formatDateTime } from "@repo/utils";
import { CommerceShell } from "../../../components/CommerceShell";
import { StatusTag } from "../../../components/StatusTag";
import { useDeleteTag, useSaveTag, useSetTagStatus, useTags } from "../../../hooks/useTags";
import { getApiErrorMessage } from "../../../api/http";
import type { Tag } from "../../../types/catalog";

type TagRow = Tag & Record<string, unknown>;

export function TagsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading, isError, error, refetch } = useTags({
    page,
    pageSize,
    search: search || undefined,
    status: status || undefined,
  });
  const save = useSaveTag();
  const remove = useDeleteTag();
  const setStatusMutation = useSetTagStatus();

  const rows = (data?.data ?? []) as TagRow[];

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const openEdit = (tag: Tag) => {
    setEditing(tag);
    form.setFieldsValue({ name: tag.name, slug: tag.slug, description: tag.description, status: tag.status });
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
          status: (values.status as number) ?? 1,
        },
      });
      message.success(editing ? "Tag updated" : "Tag created");
      setDrawerOpen(false);
      setEditing(null);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const columns: TableColumnsType<TagRow> = [
    {
      title: "Tag",
      key: "name",
      render: (_, record) => (
        <Space>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TagsOutlined style={{ color: "var(--text-secondary)" }} />
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{record.slug}</div>
          </div>
        </Space>
      ),
    },
    { title: "Products", dataIndex: "productCount", width: 110, render: (v) => v ?? 0 },
    { title: "Status", dataIndex: "status", width: 120, render: (v) => <StatusTag value={v} /> },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      width: 160,
      render: (v) => <span style={{ color: "var(--text-secondary)" }}>{formatDateTime(v)}</span>,
    },
    {
      title: "",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Button type="link" size="small" onClick={() => setStatusMutation.mutateAsync({ id: record.id, status: record.status === 1 ? 2 : 1 })}>
            {record.status === 1 ? "Deactivate" : "Activate"}
          </Button>
          <Popconfirm
            title="Delete tag?"
            onConfirm={async () => {
              try {
                await remove.mutateAsync(record.id);
                message.success("Tag deleted");
              } catch (e) {
                message.error(getApiErrorMessage(e));
              }
            }}
          >
            <Tooltip title="Delete">
              <Button type="link" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <CommerceShell
      title="Tags"
      description="Label products with lightweight, flexible tags."
      breadcrumbs={[{ title: "Catalog", href: "/admin/catalog" }, { title: "Tags" }]}
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New tag
        </Button>
      }
    >
      <DataTable<TagRow>
        columns={columns}
        dataSource={rows}
        rowKey="id"
        loading={isLoading}
        error={error ? new Error(getApiErrorMessage(error)) : undefined}
        onRefresh={refetch}
        total={data?.count ?? 0}
        page={page}
        pageSize={pageSize}
        onPageChange={(p, ps) => {
          setPage(p);
          setPageSize(ps);
        }}
        searchable
        searchPlaceholder="Search tags..."
        onSearch={(term) => {
          setSearch(term);
          setPage(1);
        }}
        filters={
          <Select
            value={status}
            options={[
              { value: "", label: "All statuses" },
              { value: "1", label: "Active" },
              { value: "2", label: "Inactive" },
            ]}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            style={{ width: 160 }}
          />
        }
        title={`${data?.count ?? 0} tags`}
        emptyTitle="No tags yet"
        emptyDescription="Create tags to label products."
        emptyAction={{ label: "New tag", onClick: openCreate }}
      />

      <DrawerForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? "Edit tag" : "New tag"}
        width={480}
        form={form}
        loading={save.isPending}
        onFinish={onFinish}
        submitLabel={editing ? "Save changes" : "Create tag"}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name is required" }]}>
            <Input placeholder="e.g. Sale" />
          </Form.Item>
          <Form.Item name="slug" label="Slug">
            <Input placeholder="sale" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>
          {editing && (
            <Form.Item name="status" label="Status">
              <Select
                options={[
                  { value: 1, label: "Active" },
                  { value: 2, label: "Inactive" },
                ]}
              />
            </Form.Item>
          )}
        </Form>
      </DrawerForm>
    </CommerceShell>
  );
}
