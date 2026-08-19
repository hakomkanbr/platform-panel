"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { AsyncBoundary, DrawerForm, EmptyState } from "@repo/ui";
import { formatCurrency, formatDateTime, SUPPORTED_CURRENCIES, getCurrencyInfo, type CurrencyInfo } from "@repo/utils";
import { useTranslations } from "@repo/localization";
import { CommerceShell } from "../../../components/CommerceShell";
import { StatusTag } from "../../../components/StatusTag";
import { enumLabel } from "../../../types/enums";
import type { PriceListReadModel, ProductPriceReadModel } from "../../../types/pricing";
import { priceListsApi } from "../../../api/pricing/price-lists";
import {
  useActivatePriceList,
  useArchivePriceList,
  useDeactivatePriceList,
  useDeletePriceList,
  usePriceList,
  usePublishPriceList,
  useSavePriceList,
} from "../../../hooks/usePriceLists";
import { useDeleteProductPrice, useProductPrices, useSaveProductPrice } from "../../../hooks/useProductPrices";
import { useProducts } from "../../../hooks/useProducts";
import { useTenantCurrencySettings, useExchangeRates } from "../../../hooks/useCurrencies";
import { useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../api/http";
import dayjs from "dayjs";

const { Text, Paragraph } = Typography;

// Deterministic valid GUID mappings for channels, customer groups, and regions
const CHANNEL_OPTIONS = [
  { value: "01950001-0000-7000-8000-000000000001", label: "المتجر الإلكتروني (Web Store)" },
  { value: "01950001-0000-7000-8000-000000000002", label: "تطبيق الجوال (Mobile App)" },
  { value: "01950001-0000-7000-8000-000000000003", label: "نقاط البيع (POS)" },
  { value: "01950001-0000-7000-8000-000000000004", label: "سوق المنصة (Marketplace)" },
];

const GROUP_OPTIONS = [
  { value: "01950002-0000-7000-8000-000000000001", label: "تجار الجملة (B2B Wholesale)" },
  { value: "01950002-0000-7000-8000-000000000002", label: "عملاء كبار الشخصيات (VIP Clients)" },
  { value: "01950002-0000-7000-8000-000000000003", label: "العملاء المسجلين (Registered)" },
  { value: "01950002-0000-7000-8000-000000000004", label: "المشتركون الدائمون (Subscribers)" },
];

const REGION_OPTIONS = [
  { value: "01950003-0000-7000-8000-000000000001", label: "المملكة العربية السعودية (KSA)" },
  { value: "01950003-0000-7000-8000-000000000002", label: "الإمارات العربية المتحدة (UAE)" },
  { value: "01950003-0000-7000-8000-000000000003", label: "دول الخليج العربي (GCC)" },
  { value: "01950003-0000-7000-8000-000000000004", label: "الشرق الأوسط وشمال أفريقيا (MENA)" },
  { value: "01950003-0000-7000-8000-000000000005", label: "جميع الدول (Global)" },
];

function getFriendlyName(id: string, options: { value: string; label: string }[]) {
  const found = options.find(
    (o) => o.value.toLowerCase() === id.toLowerCase() || o.value.includes(id) || id.includes(o.value)
  );
  return found?.label ?? id;
}

// Custom modern Guidance Alert Component
function TabGuidanceAlert({
  title,
  message,
  note,
  noteLabel,
  type = "info",
}: {
  title: string;
  message: string;
  note?: string;
  noteLabel?: string;
  type?: "info" | "warning" | "success";
}) {
  const isWarning = type === "warning";
  const bg = isWarning
    ? "linear-gradient(135deg, rgba(250, 173, 20, 0.08) 0%, rgba(250, 173, 20, 0.02) 100%)"
    : "linear-gradient(135deg, rgba(24, 144, 255, 0.08) 0%, rgba(24, 144, 255, 0.02) 100%)";
  const borderColor = isWarning ? "rgba(250, 173, 20, 0.3)" : "rgba(24, 144, 255, 0.25)";
  const iconColor = isWarning ? "#faad14" : "#1890ff";
  const titleColor = isWarning ? "#d48806" : "#096dd9";

  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 22,
        padding: "16px 20px",
        borderRadius: 14,
        background: bg,
        border: `1px solid ${borderColor}`,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: isWarning ? "rgba(250, 173, 20, 0.15)" : "rgba(24, 144, 255, 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: iconColor,
          fontSize: 18,
          marginTop: 2,
        }}
      >
        <InfoCircleOutlined />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: titleColor, marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-primary, #262626)", lineHeight: 1.6 }}>
          {message}
        </div>
        {note && (
          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: "var(--text-secondary, #666)",
              background: "rgba(255, 255, 255, 0.75)",
              border: "1px solid rgba(0,0,0,0.04)",
              padding: "5px 12px",
              borderRadius: 8,
              display: "inline-block",
            }}
          >
            💡 <strong style={{ color: "var(--text-primary, #333)" }}>{noteLabel ?? "ملاحظة هامة:"}</strong> {note}
          </div>
        )}
      </div>
    </div>
  );
}

export function PriceListDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations();

  const { data: priceList, isLoading, isError, error, refetch } = usePriceList(id);
  const savePriceList = useSavePriceList();
  const remove = useDeletePriceList();
  const publish = usePublishPriceList();
  const activate = useActivatePriceList();
  const deactivate = useDeactivatePriceList();
  const archive = useArchivePriceList();

  // Product prices associated with this price list
  const productPricesQuery = useProductPrices({ priceListId: id, pageSize: 100 });
  const productPrices = (productPricesQuery.data?.data ?? []) as ProductPriceReadModel[];
  const saveProductPrice = useSaveProductPrice();
  const deleteProductPrice = useDeleteProductPrice();

  // Products hook for lookup
  const productsQuery = useProducts({ pageSize: 100 });
  const productsList = productsQuery.data?.data ?? [];

  // Modals & Drawers state
  const [channelModal, setChannelModal] = useState(false);
  const [groupModal, setGroupModal] = useState(false);
  const [regionModal, setRegionModal] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [addPriceDrawerOpen, setAddPriceDrawerOpen] = useState(false);

  const [editForm] = Form.useForm();
  const [addPriceForm] = Form.useForm();

  // Tenant currency configuration & exchange rates
  const tenantCurrencyQuery = useTenantCurrencySettings();
  const exchangeRatesQuery = useExchangeRates();

  const baseCurrencyCode = tenantCurrencyQuery.data?.baseCurrencyCode || "SAR";
  const enabledCurrencies = tenantCurrencyQuery.data?.enabledCurrencies ?? [];
  const ratesList = exchangeRatesQuery.data ?? [];

  const priceListCurrencyCode = useMemo(() => {
    if (!priceList) return baseCurrencyCode;
    return priceList.currencyCode || (priceList.currencyId && !priceList.currencyId.includes("-") ? priceList.currencyId : baseCurrencyCode);
  }, [priceList, baseCurrencyCode]);

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

  const conversionRate = useMemo(() => {
    if (!priceListCurrencyCode || priceListCurrencyCode.toUpperCase() === baseCurrencyCode.toUpperCase()) return null;
    const direct = ratesList.find(
      (r) => r.isCurrent && r.fromCurrency.toUpperCase() === priceListCurrencyCode.toUpperCase() && r.toCurrency.toUpperCase() === baseCurrencyCode.toUpperCase()
    );
    if (direct) return direct.rate;
    const inverse = ratesList.find(
      (r) => r.isCurrent && r.fromCurrency.toUpperCase() === baseCurrencyCode.toUpperCase() && r.toCurrency.toUpperCase() === priceListCurrencyCode.toUpperCase()
    );
    if (inverse && inverse.rate > 0) return 1 / inverse.rate;
    return null;
  }, [ratesList, priceListCurrencyCode, baseCurrencyCode]);

  // Handlers for Lifecycle Actions
  const handlePublish = async () => {
    Modal.confirm({
      title: t("pricing.priceLists.detail.publishConfirmTitle"),
      content: t("pricing.priceLists.detail.publishConfirmContent"),
      okText: t("pricing.priceLists.detail.publishAction"),
      onOk: async () => {
        try {
          await publish.mutateAsync(id);
          message.success(t("pricing.priceLists.published"));
        } catch (e) {
          message.error(getApiErrorMessage(e));
        }
      },
    });
  };

  const handleActivate = async () => {
    try {
      await activate.mutateAsync(id);
      message.success(t("pricing.priceLists.activated"));
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleDeactivate = async () => {
    try {
      await deactivate.mutateAsync(id);
      message.success(t("pricing.priceLists.deactivated"));
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleArchive = async () => {
    Modal.confirm({
      title: t("pricing.priceLists.detail.archiveConfirmTitle"),
      content: t("pricing.priceLists.detail.archiveConfirmContent"),
      okText: t("pricing.priceLists.detail.archiveAction"),
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await archive.mutateAsync(id);
          message.success(t("pricing.priceLists.archived"));
        } catch (e) {
          message.error(getApiErrorMessage(e));
        }
      },
    });
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: t("pricing.priceLists.deleteTitle"),
      content: t("pricing.priceLists.deleteContent"),
      okText: t("common.actions.delete"),
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await remove.mutateAsync(id);
          message.success(t("pricing.priceLists.deleted"));
          router.push("/admin/pricing/price-lists");
        } catch (e) {
          message.error(getApiErrorMessage(e));
        }
      },
    });
  };

  // Open Edit Price List Drawer
  const openEditDrawer = () => {
    if (!priceList) return;
    editForm.setFieldsValue({
      name: priceList.name,
      description: priceList.description,
      taxMode: priceList.taxMode,
      currencyId: priceListCurrencyCode,
      priority: priceList.priority ?? 0,
      effectiveFrom: priceList.effectiveFrom ? dayjs(priceList.effectiveFrom) : null,
      effectiveTo: priceList.effectiveTo ? dayjs(priceList.effectiveTo) : null,
    });
    setEditDrawerOpen(true);
  };

  const handleSaveEdit = async (values: Record<string, unknown>) => {
    try {
      await savePriceList.mutateAsync({
        id,
        body: {
          name: values.name as string,
          description: values.description as string | undefined,
          taxMode: values.taxMode as number,
          currencyId: (values.currencyId as string) || priceListCurrencyCode,
          priority: (values.priority as number) ?? 0,
          effectiveFrom: values.effectiveFrom ? (values.effectiveFrom as dayjs.Dayjs).toISOString() : new Date().toISOString(),
          effectiveTo: values.effectiveTo ? (values.effectiveTo as dayjs.Dayjs).toISOString() : null,
        },
      });
      message.success(t("pricing.priceLists.updated"));
      setEditDrawerOpen(false);
      refetch();
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  // Assignment handlers
  const handleAssignChannel = async (channelId: string) => {
    try {
      await priceListsApi.assignChannel(id, { channelId });
      message.success(t("pricing.priceLists.detail.channelAssigned"));
      setChannelModal(false);
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list"] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleRemoveChannel = async (channelId: string) => {
    try {
      await priceListsApi.removeChannel(id, channelId);
      message.success(t("pricing.priceLists.detail.channelRemoved"));
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list"] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleAssignGroup = async (groupId: string) => {
    try {
      await priceListsApi.assignCustomerGroup(id, { customerGroupId: groupId });
      message.success(t("pricing.priceLists.detail.groupAssigned"));
      setGroupModal(false);
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list"] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleRemoveGroup = async (groupId: string) => {
    try {
      await priceListsApi.removeCustomerGroup(id, groupId);
      message.success(t("pricing.priceLists.detail.groupRemoved"));
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list"] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleAssignRegion = async (regionId: string) => {
    try {
      await priceListsApi.assignRegion(id, { regionId });
      message.success(t("pricing.priceLists.detail.regionAssigned"));
      setRegionModal(false);
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list"] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleRemoveRegion = async (regionId: string) => {
    try {
      await priceListsApi.removeRegion(id, regionId);
      message.success(t("pricing.priceLists.detail.regionRemoved"));
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list"] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  // Add Product Price directly to this Price List
  const handleAddProductPrice = async (values: Record<string, unknown>) => {
    try {
      await saveProductPrice.mutateAsync({
        body: {
          priceListId: id,
          productId: values.productId as string,
          currencyId: priceListCurrencyCode,
          baseAmount: (values.baseAmount as number) ?? 0,
          compareAtAmount: values.compareAtAmount as number | undefined,
          minAmount: values.minAmount as number | undefined,
          maxAmount: values.maxAmount as number | undefined,
          costAmount: values.costAmount as number | undefined,
          status: 5, // Published
          effectiveFrom: values.effectiveFrom ? (values.effectiveFrom as dayjs.Dayjs).toISOString() : new Date().toISOString(),
          effectiveTo: values.effectiveTo ? (values.effectiveTo as dayjs.Dayjs).toISOString() : null,
        },
      });
      message.success(t("pricing.productPrices.created"));
      setAddPriceDrawerOpen(false);
      addPriceForm.resetFields();
      productPricesQuery.refetch();
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  // Columns for Tables
  const productColumns: TableColumnsType<ProductPriceReadModel> = [
    {
      title: t("pricing.productPrices.productColumn"),
      dataIndex: "productId",
      render: (pId) => {
        const prod = productsList.find((p) => p.id === pId);
        return (
          <Space direction="vertical" size={2}>
            <Text strong>{prod?.name ?? pId}</Text>
            {prod?.code && <Text type="secondary" style={{ fontSize: 11 }}>{prod.code}</Text>}
          </Space>
        );
      },
    },
    {
      title: t("pricing.productPrices.basePriceColumn"),
      dataIndex: "basePrice",
      render: (v, r) => <Text strong style={{ color: "var(--color-primary, #1890ff)" }}>{formatCurrency(v, r.currencyId)}</Text>,
    },
    {
      title: t("pricing.productPrices.compareAtColumn"),
      dataIndex: "compareAtPrice",
      render: (v, r) => (v ? <del style={{ color: "var(--text-secondary)" }}>{formatCurrency(v, r.currencyId)}</del> : "\u2014"),
    },
    {
      title: t("pricing.productPrices.statusColumn"),
      dataIndex: "status",
      width: 110,
      render: (v) => <StatusTag value={v} />,
    },
    {
      title: t("pricing.productPrices.updatedColumn"),
      dataIndex: "updatedAt",
      width: 140,
      render: (v) => <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{formatDateTime(v)}</span>,
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title={t("pricing.productPrices.deleteTitle")}
          onConfirm={async () => {
            try {
              await deleteProductPrice.mutateAsync(record.id as string);
              message.success(t("pricing.productPrices.deleted"));
              productPricesQuery.refetch();
            } catch (e) {
              message.error(getApiErrorMessage(e));
            }
          }}
        >
          <Button type="link" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const channelColumns: TableColumnsType<{ id: string }> = [
    {
      title: t("pricing.priceLists.detail.channelColumn"),
      dataIndex: "id",
      render: (cid) => (
        <Space>
          <Tag color="blue">{getFriendlyName(cid, CHANNEL_OPTIONS)}</Tag>
          <Text type="secondary" style={{ fontSize: 11 }}>{cid}</Text>
        </Space>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title={t("pricing.priceLists.detail.removeChannelConfirm")}
          onConfirm={() => handleRemoveChannel(record.id)}
        >
          <Button type="link" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const groupColumns: TableColumnsType<{ id: string }> = [
    {
      title: t("pricing.priceLists.detail.customerGroupColumn"),
      dataIndex: "id",
      render: (gid) => (
        <Space>
          <Tag color="purple">{getFriendlyName(gid, GROUP_OPTIONS)}</Tag>
          <Text type="secondary" style={{ fontSize: 11 }}>{gid}</Text>
        </Space>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title={t("pricing.priceLists.detail.removeGroupConfirm")}
          onConfirm={() => handleRemoveGroup(record.id)}
        >
          <Button type="link" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const regionColumns: TableColumnsType<{ id: string }> = [
    {
      title: t("pricing.priceLists.detail.regionColumn"),
      dataIndex: "id",
      render: (rid) => (
        <Space>
          <Tag color="cyan">{getFriendlyName(rid, REGION_OPTIONS)}</Tag>
          <Text type="secondary" style={{ fontSize: 11 }}>{rid}</Text>
        </Space>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title={t("pricing.priceLists.detail.removeRegionConfirm")}
          onConfirm={() => handleRemoveRegion(record.id)}
        >
          <Button type="link" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const versionColumns = [
    { title: t("pricing.priceLists.detail.versions.versionNumber"), dataIndex: "versionNumber", width: 90 },
    { title: t("pricing.priceLists.detail.versions.changeSummary"), dataIndex: "changeSummary" },
    { title: t("pricing.priceLists.detail.versions.changedBy"), dataIndex: "changedBy", render: (v: string) => v || "\u2014" },
    { title: t("pricing.priceLists.detail.versions.changedAt"), dataIndex: "changedAt", render: (v: string) => formatDateTime(v) },
  ];

  // Lifecycle status determination
  const isDraft = priceList?.status === 1;
  const isPublished = priceList?.status === 3;
  const isArchived = priceList?.status === 4;
  const isActive = priceList?.isActive ?? false;

  return (
    <CommerceShell
      title={priceList?.name ?? t("pricing.priceLists.title")}
      description={priceList ? `${t("priceLists.codeColumn")}: ${priceList.code}` : undefined}
      breadcrumbs={[
        { title: t("pricing.title"), href: "/admin/pricing" },
        { title: t("pricing.priceLists.title"), href: "/admin/pricing/price-lists" },
        { title: priceList?.name ?? t("pricing.priceLists.detail.loading") },
      ]}
      actions={
        <Space wrap>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/admin/pricing/price-lists")}>
            {t("common.actions.back")}
          </Button>

          {/* Edit Info Button */}
          {!isArchived && (
            <Button icon={<EditOutlined />} onClick={openEditDrawer}>
              {t("pricing.priceLists.detail.editAction")}
            </Button>
          )}

          {/* Publish Button */}
          {isDraft && (
            <Button
              type="primary"
              icon={<UploadOutlined />}
              loading={publish.isPending}
              onClick={handlePublish}
              style={{ background: "#52c41a", borderColor: "#52c41a" }}
            >
              {t("pricing.priceLists.detail.publishAction")}
            </Button>
          )}

          {/* Activate / Deactivate */}
          {!isArchived && !isDraft && (
            isActive ? (
              <Button icon={<PauseCircleOutlined />} loading={deactivate.isPending} onClick={handleDeactivate}>
                {t("pricing.priceLists.detail.deactivateAction")}
              </Button>
            ) : (
              <Button type="primary" icon={<PlayCircleOutlined />} loading={activate.isPending} onClick={handleActivate}>
                {t("pricing.priceLists.detail.activateAction")}
              </Button>
            )
          )}

          {/* Archive Button */}
          {!isArchived && (
            <Button danger icon={<SafetyCertificateOutlined />} loading={archive.isPending} onClick={handleArchive}>
              {t("pricing.priceLists.detail.archiveAction")}
            </Button>
          )}

          {/* Delete Button */}
          <Button danger icon={<DeleteOutlined />} onClick={confirmDelete} />
        </Space>
      }
    >
      <AsyncBoundary loading={isLoading} error={error ? new Error(getApiErrorMessage(error)) : undefined} retry={refetch}>
        {priceList && (
          <>
            {/* Contextual Status Alert Banner */}
            <div style={{ marginTop: 8, marginBottom: 24 }}>
              {isDraft && (
                <Alert
                  message={t("pricing.priceLists.detail.banners.draft")}
                  type="warning"
                  showIcon
                  style={{ borderRadius: 12, padding: "12px 16px" }}
                  action={
                    <Button size="small" type="primary" onClick={handlePublish}>
                      {t("pricing.priceLists.detail.publishAction")}
                    </Button>
                  }
                />
              )}
              {isPublished && isActive && (
                <Alert
                  message={t("pricing.priceLists.detail.banners.published")}
                  type="success"
                  showIcon
                  style={{ borderRadius: 12, padding: "12px 16px" }}
                />
              )}
              {isPublished && !isActive && (
                <Alert
                  message={t("pricing.priceLists.detail.banners.inactive")}
                  type="info"
                  showIcon
                  style={{ borderRadius: 12, padding: "12px 16px" }}
                  action={
                    <Button size="small" type="primary" onClick={handleActivate}>
                      {t("pricing.priceLists.detail.activateAction")}
                    </Button>
                  }
                />
              )}
              {isArchived && (
                <Alert
                  message={t("pricing.priceLists.detail.banners.archived")}
                  type="error"
                  showIcon
                  style={{ borderRadius: 12, padding: "12px 16px" }}
                />
              )}
            </div>

            {/* Main Overview Card */}
            <Card style={{ borderRadius: 16, border: "1px solid var(--border-light)", marginBottom: 24 }}>
              <Descriptions column={{ xs: 1, sm: 2, lg: 4 }} size="middle">
                <Descriptions.Item label={t("pricing.priceLists.detail.status")}>
                  <StatusTag value={priceList.status} />
                </Descriptions.Item>
                <Descriptions.Item label={
                  <Space size={4}>
                    <span>{t("pricing.priceLists.detail.taxMode")}</span>
                    <Tooltip title={priceList.taxMode === 1 ? t("pricing.priceLists.inclusiveHint") : t("pricing.priceLists.exclusiveHint")}>
                      <InfoCircleOutlined style={{ color: "var(--text-secondary)" }} />
                    </Tooltip>
                  </Space>
                }>
                  <Tag color={priceList.taxMode === 1 ? "green" : "blue"}>
                    {enumLabel("taxMode", priceList.taxMode, t)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={
                  <Space size={4}>
                    <span>{t("pricing.priceLists.detail.priority")}</span>
                    <Tooltip title={t("pricing.priceLists.priorityHint")}>
                      <InfoCircleOutlined style={{ color: "var(--text-secondary)" }} />
                    </Tooltip>
                  </Space>
                }>
                  <Tag color="orange">{priceList.priority ?? 0}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t("pricing.priceLists.detail.active")}>
                  <Tag color={priceList.isActive ? "success" : "default"}>
                    {priceList.isActive ? t("common.actions.yes") : t("common.actions.no")}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t("pricing.priceLists.detail.currency")}>
                  <Space wrap size={4}>
                    <Tag color="cyan">
                      {(() => {
                        const info = getCurrencyInfo(priceListCurrencyCode);
                        return info ? `${info.flag} ${info.code} — ${info.nameAr} (${info.nameEn})` : priceListCurrencyCode;
                      })()}
                    </Tag>
                    {priceListCurrencyCode.toUpperCase() === baseCurrencyCode.toUpperCase() ? (
                      <Tag color="gold">{t("settings.currencies.base") || "العملة الأساسية"}</Tag>
                    ) : (
                      conversionRate && (
                        <Tooltip title={`${t("settings.currencies.effectiveRate") || "سعر الصرف"}: 1 ${priceListCurrencyCode} = ${conversionRate.toFixed(4)} ${baseCurrencyCode}`}>
                          <Tag color="purple">
                            1 {priceListCurrencyCode} ≈ {conversionRate.toFixed(4)} {baseCurrencyCode}
                          </Tag>
                        </Tooltip>
                      )
                    )}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label={t("pricing.priceLists.detail.version")}>
                  v{priceList.versionNumber}
                </Descriptions.Item>
                <Descriptions.Item label={t("pricing.priceLists.detail.effectiveFrom")}>
                  {priceList.effectiveFrom ? formatDateTime(priceList.effectiveFrom) : t("pricing.priceLists.detail.alwaysEffective")}
                </Descriptions.Item>
                <Descriptions.Item label={t("pricing.priceLists.detail.effectiveTo")}>
                  {priceList.effectiveTo ? formatDateTime(priceList.effectiveTo) : t("pricing.priceLists.detail.alwaysEffective")}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Tabs for Managing Products, Channels, Groups, Regions, Versions */}
            <Tabs
              defaultActiveKey="products"
              items={[
                {
                  key: "products",
                  label: t("pricing.priceLists.detail.tabs.products", { count: productPrices.length }),
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {/* Premium Bildirim / Informative Guidance Banner */}
                      <TabGuidanceAlert
                        title={t("pricing.priceLists.detail.guidance.productsTitle")}
                        message={t("pricing.priceLists.detail.guidance.productsMessage")}
                        note={t("pricing.priceLists.detail.guidance.productsNote")}
                        noteLabel={t("pricing.priceLists.detail.guidance.noteLabel")}
                      />

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <Text type="secondary">{t("pricing.priceLists.detail.tabDescriptions.products")}</Text>
                        {!isArchived && (
                          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddPriceDrawerOpen(true)}>
                            {t("pricing.priceLists.detail.addProductPrice")}
                          </Button>
                        )}
                      </div>
                      <Table<ProductPriceReadModel>
                        rowKey="id"
                        columns={productColumns}
                        dataSource={productPrices}
                        loading={productPricesQuery.isLoading}
                        pagination={{ pageSize: 10 }}
                        size="middle"
                        locale={{
                          emptyText: (
                            <EmptyState
                              title={t("pricing.priceLists.detail.noProductsAssigned")}
                              action={
                                !isArchived
                                  ? {
                                      label: t("pricing.priceLists.detail.addProductPrice"),
                                      onClick: () => setAddPriceDrawerOpen(true),
                                    }
                                  : undefined
                              }
                            />
                          ),
                        }}
                      />
                    </div>
                  ),
                },
                {
                  key: "channels",
                  label: t("pricing.priceLists.detail.tabs.channels", { count: priceList.channelIds.length }),
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {/* Premium Bildirim / Informative Guidance Banner */}
                      <TabGuidanceAlert
                        title={t("pricing.priceLists.detail.guidance.channelsTitle")}
                        message={t("pricing.priceLists.detail.guidance.channelsMessage")}
                        note={t("pricing.priceLists.detail.guidance.channelsNote")}
                        noteLabel={t("pricing.priceLists.detail.guidance.noteLabel")}
                      />

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <Text type="secondary">{t("pricing.priceLists.detail.tabDescriptions.channels")}</Text>
                        {!isArchived && (
                          <Button type="primary" icon={<PlusOutlined />} onClick={() => setChannelModal(true)}>
                            {t("pricing.priceLists.detail.addChannel")}
                          </Button>
                        )}
                      </div>
                      <Table<{ id: string }>
                        rowKey="id"
                        columns={channelColumns}
                        dataSource={priceList.channelIds.map((cid) => ({ id: cid }))}
                        pagination={false}
                        size="middle"
                        locale={{ emptyText: <EmptyState title={t("pricing.priceLists.detail.noChannelsAssigned")} /> }}
                      />
                    </div>
                  ),
                },
                {
                  key: "groups",
                  label: t("pricing.priceLists.detail.tabs.customerGroups", { count: priceList.customerGroupIds.length }),
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {/* Premium Bildirim / Informative Guidance Banner */}
                      <TabGuidanceAlert
                        title={t("pricing.priceLists.detail.guidance.groupsTitle")}
                        message={t("pricing.priceLists.detail.guidance.groupsMessage")}
                        note={t("pricing.priceLists.detail.guidance.groupsNote")}
                        noteLabel={t("pricing.priceLists.detail.guidance.noteLabel")}
                      />

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <Text type="secondary">{t("pricing.priceLists.detail.tabDescriptions.customerGroups")}</Text>
                        {!isArchived && (
                          <Button type="primary" icon={<PlusOutlined />} onClick={() => setGroupModal(true)}>
                            {t("pricing.priceLists.detail.addGroup")}
                          </Button>
                        )}
                      </div>
                      <Table<{ id: string }>
                        rowKey="id"
                        columns={groupColumns}
                        dataSource={priceList.customerGroupIds.map((gid) => ({ id: gid }))}
                        pagination={false}
                        size="middle"
                        locale={{ emptyText: <EmptyState title={t("pricing.priceLists.detail.noGroupsAssigned")} /> }}
                      />
                    </div>
                  ),
                },
                {
                  key: "regions",
                  label: t("pricing.priceLists.detail.tabs.regions", { count: priceList.regionIds.length }),
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {/* Premium Bildirim / Informative Guidance Banner */}
                      <TabGuidanceAlert
                        title={t("pricing.priceLists.detail.guidance.regionsTitle")}
                        message={t("pricing.priceLists.detail.guidance.regionsMessage")}
                        note={t("pricing.priceLists.detail.guidance.regionsNote")}
                        noteLabel={t("pricing.priceLists.detail.guidance.noteLabel")}
                      />

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <Text type="secondary">{t("pricing.priceLists.detail.tabDescriptions.regions")}</Text>
                        {!isArchived && (
                          <Button type="primary" icon={<PlusOutlined />} onClick={() => setRegionModal(true)}>
                            {t("pricing.priceLists.detail.addRegion")}
                          </Button>
                        )}
                      </div>
                      <Table<{ id: string }>
                        rowKey="id"
                        columns={regionColumns}
                        dataSource={priceList.regionIds.map((rid) => ({ id: rid }))}
                        pagination={false}
                        size="middle"
                        locale={{ emptyText: <EmptyState title={t("pricing.priceLists.detail.noRegionsAssigned")} /> }}
                      />
                    </div>
                  ),
                },
                {
                  key: "versions",
                  label: t("pricing.priceLists.detail.tabs.versions", { count: priceList.versions?.length ?? 0 }),
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {/* Premium Bildirim / Informative Guidance Banner */}
                      <TabGuidanceAlert
                        title={t("pricing.priceLists.detail.guidance.versionsTitle")}
                        message={t("pricing.priceLists.detail.guidance.versionsMessage")}
                      />

                      <Text type="secondary" style={{ marginBottom: 12 }}>{t("pricing.priceLists.detail.tabDescriptions.versions")}</Text>
                      <Table
                        rowKey="id"
                        columns={versionColumns}
                        dataSource={priceList.versions ?? []}
                        pagination={false}
                        size="middle"
                        locale={{ emptyText: <EmptyState title={t("pricing.priceLists.detail.versions.noVersions")} /> }}
                      />
                    </div>
                  ),
                },
              ]}
            />

            {/* Smart Select Modals with Valid GUIDs */}
            <SelectAssignModal
              open={channelModal}
              onClose={() => setChannelModal(false)}
              title={t("pricing.priceLists.detail.addChannelTitle")}
              label={t("pricing.priceLists.detail.selectChannelLabel")}
              placeholder={t("pricing.priceLists.detail.selectChannelPlaceholder")}
              options={CHANNEL_OPTIONS}
              onSubmit={handleAssignChannel}
            />

            <SelectAssignModal
              open={groupModal}
              onClose={() => setGroupModal(false)}
              title={t("pricing.priceLists.detail.addGroupTitle")}
              label={t("pricing.priceLists.detail.selectGroupLabel")}
              placeholder={t("pricing.priceLists.detail.selectGroupPlaceholder")}
              options={GROUP_OPTIONS}
              onSubmit={handleAssignGroup}
            />

            <SelectAssignModal
              open={regionModal}
              onClose={() => setRegionModal(false)}
              title={t("pricing.priceLists.detail.addRegionTitle")}
              label={t("pricing.priceLists.detail.selectRegionLabel")}
              placeholder={t("pricing.priceLists.detail.selectRegionPlaceholder")}
              options={REGION_OPTIONS}
              onSubmit={handleAssignRegion}
            />

            {/* Edit Price List Info Drawer */}
            <DrawerForm
              open={editDrawerOpen}
              onClose={() => setEditDrawerOpen(false)}
              title={t("pricing.priceLists.drawerEdit")}
              width={560}
              form={editForm}
              loading={savePriceList.isPending}
              onFinish={handleSaveEdit}
              submitLabel={t("pricing.priceLists.submitEdit")}
            >
              <Form form={editForm} layout="vertical" onFinish={handleSaveEdit}>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item name="name" label={t("pricing.priceLists.nameColumn")} rules={[{ required: true }]}>
                      <Input placeholder={t("pricing.priceLists.placeholderName")} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="description" label={t("pricing.description")}>
                      <Input.TextArea rows={3} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="taxMode" label={t("pricing.priceLists.taxMode")} rules={[{ required: true }]}>
                      <Select
                        options={[
                          { value: 1, label: t("pricing.priceLists.inclusive") },
                          { value: 2, label: t("pricing.priceLists.exclusive") },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="priority" label={t("pricing.priceLists.priority")}>
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="currencyId" label={t("pricing.priceLists.currency")} rules={[{ required: true }]}>
                      <Select
                        showSearch
                        optionFilterProp="label"
                        options={currencyOptions}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="effectiveFrom" label={t("pricing.priceLists.effectiveFrom")}>
                      <DatePicker showTime style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="effectiveTo" label={t("pricing.priceLists.effectiveTo")}>
                      <DatePicker showTime style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </DrawerForm>

            {/* Add Product Price to this list Drawer */}
            <DrawerForm
              open={addPriceDrawerOpen}
              onClose={() => setAddPriceDrawerOpen(false)}
              title={t("pricing.priceLists.detail.addProductPrice")}
              width={560}
              form={addPriceForm}
              loading={saveProductPrice.isPending}
              onFinish={handleAddProductPrice}
              submitLabel={t("pricing.productPrices.submitCreate")}
            >
              <Form form={addPriceForm} layout="vertical" onFinish={handleAddProductPrice}>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item name="productId" label={t("pricing.productPrices.productColumn")} rules={[{ required: true }]}>
                      <Select
                        showSearch
                        optionFilterProp="label"
                        placeholder={t("pricing.productPrices.selectProduct")}
                        loading={productsQuery.isLoading}
                        options={productsList.map((p) => ({ value: p.id, label: `${p.name} (${p.code})` }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="baseAmount"
                      label={t("pricing.productPrices.basePrice")}
                      rules={[{ required: true }]}
                      tooltip={t("pricing.productPrices.basePrice")}
                    >
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="compareAtAmount"
                      label={t("pricing.productPrices.compareAt")}
                      tooltip={t("pricing.productPrices.compareAtHint")}
                    >
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="costAmount"
                      label={t("pricing.productPrices.cost")}
                      tooltip={t("pricing.productPrices.costHint")}
                    >
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="minAmount"
                      label={t("pricing.productPrices.minPrice")}
                      tooltip={t("pricing.productPrices.minPriceHint")}
                    >
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="effectiveFrom" label={t("pricing.productPrices.effectiveFrom")}>
                      <DatePicker showTime style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="effectiveTo" label={t("pricing.productPrices.effectiveTo")}>
                      <DatePicker showTime style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </DrawerForm>
          </>
        )}
      </AsyncBoundary>
    </CommerceShell>
  );
}

// Smart Select Assign Modal (No raw GUID required)
function SelectAssignModal({
  open,
  onClose,
  title,
  label,
  placeholder,
  options,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onSubmit: (id: string) => Promise<void>;
  loading?: boolean;
}) {
  const t = useTranslations();
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={t("common.actions.add") ?? "إضافة"}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={async (values) => {
          await onSubmit(values.id as string);
          form.resetFields();
        }}
      >
        <Form.Item name="id" label={label} rules={[{ required: true }]}>
          <Select
            showSearch
            optionFilterProp="label"
            placeholder={placeholder}
            options={options}
            loading={loading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}