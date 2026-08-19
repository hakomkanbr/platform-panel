"use client";
import React, { useState, useEffect, useMemo, Suspense } from "react";
import {
  Table, Button, Space, Typography, Card, Input, Popconfirm, message,
  Tag, Tooltip, Modal, Form, Select, DatePicker, Switch, InputNumber,
  Spin, Row, Col, Statistic, Tabs, Empty, Divider, Alert, Segmented,
} from "antd";
import {
  PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined,
  ShoppingCartOutlined, AppstoreOutlined, FolderOutlined,
  CarOutlined, GiftOutlined, BarChartOutlined,
} from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { useDiscounts, useCreateDiscount, useUpdateDiscount } from "@/hooks/useDiscounts";
import { discountsApi } from "@/lib/api/discounts";
import { productsApi } from "@/lib/api/products";
import { categoriesApi } from "@/lib/api/categories";
import { DiscountType, DiscountTargetType, DiscountPriority } from "@/types/discount";
import type { Discount, DiscountFormData, PaginatedList } from "@/types";

const { Title, Text } = Typography;

const PRIORITY_MAP: Record<number, { color: string; label: string }> = {
  [DiscountPriority.Low]: { color: "default", label: "Low" },
  [DiscountPriority.Normal]: { color: "blue", label: "Normal" },
  [DiscountPriority.High]: { color: "orange", label: "High" },
  [DiscountPriority.Critical]: { color: "red", label: "Critical" },
};

const TARGET_META: Record<DiscountTargetType, { icon: React.ReactNode; color: string; label: string }> = {
  [DiscountTargetType.Cart]: { icon: <ShoppingCartOutlined />, color: "purple", label: "Cart" },
  [DiscountTargetType.Product]: { icon: <AppstoreOutlined />, color: "blue", label: "Product" },
  [DiscountTargetType.Category]: { icon: <FolderOutlined />, color: "green", label: "Category" },
  [DiscountTargetType.Shipping]: { icon: <CarOutlined />, color: "orange", label: "Shipping" },
  [DiscountTargetType.BuyXGetY]: { icon: <GiftOutlined />, color: "pink", label: "Buy X Get Y" },
};

const TARGET_OPTIONS = [
  { value: DiscountTargetType.Cart, label: "Cart Discount" },
  { value: DiscountTargetType.Product, label: "Product Discount" },
  { value: DiscountTargetType.Category, label: "Category Discount" },
  { value: DiscountTargetType.Shipping, label: "Free Shipping" },
  { value: DiscountTargetType.BuyXGetY, label: "Buy X Get Y" },
];

const TYPE_OPTIONS = [
  { value: DiscountType.Percentage, label: "Percentage (%)" },
  { value: DiscountType.FixedAmount, label: "Fixed Amount (SAR)" },
];

const PRIORITY_OPTIONS = [
  { value: DiscountPriority.Low, label: "Low" },
  { value: DiscountPriority.Normal, label: "Normal" },
  { value: DiscountPriority.High, label: "High" },
  { value: DiscountPriority.Critical, label: "Critical" },
];

function DiscountsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [params, setParams] = useState<{ search?: string; skip: number; pageSize: number }>({ skip: 0, pageSize: 10 });
  const { discounts, count, loading, refetch } = useDiscounts(params);
  const { create, submitting: creating } = useCreateDiscount();
  const { update, submitting: updating } = useUpdateDiscount();
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Discount | null>(null);
  const [form] = Form.useForm();
  const [productOptions, setProductOptions] = useState<{ value: number; label: string }[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ value: number; label: string }[]>([]);
  const [searchingProducts, setSearchingProducts] = useState(false);
  const [targetType, setTargetType] = useState<DiscountTargetType>(DiscountTargetType.Cart);
  const [discountType, setDiscountType] = useState<DiscountType>(DiscountType.Percentage);

  const filteredDiscounts = useMemo(() => {
    if (activeTab === "all") return discounts;
    return discounts.filter((d) => d.targetType === activeTab);
  }, [discounts, activeTab]);

  useEffect(() => {
    if (!discounts.length) return;
    if (searchParams.get("new") === "true") {
      setEditRecord(null);
      form.resetFields();
      setTargetType(DiscountTargetType.Cart);
      setDiscountType(DiscountType.Percentage);
      setModalOpen(true);
    }
    const editId = searchParams.get("edit");
    if (editId) {
      const found = discounts.find((d) => d.id === Number(editId));
      if (found) {
        setEditRecord(found);
        setTargetType(found.targetType);
        setDiscountType(found.type);
        form.setFieldsValue({
          ...found,
          startDate: found.startDate ? dayjs(found.startDate) : null,
          endDate: found.endDate ? dayjs(found.endDate) : null,
        });
        setModalOpen(true);
      }
    }
  }, [searchParams, discounts, form]);

  useEffect(() => {
    categoriesApi.list().then((cats: any) => {
      const data = Array.isArray(cats) ? cats : cats?.data || [];
      setCategoryOptions(data.map((c: any) => ({ value: c.id, label: c.name })));
    }).catch(() => {});
  }, []);

  const loadProducts = async (searchTerm?: string) => {
    setSearchingProducts(true);
    try {
      const res = await productsApi.list({ search: searchTerm, pageSize: 50 });
      setProductOptions(res.data.map((p: any) => ({ value: Number(p.id), label: `${p.code} - ${p.title}` })));
    } catch {}
    setSearchingProducts(false);
  };

  useEffect(() => {
    if (modalOpen && (targetType === DiscountTargetType.Product || targetType === DiscountTargetType.BuyXGetY)) {
      loadProducts();
    }
  }, [modalOpen, targetType]);

  const openCreateModal = () => {
    setEditRecord(null);
    form.resetFields();
    setTargetType(DiscountTargetType.Cart);
    setDiscountType(DiscountType.Percentage);
    setModalOpen(true);
    router.push("/panel/discounts?new=true");
  };

  const openEditModal = (record: Discount) => {
    setEditRecord(record);
    setTargetType(record.targetType);
    setDiscountType(record.type);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? dayjs(record.startDate) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null,
    });
    setModalOpen(true);
    router.push(`/panel/discounts?edit=${record.id}`);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditRecord(null);
    form.resetFields();
    router.push("/panel/discounts");
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload: DiscountFormData = {
        ...values,
        targetType,
        type: discountType,
        startDate: values.startDate?.toISOString?.() ?? values.startDate ?? null,
        endDate: values.endDate?.toISOString?.() ?? values.endDate ?? null,
        productIds: values.productIds ?? [],
        categoryIds: values.categoryIds ?? [],
      };
      if (editRecord) {
        await update({ ...payload, id: editRecord.id });
        message.success("Discount updated");
      } else {
        await create(payload);
        message.success("Discount created");
      }
      handleModalClose();
      refetch();
    } catch (e: any) {
      message.error(e?.message || "Failed to save discount");
    }
  };

  const handleDelete = async (id: number) => {
    try { await discountsApi.delete(id); message.success("Discount deleted"); refetch(); }
    catch { message.error("Failed to delete discount"); }
  };

  const handleToggleActive = async (id: number, checked: boolean) => {
    try {
      await discountsApi.toggleActive(id, checked);
      message.success(checked ? "Discount activated" : "Discount deactivated");
      refetch();
    } catch { message.error("Failed to update discount"); }
  };

  const summary = useMemo(() => ({
    total: count, active: discounts.filter((d) => d.isActive).length,
    cart: discounts.filter((d) => d.targetType === DiscountTargetType.Cart).length,
    product: discounts.filter((d) => d.targetType === DiscountTargetType.Product).length,
    category: discounts.filter((d) => d.targetType === DiscountTargetType.Category).length,
    shipping: discounts.filter((d) => d.targetType === DiscountTargetType.Shipping).length,
    buyXGetY: discounts.filter((d) => d.targetType === DiscountTargetType.BuyXGetY).length,
  }), [discounts, count]);

  const columns = [
    {
      title: "Name", dataIndex: "name", key: "name", ellipsis: true,
      render: (v: string, r: Discount) => {
        const meta = TARGET_META[r.targetType];
        return (
          <Space>
            <span style={{ color: meta?.color }}>{meta?.icon}</span>
            <Text strong>{v}</Text>
            {(r as any).appliesToAll && <Tag color="geekblue" style={{ fontSize: 10 }}>All</Tag>}
          </Space>
        );
      },
    },
    { title: "Code", dataIndex: "code", key: "code", width: 110 },
    {
      title: "Target", dataIndex: "targetType", key: "targetType", width: 120,
      render: (v: DiscountTargetType) => {
        const meta = TARGET_META[v];
        return <Tag color={meta?.color}>{meta?.label || v}</Tag>;
      },
    },
    {
      title: "Value", dataIndex: "value", key: "value", width: 100,
      render: (v: number, r: Discount) => (
        r.type === DiscountType.Percentage ? `%${v}` : `SAR ${v}`
      ),
    },
    {
      title: "Priority", dataIndex: "priority", key: "priority", width: 90,
      render: (v: DiscountPriority) => (
        <Tag color={PRIORITY_MAP[v]?.color}>{PRIORITY_MAP[v]?.label || v}</Tag>
      ),
    },
    {
      title: "Usage", key: "usage", width: 80,
      render: (_: any, r: Discount) => (
        <Text type="secondary">{r.usageCount}/{r.usageLimit ?? "∞"}</Text>
      ),
    },
    {
      title: "Period", key: "period", width: 170,
      render: (_: any, r: Discount) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {r.startDate ? dayjs(r.startDate).format("MM/DD") : "—"} ~ {r.endDate ? dayjs(r.endDate).format("MM/DD") : "∞"}
        </Text>
      ),
    },
    {
      title: "Active", dataIndex: "isActive", key: "isActive", width: 70,
      render: (v: boolean, record: Discount) => (
        <Switch checked={v} size="small" onChange={(checked) => handleToggleActive(record.id, checked)} />
      ),
    },
    {
      title: "Actions", key: "actions", width: 90,
      render: (_: unknown, record: Discount) => (
        <Space>
          <Tooltip title="Edit"><Button size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)} /></Tooltip>
          <Popconfirm title="Delete this discount?" onConfirm={() => handleDelete(record.id)}>
            <Tooltip title="Delete"><Button size="small" danger icon={<DeleteOutlined />} /></Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: "all", label: <span><BarChartOutlined /> All ({summary.total})</span> },
    { key: DiscountTargetType.Cart, label: <span><ShoppingCartOutlined /> Cart ({summary.cart})</span> },
    { key: DiscountTargetType.Product, label: <span><AppstoreOutlined /> Product ({summary.product})</span> },
    { key: DiscountTargetType.Category, label: <span><FolderOutlined /> Category ({summary.category})</span> },
    { key: DiscountTargetType.Shipping, label: <span><CarOutlined /> Shipping ({summary.shipping})</span> },
    { key: DiscountTargetType.BuyXGetY, label: <span><GiftOutlined /> BXGY ({summary.buyXGetY})</span> },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card size="small"><Statistic title="Total" value={summary.total} prefix={<BarChartOutlined />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small"><Statistic title="Active" value={summary.active} valueStyle={{ color: "#3f8600" }} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small"><Statistic title="Product" value={summary.product} prefix={<AppstoreOutlined />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small"><Statistic title="Cart" value={summary.cart} prefix={<ShoppingCartOutlined />} /></Card>
        </Col>
      </Row>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} style={{ marginBottom: 0 }} />
          <Space>
            <Input placeholder="Search..." prefix={<SearchOutlined />} value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={() => setParams((p) => ({ ...p, search }))} style={{ width: 200 }} />
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              Add Discount
            </Button>
          </Space>
        </div>
        <Table dataSource={filteredDiscounts} columns={columns} rowKey="id" loading={loading}
          pagination={{
            current: params.skip / params.pageSize + 1, pageSize: params.pageSize,
            total: activeTab === "all" ? count : filteredDiscounts.length,
            onChange: (page, pageSize) => setParams({ skip: (page - 1) * pageSize, pageSize }),
          }}
          size="middle" locale={{ emptyText: <Empty description="No discounts found" /> }}
        />
      </Card>

      <Modal
        title={editRecord ? "Edit Discount" : "Create Discount"}
        open={modalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={820}
        destroyOnClose
      >
        <div style={{ marginBottom: 24 }}>
          <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>Discount Target</Text>
          <Segmented
            value={targetType}
            onChange={(value) => setTargetType(value as DiscountTargetType)}
            options={TARGET_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            style={{ marginBottom: 16 }}
          />
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isActive: true, appliesToAll: false, oncePerCustomer: false,
            priority: DiscountPriority.Normal, type: DiscountType.Percentage,
            getYDiscountPercent: 100,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Discount Name" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="e.g. Summer Sale" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="code" label="Code" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="SUMMER2024" size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Type">
                <Segmented
                  value={discountType}
                  onChange={(v) => setDiscountType(v as DiscountType)}
                  options={TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="value" label="Value" rules={[{ required: true, message: "Required" }]}>
                <InputNumber min={0} style={{ width: "100%" }} size="large" addonAfter={discountType === DiscountType.Percentage ? "%" : "SAR"} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
                <Select size="large" options={PRIORITY_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          {targetType === DiscountTargetType.Cart && (
            <Form.Item name="minCartAmount" label="Minimum Cart Amount (SAR)">
              <InputNumber min={0} style={{ width: "100%" }} size="large" placeholder="No minimum" />
            </Form.Item>
          )}

          {targetType === DiscountTargetType.Product && (
            <>
              <Form.Item name="appliesToAll" valuePropName="checked">
                <Switch checkedChildren="All Products" unCheckedChildren="Specific Products" />
              </Form.Item>
              <Form.Item noStyle shouldUpdate={(prev, cur) => prev.appliesToAll !== cur.appliesToAll}>
                {({ getFieldValue }) =>
                  !getFieldValue("appliesToAll") ? (
                    <Form.Item name="productIds" label="Select Products">
                      <Select mode="multiple" placeholder="Search products" loading={searchingProducts}
                        showSearch onSearch={loadProducts} filterOption={false}
                        options={productOptions} style={{ width: "100%" }}
                      />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </>
          )}

          {targetType === DiscountTargetType.Category && (
            <Form.Item name="categoryIds" label="Select Categories">
              <Select mode="multiple" placeholder="Select categories" options={categoryOptions} style={{ width: "100%" }} />
            </Form.Item>
          )}

          {targetType === DiscountTargetType.BuyXGetY && (
            <>
              <Alert message="Customer buys X quantity and gets Y quantity at a discount" type="info" showIcon style={{ marginBottom: 16 }} />
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="buyXQty" label="Buy Qty" rules={[{ required: true }]}>
                    <InputNumber min={1} style={{ width: "100%" }} placeholder="3" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="getYQty" label="Get Qty" rules={[{ required: true }]}>
                    <InputNumber min={1} style={{ width: "100%" }} placeholder="1" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="getYDiscountPercent" label="Y Discount %">
                    <InputNumber min={0} max={100} style={{ width: "100%" }} addonAfter="%" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="productIds" label="Applicable Products">
                <Select mode="multiple" placeholder="All products if empty" loading={searchingProducts}
                  showSearch onSearch={loadProducts} filterOption={false} options={productOptions}
                />
              </Form.Item>
            </>
          )}

          {targetType === DiscountTargetType.Shipping && (
            <Alert message="Free Shipping: waives shipping fees for qualifying orders" type="success" showIcon />
          )}

          <Divider>Schedule & Limits</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startDate" label="Start Date">
                <DatePicker style={{ width: "100%" }} size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="End Date">
                <DatePicker style={{ width: "100%" }} size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="usageLimit" label="Usage Limit">
                <InputNumber min={0} style={{ width: "100%" }} placeholder="Unlimited" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="minQuantity" label="Min Qty">
                <InputNumber min={0} style={{ width: "100%" }} placeholder="No min" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="maxQuantity" label="Max Qty">
                <InputNumber min={0} style={{ width: "100%" }} placeholder="No max" />
              </Form.Item>
            </Col>
          </Row>
          {targetType !== DiscountTargetType.Shipping && (
            <Form.Item name="maxDiscountAmount" label="Maximum Discount Amount (SAR)">
              <InputNumber min={0} style={{ width: "100%" }} size="large" placeholder="No limit" />
            </Form.Item>
          )}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="oncePerCustomer" valuePropName="checked">
                <Switch checkedChildren="Once per customer" unCheckedChildren="Multiple uses" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isActive" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }}>
            <Button onClick={handleModalClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={creating || updating} size="large">
              {editRecord ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default function DiscountsPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>}>
      <DiscountsContent />
    </Suspense>
  );
}
