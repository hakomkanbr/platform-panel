"use client";
import React, { useState, useMemo } from "react";
import {
  Table, Button, Space, Typography, Card, Input, message,
  Tag, Tooltip, Row, Col, Statistic, Select, Modal, Form,
  InputNumber, Popconfirm, Badge, Tabs, Empty, Descriptions,
  Spin, Divider,
} from "antd";
import {
  SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  SwapOutlined, WarningOutlined, CheckCircleOutlined,
  ExclamationCircleOutlined, BarChartOutlined, ReloadOutlined,
  DownloadOutlined, ShoppingOutlined, HomeOutlined,
} from "@ant-design/icons";
import { useInventoryList, useInventorySummary, useWarehouses } from "@/hooks/useInventory";
import { inventoryApi, warehousesApi } from "@/lib/api/inventory";
import type { InventoryItem, InventoryListParams } from "@/types";

const { Title, Text } = Typography;

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [params, setParams] = useState<InventoryListParams>({ skip: 0, pageSize: 20 });
  const { items, count, loading, refetch } = useInventoryList(params);
  const { summary } = useInventorySummary();
  const { warehouses } = useWarehouses();
  const [selectedTab, setSelectedTab] = useState("all");
  const [adjustModal, setAdjustModal] = useState<{ open: boolean; item: InventoryItem | null }>({ open: false, item: null });
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustNote, setAdjustNote] = useState("");
  const [transferModal, setTransferModal] = useState<{ open: boolean; item: InventoryItem | null }>({ open: false, item: null });
  const [transferQty, setTransferQty] = useState(0);
  const [transferWarehouse, setTransferWarehouse] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (selectedTab === "all") return items;
    if (selectedTab === "lowStock") return items.filter((i) => i.isLowStock);
    if (selectedTab === "outOfStock") return items.filter((i) => i.availableQuantity <= 0);
    return items;
  }, [items, selectedTab]);

  const handleAdjust = async () => {
    if (!adjustModal.item) return;
    try {
      await inventoryApi.adjustStock(adjustModal.item.id, adjustQty, adjustNote);
      message.success("Stock adjusted");
      setAdjustModal({ open: false, item: null });
      refetch();
    } catch { message.error("Failed to adjust stock"); }
  };

  const handleTransfer = async () => {
    if (!transferModal.item || !transferWarehouse) return;
    try {
      await inventoryApi.transferStock(transferModal.item.id, transferWarehouse, transferQty);
      message.success("Stock transferred");
      setTransferModal({ open: false, item: null });
      refetch();
    } catch { message.error("Failed to transfer stock"); }
  };

  const columns = [
    {
      title: "Product", key: "product", ellipsis: true,
      render: (_: any, r: InventoryItem) => (
        <Space>
          {r.productImage ? <img src={r.productImage} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: "cover" }} /> : <ShoppingOutlined style={{ fontSize: 24, opacity: 0.3 }} />}
          <div>
            <Text strong style={{ fontSize: 13 }}>{r.productTitle || "Unknown"}</Text>
            <div><Text type="secondary" style={{ fontSize: 11 }}>{r.productSku} {r.variantLabel ? `| ${r.variantLabel}` : ""}</Text></div>
          </div>
        </Space>
      ),
    },
    {
      title: "Warehouse", dataIndex: "warehouseName", key: "warehouse", width: 120,
      render: (v: string) => <Tag icon={<HomeOutlined />}>{v}</Tag>,
    },
    {
      title: "On Hand", dataIndex: "quantityOnHand", key: "onHand", width: 100,
      sorter: (a: any, b: any) => a.quantityOnHand - b.quantityOnHand,
      render: (v: number) => <Text strong>{v}</Text>,
    },
    {
      title: "Reserved", dataIndex: "reservedQuantity", key: "reserved", width: 90,
      render: (v: number) => <Text type="secondary">{v}</Text>,
    },
    {
      title: "Available", dataIndex: "availableQuantity", key: "available", width: 100,
      sorter: (a: any, b: any) => a.availableQuantity - b.availableQuantity,
      render: (v: number) => (
        <Badge status={v > 0 ? v < 10 ? "warning" : "success" : "error"}
          text={<Text strong style={{ color: v > 0 ? v < 10 ? "#faad14" : "#3f8600" : "#cf1322" }}>{v}</Text>} />
      ),
    },
    {
      title: "Status", key: "status", width: 100,
      render: (_: any, r: InventoryItem) => {
        if (r.isLowStock) return <Tag icon={<WarningOutlined />} color="warning">Low Stock</Tag>;
        if (r.availableQuantity <= 0) return <Tag icon={<ExclamationCircleOutlined />} color="error">Out</Tag>;
        return <Tag icon={<CheckCircleOutlined />} color="success">OK</Tag>;
      },
    },
    {
      title: "Actions", key: "actions", width: 160,
      render: (_: any, r: InventoryItem) => (
        <Space>
          <Tooltip title="Adjust Stock">
            <Button size="small" icon={<EditOutlined />} onClick={() => { setAdjustModal({ open: true, item: r }); setAdjustQty(0); }} />
          </Tooltip>
          <Tooltip title="Transfer to Warehouse">
            <Button size="small" icon={<SwapOutlined />} onClick={() => { setTransferModal({ open: true, item: r }); setTransferQty(0); }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: "all", label: <span><BarChartOutlined /> All ({count})</span> },
    { key: "lowStock", label: <span><WarningOutlined /> Low Stock ({items.filter((i) => i.isLowStock).length})</span> },
    { key: "outOfStock", label: <span><ExclamationCircleOutlined /> Out of Stock ({items.filter((i) => i.availableQuantity <= 0).length})</span> },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="Total Stock" value={summary?.totalStock ?? 0} prefix={<ShoppingOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="Available" value={summary?.totalAvailable ?? 0} valueStyle={{ color: "#3f8600" }} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="Reserved" value={summary?.totalReserved ?? 0} valueStyle={{ color: "#1890ff" }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="Low Stock" value={summary?.lowStockCount ?? 0} valueStyle={{ color: "#faad14" }} prefix={<WarningOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <Tabs activeKey={selectedTab} onChange={setSelectedTab} items={tabItems} style={{ marginBottom: 0 }} />
          <Space wrap>
            <Input placeholder="Search product..." prefix={<SearchOutlined />} value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={() => setParams((p) => ({ ...p, search }))} style={{ width: 220 }} />
            <Select placeholder="Warehouse" allowClear style={{ width: 150 }}
              onChange={(v) => setParams((p) => ({ ...p, warehouseId: v }))}
              options={warehouses.map((w) => ({ value: w.id, label: w.name }))} />
            <Tooltip title="Refresh">
              <Button icon={<ReloadOutlined />} onClick={refetch} />
            </Tooltip>
          </Space>
        </div>
        <Table dataSource={filtered} columns={columns} rowKey="id" loading={loading}
          pagination={{
            current: (params.skip || 0) / (params.pageSize || 20) + 1,
            pageSize: params.pageSize || 20, total: count,
            onChange: (page, pageSize) => setParams({ ...params, skip: (page - 1) * pageSize, pageSize }),
          }}
          size="middle" scroll={{ x: 900 }}
          locale={{ emptyText: <Empty description="No inventory items" /> }}
        />
      </Card>

      <Modal title="Adjust Stock" open={adjustModal.open} onCancel={() => setAdjustModal({ open: false, item: null })}
        onOk={handleAdjust} okText="Save">
        {adjustModal.item && (
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            <Descriptions size="small" column={2}>
              <Descriptions.Item label="Product">{adjustModal.item.productTitle}</Descriptions.Item>
              <Descriptions.Item label="Warehouse">{adjustModal.item.warehouseName}</Descriptions.Item>
              <Descriptions.Item label="Current">{adjustModal.item.quantityOnHand}</Descriptions.Item>
              <Descriptions.Item label="Available">{adjustModal.item.availableQuantity}</Descriptions.Item>
            </Descriptions>
            <div>
              <Text>Adjust Quantity (use negative for reduction)</Text>
              <InputNumber style={{ width: "100%" }} value={adjustQty} onChange={(v) => setAdjustQty(v || 0)} />
            </div>
            <div>
              <Text>Note</Text>
              <Input.TextArea value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} placeholder="Reason for adjustment" rows={2} />
            </div>
          </Space>
        )}
      </Modal>

      <Modal title="Transfer Stock" open={transferModal.open} onCancel={() => setTransferModal({ open: false, item: null })}
        onOk={handleTransfer} okText="Transfer">
        {transferModal.item && (
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            <Descriptions size="small" column={2}>
              <Descriptions.Item label="Product">{transferModal.item.productTitle}</Descriptions.Item>
              <Descriptions.Item label="From">{transferModal.item.warehouseName}</Descriptions.Item>
              <Descriptions.Item label="Available">{transferModal.item.availableQuantity}</Descriptions.Item>
            </Descriptions>
            <div>
              <Text>Transfer To</Text>
              <Select style={{ width: "100%" }} placeholder="Select warehouse" value={transferWarehouse}
                onChange={setTransferWarehouse}
                options={warehouses.filter((w) => w.id !== transferModal.item?.warehouseId).map((w) => ({ value: w.id, label: w.name }))} />
            </div>
            <div>
              <Text>Quantity</Text>
              <InputNumber min={1} max={transferModal.item.availableQuantity} style={{ width: "100%" }} value={transferQty} onChange={(v) => setTransferQty(v || 0)} />
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
}
