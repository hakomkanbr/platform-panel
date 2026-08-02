"use client";

import React, { useMemo, useState } from "react";
import {
  Button,
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
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { DataTable, DrawerForm, EmptyState } from "@repo/ui";
import { formatCurrency, formatDateTime } from "@repo/utils";
import { CommerceShell } from "../../../components/CommerceShell";
import { StatusTag } from "../../../components/StatusTag";
import { enumLabel, enumOptions } from "../../../types/enums";
import type { ProductPriceReadModel, PriceStatus, PriceTier, PriceConstraint } from "../../../types/pricing";
import {
  useDeleteProductPrice,
  useProductPrice,
  useProductPrices,
  useSaveProductPrice,
} from "../../../hooks/useProductPrices";
import { usePriceLists } from "../../../hooks/usePriceLists";
import { useProducts } from "../../../hooks/useProducts";
import { getApiErrorMessage } from "../../../api/http";

const { Text } = Typography;

type PriceRow = ProductPriceReadModel & Record<string, unknown>;

export function ProductPricesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priceListId, setPriceListId] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const priceLists = usePriceLists({ page: 1, pageSize: 100 });

  const { data, isLoading, isError, error, refetch } = useProductPrices({
    page,
    pageSize,
    search: search || undefined,
    status: status || undefined,
    priceListId: priceListId || undefined,
  });
  const save = useSaveProductPrice();
  const remove = useDeleteProductPrice();

  const rows = (data?.data ?? []) as PriceRow[];

  const openCreate = () => {
    form.resetFields();
    setDrawerOpen(true);
  };

  const onFinish = async (values: Record<string, unknown>) => {
    try {
      await save.mutateAsync({
        body: {
          priceListId: values.priceListId as string,
          productId: values.productId as string | undefined,
          currencyId: values.currencyId as string | undefined,
          baseAmount: (values.baseAmount as number) ?? 0,
          compareAtAmount: values.compareAtAmount as number | undefined,
          minAmount: values.minAmount as number | undefined,
          maxAmount: values.maxAmount as number | undefined,
          costAmount: values.costAmount as number | undefined,
          status: ((values.status as PriceStatus) ?? "draft"),
          effectiveFrom: values.effectiveFrom as string | undefined,
          effectiveTo: values.effectiveTo as string | undefined,
        },
      });
      message.success("Product price created");
      setDrawerOpen(false);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const columns: TableColumnsType<PriceRow> = [
    {
      title: "Product",
      dataIndex: "productId",
      render: (v) => <Text strong>{v ?? "\u2014"}</Text>,
    },
    { title: "Price list", dataIndex: "priceListId", render: (v) => v ?? "\u2014" },
    { title: "Currency", dataIndex: "currencyId", render: (v) => v ?? "\u2014" },
    {
      title: "Base price",
      dataIndex: "basePrice",
      render: (v, r) => <Text strong>{formatCurrency(v, r.currencyId)}</Text>,
    },
    {
      title: "Compare-at",
      dataIndex: "compareAtPrice",
      render: (v, r) => formatCurrency(v, r.currencyId),
    },
    { title: "Status", dataIndex: "status", width: 110, render: (v) => <StatusTag value={v} /> },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      width: 150,
      render: (v) => <span style={{ color: "var(--text-secondary)" }}>{formatDateTime(v)}</span>,
    },
  ];

  return (
    <CommerceShell
      title="Product prices"
      description="Set explicit prices per product and price list, with tiers and constraints."
      breadcrumbs={[{ title: "Pricing", href: "/admin/pricing" }, { title: "Product prices" }]}
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New price
        </Button>
      }
    >
      <DataTable<PriceRow>
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
        searchPlaceholder="Search by product or price list..."
        onSearch={(term) => {
          setSearch(term);
          setPage(1);
        }}
        filters={
          <Space>
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
              style={{ width: 150 }}
            />
            <Select
              value={priceListId}
              allowClear
              placeholder="Price list"
              loading={priceLists.isLoading}
              options={(priceLists.data?.data ?? []).map((p) => ({ value: p.id, label: p.name }))}
              onChange={(v) => {
                setPriceListId(v ?? "");
                setPage(1);
              }}
              style={{ width: 200 }}
            />
          </Space>
        }
        title={`${data?.count ?? 0} prices`}
        onRowClick={(record) => {
          setDetailId(record.id);
          setDetailOpen(true);
        }}
        emptyTitle="No product prices"
        emptyDescription="Add a price for a product within a price list."
        emptyAction={{ label: "New price", onClick: openCreate }}
      />

      <DrawerForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="New product price"
        width={600}
        form={form}
        loading={save.isPending}
        onFinish={onFinish}
        submitLabel="Create price"
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <PriceFormFields
            form={form}
            priceLists={priceLists.data?.data ?? []}
            isCreate
          />
        </Form>
      </DrawerForm>

      <PriceDetailDrawer
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        priceId={detailId}
      />
    </CommerceShell>
  );
}

function PriceFormFields({
  form,
  priceLists,
  isCreate,
}: {
  form: ReturnType<typeof Form.useForm>[0];
  priceLists: { id: string; name: string }[];
  isCreate?: boolean;
}) {
  const [productSearch, setProductSearch] = useState("");
  const products = useProducts({ page: 1, pageSize: 50, search: productSearch || undefined });
  const priceListId = Form.useWatch("priceListId", form);

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="priceListId" label="Price list" rules={[{ required: true, message: "Required" }]}>
          <Select
            showSearch
            optionFilterProp="label"
            placeholder="Select price list"
            options={priceLists.map((p) => ({ value: p.id, label: p.name }))}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="productId" label="Product">
          <Select
            showSearch
            allowClear
            placeholder="Search product"
            onSearch={setProductSearch}
            optionFilterProp="label"
            loading={products.isLoading}
            options={(products.data?.data ?? []).map((p) => ({ value: p.id, label: p.name }))}
          />
        </Form.Item>
      </Col>
      {isCreate && (
        <Col span={12}>
          <Form.Item name="currencyId" label="Currency code">
            <Select
              allowClear
              placeholder="USD"
              options={["USD", "EUR", "GBP", "AED", "SAR", "TRY"].map((c) => ({ value: c, label: c }))}
            />
          </Form.Item>
        </Col>
      )}
      <Col span={12}>
        <Form.Item name="status" label="Status" initialValue="draft">
          <Select
            options={[
              { value: "draft", label: "Draft" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="baseAmount" label="Base price" rules={[{ required: true, message: "Required" }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="compareAtAmount" label="Compare-at">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="costAmount" label="Cost">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="minAmount" label="Min price">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="maxAmount" label="Max price">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="effectiveFrom" label="Effective from">
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="effectiveTo" label="Effective to">
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Text type="secondary" style={{ fontSize: 12, padding: "0 8px" }}>
        Price list: {priceListId ? (priceLists.find((p) => p.id === priceListId)?.name ?? priceListId) : "not selected"}
      </Text>
    </Row>
  );
}

function PriceDetailDrawer({
  open,
  onClose,
  priceId,
}: {
  open: boolean;
  onClose: () => void;
  priceId: string | null;
}) {
  const { data: price, isLoading, error } = useProductPrice(priceId);
  const saveTier = useSavePriceTier(priceId);
  const removeTier = useDeletePriceTier(priceId);
  const saveConstraint = useSavePriceConstraint(priceId);
  const removeConstraint = useDeletePriceConstraint(priceId);
  const [removeOpen, setRemoveOpen] = useState(false);

  const openRemove = () => setRemoveOpen(true);
  const removeMutation = useDeleteProductPrice();

  const onRemove = async () => {
    if (!priceId) return;
    try {
      await removeMutation.mutateAsync(priceId);
      message.success("Price deleted");
      setRemoveOpen(false);
      onClose();
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const tierColumns: TableColumnsType<PriceTier> = [
    { title: "Min qty", dataIndex: "minQuantity" },
    { title: "Max qty", dataIndex: "maxQuantity", render: (v) => v ?? "\u221E" },
    { title: "Price", dataIndex: "price", render: (v) => formatCurrency(v, price?.currencyId) },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Delete tier?"
          onConfirm={async () => {
            try {
              await removeTier.mutateAsync(record.id as string);
              message.success("Tier deleted");
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

  const constraintColumns: TableColumnsType<PriceConstraint> = [
    {
      title: "Type",
      dataIndex: "type",
      render: (v) => enumLabel("priceConstraintType", v),
    },
    { title: "Value", dataIndex: "value" },
    { title: "Message", dataIndex: "message", render: (v) => v ?? "\u2014" },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Delete constraint?"
          onConfirm={async () => {
            try {
              await removeConstraint.mutateAsync(record.id as string);
              message.success("Constraint deleted");
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

  return (
    <DrawerForm
      open={open}
      onClose={onClose}
      title="Product price"
      description={price?.productId}
      width={680}
      footer={
        <Space>
          <Button danger icon={<DeleteOutlined />} onClick={openRemove}>
            Delete
          </Button>
          <Button type="primary" onClick={onClose}>
            Close
          </Button>
        </Space>
      }
    >
      {isLoading && <Text type="secondary">Loading...</Text>}
      {error && <Text type="danger">{getApiErrorMessage(error)}</Text>}
      {price && (
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Product">{price.productId}</Descriptions.Item>
            <Descriptions.Item label="Price list">{price.priceListId ?? "\u2014"}</Descriptions.Item>
            <Descriptions.Item label="Base price">
              <Text strong>{formatCurrency(price.basePrice, price.currencyId)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <StatusTag value={price.status} />
            </Descriptions.Item>
            <Descriptions.Item label="Approval">{enumLabel("approvalStatus", price.approvalStatus)}</Descriptions.Item>
            <Descriptions.Item label="Active">{price.isActive ? "Yes" : "No"}</Descriptions.Item>
          </Descriptions>

          <AddListSection
            title={`Tiers (${price.tiers.length})`}
            addLabel="Add tier"
            emptyTitle="No tiers"
            loading={saveTier.isPending}
            onSubmit={async (values) => {
              try {
                await saveTier.mutateAsync({
                  body: {
                    minQuantity: values.minQuantity,
                    price: values.price,
                    maxQuantity: values.maxQuantity,
                  },
                });
                message.success("Tier added");
              } catch (e) {
                message.error(getApiErrorMessage(e));
              }
            }}
            formFields={
              <>
                <Form.Item name="minQuantity" label="Min qty" rules={[{ required: true }]}>
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="maxQuantity" label="Max qty">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </>
            }
            renderTable={
              <Table<PriceTier>
                rowKey={(r) => r.id ?? Math.random().toString(36)}
                columns={tierColumns}
                dataSource={price.tiers}
                pagination={false}
                size="small"
                locale={{ emptyText: <EmptyState title="No tiers" /> }}
              />
            }
          />

          <AddListSection
            title={`Constraints (${price.constraints.length})`}
            addLabel="Add constraint"
            emptyTitle="No constraints"
            loading={saveConstraint.isPending}
            onSubmit={async (values) => {
              try {
                await saveConstraint.mutateAsync({
                  body: { type: values.type, value: values.value, message: values.message },
                });
                message.success("Constraint added");
              } catch (e) {
                message.error(getApiErrorMessage(e));
              }
            }}
            formFields={
              <>
                <Form.Item name="type" label="Type" initialValue={1}>
                  <Select options={enumOptions("priceConstraintType")} />
                </Form.Item>
                <Form.Item name="value" label="Value" rules={[{ required: true }]}>
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="message" label="Message">
                  <Input placeholder="Note" />
                </Form.Item>
              </>
            }
            renderTable={
              <Table<PriceConstraint>
                rowKey={(r) => r.id ?? Math.random().toString(36)}
                columns={constraintColumns}
                dataSource={price.constraints}
                pagination={false}
                size="small"
                locale={{ emptyText: <EmptyState title="No constraints" /> }}
              />
            }
          />
        </Space>
      )}

      <Modal
        open={removeOpen}
        title="Delete price"
        okText="Delete"
        okButtonProps={{ danger: true }}
        onCancel={() => setRemoveOpen(false)}
        onOk={onRemove}
        confirmLoading={removeMutation.isPending}
      >
        <Text>This will permanently delete the price. This action cannot be undone.</Text>
      </Modal>
    </DrawerForm>
  );
}

function AddListSection({
  title,
  addLabel,
  emptyTitle,
  loading,
  onSubmit,
  formFields,
  renderTable,
}: {
  title: string;
  addLabel: string;
  emptyTitle: string;
  loading?: boolean;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  formFields: React.ReactNode;
  renderTable: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <Text strong>{title}</Text>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setOpen(true);
          }}
        >
          {addLabel}
        </Button>
      </div>
      {renderTable}
      <Modal
        open={open}
        title={addLabel}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="Save"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            await onSubmit(values);
            setOpen(false);
          }}
        >
          {formFields}
        </Form>
      </Modal>
    </div>
  );
}