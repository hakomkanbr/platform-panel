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
import { useTranslations } from "@repo/localization";
import { CommerceShell } from "../../../components/CommerceShell";
import { StatusTag } from "../../../components/StatusTag";
import { useBrands, useDeleteBrand, useSaveBrand, useSetBrandStatus } from "../../../hooks/useBrands";
import { useCommerce } from "../../../context/CommerceContext";
import { useProjectLanguages } from "../../../hooks/useLanguages";
import { getApiErrorMessage } from "../../../api/http";
import type { BrandReadModel as Brand } from "../../../types/catalog";

type BrandRow = Brand & Record<string, unknown>;

export function BrandsPage() {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [form] = Form.useForm();
  
  const { projectId } = useCommerce();
  const { data: languages } = useProjectLanguages(projectId);
  const defaultLanguage = languages?.find((l) => l.isDefault) ?? languages?.[0];

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
    if (defaultLanguage) {
      form.setFieldValue("languageId", defaultLanguage.id);
    }
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
      // @ts-ignore
      languageId: brand.languageId ?? defaultLanguage?.id,
    });
    setDrawerOpen(true);
  };

  const onFinish = async (values: Record<string, unknown>) => {
    try {
      const selectedLanguageId = (values.languageId as string) || defaultLanguage?.id;
      const selectedCulture = languages?.find((l) => l.id === selectedLanguageId)?.code ?? "en-US";
      
      await save.mutateAsync({
        id: editing?.id,
        body: {
          name: values.name as string,
          slug: values.slug as string | undefined,
          description: values.description as string | undefined,
          logoUrl: values.logoUrl as string | undefined,
          websiteUrl: values.websiteUrl as string | undefined,
          status: (values.status as number) ?? 1,
          languageId: selectedLanguageId,
          cultureCode: selectedCulture,
        } as Partial<Brand> & { languageId?: string; cultureCode?: string },
      });
      message.success(editing ? t("catalog.brands.updated") : t("catalog.brands.created"));
      setDrawerOpen(false);
      setEditing(null);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const toggleStatus = async (brand: Brand) => {
    try {
      await setStatusMutation.mutateAsync({ id: brand.id, status: brand.status === 1 ? 2 : 1 });
      message.success(t("catalog.brands.statusUpdated"));
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const columns: TableColumnsType<BrandRow> = [
    {
      title: t("catalog.brands.title"),
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
    { title: t("catalog.brands.slugColumn"), dataIndex: "slug", render: (v) => v ?? "\u2014" },
    { title: t("catalog.brands.productsColumn"), dataIndex: "productCount", width: 110, render: (v) => v ?? 0 },
    {
      title: t("common.fields.status"),
      dataIndex: "status",
      width: 120,
      render: (v) => <StatusTag value={v} />,
    },
    {
      title: t("catalog.products.list.updatedColumn"),
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
            {t("common.actions.edit")}
          </Button>
          <Button type="link" size="small" onClick={() => toggleStatus(record)}>
            {record.status === 1 ? t("common.actions.deactivate") : t("common.actions.activate")}
          </Button>
          <Popconfirm
            title={t("catalog.brands.deleteConfirm")}
            onConfirm={async () => {
              try {
                await remove.mutateAsync(record.id);
                message.success(t("catalog.brands.deleted"));
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

  const filters = (
    <Select
      value={status}
      options={[
        { value: "", label: t("common.actions.allStatuses") },
        { value: "1", label: t("catalog.status.active") },
        { value: "2", label: t("catalog.status.inactive") },
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
      title={t("catalog.brands.title")}
      description={t("catalog.brands.description")}
      breadcrumbs={[{ title: t("catalog.title"), href: "/admin/catalog" }, { title: t("catalog.brands.title") }]}
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {t("catalog.brands.new")}
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
        searchPlaceholder={t("catalog.brands.searchPlaceholder")}
        onSearch={(term) => {
          setSearch(term);
          setPage(1);
        }}
        filters={filters}
        title={t("catalog.brands.count", { count: data?.count ?? 0 })}
        emptyTitle={t("catalog.brands.emptyTitle")}
        emptyDescription={t("catalog.brands.emptyDescription")}
        emptyAction={{ label: t("catalog.brands.new"), onClick: openCreate }}
      />

      <DrawerForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? t("catalog.brands.drawerEdit") : t("catalog.brands.drawerCreate")}
        width={520}
        form={form}
        loading={save.isPending}
        onFinish={onFinish}
        submitLabel={editing ? t("common.actions.saveChanges") : t("catalog.brands.submitCreate")}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="languageId" label={t("common.fields.language")} rules={[{ required: true }]}>
            <Select
              loading={!languages && projectId ? true : undefined}
              placeholder={t("common.fields.selectLanguage")}
              options={(languages ?? []).map((l) => ({
                value: l.id,
                label: `${l.flag ?? ""} ${l.nativeName || l.name} (${l.code})`,
              }))}
            />
          </Form.Item>
          <Form.Item name="name" label={t("common.fields.name")} rules={[{ required: true, message: t("common.fields.nameRequired") }]}>
            <Input placeholder={t("catalog.brands.placeholderName")} />
          </Form.Item>
          <Form.Item name="slug" label={t("common.fields.slug")}>
            <Input placeholder={t("catalog.brands.placeholderSlug")} />
          </Form.Item>
          <Form.Item name="description" label={t("common.fields.description")}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="logoUrl" label={t("catalog.brands.logoUrl")}>
            <Input placeholder={t("catalog.brands.placeholderUrl")} />
          </Form.Item>
          <Form.Item name="websiteUrl" label={t("catalog.brands.website")}>
            <Input placeholder={t("catalog.brands.placeholderWebsite")} />
          </Form.Item>
          {editing && (
            <Form.Item name="status" label={t("common.fields.status")}>
              <Select
                options={[
                  { value: 1, label: t("catalog.status.active") },
                  { value: 2, label: t("catalog.status.inactive") },
                ]}
              />
            </Form.Item>
          )}
        </Form>
      </DrawerForm>
    </CommerceShell>
  );
}
