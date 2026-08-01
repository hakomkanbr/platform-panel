import { Alert, Button, Card, Checkbox, Col, List, Row, Space, Spin, Steps, Tag, Tooltip, Typography } from "antd";
import { cardStyle } from "../styles/style";
import { validate } from "../validation/validate";
import { FaCheckCircle, FaExclamationTriangle, FaPlay, FaImage, FaLayerGroup, FaPercent, FaCogs, FaEye, FaQuestionCircle } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import type { ProductSetupData, VariantType, VariantRow, DiscountRuleForm, SpecialDiscountDto, ProductImages } from "@/types";
import type { InventoryAllocation } from "./InventoryPanel";

const { Text, Title } = Typography;

interface PublishPanelProps {
  product: ProductSetupData;
  types: VariantType[];
  rows: VariantRow[];
  discounts: DiscountRuleForm[];
  effects: Record<string, number>;
  specialDiscount: SpecialDiscountDto;
  productImages: ProductImages[];
  onPublish: () => Promise<void>;
  publishing: boolean;
}

function PublishPanel({ product, types, rows, discounts, effects, specialDiscount, productImages, onPublish, publishing }: PublishPanelProps) {
  const [accepted, setAccepted] = useState(false);

  const validation = useMemo(() => validate(product, types, rows, discounts, effects, specialDiscount),
    [product, types, rows, discounts, effects, specialDiscount]);

  useEffect(() => { setAccepted(false); }, [validation.errors.length]);

  const steps = [
    { title: "Setup", icon: <FaCogs />, status: (product.name?.trim() && Number(product.basePrice) > 0 ? "finish" : "process") as const },
    { title: "Variants", icon: <FaLayerGroup />, status: (rows.length > 0 && types.length > 0 ? "finish" : "wait") as const },
    { title: "Discounts", icon: <FaPercent />, status: (discounts.filter((d) => d.active).length > 0 ? "finish" : "wait") as const },
    { title: "Preview", icon: <FaEye />, status: "wait" as const },
    { title: "Publish", icon: <FaCheckCircle />, status: "wait" as const },
  ];

  const checklist = [
    { label: "Product name", ok: Boolean(product.name?.trim()) },
    { label: "Category selected", ok: Boolean(product.categoryId || product.category) },
    { label: "Base price defined", ok: Number(product.basePrice) > 0 },
    { label: "Product images", ok: productImages?.length > 0 },
    { label: "Variant types defined", ok: types.length > 0 },
    { label: "Variants generated", ok: rows.length > 0 },
    { label: "All SKUs filled", ok: rows.every((r) => r.sku?.trim()) },
    { label: "At least one active variant", ok: rows.some((r) => r.active !== false) },
    { label: "Variant images (optional)", ok: rows.some((r) => r.imagee) },
  ];

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} lg={16}>
        <div className="form-card">
          <Title level={5} style={{ marginBottom: 24 }}>
            <FaCheckCircle style={{ color: "var(--success)", marginRight: 8 }} />Pre-Publish Checklist
          </Title>
          <Steps current={2} items={steps} size="small" style={{ marginBottom: 24 }} />
          <List
            dataSource={checklist}
            renderItem={(item) => (
              <List.Item>
                <Space>
                  {item.ok
                    ? <FaCheckCircle style={{ color: "var(--success)" }} />
                    : <FaExclamationTriangle style={{ color: "var(--warning)" }} />}
                  <Text style={{ textDecoration: item.ok ? "line-through" : "none", opacity: item.ok ? 0.6 : 1 }}>
                    {item.label}
                  </Text>
                </Space>
              </List.Item>
            )}
          />
        </div>
      </Col>

      <Col xs={24} lg={8}>
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          {validation.errors.length > 0 && (
            <Card title={<Space><FaExclamationTriangle style={{ color: "var(--danger)" }} />Errors ({validation.errors.length})</Space>}
              style={{ ...cardStyle, borderColor: "var(--error)" }}>
              {validation.errors.map((err, i) => <Alert key={i} message={err} type="error" showIcon style={{ marginBottom: 8 }} />)}
            </Card>
          )}
          {validation.warnings.length > 0 && (
            <Card title={<Space><FaExclamationTriangle style={{ color: "var(--warning)" }} />Warnings</Space>}
              style={{ ...cardStyle, borderColor: "var(--warning)" }}>
              {validation.warnings.map((warn, i) => <Alert key={i} message={warn} type="warning" showIcon style={{ marginBottom: 8 }} />)}
            </Card>
          )}
          {validation.errors.length === 0 && validation.warnings.length === 0 && (
            <Card style={{ ...cardStyle, borderColor: "var(--secondary)", textAlign: "center" }}>
              <FaCheckCircle size={40} color="var(--secondary)" />
              <Title level={4} style={{ margin: "12px 0 0" }}>Ready to Publish</Title>
              <Text type="secondary">All checks passed</Text>
            </Card>
          )}

          <div className="form-card">
            <Title level={5} style={{ marginBottom: 16 }}>Confirm & Publish</Title>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Checkbox checked={accepted} onChange={(e) => setAccepted(e.target.checked)}
                disabled={validation.errors.length > 0}>
                I confirm all data is correct and ready for publication.
              </Checkbox>
              <Button type="primary" size="large" block
                disabled={!accepted || validation.errors.length > 0 || publishing}
                onClick={onPublish} icon={publishing ? <Spin /> : <FaPlay />}>
                {publishing ? "Publishing..." : "Publish Product"}
              </Button>
            </Space>
          </div>
        </Space>
      </Col>
    </Row>
  );
}

export default PublishPanel;
