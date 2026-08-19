import React, { useMemo, useState } from "react";
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
  Tag,
  Tooltip,
} from "antd";
import type { TableColumnsType } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { DataTable, DrawerForm } from "@repo/ui";
import { formatDateTime, SUPPORTED_CURRENCIES, getCurrencyInfo, type CurrencyInfo } from "@repo/utils";
import { useTranslations } from "@repo/localization";
import { CommerceShell } from "../../../components/CommerceShell";
import { StatusTag } from "../../../components/StatusTag";
import { enumLabel } from "../../../types/enums";
import { useDeletePriceList, usePriceLists, useSavePriceList } from "../../../hooks/usePriceLists";
import { useProductPrices } from "../../../hooks/useProductPrices";
import { useTenantCurrencySettings, useExchangeRates } from "../../../hooks/useCurrencies";
import { getApiErrorMessage } from "../../../api/http";
import type { PriceListReadModel } from "../../../types/pricing";

type PriceListRow = PriceListReadModel;

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

  // Tenant currency configuration & exchange rates
  const tenantCurrencyQuery = useTenantCurrencySettings();
  const exchangeRatesQuery = useExchangeRates();

  const baseCurrencyCode = tenantCurrencyQuery.data?.baseCurrencyCode || "SAR";
  const enabledCurrencies = tenantCurrencyQuery.data?.enabledCurrencies ?? [];

  // Currency select options prioritizing tenant enabled currencies & marking Base Currency
  const currencyOptions = useMemo(() => {
    if (enabledCurrencies.length > 0) {
      return enabledCurrencies.map((c) => {
        const isBase = c.currencyCode.toUpperCase() === baseCurrencyCode.toUpperCase();
        return {
          value: c.currencyCode,
          label: `${c.flagIcon || "🏳️"} ${c.currencyCode} — ${c.nameAr || c.nameEn} ${isBase ? `⭐ (${t("settings.currencies.base") || "العملة الأساسية"})` : ""}`,
        };
      });
    }

    return SUPPORTED_CURRENCIES.map((c: CurrencyInfo) => {
      const isBase = c.code.toUpperCase() === baseCurrencyCode.toUpperCase();
      return {
        value: c.code,
        label: `${c.flag} ${c.code} — ${c.nameAr} (${c.nameEn}) ${isBase ? `⭐ (${t("settings.currencies.base") || "العملة الأساسية"})` : ""}`,
      };
    });
  }, [enabledCurrencies, baseCurrencyCode, t]);

  const { data, isLoading, isError, error, refetch } = usePriceLists({
    page,
    pageSize,
    search: search || undefined,
    status: status || undefined,
  });
  const save = useSavePriceList();
  const remove = useDeletePriceList();

  const productPricesQuery = useProductPrices({ pageSize: 500 });
  const productPrices = (productPricesQuery.data?.data ?? []) as { priceListId?: string }[];
  const productCountMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of productPrices) {
      if (p.priceListId) {
        map.set(p.priceListId, (map.get(p.priceListId) ?? 0) + 1);
      }
    }
    return map;
  }, [productPrices]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ taxMode: 1, priority: 0, currencyId: baseCurrencyCode });
    setDrawerOpen(true);
  };

  const openEdit = (record: PriceListReadModel) => {
    setEditing(record);
    const cleanCurrency = record.currencyCode || (record.currencyId && !record.currencyId.includes("-") ? record.currencyId : baseCurrencyCode);
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      description: record.description,
      taxMode: record.taxMode,
      priority: record.priority ?? 0,
      currencyId: cleanCurrency,
    });
    setDrawerOpen(true);
  };

  const onFinish = async (values: Record<string, unknown>) => {
    try {
      if (editing) {
        await save.mutateAsync({
          id: editing.id,
          body: {
            name: values.name as string,
            description: values.description as string | undefined,
            taxMode: values.taxMode as number,
            priority: (values.priority as number) ?? 0,
            currencyId: (values.currencyId as string) || baseCurrencyCode,
          },
        });
        message.success(t("pricing.priceLists.updated"));
      } else {
        await save.mutateAsync({
          body: {
            name: values.name as string,
            code: values.code as string | undefined,
            description: values.description as string | undefined,
            taxMode: values.taxMode as number,
            priority: (values.priority as number) ?? 0,
            currencyId: (values.currencyId as string) || baseCurrencyCode,
          },
        });
        message.success(t("pricing.priceLists.created"));
      }
      setDrawerOpen(false);
      refetch();
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
      title: t("pricing.priceLists.currency"),
      key: "currency",
      width: 160,
      render: (_, record) => {
        const code = record.currencyCode || (record.currencyId && !record.currencyId.includes("-") ? record.currencyId : baseCurrencyCode);
        const info = getCurrencyInfo(code);
        const isBase = code.toUpperCase() === baseCurrencyCode.toUpperCase();
        return (
          <Space size={4}>
            <Tag color="cyan">
              {info ? `${info.flag} ${info.code}` : code}
            </Tag>
            {isBase && (
              <Tag color="gold" style={{ fontSize: 10 }}>
                {t("settings.currencies.base") || "الأساسية"}
              </Tag>
            )}
          </Space>
        );
      },
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
      dataIndex: "id",
      width: 110,
      render: (id: string, record) => {
        const count = productCountMap.get(id) ?? (record as unknown as { productCount?: number }).productCount ?? 0;
        return (
          <Tag color={count > 0 ? "blue" : "default"}>
            {count}
          </Tag>
        );
      },
    },
    {
      title: t("pricing.priceLists.updatedColumn"),
      dataIndex: "updatedAt",
      width: 160,
      render: (v, record) => {
        const lastDate =
          v ??
          record.createdAt ??
          record.versions?.[record.versions.length - 1]?.changedAt ??
          record.publishedAt ??
          record.effectiveFrom;
        return (
          <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>
            {lastDate ? formatDateTime(lastDate) : "—"}
          </span>
        );
      },
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
        dataSource={data?.data ?? []}
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
        onSearch={(term: string) => {
          setSearch(term);
          setPage(1);
        }}
        filters={
          <Select
            placeholder={t("pricing.priceLists.statusFilter")}
            allowClear
            value={status || undefined}
            onChange={(v: string | null) => {
              setStatus(v ?? "");
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
          <Form.Item name="currencyId" label={t("pricing.priceLists.currency")} rules={[{ required: true }]}>
            <Select
              showSearch
              optionFilterProp="label"
              options={currencyOptions}
            />
          </Form.Item>
          <Space size={16} style={{ width: "100%", display: "flex" }}>
            <Form.Item name="taxMode" label={t("pricing.priceLists.taxMode")} style={{ flex: 1 }}>
              <Select
                options={[
                  { value: 1, label: t("pricing.priceLists.inclusive") },
                  { value: 2, label: t("pricing.priceLists.exclusive") },
                ]}
              />
            </Form.Item>
            <Form.Item name="priority" label={t("pricing.priceLists.priority")} style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Space>
        </Form>
      </DrawerForm>
    </CommerceShell>
  );
}
