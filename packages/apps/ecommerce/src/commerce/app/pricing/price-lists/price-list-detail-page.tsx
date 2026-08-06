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
import { useTranslations } from "@repo/localization";
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
  const t = useTranslations();
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={t("catalog.tabs.media.add")}
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
  const t = useTranslations();
  const { data: priceList, isLoading, isError, error, refetch } = usePriceList(id);
  const remove = useDeletePriceList();

  const [channelModal, setChannelModal] = useState(false);
  const [groupModal, setGroupModal] = useState(false);
  const [regionModal, setRegionModal] = useState(false);
  const [storeModal, setStoreModal] = useState(false);

  const confirmDelete = () => {
    Modal.confirm({
      title: t("pricing.priceLists.deleteTitle"),
      content: t("pricing.priceLists.deleteContent"),
      okText: t("pricing.productPrices.detail.delete"),
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

  const handleAssignChannel = async (channelId: string) => {
    try {
      await priceListsApi.assignChannel(id, { channelId });
      message.success(t("pricing.priceLists.detail.channelAssigned"));
      setChannelModal(false);
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", undefined, id] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleRemoveChannel = async (channelId: string) => {
    try {
      await priceListsApi.removeChannel(id, channelId);
      message.success(t("pricing.priceLists.detail.channelRemoved"));
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", undefined, id] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleAssignGroup = async (groupId: string) => {
    try {
      await priceListsApi.assignCustomerGroup(id, { customerGroupId: groupId });
      message.success(t("pricing.priceLists.detail.groupAssigned"));
      setGroupModal(false);
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", undefined, id] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleRemoveGroup = async (groupId: string) => {
    try {
      await priceListsApi.removeCustomerGroup(id, groupId);
      message.success(t("pricing.priceLists.detail.groupRemoved"));
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", undefined, id] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleAssignRegion = async (regionId: string) => {
    try {
      await priceListsApi.assignRegion(id, { regionId });
      message.success(t("pricing.priceLists.detail.regionAssigned"));
      setRegionModal(false);
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", undefined, id] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleRemoveRegion = async (regionId: string) => {
    try {
      await priceListsApi.removeRegion(id, regionId);
      message.success(t("pricing.priceLists.detail.regionRemoved"));
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", undefined, id] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleAssignStore = async (storeId: string) => {
    try {
      await priceListsApi.assignStore(id, { storeId });
      message.success(t("pricing.priceLists.detail.storeAssigned"));
      setStoreModal(false);
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", undefined, id] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleRemoveStore = async (storeId: string) => {
    try {
      await priceListsApi.removeStore(id, storeId);
      message.success(t("pricing.priceLists.detail.storeRemoved"));
      queryClient.invalidateQueries({ queryKey: ["pricing", "price-list", undefined, id] });
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const channelColumns: TableColumnsType<{ id: string }> = [
    { title: t("pricing.priceLists.detail.channelIdColumn"), dataIndex: "id" },
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
    { title: t("pricing.priceLists.detail.customerGroupIdColumn"), dataIndex: "id" },
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
    { title: t("pricing.priceLists.detail.regionIdColumn"), dataIndex: "id" },
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

  const storeColumns: TableColumnsType<{ id: string }> = [
    { title: t("pricing.priceLists.detail.storeIdColumn"), dataIndex: "id" },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title={t("pricing.priceLists.detail.removeStoreConfirm")}
          onConfirm={() => handleRemoveStore(record.id)}
        >
          <Button type="link" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <CommerceShell
      title={priceList?.name ?? t("pricing.priceLists.title")}
      description={priceList?.code}
      breadcrumbs={[
        { title: t("pricing.title"), href: "/admin/pricing" },
        { title: t("pricing.priceLists.title"), href: "/admin/pricing/price-lists" },
        { title: priceList?.name ?? t("pricing.priceLists.detail.loading") },
      ]}
      actions={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/admin/pricing/price-lists")}>
            {t("common.actions.back")}
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
                <Descriptions.Item label={t("pricing.priceLists.detail.status")}>
                  <StatusTag value={priceList.status} />
                </Descriptions.Item>
                <Descriptions.Item label={t("pricing.priceLists.detail.taxMode")}>{enumLabel("taxMode", priceList.taxMode, t)}</Descriptions.Item>
                <Descriptions.Item label={t("pricing.priceLists.detail.priority")}>{priceList.priority ?? "\u2014"}</Descriptions.Item>
                <Descriptions.Item label={t("pricing.priceLists.detail.active")}>{priceList.isActive ? t("common.actions.yes") : t("common.actions.no")}</Descriptions.Item>
                <Descriptions.Item label={t("pricing.priceLists.detail.currency")}>{priceList.currencyId}</Descriptions.Item>
                <Descriptions.Item label={t("pricing.priceLists.detail.version")}>{priceList.versionNumber}</Descriptions.Item>
                <Descriptions.Item label={t("pricing.priceLists.detail.effectiveFrom")}>{formatDateTime(priceList.effectiveFrom)}</Descriptions.Item>
                <Descriptions.Item label={t("pricing.priceLists.detail.effectiveTo")}>{formatDateTime(priceList.effectiveTo)}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Tabs
              defaultActiveKey="channels"
              items={[
                {
                  key: "channels",
                  label: t("pricing.priceLists.detail.channelsTab", { count: priceList.channelIds.length }),
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" onClick={() => setChannelModal(true)}>{t("pricing.priceLists.detail.addChannel")}</Button>
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
                  label: t("pricing.priceLists.detail.customerGroupsTab", { count: priceList.customerGroupIds.length }),
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" onClick={() => setGroupModal(true)}>{t("pricing.priceLists.detail.addGroup")}</Button>
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
                  label: t("pricing.priceLists.detail.regionsTab", { count: priceList.regionIds.length }),
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" onClick={() => setRegionModal(true)}>{t("pricing.priceLists.detail.addRegion")}</Button>
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
                  key: "stores",
                  label: t("pricing.priceLists.detail.storesTab", { count: priceList.storeIds.length }),
                  children: (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" onClick={() => setStoreModal(true)}>{t("pricing.priceLists.detail.addStore")}</Button>
                      </div>
                      <Table<{ id: string }>
                        rowKey="id"
                        columns={storeColumns}
                        dataSource={priceList.storeIds.map((sid) => ({ id: sid }))}
                        pagination={false}
                        size="middle"
                        locale={{ emptyText: <EmptyState title={t("pricing.priceLists.detail.noStoresAssigned")} /> }}
                      />
                    </div>
                  ),
                },
              ]}
            />

            <AssignModal
              open={channelModal}
              onClose={() => setChannelModal(false)}
              title={t("pricing.priceLists.detail.addChannelTitle")}
              label={t("pricing.priceLists.detail.channelIdLabel")}
              placeholder={t("pricing.priceLists.detail.channelPlaceholder")}
              onSubmit={handleAssignChannel}
            />
            <AssignModal
              open={groupModal}
              onClose={() => setGroupModal(false)}
              title={t("pricing.priceLists.detail.addGroupTitle")}
              label={t("pricing.priceLists.detail.groupIdLabel")}
              placeholder={t("pricing.priceLists.detail.groupPlaceholder")}
              onSubmit={handleAssignGroup}
            />
            <AssignModal
              open={regionModal}
              onClose={() => setRegionModal(false)}
              title={t("pricing.priceLists.detail.addRegionTitle")}
              label={t("pricing.priceLists.detail.regionIdLabel")}
              placeholder={t("pricing.priceLists.detail.regionPlaceholder")}
              onSubmit={handleAssignRegion}
            />
            <AssignModal
              open={storeModal}
              onClose={() => setStoreModal(false)}
              title={t("pricing.priceLists.detail.addStoreTitle")}
              label={t("pricing.priceLists.detail.storeIdLabel")}
              placeholder={t("pricing.priceLists.detail.storePlaceholder")}
              onSubmit={handleAssignStore}
            />
          </>
        )}
      </AsyncBoundary>
    </CommerceShell>
  );
}