"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Table, Button, Space, Typography, Card, Input, Popconfirm, message, Tag, Tooltip, Modal, Form, Select, DatePicker, Switch, InputNumber, Spin } from "antd";
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { useCoupons, useCreateCoupon, useUpdateCoupon } from "@/hooks/useCoupons";
import { couponsApi } from "@/lib/api/coupons";
import type { Coupon } from "@/types";

const { Title } = Typography;

function CouponsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [params, setParams] = useState<{ search?: string; skip: number; pageSize: number }>({ skip: 0, pageSize: 10 });
  const { coupons, count, loading, refetch } = useCoupons(params);
  const { create, submitting: creating } = useCreateCoupon();
  const { update, submitting: updating } = useUpdateCoupon();
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Coupon | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!coupons.length) return;
    if (searchParams.get("new") === "true") {
      setEditRecord(null);
      form.resetFields();
      setModalOpen(true);
    }
    const editId = searchParams.get("edit");
    if (editId) {
      const found = coupons.find((c) => c.id === Number(editId));
      if (found) {
        setEditRecord(found);
        form.setFieldsValue({
          ...found,
          validFrom: found.validFrom ? dayjs(found.validFrom) : null,
          validTo: found.validTo ? dayjs(found.validTo) : null,
        });
        setModalOpen(true);
      }
    }
  }, [searchParams, coupons, form]);

  const openCreateModal = () => {
    setEditRecord(null);
    form.resetFields();
    setModalOpen(true);
    router.push("/panel/coupons?new=true");
  };

  const openEditModal = (record: Coupon) => {
    setEditRecord(record);
    form.setFieldsValue({
      ...record,
      validFrom: record.validFrom ? dayjs(record.validFrom) : null,
      validTo: record.validTo ? dayjs(record.validTo) : null,
    });
    setModalOpen(true);
    router.push(`/panel/coupons?edit=${record.id}`);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditRecord(null);
    form.resetFields();
    router.push("/panel/coupons");
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        validFrom: values.validFrom?.toISOString(),
        validTo: values.validTo?.toISOString(),
      };
      if (editRecord) {
        await update({ ...payload, id: editRecord.id });
        message.success("Coupon updated");
      } else {
        await create(payload);
        message.success("Coupon created");
      }
      handleModalClose();
      refetch();
    } catch (e: any) {
      message.error(e?.message || "Failed to save coupon");
    }
  };

  const handleDelete = async (id: number) => {
    try { await couponsApi.delete(id); message.success("Coupon deleted"); refetch(); }
    catch { message.error("Failed to delete coupon"); }
  };

  const handleToggleActive = async (id: number, checked: boolean) => {
    try {
      await couponsApi.update({ id, isActive: checked } as any);
      message.success(checked ? "Coupon activated" : "Coupon deactivated");
      refetch();
    } catch { message.error("Failed to update coupon"); }
  };

  const columns = [
    { title: "Code", dataIndex: "code", key: "code", width: 130 },
    { title: "Description", dataIndex: "description", key: "description", ellipsis: true },
    { title: "Type", dataIndex: "type", key: "type", width: 100, render: (v: string) => <Tag>{v}</Tag> },
    { title: "Value", dataIndex: "value", key: "value", width: 80, render: (v: number) => `SAR ${v}` },
    { title: "Min Purchase", dataIndex: "minPurchaseAmount", key: "minPurchaseAmount", width: 100, render: (v: number | null) => v ? `SAR ${v}` : "-" },
    { title: "Valid From", dataIndex: "validFrom", key: "validFrom", width: 100, render: (v: string) => v ? dayjs(v).format("YYYY-MM-DD") : "-" },
    { title: "Valid To", dataIndex: "validTo", key: "validTo", width: 100, render: (v: string) => v ? dayjs(v).format("YYYY-MM-DD") : "-" },
    { title: "Usage", key: "usage", width: 80, render: (_: unknown, r: Coupon) => `${r.usageCount || 0}${r.usageLimit ? `/${r.usageLimit}` : ""}` },
    {
      title: "Active", dataIndex: "isActive", key: "isActive", width: 80,
      render: (v: boolean, record: Coupon) => <Switch checked={v} size="small" onChange={(checked) => handleToggleActive(record.id, checked)} />,
    },
    {
      title: "Actions", key: "actions", width: 100,
      render: (_: unknown, record: Coupon) => (
        <Space>
          <Tooltip title="Edit"><Button size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)} /></Tooltip>
          <Popconfirm title="Delete this coupon?" onConfirm={() => handleDelete(record.id)}>
            <Tooltip title="Delete"><Button size="small" danger icon={<DeleteOutlined />} /></Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <Title level={4} style={{ margin: 0 }}>Coupons</Title>
          <p>Manage coupon codes and promotions</p>
        </div>
        <Space>
          <Input placeholder="Search coupons..." prefix={<SearchOutlined />} value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={() => setParams((p) => ({ ...p, search }))} style={{ width: 250 }} />
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Add Coupon
          </Button>
        </Space>
      </div>
      <Card styles={{ body: { padding: 0 } }}>
        <Table dataSource={coupons} columns={columns} rowKey="id" loading={loading}
          pagination={{
            current: params.skip / params.pageSize + 1, pageSize: params.pageSize, total: count,
            onChange: (page, pageSize) => setParams({ skip: (page - 1) * pageSize, pageSize }),
          }}
          size="middle"
        />
      </Card>

      <Modal
        title={editRecord ? "Edit Coupon" : "New Coupon"}
        open={modalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={640}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 8 }}>
          <Form.Item name="code" label="Code" rules={[{ required: true, message: "Please enter a coupon code" }]}>
            <Input placeholder="SUMMER2024" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input placeholder="Coupon description" />
          </Form.Item>
          <Space style={{ width: "100%" }} size={16}>
            <Form.Item name="type" label="Type" rules={[{ required: true }]} style={{ width: "100%" }}>
              <Select options={[
                { value: "Fixed", label: "Fixed Amount" },
                { value: "Percentage", label: "Percentage" },
                { value: "FreeShipping", label: "Free Shipping" },
              ]} placeholder="Select type" />
            </Form.Item>
            <Form.Item name="value" label="Value" rules={[{ required: true, message: "Enter value" }]} style={{ width: "100%" }}>
              <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
            </Form.Item>
          </Space>
          <Form.Item name="minPurchaseAmount" label="Minimum Purchase Amount">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="No minimum" />
          </Form.Item>
          <Space style={{ width: "100%" }} size={16}>
            <Form.Item name="validFrom" label="Valid From" style={{ width: "100%" }}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="validTo" label="Valid To" style={{ width: "100%" }}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Space>
          <Form.Item name="usageLimit" label="Usage Limit">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Unlimited" />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
            <Button onClick={handleModalClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={creating || updating}>
              {editRecord ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default function CouponsPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>}>
      <CouponsContent />
    </Suspense>
  );
}
