"use client";

import React, { useEffect, useState } from "react";
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
import { CrownOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { DataTable, DrawerForm } from "@repo/ui";
import { formatDateTime } from "@repo/utils";
import { CommerceShell } from "../../../components/CommerceShell";
import { StatusTag } from "../../../components/StatusTag";
import { useBrands, useDeleteBrand, useSaveBrand, useSetBrandStatus } from "../../../hooks/useBrands";
import { getApiErrorMessage } from "../../../api/http";
import type { Brand } from "../../../types/catalog";

type BrandRow = Brand & Record<string, unknown>;

export function BrandsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading, isError, error, refetch } = useBrands({
    page,
    pageSize,
    search: search || undefined,
    status: status || undefined,
  });
  const save = useSaveBrand();
  const remove = useDeleteBrand();
  const setStatusMutation = useSetBrandStatus();

  const rows = (data?.data ?? []) as BrandRow[];

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const openEdit = (brand: Brand) => {
    setEditing(brand);
    form.setFieldsValue({
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      logoUrl: brand.logoUrl,
      websiteUrl: brand.websiteUrl,
      status: brand.status,
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
          logoUrl: values.logoUrl as string | undefined,
          websiteUrl: values.websiteUrl as string | undefined,
          status: (values.status as number) ?? 1,
        },
      });
      message.success(editing ? "Brand updated" : "Brand created");
      setDrawerOpen(false);
      setEditing(null);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const toggleStatus = async (brand: Brand) => {
    try {
      await setStatusMutation.mutateAsync({ id: brand.id, status: brand.status === 1 ? 2 : 1 });
      message.success("Status updated");
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const columns: TableColumnsType<BrandRow> = [
    {
      title: "Brand",
      key: "name",
      render: (_, record) => (
        <Space>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "var(--border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {record.logoUrl ? (
              <img src={record.logoUrl} alt={record.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <CrownOutlined style={{ color: "var(--text-secondary)" }} />
            )}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            {record.websiteUrl && (
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{record.websiteUrl}</div>
            )}
          </div>
        </Space>
      ),
    },
    { title: "Slug", dataIndex: "slug", render: (v) => v ?? "\u2014" },
    { title: "Products", dataIndex: "productCount", width: 110, render: (v) => v ?? 0 },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (v) => <StatusTag value={v} />,
    },
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
          <Button type="link" size="small" onClick={() => toggleStatus(record)}>
            {record.status === 1 ? "Deactivate" : "Activate"}
          </Button>
          <Popconfirm
            title="Delete brand?"
            onConfirm={async () => {
              try {
                await remove.mutateAsync(record.id);
                message.success("Brand deleted");
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

  const filters = (
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
  );

  return (
    <CommerceShell
      title="Brands"
      description="Manage the brands that your products belong to."
      breadcrumbs={[{ title: "Catalog", href: "/admin/catalog" }, { title: "Brands" }]}
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New brand
        </Button>
      }
    >
      <DataTable<BrandRow>
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
        searchPlaceholder="Search brands..."
        onSearch={(term) => {
          setSearch(term);
          setPage(1);
        }}
        filters={filters}
        title={`${data?.count ?? 0} brands`}
        emptyTitle="No brands yet"
        emptyDescription="Add brands to organize products by manufacturer."
        emptyAction={{ label: "New brand", onClick: openCreate }}
      />

      <DrawerForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? "Edit brand" : "New brand"}
        width={520}
        form={form}
        loading={save.isPending}
        onFinish={onFinish}
        submitLabel={editing ? "Save changes" : "Create brand"}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name is required" }]}>
            <Input placeholder="e.g. Nike" />
          </Form.Item>
          <Form.Item name="slug" label="Slug">
            <Input placeholder="nike" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="logoUrl" label="Logo URL">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="websiteUrl" label="Website">
            <Input placeholder="https://example.com" />
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
