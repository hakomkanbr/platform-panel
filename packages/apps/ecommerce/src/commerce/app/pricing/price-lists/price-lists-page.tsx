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
import { formatDateTime } from "@repo/utils";
import { useTranslations } from "@repo/localization";
import { CommerceShell } from "../../../components/CommerceShell";
import { StatusTag } from "../../../components/StatusTag";
import { enumLabel } from "../../../types/enums";
import { useDeletePriceList, usePriceLists, useSavePriceList } from "../../../hooks/usePriceLists";
import { getApiErrorMessage } from "../../../api/http";
import type { PriceListReadModel } from "../../../types/pricing";

type PriceListRow = PriceListReadModel & Record<string, unknown>;

export function PriceListsPage() {
  const router = useRouter();
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<PriceListReadModel | null>(null);
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

  const openEdit = (priceList: PriceListReadModel) => {
    setEditing(priceList);
    form.setFieldsValue({
      code: priceList.code,
      name: priceList.name,
      description: priceList.description,
      taxMode: priceList.taxMode,
      currencyId: priceList.currencyId,
      priority: priceList.priority,
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
      message.success(editing ? t("pricing.priceLists.updated") : t("pricing.priceLists.created"));
      setDrawerOpen(false);
      setEditing(null);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const columns: TableColumnsType<PriceListRow> = [
    {
      title: t("pricing.priceLists.nameColumn"),
      key: "name",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.name}</div>
          {record.code && <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{record.code}</div>}
        </div>
      ),
    },
    {
      title: t("pricing.priceLists.statusColumn"),
      dataIndex: "status",
      width: 120,
      render: (v) => <StatusTag value={v} />,
    },
    {
      title: t("pricing.priceLists.taxColumn"),
      dataIndex: "taxMode",
      width: 120,
      render: (v) => enumLabel("taxMode", v, t),
    },
    {
      title: t("pricing.priceLists.priorityColumn"),
      dataIndex: "priority",
      width: 90,
      render: (v) => v ?? "\u2014",
    },
    {
      title: t("pricing.priceLists.productsColumn"),
      dataIndex: "productCount",
      width: 100,
      render: (v) => v ?? 0,
    },
    {
      title: t("pricing.priceLists.updatedColumn"),
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
            {t("pricing.priceLists.manage")}
          </Button>
          <Popconfirm
            title={t("pricing.priceLists.deleteConfirm")}
            onConfirm={async () => {
              try {
                await remove.mutateAsync(record.id);
                message.success(t("pricing.priceLists.deleted"));
              } catch (e) {
                message.error(getApiErrorMessage(e));
              }
            }}
          >
            <Tooltip title={t("common.actions.delete")}>
              <Button type="link" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <CommerceShell
      title={t("pricing.priceLists.title")}
      description={t("pricing.priceLists.description")}
      breadcrumbs={[{ title: t("pricing.title"), href: "/admin/pricing" }, { title: t("pricing.priceLists.title") }]}
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {t("pricing.priceLists.new")}
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
        searchPlaceholder={t("pricing.priceLists.searchPlaceholder")}
        onSearch={(term) => {
          setSearch(term);
          setPage(1);
        }}
        filters={
          <Select
            value={status}
            options={[
              { value: "", label: t("common.actions.allStatuses") },
              { value: "draft", label: t("catalog.status.draft") },
              { value: "active", label: t("catalog.status.active") },
              { value: "inactive", label: t("catalog.status.inactive") },
            ]}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            style={{ width: 160 }}
          />
        }
        title={t("pricing.priceLists.count", { count: data?.count ?? 0 })}
        onRowClick={(record) => router.push(`/admin/pricing/price-lists/${record.id}`)}
        emptyTitle={t("pricing.priceLists.emptyTitle")}
        emptyDescription={t("pricing.priceLists.emptyDescription")}
        emptyAction={{ label: t("pricing.priceLists.new"), onClick: openCreate }}
      />

      <DrawerForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? t("pricing.priceLists.drawerEdit") : t("pricing.priceLists.drawerCreate")}
        width={540}
        form={form}
        loading={save.isPending}
        onFinish={onFinish}
        submitLabel={editing ? t("common.actions.saveChanges") : t("pricing.priceLists.submitCreate")}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label={t("common.fields.name")} rules={[{ required: true, message: t("common.fields.nameRequired") }]}>
            <Input placeholder={t("pricing.priceLists.placeholderName")} />
          </Form.Item>
          <Form.Item name="code" label={t("catalog.products.create.code")}>
            <Input placeholder={t("pricing.priceLists.placeholderCode")} />
          </Form.Item>
          <Form.Item name="description" label={t("common.fields.description")}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Space size={16}>
            <Form.Item name="taxMode" label={t("pricing.priceLists.taxMode")}>
              <Select
                style={{ width: 180 }}
                options={[
                  { value: 1, label: t("pricing.priceLists.inclusive") },
                  { value: 2, label: t("pricing.priceLists.exclusive") },
                ]}
              />
            </Form.Item>
            <Form.Item name="priority" label={t("pricing.priceLists.priority")}>
              <InputNumber min={0} style={{ width: 140 }} />
            </Form.Item>
          </Space>
          {editing && (
            <Form.Item name="status" label={t("common.fields.status")}>
              <Select
                options={[
                  { value: "draft", label: t("catalog.status.draft") },
                  { value: "active", label: t("catalog.status.active") },
                  { value: "inactive", label: t("catalog.status.inactive") },
                ]}
              />
            </Form.Item>
          )}
        </Form>
      </DrawerForm>
    </CommerceShell>
  );
}
