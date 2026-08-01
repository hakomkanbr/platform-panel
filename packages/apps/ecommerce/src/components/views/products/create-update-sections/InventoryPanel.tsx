import { useEffect, useState } from "react";
import { Card, Col, InputNumber, Row, Table, Tag, Typography, Alert, Button, Empty, Spin } from "antd";
import { cardStyle } from "../styles/style";
import { FaWarehouse, FaPlus, FaExclamationTriangle } from "react-icons/fa";
import { warehousesApi } from "@/lib/api/inventory";
import type { Warehouse, VariantRow } from "@/types";
import Link from "next/link";

const { Text, Title } = Typography;

export interface InventoryAllocation {
  quantity: number;
  threshold: number;
}

interface InventoryPanelProps {
  rows: VariantRow[];
  inventoryData: Record<string, InventoryAllocation>;
  onChange: (data: Record<string, InventoryAllocation>) => void;
}

function InventoryPanel({ rows, inventoryData, onChange }: InventoryPanelProps) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    warehousesApi.list({ pageSize: 100 })
      .then((res) => setWarehouses((res.data || []).filter((w: Warehouse) => w.isActive)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getKey = (whId: number, rowIdx?: number) =>
    rowIdx !== undefined ? `${whId}:${rowIdx}` : `${whId}`;

  const getValue = (whId: number, rowIdx?: number): InventoryAllocation =>
    inventoryData[getKey(whId, rowIdx)] || { quantity: 0, threshold: 10 };

  const setValue = (whId: number, field: keyof InventoryAllocation, value: number, rowIdx?: number) => {
    const key = getKey(whId, rowIdx);
    const current = getValue(whId, rowIdx);
    onChange({ ...inventoryData, [key]: { ...current, [field]: value } });
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: 40 }}><Spin /></div>;
  }

  if (warehouses.length === 0) {
    return (
      <div className="form-card" style={{ textAlign: "center", padding: 40 }}>
        <Empty
          image={<FaWarehouse size={48} color="var(--text-secondary)" />}
          description={
            <span>
              No warehouses found.{" "}
              <Link href="/panel/inventory/warehouses">Create a warehouse</Link> first.
            </span>
          }
        />
      </div>
    );
  }

  const hasVariants = rows.length > 0;

  if (hasVariants) {
    const columns = [
      {
        title: "Variant",
        dataIndex: "label",
        key: "label",
        fixed: "left" as const,
        width: 200,
        render: (_: any, record: VariantRow) => (
          <div>
            <Text strong>{record.sku || "—"}</Text>
            <div><Text type="secondary" style={{ fontSize: 12 }}>{Object.values(record.attrs).join(" / ")}</Text></div>
          </div>
        ),
      },
      ...warehouses.map((wh) => ({
        title: wh.name,
        key: `wh-${wh.id}`,
        width: 160,
        render: (_: any, __: any, rowIdx: number) => (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <InputNumber
              size="small"
              min={0}
              value={getValue(wh.id, rowIdx).quantity}
              onChange={(v) => setValue(wh.id, "quantity", v ?? 0, rowIdx)}
              style={{ width: "100%" }}
              placeholder="Qty"
            />
            <InputNumber
              size="small"
              min={0}
              value={getValue(wh.id, rowIdx).threshold}
              onChange={(v) => setValue(wh.id, "threshold", v ?? 10, rowIdx)}
              style={{ width: "100%" }}
              placeholder="Threshold"
            />
          </div>
        ),
      })),
    ];

    return (
      <div className="form-card">
        <Title level={5} style={{ marginBottom: 16 }}>
          <FaWarehouse style={{ marginRight: 8 }} />Warehouse Stock by Variant
        </Title>
        <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
          Set initial stock quantity and low-stock threshold per warehouse for each variant.
        </Text>
        <div style={{ overflowX: "auto" }}>
          <Table
            dataSource={rows}
            columns={columns}
            rowKey={(_, i) => String(i)}
            pagination={false}
            size="small"
            bordered
          />
        </div>
      </div>
    );
  }

  // No variants — simple product
  return (
    <div className="form-card">
      <Title level={5} style={{ marginBottom: 16 }}>
        <FaWarehouse style={{ marginRight: 8 }} />Warehouse Stock
      </Title>
      <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
        Set initial stock quantity for each warehouse.
      </Text>
      <Row gutter={[16, 16]}>
        {warehouses.map((wh) => {
          const val = getValue(wh.id);
          return (
            <Col xs={24} sm={12} lg={8} key={wh.id}>
              <Card size="small" style={cardStyle}>
                <Text strong>{wh.name}</Text>
                {wh.location && <Text type="secondary" style={{ display: "block", fontSize: 12 }}>{wh.location}</Text>}
                <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 11 }}>Quantity</Text>
                    <InputNumber
                      min={0}
                      value={val.quantity}
                      onChange={(v) => setValue(wh.id, "quantity", v ?? 0)}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 11 }}>Threshold</Text>
                    <InputNumber
                      min={0}
                      value={val.threshold}
                      onChange={(v) => setValue(wh.id, "threshold", v ?? 10)}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default InventoryPanel;
