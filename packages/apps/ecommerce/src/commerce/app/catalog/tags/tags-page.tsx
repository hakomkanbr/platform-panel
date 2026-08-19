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
import { DeleteOutlined, PlusOutlined, SyncOutlined, TagsOutlined } from "@ant-design/icons";
import { DataTable, DrawerForm } from "@repo/ui";
import { formatDateTime } from "@repo/utils";
import { useTranslations } from "@repo/localization";
import { CommerceShell } from "../../../components/CommerceShell";
import { StatusTag } from "../../../components/StatusTag";
import { generateSlug, slugRule } from "../../../utils/slug";
import { useDeleteTag, useSaveTag, useSetTagStatus, useTags } from "../../../hooks/useTags";
import { useCommerce } from "../../../context/CommerceContext";
import { useProjectLanguages } from "../../../hooks/useLanguages";
import { getApiErrorMessage } from "../../../api/http";
import type { TagReadModel as Tag } from "../../../types/catalog";

type TagRow = Tag & Record<string, unknown>;

export function TagsPage() {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [form] = Form.useForm();
  
  const { projectId } = useCommerce();
  const { data: languages } = useProjectLanguages(projectId);
  const defaultLanguage = languages?.find((l) => l.isDefault) ?? languages?.[0];

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

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    if (defaultLanguage) {
      form.setFieldValue("languageId", defaultLanguage.id);
    }
    setIsSlugCustomized(false);
    setDrawerOpen(true);
  };

  const openEdit = (tag: Tag) => {
    setEditing(tag);
    const trans = tag.translations?.[0];
    form.setFieldsValue({ 
      name: tag.name || trans?.name, 
      slug: tag.slug || trans?.slug, 
      status: tag.status,
      // @ts-ignore
      languageId: tag.languageId ?? defaultLanguage?.id,
    });
    setIsSlugCustomized(true);
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
          slug: (values.slug as string) || generateSlug(values.name as string),
          status: (values.status as number) ?? 1,
          languageId: selectedLanguageId,
          cultureCode: selectedCulture,
        } as Partial<Tag> & { languageId?: string; cultureCode?: string },
      });
      message.success(editing ? t("catalog.tags.updated") : t("catalog.tags.created"));
      setDrawerOpen(false);
      setEditing(null);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const columns: TableColumnsType<TagRow> = [
    {
      title: t("catalog.tags.title"),
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
            <div style={{ fontWeight: 500 }}>{record.name || record.translations?.[0]?.name}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{record.slug || record.translations?.[0]?.slug}</div>
          </div>
        </Space>
      ),
    },
    { title: t("catalog.brands.productsColumn"), dataIndex: "productCount", width: 110, render: (v) => v ?? 0 },
    { title: t("common.fields.status"), dataIndex: "status", width: 120, render: (v) => <StatusTag value={v} /> },
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
          <Button type="link" size="small" onClick={() => setStatusMutation.mutateAsync({ id: record.id, status: record.status === 1 ? 2 : 1 })}>
            {record.status === 1 ? t("common.actions.deactivate") : t("common.actions.activate")}
          </Button>
          <Popconfirm
            title={t("catalog.tags.deleteConfirm")}
            onConfirm={async () => {
              try {
                await remove.mutateAsync(record.id);
                message.success(t("catalog.tags.deleted"));
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
      title={t("catalog.tags.title")}
      description={t("catalog.tags.description")}
      breadcrumbs={[{ title: t("catalog.title"), href: "/admin/catalog" }, { title: t("catalog.tags.title") }]}
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {t("catalog.tags.new")}
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
        searchPlaceholder={t("catalog.tags.searchPlaceholder")}
        onSearch={(term) => {
          setSearch(term);
          setPage(1);
        }}
        filters={
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
        }
        title={t("catalog.tags.count", { count: data?.count ?? 0 })}
        emptyTitle={t("catalog.tags.emptyTitle")}
        emptyDescription={t("catalog.tags.emptyDescription")}
        emptyAction={{ label: t("catalog.tags.new"), onClick: openCreate }}
      />

      <DrawerForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? t("catalog.tags.drawerEdit") : t("catalog.tags.drawerCreate")}
        width={480}
        form={form}
        loading={save.isPending}
        onFinish={onFinish}
        submitLabel={editing ? t("common.actions.saveChanges") : t("catalog.tags.submitCreate")}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} onValuesChange={handleValuesChange}>
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
            <Input placeholder={t("catalog.tags.placeholderName")} />
          </Form.Item>
          <Form.Item name="slug" label={t("common.fields.slug")} rules={[slugRule(t)]}>
            <Input
              placeholder={t("catalog.tags.placeholderSlug")}
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
