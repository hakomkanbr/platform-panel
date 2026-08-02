"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tabs,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import { AsyncBoundary, EmptyState } from "@repo/ui";
import { formatDateTime } from "@repo/utils";
import { CommerceShell } from "../../../components/CommerceShell";
import { StatusTag } from "../../../components/StatusTag";
import { enumLabel } from "../../../types/enums";
import type { PriceListReadModel } from "../../../types/pricing";
import { priceListsApi } from "../../../api/pricing/price-lists";
import { usePriceList } from "../../../hooks/usePriceLists";
import { useDeletePriceList } from "../../../hooks/usePriceLists";
import { useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../api/http";

const { Text } = Typography;

function AssignModal({ open, onClose, title, label, placeholder, onSubmit, loading }: {
  open: boolean;
  onClose: () => void;
  title: string;
  label: string;
  placeholder: string;
  onSubmit: (id: string) => Promise<void>;
  loading?: boolean;
}) {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Add"
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={async (values) => {
        await onSubmit(values.id as string);
        form.resetFields();
      }}>
        <Form.Item name="id" label={label} rules={[{ required: true }]}>
          <Input placeholder={placeholder} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export function PriceListDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: priceList, isLoading, isError, error, refetch } = usePriceList(id);
  const remove = useDeletePriceList();

  const [channelModal, setChannelModal] = useState(false);
  const [groupModal, setGroupModal] = useState(false);
  const [regionModal, setRegionModal] = useState(false);
  const [storeModal, setStoreModal] = useState(false);

  const confirmDelete = () => {
    Modal.confirm({
      title: "Delete price list",
      content: "This will permanently delete the price list and its prices.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await remove.mutateAsync(id);
          message.success("Price list deleted");
          router.push("/admin/pricing/price-lists");
        } catch (e) {
          message.error(getApiErrorMessage(e));
        }
      },
    });
  };

  const handleAssignChannel = async (channelId: string) => {
    try {
      await priceListsApi.assignChannel(id, { channelId });
      message.success("Channel assigned");
      setChannelModal(false);
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", undefined, id] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleRemoveChannel = async (channelId: string) => {
    try {
      await priceListsApi.removeChannel(id, channelId);
      message.success("Channel removed");
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", undefined, id] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleAssignGroup = async (groupId: string) => {
    try {
      await priceListsApi.assignCustomerGroup(id, { customerGroupId: groupId });
      message.success("Customer group assigned");
      setGroupModal(false);
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", undefined, id] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleRemoveGroup = async (groupId: string) => {
    try {
      await priceListsApi.removeCustomerGroup(id, groupId);
      message.success("Customer group removed");
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", undefined, id] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleAssignRegion = async (regionId: string) => {
    try {
      await priceListsApi.assignRegion(id, { regionId });
      message.success("Region assigned");
      setRegionModal(false);
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", undefined, id] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleRemoveRegion = async (regionId: string) => {
    try {
      await priceListsApi.removeRegion(id, regionId);
      message.success("Region removed");
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", undefined, id] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleAssignStore = async (storeId: string) => {
    try {
      await priceListsApi.assignStore(id, { storeId });
      message.success("Store assigned");
      setStoreModal(false);
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", undefined, id] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleRemoveStore = async (storeId: string) => {
    try {
      await priceListsApi.removeStore(id, storeId);
      message.success("Store removed");
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", undefined, id] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const channelColumns: TableColumnsType<{ id: string }> = [
    { title: "Channel ID", dataIndex: "id" },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Remove channel?"
          onConfirm={() => handleRemoveChannel(record.id)}
        >
          <Button type="link" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const groupColumns: TableColumnsType<{ id: string }> = [
    { title: "Customer group ID", dataIndex: "id" },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Remove group?"
          onConfirm={() => handleRemoveGroup(record.id)}
        >
          <Button type="link" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const regionColumns: TableColumnsType<{ id: string }> = [
    { title: "Region ID", dataIndex: "id" },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Remove region?"
          onConfirm={() => handleRemoveRegion(record.id)}
        >
          <Button type="link" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const storeColumns: TableColumnsType<{ id: string }> = [
    { title: "Store ID", dataIndex: "id" },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Remove store?"
          onConfirm={() => handleRemoveStore(record.id)}
        >
          <Button type="link" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <CommerceShell
      title={priceList?.name ?? "Price list"}
      description={priceList?.code}
      breadcrumbs={[
        { title: "Pricing", href: "/admin/pricing" },
        { title: "Price lists", href: "/admin/pricing/price-lists" },
        { title: priceList?.name ?? "Loading..." },
      ]}
      actions={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/admin/pricing/price-lists")}>
            Back
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={confirmDelete} />
        </Space>
      }
    >
      <AsyncBoundary loading={isLoading} error={error ? new Error(getApiErrorMessage(error)) : undefined} retry={refetch}>
        {priceList && (
          <>
            <Card style={{ borderRadius: 16, border: "1px solid var(--border-light)", marginBottom: 24 }}>
              <Descriptions column={{ xs: 1, sm: 2, lg: 4 }} size="middle">
                <Descriptions.Item label="Status">
                  <StatusTag value={priceList.status} />
                </Descriptions.Item>
                <Descriptions.Item label="Tax mode">{enumLabel("taxMode", priceList.taxMode)}</Descriptions.Item>
                <Descriptions.Item label="Priority">{priceList.priority ?? "\u2014"}</Descriptions.Item>
                <Descriptions.Item label="Active">{priceList.isActive ? "Yes" : "No"}</Descriptions.Item>
                <Descriptions.Item label="Currency">{priceList.currencyId}</Descriptions.Item>
                <Descriptions.Item label="Version">{priceList.versionNumber}</Descriptions.Item>
                <Descriptions.Item label="Effective from">{formatDateTime(priceList.effectiveFrom)}</Descriptions.Item>
                <Descriptions.Item label="Effective to">{formatDateTime(priceList.effectiveTo)}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Tabs
              defaultActiveKey="channels"
              items={[
                {
                  key: "channels",
                  label: `Channels (${priceList.channelIds.length})`,
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" onClick={() => setChannelModal(true)}>Add channel</Button>
                      </div>
                      <Table<{ id: string }>
                        rowKey="id"
                        columns={channelColumns}
                        dataSource={priceList.channelIds.map((cid) => ({ id: cid }))}
                        pagination={false}
                        size="middle"
                        locale={{ emptyText: <EmptyState title="No channels assigned" /> }}
                      />
                    </div>
                  ),
                },
                {
                  key: "groups",
                  label: `Customer groups (${priceList.customerGroupIds.length})`,
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" onClick={() => setGroupModal(true)}>Add group</Button>
                      </div>
                      <Table<{ id: string }>
                        rowKey="id"
                        columns={groupColumns}
                        dataSource={priceList.customerGroupIds.map((gid) => ({ id: gid }))}
                        pagination={false}
                        size="middle"
                        locale={{ emptyText: <EmptyState title="No customer groups assigned" /> }}
                      />
                    </div>
                  ),
                },
                {
                  key: "regions",
                  label: `Regions (${priceList.regionIds.length})`,
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" onClick={() => setRegionModal(true)}>Add region</Button>
                      </div>
                      <Table<{ id: string }>
                        rowKey="id"
                        columns={regionColumns}
                        dataSource={priceList.regionIds.map((rid) => ({ id: rid }))}
                        pagination={false}
                        size="middle"
                        locale={{ emptyText: <EmptyState title="No regions assigned" /> }}
                      />
                    </div>
                  ),
                },
                {
                  key: "stores",
                  label: `Stores (${priceList.storeIds.length})`,
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" onClick={() => setStoreModal(true)}>Add store</Button>
                      </div>
                      <Table<{ id: string }>
                        rowKey="id"
                        columns={storeColumns}
                        dataSource={priceList.storeIds.map((sid) => ({ id: sid }))}
                        pagination={false}
                        size="middle"
                        locale={{ emptyText: <EmptyState title="No stores assigned" /> }}
                      />
                    </div>
                  ),
                },
              ]}
            />

            <AssignModal
              open={channelModal}
              onClose={() => setChannelModal(false)}
              title="Add channel"
              label="Channel ID"
              placeholder="Enter channel GUID"
              onSubmit={handleAssignChannel}
            />
            <AssignModal
              open={groupModal}
              onClose={() => setGroupModal(false)}
              title="Add customer group"
              label="Customer group ID"
              placeholder="Enter group GUID"
              onSubmit={handleAssignGroup}
            />
            <AssignModal
              open={regionModal}
              onClose={() => setRegionModal(false)}
              title="Add region"
              label="Region ID"
              placeholder="Enter region GUID"
              onSubmit={handleAssignRegion}
            />
            <AssignModal
              open={storeModal}
              onClose={() => setStoreModal(false)}
              title="Add store"
              label="Store ID"
              placeholder="Enter store GUID"
              onSubmit={handleAssignStore}
            />
          </>
        )}
      </AsyncBoundary>
    </CommerceShell>
  );
}