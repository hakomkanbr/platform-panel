"use client";
import React, { useState } from "react";
import {
  Table, Button, Space, Typography, Card, Input, message,
  Tag, Tooltip, Modal, Form, Popconfirm, Spin, Switch, Empty,
} from "antd";
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  HomeOutlined, EnvironmentOutlined,
} from "@ant-design/icons";
import { useWarehouses, useCreateWarehouse } from "@/hooks/useInventory";
import { warehousesApi } from "@/lib/api/inventory";
import type { Warehouse, WarehouseFormData } from "@/types";

const { Title, Text } = Typography;

export default function WarehousesPage() {
  const [search, setSearch] = useState("");
  const [params, setParams] = useState<{ search?: string; skip: number; pageSize: number }>({ skip: 0, pageSize: 20 });
  const { warehouses, count, loading, refetch } = useWarehouses(params);
  const { create, submitting } = useCreateWarehouse();
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Warehouse | null>(null);
  const [form] = Form.useForm();

  const openCreate = () => {
    setEditRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: Warehouse) => {
    setEditRecord(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleSubmit = async (values: WarehouseFormData) => {
    try {
      if (editRecord) {
        await warehousesApi.update(editRecord.id, values);
        message.success("Warehouse updated");
      } else {
        await create(values);
        message.success("Warehouse created");
      }
      setModalOpen(false);
      refetch();
    } catch { message.error("Failed to save warehouse"); }
  };

  const handleDelete = async (id: number) => {
    try { await warehousesApi.delete(id); message.success("Warehouse deleted"); refetch(); }
    catch { message.error("Failed to delete warehouse"); }
  };

  const columns = [
    {
      title: "Name", dataIndex: "name", key: "name",
      render: (v: string) => <Space><HomeOutlined /><Text strong>{v}</Text></Space>,
    },
    {
      title: "Location", dataIndex: "location", key: "location",
      render: (v: string | null) => v ? <Space><EnvironmentOutlined />{v}</Space> : <Text type="secondary">—</Text>,
    },
    {
      title: "Active", dataIndex: "isActive", key: "isActive", width: 80,
      render: (v: boolean) => <Tag color={v ? "green" : "red"}>{v ? "Active" : "Inactive"}</Tag>,
    },
    {
      title: "Actions", key: "actions", width: 100,
      render: (_: any, record: Warehouse) => (
        <Space>
          <Tooltip title="Edit"><Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} /></Tooltip>
          <Popconfirm title="Delete this warehouse?" onConfirm={() => handleDelete(record.id)}>
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
          <Title level={4} style={{ margin: 0 }}>Warehouses</Title>
          <p>Manage storage locations ({count} total)</p>
        </div>
        <Space>
          <Input placeholder="Search..." prefix={<SearchOutlined />} value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={() => setParams((p) => ({ ...p, search }))} style={{ width: 220 }} />
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add Warehouse
          </Button>
        </Space>
      </div>
      <Card styles={{ body: { padding: 0 } }}>
        <Table dataSource={warehouses} columns={columns} rowKey="id" loading={loading}
          pagination={{
            current: params.skip / params.pageSize + 1, pageSize: params.pageSize, total: count,
            onChange: (page, pageSize) => setParams({ skip: (page - 1) * pageSize, pageSize }),
          }}
          size="middle" locale={{ emptyText: <Empty description="No warehouses" /> }}
        />
      </Card>

      <Modal title={editRecord ? "Edit Warehouse" : "New Warehouse"} open={modalOpen}
        onCancel={() => setModalOpen(false)} onOk={() => form.submit()} confirmLoading={submitting}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="Main Warehouse" />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input placeholder="City, Address" />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
