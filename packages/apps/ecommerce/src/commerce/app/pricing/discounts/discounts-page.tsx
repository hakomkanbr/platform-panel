"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  GiftOutlined,
  PercentageOutlined,
  PlusOutlined,
  TagOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { DataTable, DrawerForm } from "@repo/ui";
import { formatDateTime } from "@repo/utils";
import { useTranslations } from "@repo/localization";
import { CommerceShell } from "../../../components/CommerceShell";
import { getApiErrorMessage } from "../../../api/http";
import {
  useCoupons,
  useDeleteCoupon,
  useDeleteDiscount,
  useDiscounts,
  useSaveCoupon,
  useSaveDiscount,
  useToggleDiscountStatus,
} from "../../../hooks/useDiscounts";
import { useProducts } from "../../../hooks/useProducts";
import { useCategories } from "../../../hooks/useCategories";
import {
  DiscountPriority,
  DiscountTargetType,
  DiscountType,
  type CouponDto,
  type DiscountDto,
} from "../../../types/discounts";

const { Text } = Typography;

export function DiscountsPage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("discounts");

  // Discounts State
  const [discPage, setDiscPage] = useState(1);
  const [discPageSize, setDiscPageSize] = useState(10);
  const [discSearch, setDiscSearch] = useState("");
  const [discTypeFilter, setDiscTypeFilter] = useState<DiscountType | undefined>();
  const [discDrawerOpen, setDiscDrawerOpen] = useState(false);
  const [editingDisc, setEditingDisc] = useState<DiscountDto | null>(null);
  const [discForm] = Form.useForm();
  const selectedTargetType = Form.useWatch("targetType", discForm);
  const selectedType = Form.useWatch("type", discForm);
  const appliesToAll = Form.useWatch("appliesToAll", discForm);

  // Coupons State
  const [couponPage, setCouponPage] = useState(1);
  const [couponPageSize, setCouponPageSize] = useState(10);
  const [couponSearch, setCouponSearch] = useState("");
  const [couponDrawerOpen, setCouponDrawerOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponDto | null>(null);
  const [couponForm] = Form.useForm();

  // Queries & Mutations
  const discountsQuery = useDiscounts({
    pageNumber: discPage,
    pageSize: discPageSize,
    search: discSearch || undefined,
    type: discTypeFilter,
  });
  const productsQuery = useProducts({ pageSize: 100 });
  const categoriesQuery = useCategories({ pageSize: 100 });
  const saveDiscount = useSaveDiscount();
  const toggleDiscountStatus = useToggleDiscountStatus();
  const deleteDiscount = useDeleteDiscount();

  const couponsQuery = useCoupons({
    pageNumber: couponPage,
    pageSize: couponPageSize,
    search: couponSearch || undefined,
  });
  const saveCoupon = useSaveCoupon();
  const deleteCoupon = useDeleteCoupon();

  // --- Handlers: Discounts ---
  const openCreateDiscount = () => {
    setEditingDisc(null);
    discForm.resetFields();
    discForm.setFieldsValue({
      type: DiscountType.Percentage,
      targetType: DiscountTargetType.Cart,
      priority: DiscountPriority.Normal,
      value: 10,
      usageLimit: 100,
      isActive: true,
      appliesToAll: true,
      oncePerCustomer: false,
      productIds: [],
      categoryIds: [],
      dateRange: [dayjs(), dayjs().add(30, "day")],
      buyXQty: 2,
      getYQty: 1,
      getYDiscountPercent: 100,
    });
    setDiscDrawerOpen(true);
  };

  const openEditDiscount = (record: DiscountDto) => {
    setEditingDisc(record);
    discForm.setFieldsValue({
      name: record.name,
      code: record.code,
      type: record.type,
      targetType: record.targetType,
      value: record.value,
      priority: record.priority,
      usageLimit: record.usageLimit,
      isActive: record.isActive,
      minQuantity: record.minQuantity,
      maxQuantity: record.maxQuantity,
      minCartAmount: record.minCartAmount,
      maxDiscountAmount: record.maxDiscountAmount,
      oncePerCustomer: record.oncePerCustomer,
      appliesToAll: record.appliesToAll,
      productIds: record.productIds || [],
      categoryIds: record.categoryIds || [],
      buyXQty: record.buyXQty,
      getYQty: record.getYQty,
      getYDiscountPercent: record.getYDiscountPercent,
      dateRange: [
        record.startDate ? dayjs(record.startDate) : dayjs(),
        record.endDate ? dayjs(record.endDate) : dayjs().add(30, "day"),
      ],
    });
    setDiscDrawerOpen(true);
  };

  const onFinishDiscount = async (values: Record<string, unknown>) => {
    try {
      const dates = values.dateRange as [dayjs.Dayjs, dayjs.Dayjs] | undefined;
      const startDate = dates?.[0] ? dates[0].toISOString() : new Date().toISOString();
      const endDate = dates?.[1] ? dates[1].toISOString() : new Date(Date.now() + 30 * 86400000).toISOString();

      const targetTypeNum = Number(values.targetType ?? DiscountTargetType.Cart);
      const productIds = targetTypeNum === DiscountTargetType.Product
        ? (values.productIds as string[] | undefined) ?? []
        : [];
      const categoryIds = targetTypeNum === DiscountTargetType.Category
        ? (values.categoryIds as string[] | undefined) ?? []
        : [];

      const payload: any = {
        name: values.name as string,
        code: values.code as string,
        type: Number(values.type ?? DiscountType.Percentage),
        targetType: targetTypeNum,
        value: Number(values.value ?? 0),
        priority: Number(values.priority ?? DiscountPriority.Normal),
        startDate,
        endDate,
        usageLimit: Number(values.usageLimit ?? 0),
        isActive: !!values.isActive,
        minQuantity: values.minQuantity ? Number(values.minQuantity) : null,
        maxQuantity: values.maxQuantity ? Number(values.maxQuantity) : null,
        minCartAmount: values.minCartAmount ? Number(values.minCartAmount) : null,
        maxDiscountAmount: values.maxDiscountAmount ? Number(values.maxDiscountAmount) : null,
        oncePerCustomer: !!values.oncePerCustomer,
        appliesToAll: !!values.appliesToAll,
        productIds,
        categoryIds,
        buyXQty: Number(values.buyXQty ?? 0),
        getYQty: Number(values.getYQty ?? 0),
        getYDiscountPercent: Number(values.getYDiscountPercent ?? 100),
      };

      if (editingDisc) {
        await saveDiscount.mutateAsync({
          id: editingDisc.id,
          body: { ...payload, id: editingDisc.id },
        });
        message.success(t("pricing.discounts.updated"));
      } else {
        await saveDiscount.mutateAsync({ body: payload });
        message.success(t("pricing.discounts.created"));
      }
      setDiscDrawerOpen(false);
      discountsQuery.refetch();
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  // --- Handlers: Coupons ---
  const openCreateCoupon = () => {
    setEditingCoupon(null);
    couponForm.resetFields();
    couponForm.setFieldsValue({
      type: "Percentage",
      value: 15,
      usageLimit: 50,
      isActive: true,
      dateRange: [dayjs(), dayjs().add(30, "day")],
    });
    setCouponDrawerOpen(true);
  };

  const openEditCoupon = (record: CouponDto) => {
    setEditingCoupon(record);
    couponForm.setFieldsValue({
      code: record.code,
      description: record.description,
      type: record.type,
      value: record.value,
      minPurchaseAmount: record.minPurchaseAmount,
      usageLimit: record.usageLimit,
      isActive: record.isActive,
      dateRange: [
        record.validFrom ? dayjs(record.validFrom) : dayjs(),
        record.validTo ? dayjs(record.validTo) : dayjs().add(30, "day"),
      ],
    });
    setCouponDrawerOpen(true);
  };

  const onFinishCoupon = async (values: Record<string, unknown>) => {
    try {
      const dates = values.dateRange as [dayjs.Dayjs, dayjs.Dayjs] | undefined;
      const validFrom = dates?.[0] ? dates[0].toISOString() : new Date().toISOString();
      const validTo = dates?.[1] ? dates[1].toISOString() : new Date(Date.now() + 30 * 86400000).toISOString();

      const payload: any = {
        code: (values.code as string).toUpperCase(),
        description: values.description as string | undefined,
        type: values.type as string,
        value: Number(values.value ?? 0),
        minPurchaseAmount: values.minPurchaseAmount ? Number(values.minPurchaseAmount) : null,
        validFrom,
        validTo,
        usageLimit: Number(values.usageLimit ?? 0),
        isActive: !!values.isActive,
      };

      if (editingCoupon) {
        await saveCoupon.mutateAsync({
          id: editingCoupon.id,
          body: { ...payload, id: editingCoupon.id },
        });
        message.success(t("pricing.discounts.couponUpdated"));
      } else {
        await saveCoupon.mutateAsync({ body: payload });
        message.success(t("pricing.discounts.couponCreated"));
      }
      setCouponDrawerOpen(false);
      couponsQuery.refetch();
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  // Helper tags
  const renderDiscountTypeTag = (type: DiscountType) => {
    switch (type) {
      case DiscountType.Percentage:
        return <Tag color="blue">{t("pricing.discounts.typePercentage")}</Tag>;
      case DiscountType.FixedAmount:
        return <Tag color="green">{t("pricing.discounts.typeFixed")}</Tag>;
      case DiscountType.FreeShipping:
        return <Tag color="cyan">{t("pricing.discounts.typeFreeShipping")}</Tag>;
      default:
        return <Tag>{type}</Tag>;
    }
  };

  const renderTargetTypeTag = (target: DiscountTargetType, record?: DiscountDto) => {
    switch (target) {
      case DiscountTargetType.Cart:
        return <Tag color="geekblue">{t("pricing.discounts.targetCart")}</Tag>;
      case DiscountTargetType.Product:
        return (
          <Space size={4}>
            <Tag color="orange">{t("pricing.discounts.targetProduct")}</Tag>
            {record?.productIds && record.productIds.length > 0 ? (
              <Tag color="default" style={{ fontSize: 11 }}>
                {record.productIds.length}
              </Tag>
            ) : null}
          </Space>
        );
      case DiscountTargetType.Category:
        return (
          <Space size={4}>
            <Tag color="gold">{t("pricing.discounts.targetCategory")}</Tag>
            {record?.categoryIds && record.categoryIds.length > 0 ? (
              <Tag color="default" style={{ fontSize: 11 }}>
                {record.categoryIds.length}
              </Tag>
            ) : null}
          </Space>
        );
      case DiscountTargetType.Shipping:
        return <Tag color="cyan">{t("pricing.discounts.targetShipping")}</Tag>;
      case DiscountTargetType.BuyXGetY:
        return <Tag color="magenta">{t("pricing.discounts.targetBuyXGetY")}</Tag>;
      default:
        return <Tag>{target}</Tag>;
    }
  };

  const renderPriorityTag = (p: DiscountPriority) => {
    switch (p) {
      case DiscountPriority.Critical:
        return <Tag color="red">{t("pricing.discounts.priorityCritical")}</Tag>;
      case DiscountPriority.High:
        return <Tag color="volcano">{t("pricing.discounts.priorityHigh")}</Tag>;
      case DiscountPriority.Normal:
        return <Tag color="blue">{t("pricing.discounts.priorityNormal")}</Tag>;
      case DiscountPriority.Low:
      default:
        return <Tag color="default">{t("pricing.discounts.priorityLow")}</Tag>;
    }
  };

  // --- Columns: Discounts ---
  const discountColumns: TableColumnsType<DiscountDto> = [
    {
      title: t("pricing.discounts.nameColumn"),
      key: "name",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.name}</div>
          <Tag color="geekblue" style={{ fontSize: 11, marginTop: 4 }}>
            {record.code}
          </Tag>
        </div>
      ),
    },
    {
      title: t("pricing.discounts.typeColumn"),
      dataIndex: "type",
      width: 130,
      render: (v) => renderDiscountTypeTag(v),
    },
    {
      title: t("pricing.discounts.targetColumn"),
      dataIndex: "targetType",
      width: 160,
      render: (v, record) => renderTargetTypeTag(v, record),
    },
    {
      title: t("pricing.discounts.valueColumn"),
      key: "value",
      width: 110,
      render: (_, record) => (
        <span style={{ fontWeight: 600, color: "#1890ff" }}>
          {record.type === DiscountType.Percentage
            ? `${record.value}%`
            : record.type === DiscountType.FreeShipping
              ? t("pricing.discounts.free")
              : `${record.value} SAR`}
        </span>
      ),
    },
    {
      title: t("pricing.discounts.priorityColumn"),
      dataIndex: "priority",
      width: 100,
      render: (v) => renderPriorityTag(v),
    },
    {
      title: t("pricing.discounts.usageColumn"),
      key: "usage",
      width: 120,
      render: (_, record) => (
        <span>
          {record.usageCount ?? 0} / {record.usageLimit > 0 ? record.usageLimit : "∞"}
        </span>
      ),
    },
    {
      title: t("pricing.discounts.validityColumn"),
      key: "dates",
      width: 180,
      render: (_, record) => {
        const isExpired = record.endDate && dayjs(record.endDate).isBefore(dayjs());
        const isUpcoming = record.startDate && dayjs(record.startDate).isAfter(dayjs());
        return (
          <Space direction="vertical" size={2}>
            <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
              {record.startDate ? dayjs(record.startDate).format("YYYY-MM-DD") : "—"} →{" "}
              {record.endDate ? dayjs(record.endDate).format("YYYY-MM-DD") : "—"}
            </span>
            {isExpired ? (
              <Tag color="error">{t("pricing.discounts.expired")}</Tag>
            ) : isUpcoming ? (
              <Tag color="warning">{t("pricing.discounts.upcoming")}</Tag>
            ) : (
              <Tag color="success">{t("pricing.discounts.activeNow")}</Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: t("common.fields.status"),
      dataIndex: "isActive",
      width: 90,
      render: (isActive: boolean, record) => (
        <Switch
          checked={isActive}
          size="small"
          onChange={async (checked) => {
            try {
              await toggleDiscountStatus.mutateAsync({ id: record.id, isActive: checked });
              message.success(t("common.actions.statusUpdated"));
              discountsQuery.refetch();
            } catch (e) {
              message.error(getApiErrorMessage(e));
            }
          }}
        />
      ),
    },
    {
      title: "",
      key: "actions",
      width: 110,
      render: (_, record) => (
        <Space>
          <Tooltip title={t("common.actions.edit")}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEditDiscount(record)}
            />
          </Tooltip>
          <Popconfirm
            title={t("pricing.discounts.deleteConfirm")}
            onConfirm={async () => {
              try {
                await deleteDiscount.mutateAsync(record.id);
                message.success(t("pricing.discounts.deleted"));
                discountsQuery.refetch();
              } catch (e) {
                message.error(getApiErrorMessage(e));
              }
            }}
          >
            <Tooltip title={t("common.actions.delete")}>
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // --- Columns: Coupons ---
  const couponColumns: TableColumnsType<CouponDto> = [
    {
      title: t("pricing.discounts.couponCode"),
      key: "code",
      render: (_, record) => (
        <Space>
          <Tag color="purple" style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.05em" }}>
            {record.code}
          </Tag>
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => {
              navigator.clipboard.writeText(record.code);
              message.success(t("pricing.discounts.codeCopied"));
            }}
          />
        </Space>
      ),
    },
    {
      title: t("pricing.discounts.typeColumn"),
      dataIndex: "type",
      width: 130,
      render: (tVal) => <Tag color="blue">{tVal}</Tag>,
    },
    {
      title: t("pricing.discounts.valueColumn"),
      key: "value",
      width: 120,
      render: (_, record) => (
        <span style={{ fontWeight: 600, color: "#722ed1" }}>
          {record.type?.toLowerCase().includes("percent") ? `${record.value}%` : `${record.value} SAR`}
        </span>
      ),
    },
    {
      title: t("pricing.discounts.minCartAmount"),
      dataIndex: "minPurchaseAmount",
      width: 140,
      render: (v) => (v ? `${v} SAR` : "—"),
    },
    {
      title: t("pricing.discounts.usageColumn"),
      key: "usage",
      width: 120,
      render: (_, record) => (
        <span>
          {record.usageCount ?? 0} / {record.usageLimit > 0 ? record.usageLimit : "∞"}
        </span>
      ),
    },
    {
      title: t("pricing.discounts.validityColumn"),
      key: "dates",
      width: 180,
      render: (_, record) => (
        <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
          {record.validFrom ? dayjs(record.validFrom).format("YYYY-MM-DD") : "—"} →{" "}
          {record.validTo ? dayjs(record.validTo).format("YYYY-MM-DD") : "—"}
        </span>
      ),
    },
    {
      title: t("common.fields.status"),
      dataIndex: "isActive",
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? "success" : "default"}>
          {isActive ? t("pricing.discounts.active") : t("pricing.discounts.inactive")}
        </Tag>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 110,
      render: (_, record) => (
        <Space>
          <Tooltip title={t("common.actions.edit")}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEditCoupon(record)}
            />
          </Tooltip>
          <Popconfirm
            title={t("pricing.discounts.deleteCouponConfirm")}
            onConfirm={async () => {
              try {
                await deleteCoupon.mutateAsync(record.id);
                message.success(t("pricing.discounts.couponDeleted"));
                couponsQuery.refetch();
              } catch (e) {
                message.error(getApiErrorMessage(e));
              }
            }}
          >
            <Tooltip title={t("common.actions.delete")}>
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <CommerceShell
      title={t("pricing.discounts.title")}
      description={t("pricing.discounts.description")}
      breadcrumbs={[
        { title: t("pricing.title"), href: "/admin/pricing" },
        { title: t("pricing.discounts.title") },
      ]}
      actions={
        activeTab === "discounts" ? (
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateDiscount}>
            {t("pricing.discounts.newDiscount")}
          </Button>
        ) : (
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateCoupon}>
            {t("pricing.discounts.newCoupon")}
          </Button>
        )
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "discounts",
            label: (
              <Space>
                <TagOutlined />
                {t("pricing.discounts.discountsTab")}
              </Space>
            ),
            children: (
              <DataTable<DiscountDto>
                columns={discountColumns}
                dataSource={discountsQuery.data?.data ?? []}
                rowKey="id"
                loading={discountsQuery.isLoading}
                error={discountsQuery.error ? new Error(getApiErrorMessage(discountsQuery.error)) : undefined}
                onRefresh={discountsQuery.refetch}
                total={discountsQuery.data?.count ?? 0}
                page={discPage}
                pageSize={discPageSize}
                onPageChange={(p, ps) => {
                  setDiscPage(p);
                  setDiscPageSize(ps);
                }}
                searchable
                searchPlaceholder={t("pricing.discounts.searchDiscountsPlaceholder")}
                onSearch={(term) => {
                  setDiscSearch(term);
                  setDiscPage(1);
                }}
                filters={
                  <Select
                    placeholder={t("pricing.discounts.filterByType")}
                    allowClear
                    style={{ width: 170 }}
                    value={discTypeFilter}
                    onChange={(v) => {
                      setDiscTypeFilter(v);
                      setDiscPage(1);
                    }}
                    options={[
                      { value: DiscountType.Percentage, label: t("pricing.discounts.typePercentage") },
                      { value: DiscountType.FixedAmount, label: t("pricing.discounts.typeFixed") },
                      { value: DiscountType.FreeShipping, label: t("pricing.discounts.typeFreeShipping") },
                    ]}
                  />
                }
                title={t("pricing.discounts.discountsCount", { count: discountsQuery.data?.count ?? 0 })}
                emptyTitle={t("pricing.discounts.noDiscountsTitle")}
                emptyDescription={t("pricing.discounts.noDiscountsDesc")}
                emptyAction={{ label: t("pricing.discounts.newDiscount"), onClick: openCreateDiscount }}
              />
            ),
          },
          {
            key: "coupons",
            label: (
              <Space>
                <GiftOutlined />
                {t("pricing.discounts.couponsTab")}
              </Space>
            ),
            children: (
              <DataTable<CouponDto>
                columns={couponColumns}
                dataSource={couponsQuery.data?.data ?? []}
                rowKey="id"
                loading={couponsQuery.isLoading}
                error={couponsQuery.error ? new Error(getApiErrorMessage(couponsQuery.error)) : undefined}
                onRefresh={couponsQuery.refetch}
                total={couponsQuery.data?.count ?? 0}
                page={couponPage}
                pageSize={couponPageSize}
                onPageChange={(p, ps) => {
                  setCouponPage(p);
                  setCouponPageSize(ps);
                }}
                searchable
                searchPlaceholder={t("pricing.discounts.searchCouponsPlaceholder")}
                onSearch={(term) => {
                  setCouponSearch(term);
                  setCouponPage(1);
                }}
                title={t("pricing.discounts.couponsCount", { count: couponsQuery.data?.count ?? 0 })}
                emptyTitle={t("pricing.discounts.noCouponsTitle")}
                emptyDescription={t("pricing.discounts.noCouponsDesc")}
                emptyAction={{ label: t("pricing.discounts.newCoupon"), onClick: openCreateCoupon }}
              />
            ),
          },
        ]}
      />

      {/* Drawer: Discount */}
      <DrawerForm
        open={discDrawerOpen}
        onClose={() => setDiscDrawerOpen(false)}
        title={editingDisc ? t("pricing.discounts.editDiscountTitle") : t("pricing.discounts.createDiscountTitle")}
        width={600}
        form={discForm}
        loading={saveDiscount.isPending}
        onFinish={onFinishDiscount}
        submitLabel={editingDisc ? t("common.actions.saveChanges") : t("pricing.discounts.submitCreateDiscount")}
      >
        <Form form={discForm} layout="vertical" onFinish={onFinishDiscount}>
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item
                name="name"
                label={t("pricing.discounts.discountName")}
                rules={[{ required: true, message: t("common.fields.nameRequired") }]}
              >
                <Input placeholder={t("pricing.discounts.namePlaceholder") || "مثال: تخفيضات الصيف 2026"} />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name="code"
                label={t("pricing.discounts.code")}
                rules={[{ required: true, message: t("common.fields.keyRequired") }]}
              >
                <Input placeholder="SUMMER2026, RAMADAN10..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label={t("pricing.discounts.typeColumn")}
                rules={[{ required: true }]}
              >
                <Select
                  placeholder={t("pricing.discounts.typeColumn") || "اختر نوع الخصم"}
                  options={[
                    { value: DiscountType.Percentage, label: t("pricing.discounts.typePercentage") },
                    { value: DiscountType.FixedAmount, label: t("pricing.discounts.typeFixed") },
                    { value: DiscountType.FreeShipping, label: t("pricing.discounts.typeFreeShipping") },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="targetType"
                label={t("pricing.discounts.targetColumn")}
                rules={[{ required: true }]}
              >
                <Select
                  placeholder={t("pricing.discounts.targetColumn") || "اختر نطاق الهدف"}
                  options={[
                    { value: DiscountTargetType.Cart, label: t("pricing.discounts.targetCart") },
                    { value: DiscountTargetType.Product, label: t("pricing.discounts.targetProduct") },
                    { value: DiscountTargetType.Category, label: t("pricing.discounts.targetCategory") },
                    { value: DiscountTargetType.Shipping, label: t("pricing.discounts.targetShipping") },
                    { value: DiscountTargetType.BuyXGetY, label: t("pricing.discounts.targetBuyXGetY") },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Conditional Product Scope & Selection */}
          {selectedTargetType === DiscountTargetType.Product && (
            <Card
              size="small"
              style={{
                backgroundColor: "var(--bg-subtle, #fafafa)",
                borderRadius: 10,
                marginBottom: 16,
                border: "1px solid var(--border-light, #f0f0f0)",
              }}
            >
              <Row gutter={16} align="middle" style={{ marginBottom: appliesToAll ? 0 : 12 }}>
                <Col span={18}>
                  <Text strong style={{ fontSize: 13 }}>
                    {t("pricing.discounts.appliesToAllProducts") || "تطبيق على جميع المنتجات"}
                  </Text>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {appliesToAll
                      ? (t("pricing.discounts.allProductsNotice") || "الخصم سيسري على كل منتجات المتجر")
                      : (t("pricing.discounts.specificProductsNotice") || "قم بتحديد المنتجات المشمولة بالخصم أدناه")}
                  </div>
                </Col>
                <Col span={6} style={{ textAlign: "end" }}>
                  <Form.Item name="appliesToAll" valuePropName="checked" noStyle>
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              {!appliesToAll && (
                <Form.Item
                  name="productIds"
                  label={t("pricing.discounts.selectProducts") || "المنتجات المشمولة"}
                  rules={[{ required: true, message: t("pricing.discounts.productsRequired") || "يرجى تحديد منتج واحد على الأقل" }]}
                  extra={t("pricing.discounts.selectProductsHelp") || "اختر المنتجات التي ينطبق عليها هذا الخصم"}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="label"
                    placeholder={t("pricing.discounts.selectProductsPlaceholder") || "اختر أو ابحث عن المنتجات لتطبيق الخصم عليها..."}
                    loading={productsQuery.isLoading}
                    options={(productsQuery.data?.data ?? []).map((p) => ({
                      value: p.id,
                      label: `${p.name} (${p.code || p.sku || p.id})`,
                    }))}
                  />
                </Form.Item>
              )}
            </Card>
          )}

          {/* Conditional Category Scope & Selection */}
          {selectedTargetType === DiscountTargetType.Category && (
            <Card
              size="small"
              style={{
                backgroundColor: "var(--bg-subtle, #fafafa)",
                borderRadius: 10,
                marginBottom: 16,
                border: "1px solid var(--border-light, #f0f0f0)",
              }}
            >
              <Row gutter={16} align="middle" style={{ marginBottom: appliesToAll ? 0 : 12 }}>
                <Col span={18}>
                  <Text strong style={{ fontSize: 13 }}>
                    {t("pricing.discounts.appliesToAllCategories") || "تطبيق على جميع التصنيفات"}
                  </Text>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {appliesToAll
                      ? (t("pricing.discounts.allCategoriesNotice") || "الخصم سيسري على كل التصنيفات في المتجر")
                      : (t("pricing.discounts.specificCategoriesNotice") || "قم بتحديد التصنيفات المشمولة بالخصم أدناه")}
                  </div>
                </Col>
                <Col span={6} style={{ textAlign: "end" }}>
                  <Form.Item name="appliesToAll" valuePropName="checked" noStyle>
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              {!appliesToAll && (
                <Form.Item
                  name="categoryIds"
                  label={t("pricing.discounts.selectCategories") || "التصنيفات المشمولة"}
                  rules={[{ required: true, message: t("pricing.discounts.categoriesRequired") || "يرجى تحديد تصنيف واحد على الأقل" }]}
                  extra={t("pricing.discounts.selectCategoriesHelp") || "اختر التصنيفات التي ينطبق عليها هذا الخصم"}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="label"
                    placeholder={t("pricing.discounts.selectCategoriesPlaceholder") || "اختر أو ابحث عن التصنيفات لتطبيق الخصم عليها..."}
                    loading={categoriesQuery.isLoading}
                    options={(categoriesQuery.data?.data ?? []).map((c) => ({
                      value: c.id,
                      label: c.name,
                    }))}
                  />
                </Form.Item>
              )}
            </Card>
          )}

          {selectedType !== DiscountType.FreeShipping && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="value"
                  label={t("pricing.discounts.valueColumn")}
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={0}
                    placeholder="0.00"
                    style={{ width: "100%" }}
                    addonAfter={selectedType === DiscountType.Percentage ? "%" : "SAR"}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="priority" label={t("pricing.discounts.priorityColumn")}>
                  <Select
                    placeholder={t("pricing.discounts.priorityColumn") || "اختر الأولوية"}
                    options={[
                      { value: DiscountPriority.Low, label: t("pricing.discounts.priorityLow") },
                      { value: DiscountPriority.Normal, label: t("pricing.discounts.priorityNormal") },
                      { value: DiscountPriority.High, label: t("pricing.discounts.priorityHigh") },
                      { value: DiscountPriority.Critical, label: t("pricing.discounts.priorityCritical") },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* Buy X Get Y Specific Fields */}
          {selectedTargetType === DiscountTargetType.BuyXGetY && (
            <Card style={{ backgroundColor: "#f9f9f9", marginBottom: 16 }}>
              <Text strong style={{ display: "block", marginBottom: 12 }}>
                {t("pricing.discounts.bogoSettings")}
              </Text>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="buyXQty" label={t("pricing.discounts.buyXQty")}>
                    <InputNumber min={1} placeholder="2" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="getYQty" label={t("pricing.discounts.getYQty")}>
                    <InputNumber min={1} placeholder="1" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="getYDiscountPercent" label={t("pricing.discounts.getYDiscountPercent")}>
                    <InputNumber min={1} max={100} placeholder="100" addonAfter="%" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          )}

          <Form.Item
            name="dateRange"
            label={t("pricing.discounts.validityColumn")}
            rules={[{ required: true }]}
          >
            <DatePicker.RangePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="usageLimit" label={t("pricing.discounts.usageLimit")}>
                <InputNumber min={0} placeholder={t("pricing.discounts.unlimitedPlaceholder") || "0 = غير محدود"} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minCartAmount" label={t("pricing.discounts.minCartAmount")}>
                <InputNumber min={0} step={0.01} placeholder="0.00" addonAfter="SAR" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="maxDiscountAmount" label={t("pricing.discounts.maxDiscountCap")}>
                <InputNumber min={0} step={0.01} placeholder="0.00" addonAfter="SAR" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minQuantity" label={t("pricing.discounts.minQuantity")}>
                <InputNumber min={0} placeholder="1" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: "12px 0" }} />

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label={t("pricing.discounts.active")}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="oncePerCustomer"
                label={t("pricing.discounts.oncePerCustomer")}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </DrawerForm>

      {/* Drawer: Coupon */}
      <DrawerForm
        open={couponDrawerOpen}
        onClose={() => setCouponDrawerOpen(false)}
        title={editingCoupon ? t("pricing.discounts.editCouponTitle") : t("pricing.discounts.createCouponTitle")}
        width={500}
        form={couponForm}
        loading={saveCoupon.isPending}
        onFinish={onFinishCoupon}
        submitLabel={editingCoupon ? t("common.actions.saveChanges") : t("pricing.discounts.submitCreateCoupon")}
      >
        <Form form={couponForm} layout="vertical" onFinish={onFinishCoupon}>
          <Form.Item
            name="code"
            label={t("pricing.discounts.couponCode")}
            rules={[{ required: true, message: t("pricing.discounts.couponCodeRequired") }]}
          >
            <Input placeholder="PROMO2026, WELCOME10..." />
          </Form.Item>
          <Form.Item name="description" label={t("common.fields.description")}>
            <Input.TextArea rows={2} placeholder="وصف تفصيلي للكوبون والشروط (اختياري)..." />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label={t("pricing.discounts.typeColumn")} rules={[{ required: true }]}>
                <Select
                  placeholder={t("pricing.discounts.typeColumn") || "اختر نوع الكوبون"}
                  options={[
                    { value: "Percentage", label: t("pricing.discounts.typePercentage") },
                    { value: "FixedAmount", label: t("pricing.discounts.typeFixed") },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="value" label={t("pricing.discounts.valueColumn")} rules={[{ required: true }]}>
                <InputNumber min={0} placeholder="0.00" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="minPurchaseAmount" label={t("pricing.discounts.minCartAmount")}>
                <InputNumber min={0} step={0.01} placeholder="0.00" addonAfter="SAR" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="usageLimit" label={t("pricing.discounts.usageLimit")}>
                <InputNumber min={0} placeholder="0 = غير محدود" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="dateRange"
            label={t("pricing.discounts.validityColumn")}
            rules={[{ required: true }]}
          >
            <DatePicker.RangePicker showTime style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="isActive" label={t("pricing.discounts.active")} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </DrawerForm>
    </CommerceShell>
  );
}
