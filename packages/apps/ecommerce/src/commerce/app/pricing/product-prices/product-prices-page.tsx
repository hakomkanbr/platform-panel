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
import { useTranslations } from "@repo/localization";
import { CommerceShell } from "../../../components/CommerceShell";
import { StatusTag } from "../../../components/StatusTag";
import { enumLabel, enumOptions } from "../../../types/enums";
import type { ProductPriceReadModel, PricingStatus, PriceTierReadModel, PriceConstraintReadModel } from "../../../types/pricing";
import {
  useDeleteProductPrice,
  useProductPrice,
  useProductPrices,
  useSaveProductPrice,
  useSavePriceTier,
  useDeletePriceTier,
  useSavePriceConstraint,
  useDeletePriceConstraint,
} from "../../../hooks/useProductPrices";
import { usePriceLists } from "../../../hooks/usePriceLists";
import { useProducts } from "../../../hooks/useProducts";
import { getApiErrorMessage } from "../../../api/http";

const { Text } = Typography;

type PriceRow = ProductPriceReadModel & Record<string, unknown>;

export function ProductPricesPage() {
  const t = useTranslations();
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
          status: ((values.status as PricingStatus) ?? 1),
          effectiveFrom: values.effectiveFrom as string | undefined,
          effectiveTo: values.effectiveTo as string | undefined,
        },
      });
      message.success(t("pricing.productPrices.created"));
      setDrawerOpen(false);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const columns: TableColumnsType<PriceRow> = [
    {
      title: t("pricing.productPrices.productColumn"),
      dataIndex: "productId",
      render: (v) => <Text strong>{v ?? "\u2014"}</Text>,
    },
    { title: t("pricing.productPrices.priceListColumn"), dataIndex: "priceListId", render: (v) => v ?? "\u2014" },
    { title: t("pricing.productPrices.currencyColumn"), dataIndex: "currencyId", render: (v) => v ?? "\u2014" },
    {
      title: t("pricing.productPrices.basePriceColumn"),
      dataIndex: "basePrice",
      render: (v, r) => <Text strong>{formatCurrency(v, r.currencyId)}</Text>,
    },
    {
      title: t("pricing.productPrices.compareAtColumn"),
      dataIndex: "compareAtPrice",
      render: (v, r) => formatCurrency(v, r.currencyId),
    },
    { title: t("pricing.productPrices.statusColumn"), dataIndex: "status", width: 110, render: (v) => <StatusTag value={v} /> },
    {
      title: t("pricing.productPrices.updatedColumn"),
      dataIndex: "updatedAt",
      width: 150,
      render: (v) => <span style={{ color: "var(--text-secondary)" }}>{formatDateTime(v)}</span>,
    },
  ];

  return (
    <CommerceShell
      title={t("pricing.productPrices.title")}
      description={t("pricing.productPrices.description")}
      breadcrumbs={[{ title: t("pricing.title"), href: "/admin/pricing" }, { title: t("pricing.productPrices.title") }]}
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {t("pricing.productPrices.new")}
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
        searchPlaceholder={t("pricing.productPrices.searchPlaceholder")}
        onSearch={(term) => {
          setSearch(term);
          setPage(1);
        }}
        filters={
          <Space>
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
              style={{ width: 150 }}
            />
            <Select
              value={priceListId}
              allowClear
              placeholder={t("pricing.productPrices.priceListPlaceholder")}
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
        title={t("pricing.productPrices.count", { count: data?.count ?? 0 })}
        onRowClick={(record) => {
          setDetailId(record.id);
          setDetailOpen(true);
        }}
        emptyTitle={t("pricing.productPrices.emptyTitle")}
        emptyDescription={t("pricing.productPrices.emptyDescription")}
        emptyAction={{ label: t("pricing.productPrices.new"), onClick: openCreate }}
      />

      <DrawerForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={t("pricing.productPrices.drawerCreateTitle")}
        width={600}
        form={form}
        loading={save.isPending}
        onFinish={onFinish}
        submitLabel={t("pricing.productPrices.submitCreate")}
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
  const t = useTranslations();
  const [productSearch, setProductSearch] = useState("");
  const products = useProducts({ page: 1, pageSize: 50, search: productSearch || undefined });
  const priceListId = Form.useWatch("priceListId", form);

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="priceListId" label={t("pricing.productPrices.priceListHint")} rules={[{ required: true, message: t("common.fields.required") }]}>
          <Select
            showSearch
            optionFilterProp="label"
            placeholder={t("pricing.productPrices.selectPriceList")}
            options={priceLists.map((p) => ({ value: p.id, label: p.name }))}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="productId" label={t("pricing.productPrices.detail.product")}>
          <Select
            showSearch
            allowClear
            placeholder={t("pricing.productPrices.selectProduct")}
            onSearch={setProductSearch}
            optionFilterProp="label"
            loading={products.isLoading}
            options={(products.data?.data ?? []).map((p) => ({ value: p.id, label: p.name }))}
          />
        </Form.Item>
      </Col>
      {isCreate && (
        <Col span={12}>
          <Form.Item name="currencyId" label={t("pricing.productPrices.currencyCode")}>
            <Select
              allowClear
              placeholder="USD"
              options={["USD", "EUR", "GBP", "AED", "SAR", "TRY"].map((c) => ({ value: c, label: c }))}
            />
          </Form.Item>
        </Col>
      )}
      <Col span={12}>
        <Form.Item name="status" label={t("common.fields.status")} initialValue="draft">
          <Select
            options={[
              { value: "draft", label: t("catalog.status.draft") },
              { value: "active", label: t("catalog.status.active") },
              { value: "inactive", label: t("catalog.status.inactive") },
            ]}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="baseAmount" label={t("pricing.productPrices.basePrice")} rules={[{ required: true, message: t("common.fields.required") }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="compareAtAmount" label={t("pricing.productPrices.compareAt")}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="costAmount" label={t("pricing.productPrices.cost")}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="minAmount" label={t("pricing.productPrices.minPrice")}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="maxAmount" label={t("pricing.productPrices.maxPrice")}>
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
      <Text type="secondary" style={{ fontSize: 12, padding: "0 8px" }}>
        {t("pricing.productPrices.priceListHint")}: {priceListId ? (priceLists.find((p) => p.id === priceListId)?.name ?? priceListId) : t("pricing.productPrices.priceListNotSelected")}
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
  const t = useTranslations();
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
      message.success(t("pricing.productPrices.deleted"));
      setRemoveOpen(false);
      onClose();
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const tierColumns: TableColumnsType<PriceTierReadModel> = [
    { title: t("pricing.productPrices.detail.minQty"), dataIndex: "minQuantity" },
    { title: t("pricing.productPrices.detail.maxQty"), dataIndex: "maxQuantity", render: (v) => v ?? "\u221E" },
    { title: t("pricing.productPrices.detail.price"), dataIndex: "price", render: (v) => formatCurrency(v, price?.currencyId) },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title={t("pricing.productPrices.detail.deleteTierConfirm")}
          onConfirm={async () => {
            try {
              await removeTier.mutateAsync(record.id as string);
              message.success(t("pricing.productPrices.detail.tierDeleted"));
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

  const constraintColumns: TableColumnsType<PriceConstraintReadModel> = [
    {
      title: t("pricing.productPrices.detail.type"),
      dataIndex: "type",
      render: (v) => enumLabel("priceConstraintType", v, t),
    },
    { title: t("pricing.productPrices.detail.value"), dataIndex: "value" },
    { title: t("pricing.productPrices.detail.message"), dataIndex: "message", render: (v) => v ?? "\u2014" },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title={t("pricing.productPrices.detail.deleteConstraintConfirm")}
          onConfirm={async () => {
            try {
              await removeConstraint.mutateAsync(record.id as string);
              message.success(t("pricing.productPrices.detail.constraintDeleted"));
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
      title={t("pricing.productPrices.detail.title")}
      description={price?.productId}
      width={680}
      footer={
        <Space>
          <Button danger icon={<DeleteOutlined />} onClick={openRemove}>
            {t("pricing.productPrices.detail.delete")}
          </Button>
          <Button type="primary" onClick={onClose}>
            {t("pricing.productPrices.detail.close")}
          </Button>
        </Space>
      }
    >
      {isLoading && <Text type="secondary">{t("pricing.productPrices.detail.loading")}</Text>}
      {error && <Text type="danger">{getApiErrorMessage(error)}</Text>}
      {price && (
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
          <Descriptions column={2} size="small">
            <Descriptions.Item label={t("pricing.productPrices.detail.product")}>{price.productId}</Descriptions.Item>
            <Descriptions.Item label={t("pricing.productPrices.detail.priceList")}>{price.priceListId ?? "\u2014"}</Descriptions.Item>
            <Descriptions.Item label={t("pricing.productPrices.detail.basePrice")}>
              <Text strong>{formatCurrency(price.basePrice, price.currencyId)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={t("pricing.productPrices.detail.status")}>
              <StatusTag value={price.status} />
            </Descriptions.Item>
            <Descriptions.Item label={t("pricing.productPrices.detail.approval")}>{enumLabel("approvalStatus", price.approvalStatus, t)}</Descriptions.Item>
            <Descriptions.Item label={t("pricing.productPrices.detail.active")}>{price.isActive ? t("common.actions.yes") : t("common.actions.no")}</Descriptions.Item>
          </Descriptions>

          <AddListSection
            title={t("pricing.productPrices.detail.tiersTitle", { count: price.tiers.length })}
            addLabel={t("pricing.productPrices.detail.addTier")}
            emptyTitle={t("pricing.productPrices.detail.noTiers")}
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
                message.success(t("pricing.productPrices.detail.tierAdded"));
              } catch (e) {
                message.error(getApiErrorMessage(e));
              }
            }}
            formFields={
              <>
                <Form.Item name="minQuantity" label={t("pricing.productPrices.detail.minQty")} rules={[{ required: true }]}>
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="maxQuantity" label={t("pricing.productPrices.detail.maxQty")}>
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="price" label={t("pricing.productPrices.detail.price")} rules={[{ required: true }]}>
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </>
            }
            renderTable={
              <Table<PriceTierReadModel>
                rowKey={(r) => r.id ?? Math.random().toString(36)}
                columns={tierColumns}
                dataSource={price.tiers}
                pagination={false}
                size="small"
                locale={{ emptyText: <EmptyState title={t("pricing.productPrices.detail.noTiers")} /> }}
              />
            }
          />

          <AddListSection
            title={t("pricing.productPrices.detail.constraintsTitle", { count: price.constraints.length })}
            addLabel={t("pricing.productPrices.detail.addConstraint")}
            emptyTitle={t("pricing.productPrices.detail.noConstraints")}
            loading={saveConstraint.isPending}
            onSubmit={async (values) => {
              try {
                await saveConstraint.mutateAsync({
                  body: { type: values.type, value: values.value, message: values.message },
                });
                message.success(t("pricing.productPrices.detail.constraintAdded"));
              } catch (e) {
                message.error(getApiErrorMessage(e));
              }
            }}
            formFields={
              <>
                <Form.Item name="type" label={t("pricing.productPrices.detail.type")} initialValue={1}>
                  <Select options={enumOptions("priceConstraintType", t)} />
                </Form.Item>
                <Form.Item name="value" label={t("pricing.productPrices.detail.value")} rules={[{ required: true }]}>
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="message" label={t("pricing.productPrices.detail.message")}>
                  <Input placeholder={t("pricing.productPrices.detail.notePlaceholder")} />
                </Form.Item>
              </>
            }
            renderTable={
              <Table<PriceConstraintReadModel>
                rowKey={(r) => r.id ?? Math.random().toString(36)}
                columns={constraintColumns}
                dataSource={price.constraints}
                pagination={false}
                size="small"
                locale={{ emptyText: <EmptyState title={t("pricing.productPrices.detail.noConstraints")} /> }}
              />
            }
          />
        </Space>
      )}

      <Modal
        open={removeOpen}
        title={t("pricing.productPrices.deleteTitle")}
        okText={t("pricing.productPrices.detail.delete")}
        okButtonProps={{ danger: true }}
        onCancel={() => setRemoveOpen(false)}
        onOk={onRemove}
        confirmLoading={removeMutation.isPending}
      >
        <Text>{t("pricing.productPrices.deleteContent")}</Text>
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
  const t = useTranslations();
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
        okText={t("common.actions.saveChanges")}
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