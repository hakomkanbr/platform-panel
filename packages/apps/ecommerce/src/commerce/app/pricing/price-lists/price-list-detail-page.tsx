"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tabs,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import { ArrowLeftOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { AsyncBoundary, EmptyState } from "@repo/ui";
import { formatDateTime } from "@repo/utils";
import { CommerceShell } from "../../../components/CommerceShell";
import { StatusTag } from "../../../components/StatusTag";
import { enumLabel } from "../../../types/enums";
import type {
  PriceListChannel,
  PriceListCustomerGroup,
  PriceListRegion,
  PriceListStore,
} from "../../../types/pricing";
import { usePriceList } from "../../../hooks/usePriceLists";
import {
  useDeletePriceList,
  usePriceListChannels,
  useSavePriceListChannel,
  useDeletePriceListChannel,
  usePriceListCustomerGroups,
  useSavePriceListCustomerGroup,
  useDeletePriceListCustomerGroup,
  usePriceListRegions,
  useSavePriceListRegion,
  useDeletePriceListRegion,
  usePriceListStores,
  useSavePriceListStore,
  useDeletePriceListStore,
} from "../../../hooks/usePriceLists";
import { getApiErrorMessage } from "../../../api/http";

const { Text } = Typography;

interface SubEntityModalProps<T> {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: { name: string; label: string; placeholder?: string; required?: boolean }[];
  onSubmit: (values: T) => Promise<void>;
  loading?: boolean;
}

function SubEntityModal<T>({ open, onClose, title, fields, onSubmit, loading }: SubEntityModalProps<T>) {
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
      <Form
        form={form}
        layout="vertical"
        onFinish={async (values) => {
          await onSubmit(values as T);
          form.resetFields();
        }}
      >
        {fields.map((f) => (
          <Form.Item key={f.name} name={f.name} label={f.label} rules={f.required ? [{ required: true }] : []}>
            <Input placeholder={f.placeholder} />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
}

function SimpleTable<T extends object>({
  dataSource,
  columns,
  loading,
  emptyTitle,
}: {
  dataSource: T[];
  columns: TableColumnsType<T & Record<string, unknown>>;
  loading?: boolean;
  emptyTitle: string;
}) {
  return (
    <Table<T & Record<string, unknown>>
      rowKey={(r) => (r as { id?: string }).id ?? Math.random().toString(36)}
      columns={columns}
      dataSource={dataSource as (T & Record<string, unknown>)[]}
      loading={loading}
      pagination={false}
      size="middle"
      locale={{ emptyText: <EmptyState title={emptyTitle} /> }}
    />
  );
}

export function PriceListDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { data: priceList, isLoading, isError, error, refetch } = usePriceList(id);
  const remove = useDeletePriceList();

  const [channelModal, setChannelModal] = useState(false);
  const [groupModal, setGroupModal] = useState(false);
  const [regionModal, setRegionModal] = useState(false);
  const [storeModal, setStoreModal] = useState(false);

  const channels = usePriceListChannels(id);
  const saveChannel = useSavePriceListChannel(id);
  const removeChannel = useDeletePriceListChannel(id);

  const groups = usePriceListCustomerGroups(id);
  const saveGroup = useSavePriceListCustomerGroup(id);
  const removeGroup = useDeletePriceListCustomerGroup(id);

  const regions = usePriceListRegions(id);
  const saveRegion = useSavePriceListRegion(id);
  const removeRegion = useDeletePriceListRegion(id);

  const stores = usePriceListStores(id);
  const saveStore = useSavePriceListStore(id);
  const removeStore = useDeletePriceListStore(id);

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

  const channelColumns: TableColumnsType<PriceListChannel & Record<string, unknown>> = [
    { title: "Channel", dataIndex: "channelName", render: (v) => v ?? "\u2014" },
    { title: "ID", dataIndex: "channelId" },
    { title: "Priority", dataIndex: "priority", render: (v) => v ?? "\u2014" },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Remove channel?"
          onConfirm={async () => {
            try {
              await removeChannel.mutateAsync(record.id as string);
              message.success("Channel removed");
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

  const groupColumns: TableColumnsType<PriceListCustomerGroup & Record<string, unknown>> = [
    { title: "Customer group", dataIndex: "customerGroupName", render: (v) => v ?? "\u2014" },
    { title: "ID", dataIndex: "customerGroupId" },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Remove group?"
          onConfirm={async () => {
            try {
              await removeGroup.mutateAsync(record.id as string);
              message.success("Group removed");
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

  const regionColumns: TableColumnsType<PriceListRegion & Record<string, unknown>> = [
    { title: "Region", dataIndex: "regionName", render: (v) => v ?? "\u2014" },
    { title: "ID", dataIndex: "regionId" },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Remove region?"
          onConfirm={async () => {
            try {
              await removeRegion.mutateAsync(record.id as string);
              message.success("Region removed");
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

  const storeColumns: TableColumnsType<PriceListStore & Record<string, unknown>> = [
    { title: "Store", dataIndex: "storeName", render: (v) => v ?? "\u2014" },
    { title: "ID", dataIndex: "storeId" },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Remove store?"
          onConfirm={async () => {
            try {
              await removeStore.mutateAsync(record.id as string);
              message.success("Store removed");
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
                <Descriptions.Item label="Default">{priceList.isDefault ? "Yes" : "No"}</Descriptions.Item>
                <Descriptions.Item label="Currency">{priceList.currencyCode ?? "\u2014"}</Descriptions.Item>
                <Descriptions.Item label="Effective from">{formatDateTime(priceList.effectiveFrom)}</Descriptions.Item>
                <Descriptions.Item label="Effective to">{formatDateTime(priceList.effectiveTo)}</Descriptions.Item>
                <Descriptions.Item label="Products">{priceList.productCount ?? 0}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Tabs
              defaultActiveKey="channels"
              items={[
                {
                  key: "channels",
                  label: `Channels (${channels.data?.length ?? 0})`,
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setChannelModal(true)}>
                          Add channel
                        </Button>
                      </div>
                      <SimpleTable
                        dataSource={channels.data ?? []}
                        columns={channelColumns}
                        loading={channels.isLoading}
                        emptyTitle="No channels assigned"
                      />
                    </div>
                  ),
                },
                {
                  key: "groups",
                  label: `Customer groups (${groups.data?.length ?? 0})`,
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setGroupModal(true)}>
                          Add group
                        </Button>
                      </div>
                      <SimpleTable
                        dataSource={groups.data ?? []}
                        columns={groupColumns}
                        loading={groups.isLoading}
                        emptyTitle="No customer groups assigned"
                      />
                    </div>
                  ),
                },
                {
                  key: "regions",
                  label: `Regions (${regions.data?.length ?? 0})`,
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setRegionModal(true)}>
                          Add region
                        </Button>
                      </div>
                      <SimpleTable
                        dataSource={regions.data ?? []}
                        columns={regionColumns}
                        loading={regions.isLoading}
                        emptyTitle="No regions assigned"
                      />
                    </div>
                  ),
                },
                {
                  key: "stores",
                  label: `Stores (${stores.data?.length ?? 0})`,
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setStoreModal(true)}>
                          Add store
                        </Button>
                      </div>
                      <SimpleTable
                        dataSource={stores.data ?? []}
                        columns={storeColumns}
                        loading={stores.isLoading}
                        emptyTitle="No stores assigned"
                      />
                    </div>
                  ),
                },
              ]}
            />

            <SubEntityModal<{ channelId: string; channelName?: string; priority?: number }>
              open={channelModal}
              onClose={() => setChannelModal(false)}
              title="Add channel"
              loading={saveChannel.isPending}
              fields={[
                { name: "channelId", label: "Channel ID", required: true },
                { name: "channelName", label: "Channel name" },
              ]}
              onSubmit={async (values) => {
                try {
                  await saveChannel.mutateAsync({ body: values });
                  message.success("Channel added");
                  setChannelModal(false);
                } catch (e) {
                  message.error(getApiErrorMessage(e));
                }
              }}
            />
            <SubEntityModal<{ customerGroupId: string; customerGroupName?: string }>
              open={groupModal}
              onClose={() => setGroupModal(false)}
              title="Add customer group"
              loading={saveGroup.isPending}
              fields={[
                { name: "customerGroupId", label: "Customer group ID", required: true },
                { name: "customerGroupName", label: "Name" },
              ]}
              onSubmit={async (values) => {
                try {
                  await saveGroup.mutateAsync(values);
                  message.success("Group added");
                  setGroupModal(false);
                } catch (e) {
                  message.error(getApiErrorMessage(e));
                }
              }}
            />
            <SubEntityModal<{ regionId: string; regionName?: string }>
              open={regionModal}
              onClose={() => setRegionModal(false)}
              title="Add region"
              loading={saveRegion.isPending}
              fields={[
                { name: "regionId", label: "Region ID", required: true },
                { name: "regionName", label: "Region name" },
              ]}
              onSubmit={async (values) => {
                try {
                  await saveRegion.mutateAsync(values);
                  message.success("Region added");
                  setRegionModal(false);
                } catch (e) {
                  message.error(getApiErrorMessage(e));
                }
              }}
            />
            <SubEntityModal<{ storeId: string; storeName?: string }>
              open={storeModal}
              onClose={() => setStoreModal(false)}
              title="Add store"
              loading={saveStore.isPending}
              fields={[
                { name: "storeId", label: "Store ID", required: true },
                { name: "storeName", label: "Store name" },
              ]}
              onSubmit={async (values) => {
                try {
                  await saveStore.mutateAsync(values);
                  message.success("Store added");
                  setStoreModal(false);
                } catch (e) {
                  message.error(getApiErrorMessage(e));
                }
              }}
            />
          </>
        )}
      </AsyncBoundary>
    </CommerceShell>
  );
}
