import { Button, Card, Checkbox, Col, DatePicker, Divider, Input, InputNumber, Row, Select, Space, Table, Tag, Tooltip, Typography } from "antd";
import { cardStyle } from "../styles/style";
import { FaPercent, FaPlus, FaTrash, FaStar, FaLayerGroup, FaQuestionCircle } from "react-icons/fa";
import { InfoCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { DiscountRuleForm, SpecialDiscountDto, ProductSetupData } from "@/types";

const { Text } = Typography;

interface DiscountsPanelProps {
  product: ProductSetupData;
  discounts: DiscountRuleForm[];
  setDiscounts: (d: DiscountRuleForm[] | ((prev: DiscountRuleForm[]) => DiscountRuleForm[])) => void;
  specialDiscount: SpecialDiscountDto;
  setSpecialDiscount: (d: SpecialDiscountDto | ((prev: SpecialDiscountDto) => SpecialDiscountDto)) => void;
}

function DiscountsPanel({ discounts, setDiscounts, specialDiscount, setSpecialDiscount }: DiscountsPanelProps) {
  const addDiscount = () => setDiscounts((old) => [...old, {
    id: Date.now(), scope: "product", target: "", useRange: false,
    from: "", to: "", rate: 0, active: true, minQuantity: null, maxQuantity: null,
  }]);

  const updateDiscount = (index: number, data: Partial<DiscountRuleForm>) =>
    setDiscounts((old) => old.map((d, i) => i === index ? { ...d, ...data } : d));

  const removeDiscount = (index: number) =>
    setDiscounts((old) => old.filter((_, i) => i !== index));

  const updateSpecial = (field: keyof SpecialDiscountDto, value: any) =>
    setSpecialDiscount((old) => ({ ...old, [field]: value }));

  const activeRules = discounts.filter((d) => d.active).length;

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} lg={16}>
        <div className="form-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <Text strong style={{ fontSize: 16 }}>
              <FaPercent style={{ color: "var(--primary)", marginRight: 8 }} />Discount Rules
            </Text>
            <Button type="primary" icon={<FaPlus />} onClick={addDiscount}>Add Rule</Button>
          </div>
          <div style={{ padding: "8px 16px", background: "var(--bg-subtle)", borderRadius: 8, marginBottom: 16 }}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              <InfoCircleOutlined style={{ marginRight: 6 }} />
              <strong>Scope</strong>: Product = this product only. Category = all products in category. Quantity = based on order qty.
            </Text>
          </div>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            {discounts.map((discount, index) => (
              <Card key={discount.id} size="small" style={{ borderRadius: 12 }}
                title={<Space><Tag color="orange">Rule #{index + 1}</Tag>
                  <Checkbox checked={discount.active} onChange={(e) => updateDiscount(index, { active: e.target.checked })}>Active</Checkbox></Space>}
                extra={<Tooltip title="Remove"><Button danger icon={<FaTrash />} size="small" onClick={() => removeDiscount(index)} /></Tooltip>}>
                <Row gutter={[12, 12]} align="middle">
                  <Col xs={24} sm={6}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Scope</Text>
                    <Select value={discount.scope} style={{ width: "100%" }} size="middle"
                      onChange={(v) => updateDiscount(index, { scope: v })}
                      options={[{ value: "product", label: "Product" }, { value: "category", label: "Category" }, { value: "quantity", label: "Quantity" }]} />
                  </Col>
                  <Col xs={12} sm={4}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Rate %</Text>
                    <InputNumber size="middle" style={{ width: "100%" }} min={0} max={100} value={discount.rate}
                      formatter={(v: any) => `${v}%`} parser={(v: any) => v?.replace("%", "") ?? ""}
                      onChange={(v) => updateDiscount(index, { rate: Number(v || 0) })} />
                  </Col>
                  <Col xs={12} sm={3}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Date Range</Text>
                    <Checkbox checked={discount.useRange} onChange={(e) => updateDiscount(index, { useRange: e.target.checked })}>Use</Checkbox>
                  </Col>
                  {discount.useRange && (
                    <>
                      <Col xs={12} sm={4}>
                        <Text type="secondary" style={{ fontSize: 12 }}>From</Text>
                        <DatePicker size="middle" style={{ width: "100%" }}
                          value={discount.from ? dayjs(discount.from) : null}
                          onChange={(d) => updateDiscount(index, { from: d?.toISOString() || "" })} />
                      </Col>
                      <Col xs={12} sm={4}>
                        <Text type="secondary" style={{ fontSize: 12 }}>To</Text>
                        <DatePicker size="middle" style={{ width: "100%" }}
                          value={discount.to ? dayjs(discount.to) : null}
                          onChange={(d) => updateDiscount(index, { to: d?.toISOString() || "" })} />
                      </Col>
                    </>
                  )}
                  <Col xs={12} sm={3}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Min Qty</Text>
                    <InputNumber size="middle" style={{ width: "100%" }} min={0} value={discount.minQuantity}
                      onChange={(v) => updateDiscount(index, { minQuantity: v })} />
                  </Col>
                  <Col xs={12} sm={3}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Max Qty</Text>
                    <InputNumber size="middle" style={{ width: "100%" }} min={0} value={discount.maxQuantity}
                      onChange={(v) => updateDiscount(index, { maxQuantity: v })} />
                  </Col>
                </Row>
              </Card>
            ))}
            {discounts.length === 0 && (
              <div style={{ textAlign: "center", padding: 48, color: "var(--text-tertiary)" }}>
                <FaPercent size={48} style={{ opacity: 0.2, marginBottom: 12 }} />
                <div style={{ fontSize: 15, marginBottom: 4 }}>No discount rules yet</div>
                <Text type="secondary">Click "Add Rule" to create your first discount rule.</Text>
              </div>
            )}
          </Space>
        </div>
      </Col>

      <Col xs={24} lg={8}>
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          <div className="form-card">
            <Text strong style={{ fontSize: 16 }}>
              <FaStar style={{ color: "var(--warning)", marginRight: 8 }} />Special Campaign
            </Text>
            <Space direction="vertical" size={16} style={{ width: "100%", marginTop: 16 }}>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Campaign Title</Text>
                <Input value={specialDiscount.title} onChange={(e) => updateSpecial("title", e.target.value)} placeholder="e.g. Summer Sale" />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Discount Type</Text>
                <Select value={specialDiscount.type} style={{ width: "100%", marginTop: 4 }}
                  onChange={(v) => updateSpecial("type", v)}
                  options={[{ value: "percent", label: "Percent (%)" }, { value: "fixed", label: "Fixed Amount (SAR)" }]} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>{specialDiscount.type === "percent" ? "Rate %" : "Amount (SAR)"}</Text>
                <InputNumber style={{ width: "100%", marginTop: 4 }} min={0} value={specialDiscount.value}
                  onChange={(v) => updateSpecial("value", Number(v || 0))}
                  addonAfter={specialDiscount.type === "percent" ? "%" : "SAR"} />
              </div>
              <Checkbox checked={specialDiscount.active} onChange={(e) => updateSpecial("active", e.target.checked)}>Active</Checkbox>
              <Checkbox checked={specialDiscount.combine} onChange={(e) => updateSpecial("combine", e.target.checked)}>
                Combine with other discounts
              </Checkbox>
              {specialDiscount.combine && (
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>Max Total Rate %</Text>
                  <InputNumber style={{ width: "100%", marginTop: 4 }} min={0} max={100} value={specialDiscount.maxTotalRate}
                    onChange={(v) => updateSpecial("maxTotalRate", Number(v || 0))} addonAfter="%" />
                </div>
              )}
              <Checkbox checked={specialDiscount.useRange} onChange={(e) => updateSpecial("useRange", e.target.checked)}>Set date range</Checkbox>
              {specialDiscount.useRange && (
                <Row gutter={12}>
                  <Col span={12}>
                    <Text type="secondary" style={{ fontSize: 12 }}>From</Text>
                    <DatePicker style={{ width: "100%", marginTop: 4 }}
                      value={specialDiscount.from ? dayjs(specialDiscount.from) : null}
                      onChange={(d) => updateSpecial("from", d?.toISOString() || "")} />
                  </Col>
                  <Col span={12}>
                    <Text type="secondary" style={{ fontSize: 12 }}>To</Text>
                    <DatePicker style={{ width: "100%", marginTop: 4 }}
                      value={specialDiscount.to ? dayjs(specialDiscount.to) : null}
                      onChange={(d) => updateSpecial("to", d?.toISOString() || "")} />
                  </Col>
                </Row>
              )}
            </Space>
          </div>

          <div className="form-card">
            <Text strong style={{ fontSize: 16 }}>
              <FaLayerGroup style={{ color: "var(--secondary)", marginRight: 8 }} />Summary
            </Text>
            <Space direction="vertical" size={8} style={{ width: "100%", marginTop: 16 }}>
              <Row justify="space-between"><Text type="secondary">Active rules</Text><Text>{activeRules}/{discounts.length}</Text></Row>
              <Row justify="space-between"><Text type="secondary">Special campaign</Text>
                {specialDiscount.active ? <Tag color="orange">Active</Tag> : <Tag>Inactive</Tag>}</Row>
              <Row justify="space-between"><Text type="secondary">Max total</Text>
                <Text strong>{specialDiscount.active ? `%${specialDiscount.maxTotalRate}` : "—"}</Text></Row>
            </Space>
          </div>
        </Space>
      </Col>
    </Row>
  );
}

export default DiscountsPanel;
