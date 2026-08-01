import { Card, Col, Divider, InputNumber, Row, Space, Table, Tag, Typography, Tooltip } from "antd";
import { useState, useMemo } from "react";
import { cardStyle } from "../styles/style";
import finalUnitPrice from "../helper/finalUnitPrice";
import { calculateDiscounts } from "../helper";
import formatMoney from "@/lib/formatMoney";
import { FaQuestionCircle } from "react-icons/fa";
import type { ProductSetupData, VariantType, VariantRow, DiscountRuleForm, SpecialDiscountDto } from "@/types";

const { Text, Title } = Typography;

interface PreviewPanelProps {
  product: ProductSetupData;
  types: VariantType[];
  rows: VariantRow[];
  discounts: DiscountRuleForm[];
  effects: Record<string, number>;
  specialDiscount: SpecialDiscountDto;
}

function PreviewPanel({ product, types, rows, discounts, effects, specialDiscount }: PreviewPanelProps) {
  const [qty, setQty] = useState(product.startQty || 1);

  const activeRows = useMemo(() => rows.filter((r) => r.active !== false), [rows]);
  const sampleRow = activeRows[0] || rows[0];
  const samplePrice = sampleRow ? finalUnitPrice(product, sampleRow, effects) : 0;
  const basePrice = Number(product.basePrice || 0);
  const taxRate = Number(product.vatRate || 0) / 100;

  const activeDiscounts = discounts.filter((d) => d.active);
  const totalActiveDiscountRate = useMemo(() =>
    activeDiscounts.reduce((sum, d) => sum + Number(d.rate || 0), 0) +
    (specialDiscount.active ? Number(specialDiscount.value || 0) : 0),
  [activeDiscounts, specialDiscount]);

  const subtotal = samplePrice || basePrice;
  const taxAmount = subtotal * taxRate;
  const finalPrice = subtotal + taxAmount;

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} lg={16}>
        <div className="form-card">
          <Title level={5} style={{ margin: 0, color: "var(--text-primary)" }}>{product.name || "Product Preview"}</Title>
          {product.category && <Tag color="orange" style={{ marginTop: 8 }}>{product.category}</Tag>}

          <Divider orientation="left">Pricing Breakdown</Divider>
          <Row gutter={[16, 16]}>
            <Col xs={12}><Text type="secondary">Base Price</Text><br /><Text strong style={{ fontSize: 18 }}>{formatMoney(basePrice)}</Text></Col>
            <Col xs={12}><Text type="secondary">VAT</Text><br /><Text strong>%{product.vatRate || 0}</Text></Col>
            <Col xs={12}>
              <Text type="secondary">Quantity</Text><br />
              <InputNumber min={1} value={qty} onChange={(v) => setQty(Number(v || 1))} />
            </Col>
            <Col xs={12}><Text type="secondary">Active Variants</Text><br /><Text strong>{activeRows.length}/{rows.length}</Text></Col>
          </Row>

          {(sampleRow || activeRows.length > 0) && (
            <div style={{ marginTop: 16, padding: 20, background: "var(--gradient-card-1)", borderRadius: 16 }}>
              <Title level={4} style={{ margin: 0, color: "var(--primary)", textAlign: "center" }}>
                {formatMoney(finalPrice)} <span style={{ fontSize: 14, fontWeight: 400, color: "var(--text-secondary)" }}>per unit inc. VAT</span>
              </Title>
              <Row gutter={16} style={{ marginTop: 16, textAlign: "center" }}>
                <Col span={6}><Text type="secondary">Subtotal</Text><br /><Text strong>{formatMoney(subtotal)}</Text></Col>
                <Col span={6}><Text type="secondary">Tax</Text><br /><Text strong>{formatMoney(taxAmount)}</Text></Col>
                <Col span={6}>
                  <Tooltip title={`Total discount: ${totalActiveDiscountRate}%`}>
                    <Text type="secondary">Discount</Text><br />
                    <Text strong style={{ color: "var(--error)" }}>-{formatMoney(basePrice - subtotal)}</Text>
                  </Tooltip>
                </Col>
                <Col span={6}><Text type="secondary">Total {qty}x</Text><br />
                  <Text strong style={{ color: "var(--secondary)" }}>{formatMoney(finalPrice * qty)}</Text></Col>
              </Row>
            </div>
          )}

          <Divider orientation="left">All Variant Prices</Divider>
          <Table dataSource={activeRows.map((r, i) => ({ ...r, key: i }))} pagination={false} size="small" scroll={{ x: 700 }}
            columns={[
              { title: "#", key: "i", width: 40, render: (_: any, __: any, i: number) => i + 1 },
              ...types.map((t) => ({ title: t.name, key: t.id, dataIndex: ["attrs", t.id] as any, render: (v: string) => <Tag color="orange" style={{ borderRadius: 6 }}>{v}</Tag> })),
              { title: "SKU", dataIndex: "sku", width: 120 },
              { title: "Image", key: "img", width: 50, render: (_: any, __: any, i: number) =>
                activeRows[i]?.imagee ? <img src={activeRows[i].imagee!} alt="" style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover" }} /> : <Text type="secondary">—</Text> },
              { title: "Unit Price", key: "unitPrice", width: 100, render: (_: any, __: any, i: number) =>
                <Text strong style={{ color: "var(--primary)" }}>{formatMoney(finalUnitPrice(product, activeRows[i], effects))}</Text> },
              { title: `Total (${qty})`, key: "total", width: 100, render: (_: any, __: any, i: number) =>
                <Text strong>{formatMoney(finalUnitPrice(product, activeRows[i], effects) * qty)}</Text> },
            ]} />
        </div>
      </Col>

      <Col xs={24} lg={8}>
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          <div className="form-card">
            <Text strong style={{ fontSize: 16, marginBottom: 16, display: "block" }}>Discount Breakdown</Text>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              {activeDiscounts.map((d, i) => (
                <Row key={i} justify="space-between" align="middle">
                  <Col><Tag color={d.scope === "product" ? "blue" : d.scope === "category" ? "green" : "purple"}>
                    {d.scope}</Tag></Col>
                  <Col><Text strong style={{ color: "var(--error)" }}>-{d.rate}%</Text></Col>
                </Row>
              ))}
              {specialDiscount.active && (
                <Row justify="space-between" align="middle">
                  <Col><Tag color="gold">Campaign</Tag>{specialDiscount.title}</Col>
                  <Col><Text strong style={{ color: "var(--error)" }}>-{specialDiscount.type === "percent" ? "%" : "SAR"}{specialDiscount.value}</Text></Col>
                </Row>
              )}
              {totalActiveDiscountRate === 0 && <Text type="secondary">No active discounts</Text>}
            </Space>
          </div>

          <div className="form-card" style={{ background: "var(--gradient-card-2)" }}>
            <Text strong style={{ fontSize: 16, marginBottom: 16, display: "block", color: "var(--secondary)" }}>Order Summary</Text>
            <div style={{ textAlign: "center" }}>
              <Text type="secondary">Price per unit (qty {qty})</Text>
              <Title level={2} style={{ margin: "8px 0", color: "var(--primary)" }}>{samplePrice > 0 ? formatMoney(samplePrice) : "—"}</Title>
              <Divider style={{ margin: "12px 0" }} />
              <Text type="secondary">Subtotal ({qty} units)</Text>
              <Title level={3} style={{ margin: "4px 0", color: "var(--secondary)" }}>{samplePrice > 0 ? formatMoney(samplePrice * qty) : "—"}</Title>
              <Divider style={{ margin: "12px 0" }} />
              <Text type="secondary">VAT (included)</Text>
              <Title level={3} style={{ margin: "4px 0", color: "var(--warning)" }}>
                {samplePrice > 0 ? formatMoney((samplePrice * Number(product.vatRate || 0)) / 100) : "—"}</Title>
            </div>
          </div>
        </Space>
      </Col>
    </Row>
  );
}

export default PreviewPanel;
