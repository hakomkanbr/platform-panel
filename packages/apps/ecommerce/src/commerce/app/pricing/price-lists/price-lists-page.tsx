"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Space,
  Tooltip,
} from "antd";
import type { TableColumnsType } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { DataTable, DrawerForm } from "@repo/ui";
import { formatCurrency, formatDateTime } from "@repo/utils";
import { CommerceShell } from "../../../components/CommerceShell";
import { StatusTag } from "../../../components/StatusTag";
import { enumLabel } from "../../../types/enums";
import { useDeletePriceList, usePriceLists, useSavePriceList } from "../../../hooks/usePriceLists";
import { getApiErrorMessage } from "../../../api/http";
import type { PriceList } from "../../../types/pricing";

type PriceListRow = PriceList & Record<string, unknown>;

export function PriceListsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<PriceList | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading, isError, error, refetch } = usePriceLists({
    page,
    pageSize,
    search: search || undefined,
    status: status || undefined,
  });
  const save = useSavePriceList();
  const remove = useDeletePriceList();

  const rows = (data?.data ?? []) as PriceListRow[];

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ status: "draft", taxMode: 2 });
    setDrawerOpen(true);
  };

  const openEdit = (priceList: PriceList) => {
    setEditing(priceList);
    form.setFieldsValue({
      code: priceList.code,
      name: priceList.name,
      description: priceList.description,
      taxMode: priceList.taxMode,
      currencyCode: priceList.currencyCode,
      priority: priceList.priority,
      isDefault: priceList.isDefault,
      status: priceList.status,
    });
    setDrawerOpen(true);
  };

  const onFinish = async (values: Record<string, unknown>) => {
    try {
      await save.mutateAsync({
        id: editing?.id,
        body: {
          code: values.code as string,
          name: values.name as string,
          description: values.description as string | undefined,
          cultureCode: values.cultureCode as string | undefined ?? "en-US",
          taxMode: values.taxMode as number | undefined,
          currencyId: values.currency as number | undefined ?? "4f7d8a31-2d4e-4b9c-a8f6-9e1d73c5b4a2",
          languageId: values.languageId as string | undefined ?? "4f7d8a31-2d4e-4b9c-a8f6-9e1d73c5b4a2",
          priority: values.priority as number | undefined,
          isDefault: values.isDefault as boolean | undefined,
          metadata: (values.metadata as { key: string; value: string }[] | undefined)?.filter((m) => m.key.trim()),
        },
      });
      message.success(editing ? "Price list updated" : "Price list created");
      setDrawerOpen(false);
      setEditing(null);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const columns: TableColumnsType<PriceListRow> = [
    {
      title: "Price list",
      key: "name",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.name}</div>
          {record.code && <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{record.code}</div>}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (v) => <StatusTag value={v} />,
    },
    {
      title: "Tax",
      dataIndex: "taxMode",
      width: 120,
      render: (v) => enumLabel("taxMode", v),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      width: 90,
      render: (v) => v ?? "\u2014",
    },
    {
      title: "Products",
      dataIndex: "productCount",
      width: 100,
      render: (v) => v ?? 0,
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
      width: 140,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => router.push(`/admin/pricing/price-lists/${record.id}`)}>
            Manage
          </Button>
          <Popconfirm
            title="Delete price list?"
            onConfirm={async () => {
              try {
                await remove.mutateAsync(record.id);
                message.success("Price list deleted");
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
      title="Price lists"
      description="Group pricing rules and assign them to channels, customer groups, regions and stores."
      breadcrumbs={[{ title: "Pricing", href: "/admin/pricing" }, { title: "Price lists" }]}
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New price list
        </Button>
      }
    >
      <DataTable<PriceListRow>
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
        searchPlaceholder="Search price lists..."
        onSearch={(term) => {
          setSearch(term);
          setPage(1);
        }}
        filters={
          <Select
            value={status}
            options={[
              { value: "", label: "All statuses" },
              { value: "draft", label: "Draft" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            style={{ width: 160 }}
          />
        }
        title={`${data?.count ?? 0} price lists`}
        onRowClick={(record) => router.push(`/admin/pricing/price-lists/${record.id}`)}
        emptyTitle="No price lists"
        emptyDescription="Create a price list to start controlling product prices."
        emptyAction={{ label: "New price list", onClick: openCreate }}
      />

      <DrawerForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? "Edit price list" : "New price list"}
        width={540}
        form={form}
        loading={save.isPending}
        onFinish={onFinish}
        submitLabel={editing ? "Save changes" : "Create price list"}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name is required" }]}>
            <Input placeholder="e.g. Wholesale" />
          </Form.Item>
          <Form.Item name="code" label="Code">
            <Input placeholder="wholesale" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Space size={16}>
            <Form.Item name="taxMode" label="Tax mode">
              <Select
                style={{ width: 180 }}
                options={[
                  { value: 1, label: "Inclusive" },
                  { value: 2, label: "Exclusive" },
                ]}
              />
            </Form.Item>
            <Form.Item name="priority" label="Priority">
              <InputNumber min={0} style={{ width: 140 }} />
            </Form.Item>
          </Space>
          {editing && (
            <Form.Item name="status" label="Status">
              <Select
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
            </Form.Item>
          )}
        </Form>
      </DrawerForm>
    </CommerceShell>
  );
}
