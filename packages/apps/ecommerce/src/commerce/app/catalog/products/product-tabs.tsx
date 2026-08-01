"use client";

import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { EmptyState, DrawerForm } from "@repo/ui";
import { formatCurrency } from "@repo/utils";
import { enumLabel, enumOptions } from "../../../types/enums";
import type { MediaItem, OptionValue, ProductOption, Relation, Variant } from "../../../types/catalog";
import {
  useAddProductRelation,
  useDeleteProductDetail,
  useProductMedia,
  useProductOptions,
  useProductRelations,
  useProductVariants,
  useSaveProductDetail,
} from "../../../hooks/useProducts";
import { useProducts } from "../../../hooks/useProducts";
import { getApiErrorMessage } from "../../../api/http";

const { Text } = Typography;

function ErrorHint({ error }: { error: unknown }) {
  if (!error) return null;
  return <Text type="danger">{getApiErrorMessage(error)}</Text>;
}

/* ----------------------------------- Media ----------------------------------- */

export function ProductMediaTab({ productId }: { productId: string }) {
  const { data, isLoading, isError, error, refetch } = useProductMedia(productId);
  const save = useSaveProductDetail("media", productId);
  const remove = useDeleteProductDetail("media", productId);

  const [url, setUrl] = useState("");
  const [type, setType] = useState(1);

  const add = async () => {
    if (!url.trim()) return;
    try {
      await save.mutateAsync({ body: { url: url.trim(), type } });
      message.success("Media added");
      setUrl("");
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const items = (data ?? []) as MediaItem[];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <Input
          value={url}
          placeholder="Paste media URL..."
          onChange={(e) => setUrl(e.target.value)}
          onPressEnter={add}
          style={{ maxWidth: 420 }}
        />
        <Select value={type} options={enumOptions("mediaType")} style={{ width: 140 }} onChange={setType} />
        <Button type="primary" icon={<PlusOutlined />} onClick={add} disabled={!url.trim()}>
          Add
        </Button>
      </div>

      {isError && <ErrorHint error={error} />}

      {items.length === 0 && !isLoading ? (
        <EmptyState
          title="No media"
          description="Add product images by URL to build the gallery."
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {items.map((item, index) => (
            <div
              key={item.id ?? index}
              style={{
                border: "1px solid var(--border-light)",
                borderRadius: 12,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <div
                style={{
                  height: 120,
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {item.type === 1 ? (
                  <img
                    src={item.url}
                    alt={item.altText || "media"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                    }}
                  />
                ) : (
                  <Text type="secondary">{enumLabel("mediaType", item.type)}</Text>
                )}
              </div>
              <div style={{ padding: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 12 }} ellipsis>
                  {enumLabel("mediaType", item.type)}
                </Text>
                <Popconfirm
                  title="Remove media?"
                  onConfirm={async () => {
                    try {
                      await remove.mutateAsync(item.id as string);
                      message.success("Media removed");
                    } catch (e) {
                      message.error(getApiErrorMessage(e));
                    }
                  }}
                >
                  <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- Options ---------------------------------- */

export function ProductOptionsTab({ productId }: { productId: string }) {
  const { data, isLoading, isError, error } = useProductOptions(productId);
  const save = useSaveProductDetail("options", productId);
  const remove = useDeleteProductDetail("options", productId);

  const [form] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<ProductOption | null>(null);

  const options = (data ?? []) as ProductOption[];

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const openEdit = (option: ProductOption) => {
    setEditing(option);
    form.setFieldsValue({
      name: option.name,
      inputType: option.inputType,
      isRequired: option.isRequired,
      values: option.values ?? [],
    });
    setDrawerOpen(true);
  };

  const onFinish = async (values: Record<string, unknown>) => {
    try {
      await save.mutateAsync({
        entityId: editing?.id,
        body: {
          name: values.name,
          inputType: values.inputType,
          isRequired: values.isRequired,
          values: (values.values as OptionValue[] | undefined)?.filter((v) => v.value.trim()) ?? [],
        },
      });
      message.success(editing ? "Option updated" : "Option created");
      setDrawerOpen(false);
      setEditing(null);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const columns: TableColumnsType<ProductOption> = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Input type",
      dataIndex: "inputType",
      render: (v) => enumLabel("optionInputType", v),
    },
    {
      title: "Values",
      dataIndex: "values",
      render: (values: OptionValue[] | undefined) => values?.length ?? 0,
    },
    {
      title: "Required",
      dataIndex: "isRequired",
      render: (v) => (v ? "Yes" : "No"),
    },
    {
      title: "",
      key: "actions",
      width: 140,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete option?"
            onConfirm={async () => {
              try {
                await remove.mutateAsync(record.id as string);
                message.success("Option deleted");
              } catch (e) {
                message.error(getApiErrorMessage(e));
              }
            }}
          >
            <Button type="link" size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New option
        </Button>
      </div>
      <ErrorHint error={isError ? error : null} />
      <Table<ProductOption>
        rowKey={(r) => r.id ?? r.name}
        columns={columns}
        dataSource={options}
        loading={isLoading}
        pagination={false}
        size="middle"
        locale={{
          emptyText: <EmptyState title="No options" description="Add size, color or other options." />,
        }}
      />

      <DrawerForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? "Edit option" : "New option"}
        width={520}
        form={form}
        loading={save.isPending}
        onFinish={onFinish}
        submitLabel={editing ? "Save changes" : "Create option"}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ inputType: 2 }}>
          <Form.Item name="name" label="Option name" rules={[{ required: true, message: "Name is required" }]}>
            <Input placeholder="e.g. Size" />
          </Form.Item>
          <Form.Item name="inputType" label="Input type">
            <Select options={enumOptions("optionInputType")} />
          </Form.Item>
          <Form.Item name="isRequired" label="Required" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Values">
            <Form.List name="values">
              {(fields, { add, remove: removeField }) => (
                <Space direction="vertical" style={{ width: "100%" }}>
                  {fields.map((field) => (
                    <Space.Compact key={field.key} style={{ width: "100%" }}>
                      <Form.Item name={[field.name, "value"]} noStyle rules={[{ required: true }]}>
                        <Input placeholder="Value" />
                      </Form.Item>
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeField(field.name)} />
                    </Space.Compact>
                  ))}
                  <Button icon={<PlusOutlined />} onClick={() => add({ value: "" })}>
                    Add value
                  </Button>
                </Space>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </DrawerForm>
    </>
  );
}

/* ---------------------------------- Variants ---------------------------------- */

export function ProductVariantsTab({ productId }: { productId: string }) {
  const { data, isLoading, isError, error } = useProductVariants(productId);
  const save = useSaveProductDetail("variants", productId);
  const remove = useDeleteProductDetail("variants", productId);

  const [form] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const variants = (data ?? []) as Variant[];

  const onFinish = async (values: Record<string, unknown>) => {
    try {
      await save.mutateAsync({
        body: {
          code: values.code,
          name: values.name,
          sku: values.sku,
          price: values.price,
          stock: values.stock,
          values: (values.values as { optionName?: string; value?: string }[] | undefined)?.filter(
            (v) => v.value?.trim() || v.optionName?.trim(),
          ),
        },
      });
      message.success("Variant created");
      setDrawerOpen(false);
      form.resetFields();
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const columns: TableColumnsType<Variant> = [
    {
      title: "Variant",
      key: "name",
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 500 }}>{r.name || r.code || r.id.slice(0, 8)}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            {r.values?.map((v) => v.value).join(" / ") || "\u2014"}
          </div>
        </div>
      ),
    },
    { title: "SKU", dataIndex: "sku", render: (v) => v ?? "\u2014" },
    { title: "Price", dataIndex: "price", render: (v) => formatCurrency(v) },
    { title: "Stock", dataIndex: "stock", render: (v) => v ?? "\u2014" },
    {
      title: "",
      key: "actions",
      width: 100,
      render: (_, r) => (
        <Popconfirm
          title="Delete variant?"
          onConfirm={async () => {
            try {
              await remove.mutateAsync(r.id);
              message.success("Variant deleted");
            } catch (e) {
              message.error(getApiErrorMessage(e));
            }
          }}
        >
          <Button type="link" size="small" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setDrawerOpen(true);
          }}
        >
          New variant
        </Button>
      </div>
      <ErrorHint error={isError ? error : null} />
      <Table<Variant>
        rowKey="id"
        columns={columns}
        dataSource={variants}
        loading={isLoading}
        pagination={false}
        size="middle"
        locale={{
          emptyText: <EmptyState title="No variants" description="Create variants for configurable products." />,
        }}
      />

      <DrawerForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="New variant"
        width={520}
        form={form}
        loading={save.isPending}
        onFinish={onFinish}
        submitLabel="Create variant"
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Name">
                <Input placeholder="e.g. Red / Large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="code" label="Code">
                <Input placeholder="Variant code" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sku" label="SKU">
                <Input placeholder="SKU" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="price" label="Price">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="stock" label="Stock">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Option values">
                <Form.List name="values">
                  {(fields, { add, remove: removeField }) => (
                    <Space direction="vertical" style={{ width: "100%" }}>
                      {fields.map((field) => (
                        <Space.Compact key={field.key} style={{ width: "100%" }}>
                          <Form.Item name={[field.name, "optionName"]} noStyle>
                            <Input placeholder="Option name (e.g. Size)" style={{ width: "45%" }} />
                          </Form.Item>
                          <Form.Item name={[field.name, "value"]} noStyle>
                            <Input placeholder="Value (e.g. Large)" />
                          </Form.Item>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeField(field.name)}
                          />
                        </Space.Compact>
                      ))}
                      <Button icon={<PlusOutlined />} onClick={() => add({})}>
                        Add option value
                      </Button>
                    </Space>
                  )}
                </Form.List>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </DrawerForm>
    </>
  );
}

/* ---------------------------------- Relations ---------------------------------- */

export function ProductRelationsTab({ productId }: { productId: string }) {
  const { data, isLoading, isError, error } = useProductRelations(productId);
  const addRelation = useAddProductRelation(productId);
  const remove = useDeleteProductDetail("relations", productId);

  const [productSearch, setProductSearch] = useState("");
  const products = useProducts({ page: 1, pageSize: 50, search: productSearch || undefined });
  const [relationType, setRelationType] = useState(1);
  const [targetProductId, setTargetProductId] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const relations = (data ?? []) as Relation[];

  const add = async () => {
    if (!targetProductId) return;
    try {
      await addRelation.mutateAsync({ productId: targetProductId, relationType });
      message.success("Relation added");
      setModalOpen(false);
      setTargetProductId(undefined);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const columns: TableColumnsType<Relation> = [
    { title: "Product", dataIndex: "productName", render: (v) => v ?? "\u2014" },
    { title: "Relation", dataIndex: "relationType", render: (v) => enumLabel("relationType", v) },
    {
      title: "",
      key: "actions",
      width: 100,
      render: (_, r) => (
        <Popconfirm
          title="Remove relation?"
          onConfirm={async () => {
            try {
              await remove.mutateAsync(r.id as string);
              message.success("Relation removed");
            } catch (e) {
              message.error(getApiErrorMessage(e));
            }
          }}
        >
          <Button type="link" size="small" danger>
            Remove
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          Add related product
        </Button>
      </div>
      <ErrorHint error={isError ? error : null} />
      <Table<Relation>
        rowKey={(r) => r.id ?? r.productId}
        columns={columns}
        dataSource={relations}
        loading={isLoading}
        pagination={false}
        size="middle"
        locale={{
          emptyText: <EmptyState title="No relations" description="Link related, upsell or cross-sell products." />,
        }}
      />

      <Modal
        open={modalOpen}
        title="Add related product"
        onCancel={() => setModalOpen(false)}
        onOk={add}
        okText="Add"
        confirmLoading={addRelation.isPending}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Select
            showSearch
            placeholder="Search a product..."
            style={{ width: "100%" }}
            value={targetProductId}
            onChange={setTargetProductId}
            onSearch={setProductSearch}
            optionFilterProp="label"
            loading={products.isLoading}
            options={(products.data?.data ?? []).map((p) => ({ value: p.id, label: p.name }))}
          />
          <Select
            value={relationType}
            onChange={setRelationType}
            options={enumOptions("relationType")}
            style={{ width: "100%" }}
          />
        </Space>
      </Modal>
    </>
  );
}
