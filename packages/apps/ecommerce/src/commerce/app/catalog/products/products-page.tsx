"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Button,
  Dropdown,
  message,
  Modal,
  Select,
  Space,
  Tooltip,
  Switch,
  Drawer,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  ProductOutlined,
  StopOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  FilterOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { DataTable } from "@repo/ui";
import { formatDateTime, formatCurrency } from "@repo/utils";
import { useTranslations } from "@repo/localization";
import { CommerceShell } from "../../../components/CommerceShell";
import { StatusTag } from "../../../components/StatusTag";
import { enumLabel, enumOptions } from "../../../types/enums";
import type { ProductListItem } from "../../../types/catalog";
import {
  useDeleteProduct,
  useProducts,
  useSetProductStatus,
  useBulkSetProductStatus,
  useBulkDeleteProducts,
} from "../../../hooks/useProducts";
import { useBrands } from "../../../hooks/useBrands";
import { useCategories } from "../../../hooks/useCategories";
import { useTags } from "../../../hooks/useTags";
import { getApiErrorMessage } from "../../../api/http";
import { useQueryClient } from "@tanstack/react-query";

type ProductRow = ProductListItem & Record<string, unknown>;

export function ProductsPage() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // State initialized from URL
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [pageSize, setPageSize] = useState(
    Number(searchParams.get("pageSize")) || 10,
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState<number | undefined>(
    searchParams.get("status") ? Number(searchParams.get("status")) : undefined,
  );
  const [type, setType] = useState<number | undefined>(
    searchParams.get("type") ? Number(searchParams.get("type")) : undefined,
  );
  const [brandId, setBrandId] = useState<string | undefined>(
    searchParams.get("brandId") || undefined,
  );
  const [categoryId, setCategoryId] = useState<string | undefined>(
    searchParams.get("categoryId") || undefined,
  );
  const [tagId, setTagId] = useState<string | undefined>(
    searchParams.get("tagId") || undefined,
  );
  const [visibility, setVisibility] = useState<number | undefined>(
    searchParams.get("visibility")
      ? Number(searchParams.get("visibility"))
      : undefined,
  );
  const [structure, setStructure] = useState<number | undefined>(
    searchParams.get("structure")
      ? Number(searchParams.get("structure"))
      : undefined,
  );

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sync state to URL
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (pageSize !== 10) params.set("pageSize", String(pageSize));
    if (search) params.set("search", search);
    if (status) params.set("status", String(status));
    if (type) params.set("type", String(type));
    if (brandId) params.set("brandId", brandId);
    if (categoryId) params.set("categoryId", categoryId);
    if (tagId) params.set("tagId", tagId);
    if (visibility) params.set("visibility", String(visibility));
    if (structure) params.set("structure", String(structure));

    router.replace(`${pathname}?${params.toString()}`);
  }, [
    page,
    pageSize,
    search,
    status,
    type,
    brandId,
    categoryId,
    tagId,
    visibility,
    structure,
    pathname,
    router,
  ]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  const query = useMemo(
    () => ({
      page,
      pageSize,
      search: search || undefined,
      status: status !== undefined ? String(status) : undefined,
      type: type !== undefined ? String(type) : undefined,
      brandId,
      categoryId,
      tagId,
      visibility: visibility !== undefined ? String(visibility) : undefined,
      structure: structure !== undefined ? String(structure) : undefined,
    }),
    [
      page,
      pageSize,
      search,
      status,
      type,
      brandId,
      categoryId,
      tagId,
      visibility,
      structure,
    ],
  );

  const { data, isLoading, isError, error, refetch } = useProducts(query);
  const setStatusMutation = useSetProductStatus();
  const deleteMutation = useDeleteProduct();
  const bulkStatusMutation = useBulkSetProductStatus();
  const bulkDeleteMutation = useBulkDeleteProducts();

  // Dictionary queries for filters
  const { data: brandsData } = useBrands({ pageSize: 100 });
  const { data: categoriesData } = useCategories();
  const { data: tagsData } = useTags({ pageSize: 100 });

  const total = data?.count ?? 0;
  const rows = (data?.data ?? []) as ProductRow[];

  const runBulk = async (
    action: "publish" | "unpublish" | "archive" | "restore",
  ) => {
    if (selectedRowKeys.length === 0) return;
    try {
      await bulkStatusMutation.mutateAsync({
        ids: selectedRowKeys.map(String),
        action,
      });
      message.success(
        t("catalog.products.bulkUpdated", { count: selectedRowKeys.length }),
      );
      setSelectedRowKeys([]);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const confirmBulkDelete = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: t("catalog.products.deleteTitlePlural"),
      content: t("catalog.products.deleteContentPlural", {
        count: selectedRowKeys.length,
      }),
      okText: t("common.actions.delete"),
      okButtonProps: { danger: true, loading: bulkDeleteMutation.isPending },
      onOk: async () => {
        try {
          await bulkDeleteMutation.mutateAsync(selectedRowKeys.map(String));
          message.success(t("catalog.products.deleted"));
          setSelectedRowKeys([]);
        } catch (e) {
          message.error(getApiErrorMessage(e));
        }
      },
    });
  };

  const confirmDeleteSingle = (id: string) => {
    Modal.confirm({
      title: t("catalog.products.deleteTitle"),
      content: t("catalog.products.deleteContent"),
      okText: t("common.actions.delete"),
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          message.success(t("catalog.products.deleted"));
        } catch (e) {
          message.error(getApiErrorMessage(e));
        }
      },
    });
  };

  const togglePublishStatus = async (id: string, currentStatus: number) => {
    const isPublished = currentStatus === 2; // Assuming 2 is Published based on enums
    const action = isPublished ? "unpublish" : "publish";

    try {
      await setStatusMutation.mutateAsync({ id, action });
      message.success(
        isPublished
          ? t("catalog.products.unpublished")
          : t("catalog.products.published"),
      );
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const columns: TableColumnsType<ProductRow> = [
    {
      title: t("catalog.products.list.productColumn"),
      key: "name",
      width: 320,
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
              flexShrink: 0,
            }}
          >
            {record.primaryMediaUrl ? (
              <img
                src={record.primaryMediaUrl}
                alt={record.name}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.visibility =
                    "hidden";
                }}
              />
            ) : (
              <ProductOutlined style={{ color: "var(--text-secondary)" }} />
            )}
          </div>
          <div>
            <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>
              {record.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {record.sku || record.code || record.id.slice(0, 8)}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: t("catalog.products.list.brandColumn"),
      dataIndex: "brandId",
      width: 140,
      render: (val, record) => {
        // Fallback to searching the dictionary if brandName is missing
        if (record.brandName) return record.brandName;
        if (val && Array.isArray(brandsData?.data)) {
          const b = (brandsData.data as any[]).find((x) => x.id === val);
          if (b) return b.name || b.translations?.[0]?.name;
        }
        return "\u2014";
      },
    },
    // {
    //   title: t("catalog.products.list.visibilityColumn"),
    //   dataIndex: "visibility",
    //   width: 130,
    //   render: (value) => (value ? enumLabel("productVisibility", value, t) : "\u2014"),
    // },
    {
      title: t("catalog.products.list.priceColumn"),
      key: "price",
      width: 130,
      render: (_, record) =>
        record.price === undefined || record.price === null
          ? "\u2014"
          : formatCurrency(record.price),
    },
    {
      title: t("catalog.products.list.stockColumn"),
      dataIndex: "stock",
      width: 100,
      render: (value) =>
        value === undefined || value === null ? "\u2014" : value,
    },
    {
      title: t("catalog.products.list.publishSwitch"),
      key: "published",
      width: 100,
      render: (_, record) => (
        <Switch
          checked={record.status === 2}
          loading={
            setStatusMutation.isPending &&
            setStatusMutation.variables?.id === record.id
          }
          onChange={(checked, e) => {
            e.stopPropagation();
            togglePublishStatus(record.id, record.status);
          }}
        />
      ),
    },
    {
      title: t("catalog.products.list.statusColumn"),
      dataIndex: "status",
      width: 130,
      render: (value) => {
        let key = String(value);
        if (value === 1) key = "draft";
        else if (value === 2) key = "published";
        else if (value === 3) key = "unpublished";
        else if (value === 4) key = "archived";
        return <StatusTag value={key} />;
      },
    },
    {
      title: t("catalog.products.list.updatedColumn"),
      dataIndex: "updatedAt",
      width: 170,
      render: (value) => (
        <span style={{ color: "var(--text-secondary)" }}>
          {formatDateTime(value)}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 60,
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              { key: "edit", label: t("common.actions.edit") },
              { type: "divider" },
              {
                key: "publish",
                label: t("catalog.products.list.publish"),
                disabled: record.status === 2,
              },
              {
                key: "unpublish",
                label: t("catalog.products.list.unpublish"),
                disabled: record.status !== 2,
              },
              {
                key: "archive",
                label: t("catalog.products.list.archive"),
                disabled: record.status === 4,
              },
              {
                key: "restore",
                label: t("catalog.products.detail.restore"),
                disabled: record.status !== 4,
              },
              { type: "divider" },
              {
                key: "delete",
                label: t("common.actions.delete"),
                danger: true,
              },
            ],
            onClick: ({ key, domEvent }) => {
              domEvent.stopPropagation();
              if (key === "edit")
                router.push(`/admin/catalog/products/${record.id}`);
              if (
                key === "publish" ||
                key === "unpublish" ||
                key === "archive" ||
                key === "restore"
              ) {
                setStatusMutation.mutate({ id: record.id, action: key });
              }
              if (key === "delete") confirmDeleteSingle(record.id);
            },
          }}
        >
          <Button type="text" size="small" onClick={(e) => e.stopPropagation()}>
            ...
          </Button>
        </Dropdown>
      ),
    },
  ];

  const resetFilters = () => {
    setStatus(undefined);
    setType(undefined);
    setBrandId(undefined);
    setCategoryId(undefined);
    setTagId(undefined);
    setVisibility(undefined);
    setStructure(undefined);
    setSearch("");
    setPage(1);
  };

  const filters = (
    <div
      style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Select
        value={status}
        allowClear
        placeholder={t("common.actions.allStatuses")}
        options={enumOptions("productStatus", t)}
        onChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        style={{ width: 160 }}
      />
      <Select
        value={brandId}
        allowClear
        placeholder={t("catalog.products.list.brandPlaceholder")}
        options={
          Array.isArray(brandsData?.data)
            ? (brandsData.data as any[]).map((b) => ({
                value: b.id,
                label: b.name || b.translations?.[0]?.name || b.id,
              }))
            : []
        }
        onChange={(v) => {
          setBrandId(v);
          setPage(1);
        }}
        style={{ width: 160 }}
      />
      <Button
        type="dashed"
        icon={<FilterOutlined />}
        onClick={() => setIsFilterDrawerOpen(true)}
      >
        {t("catalog.products.list.advancedFilters")}
      </Button>
      {(status ||
        type ||
        brandId ||
        categoryId ||
        tagId ||
        visibility ||
        structure ||
        search) && (
        <Button type="link" onClick={resetFilters}>
          {t("catalog.products.list.resetFilters")}
        </Button>
      )}
    </div>
  );

  return (
    <CommerceShell
      title={t("catalog.products.title")}
      description={t("catalog.products.description")}
      breadcrumbs={[
        { title: t("catalog.title"), href: "/admin/catalog" },
        { title: t("catalog.products.title") },
      ]}
      actions={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/admin/catalog/products/new")}
        >
          {t("catalog.products.new")}
        </Button>
      }
    >
      <DataTable<ProductRow>
        columns={columns}
        dataSource={rows}
        rowKey="id"
        loading={
          isLoading ||
          bulkStatusMutation.isPending ||
          bulkDeleteMutation.isPending
        }
        error={error ? new Error(getApiErrorMessage(error)) : undefined}
        onRefresh={refetch}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={(p, ps) => {
          setPage(p);
          setPageSize(ps);
        }}
        searchable
        searchPlaceholder={t("catalog.products.list.searchPlaceholder")}
        onSearch={(term) => {
          setSearch(term);
          setPage(1);
        }}
        filters={filters}
        title={
          selectedRowKeys.length > 0
            ? t("catalog.products.list.selectedCount", {
                count: selectedRowKeys.length,
              })
            : t("catalog.products.count", { count: total })
        }
        onRowClick={(record) =>
          router.push(`/admin/catalog/products/${record.id}`)
        }
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        bulkActions={
          <>
            <Tooltip title={t("catalog.products.list.publishSelected")}>
              <Button
                icon={<CheckCircleOutlined />}
                onClick={() => runBulk("publish")}
              >
                {t("catalog.products.list.publish")}
              </Button>
            </Tooltip>
            <Tooltip title={t("catalog.products.list.unpublishSelected")}>
              <Button
                icon={<StopOutlined />}
                onClick={() => runBulk("unpublish")}
              >
                {t("catalog.products.list.unpublish")}
              </Button>
            </Tooltip>
            <Tooltip title={t("catalog.products.list.archiveSelected")}>
              <Button
                icon={<InboxOutlined />}
                onClick={() => runBulk("archive")}
              >
                {t("catalog.products.list.archive")}
              </Button>
            </Tooltip>
            <Tooltip title={t("catalog.products.detail.restore")}>
              <Button
                icon={<UndoOutlined />}
                onClick={() => runBulk("restore")}
              >
                {t("catalog.products.detail.restore")}
              </Button>
            </Tooltip>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={confirmBulkDelete}
            >
              {t("common.actions.delete")}
            </Button>
          </>
        }
        emptyTitle={t("catalog.products.list.emptyTitle")}
        emptyDescription={t("catalog.products.list.emptyDescription")}
        emptyAction={{
          label: t("catalog.products.new"),
          onClick: () => router.push("/admin/catalog/products/new"),
        }}
      />

      <Drawer
        title={t("catalog.products.list.advancedFilters")}
        placement="right"
        onClose={() => setIsFilterDrawerOpen(false)}
        open={isFilterDrawerOpen}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              {t("catalog.products.list.typeColumn")}
            </label>
            <Select
              value={type}
              allowClear
              placeholder={t("catalog.products.list.productTypePlaceholder")}
              options={enumOptions("productType", t)}
              onChange={(v) => {
                setType(v);
                setPage(1);
              }}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              {t("catalog.products.list.visibilityColumn")}
            </label>
            <Select
              value={visibility}
              allowClear
              placeholder={t("catalog.products.list.visibilityPlaceholder")}
              options={enumOptions("productVisibility", t)}
              onChange={(v) => {
                setVisibility(v);
                setPage(1);
              }}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              {t("catalog.products.list.structureColumn")}
            </label>
            <Select
              value={structure}
              allowClear
              placeholder={t("catalog.products.list.structurePlaceholder")}
              options={enumOptions("productStructure", t)}
              onChange={(v) => {
                setStructure(v);
                setPage(1);
              }}
              style={{ width: "100%" }}
            />
          </div>
          <Button
            type="primary"
            block
            onClick={() => setIsFilterDrawerOpen(false)}
          >
            {t("common.actions.apply")}
          </Button>
        </Space>
      </Drawer>
    </CommerceShell>
  );
}
