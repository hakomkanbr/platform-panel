import {
  Button, Card, Checkbox, Col, Input, InputNumber, Row, Space, Table,
  Tag, Typography, Tooltip, Upload, message, Select,
} from "antd";
import { useState, useMemo } from "react";
import { cardStyle } from "../styles/style";
import autoPrice from "../helper/autoPrice";
import finalUnitPrice from "../helper/finalUnitPrice";
import formatMoney from "@/lib/formatMoney";
import { InfoCircleOutlined } from "@ant-design/icons";
import {
  FaImage, FaMagic, FaPlus, FaTrash, FaSearch, FaDownload,
  FaSortAmountDown, FaQuestionCircle, FaFileExcel, FaPercentage,
} from "react-icons/fa";
import type { ProductSetupData, VariantType, VariantRow } from "@/types";

const { Text } = Typography;

interface MatrixPanelProps {
  product: ProductSetupData;
  types: VariantType[];
  rows: VariantRow[];
  setRows: (rows: VariantRow[] | ((prev: VariantRow[]) => VariantRow[])) => void;
  generate: () => void;
  effects: Record<string, number>;
}

function MatrixPanel({ product, types, rows, setRows, generate, effects }: MatrixPanelProps) {
  const [searchSku, setSearchSku] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [bulkPercent, setBulkPercent] = useState<number>(0);
  const [bulkField, setBulkField] = useState<"overridePrice" | "stock">("overridePrice");

  const updateRow = (index: number, data: Partial<VariantRow>) =>
    setRows((old) => old.map((r, i) => (i === index ? { ...r, ...data } : r)));

  const bulkSet = (field: keyof VariantRow, value: any) =>
    setRows((old) => old.map((r) => ({ ...r, [field]: value })));

  const bulkApplyPercent = () => {
    if (!bulkPercent || bulkField !== "overridePrice") return;
    setRows((old) => old.map((r) => {
      const currentPrice = finalUnitPrice(product, r, effects);
      const newPrice = currentPrice * (1 + bulkPercent / 100);
      return { ...r, overridePrice: String(Math.round(newPrice * 100) / 100) };
    }));
    message.success(`Applied ${bulkPercent}% to all prices`);
  };

  const filteredRows = useMemo(() => rows.filter((r, i) => {
    if (searchSku && !r.sku?.toLowerCase().includes(searchSku.toLowerCase())) return false;
    if (!showInactive && r.active === false) return false;
    return true;
  }), [rows, searchSku, showInactive]);

  const totalSum = useMemo(() =>
    filteredRows.reduce((sum, r) => sum + finalUnitPrice(product, r, effects), 0),
  [filteredRows, product, effects]);

  const handleRowImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => updateRow(index, { imagee: e.target?.result as string });
    return false;
  };

  const columns = [
    { title: "#", key: "index", width: 45, render: (_: any, __: any, i: number) => <Text type="secondary">{i + 1}</Text> },
    ...types.map((type) => ({
      title: type.name,
      key: type.id,
      width: 100,
      dataIndex: ["attrs", type.id] as any,
      render: (val: string) => <Tag color="orange" style={{ borderRadius: 6 }}>{val}</Tag>,
    })),
    {
      title: "Image", key: "imagee", width: 70,
      render: (_: any, __: any, i: number) => {
        const row = rows[i];
        return row?.imagee ? (
          <Tooltip title="Click to remove"><img src={row.imagee} alt="" className="variant-image-thumb"
            onClick={() => updateRow(i, { imagee: "" })} /></Tooltip>
        ) : (
          <Upload beforeUpload={(file) => handleRowImageUpload(i, file)} showUploadList={false} accept="image/*">
            <div style={{ width: 36, height: 36, borderRadius: 8, border: "1px dashed var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "var(--bg-subtle)" }}>
              <FaPlus style={{ fontSize: 12, color: "var(--text-tertiary)" }} />
            </div>
          </Upload>
        );
      },
    },
    {
      title: "SKU", key: "sku", width: 130,
      render: (_: any, __: any, i: number) => (
        <Input size="small" value={rows[i]?.sku || ""} onChange={(e) => updateRow(i, { sku: e.target.value })} />
      ),
    },
    {
      title: "Override Price", key: "overridePrice", width: 110,
      render: (_: any, __: any, i: number) => (
        <InputNumber size="small" style={{ width: "100%" }} min={0} value={rows[i]?.overridePrice}
          onChange={(v) => updateRow(i, { overridePrice: v ? String(v) : "" })} />
      ),
    },
    {
      title: "Auto Price", key: "autoPrice", width: 90,
      render: (_: any, __: any, i: number) => {
        const price = autoPrice(product, rows[i]?.attrs || {}, effects);
        return <Tooltip title={`Base: ${formatMoney(product.basePrice)} + effects`}><Text>{formatMoney(price)}</Text></Tooltip>;
      },
    },
    {
      title: "Your Price", key: "finalPrice", width: 100,
      render: (_: any, __: any, i: number) => (
        <Text strong style={{ color: "var(--primary)" }}>{formatMoney(finalUnitPrice(product, rows[i], effects))}</Text>
      ),
    },
    {
      title: "Discount", key: "discountRate", width: 78,
      render: (_: any, __: any, i: number) => {
        const rate = rows[i]?.dynamicDiscountRate || 0;
        return rate > 0 ? <Tag color="red">%{rate}</Tag> : <Text type="secondary">—</Text>;
      },
    },
    { title: "Tax", key: "taxRate", width: 65, render: (_: any, __: any, i: number) => <Text>%{rows[i]?.taxRate || product.vatRate || 0}</Text> },
    { title: "Stock", key: "stock", width: 55,
      render: (_: any, __: any, i: number) => (
        <Checkbox checked={rows[i]?.stock || false} onChange={(e) => updateRow(i, { stock: e.target.checked })} />
      ),
    },
    { title: "Active", key: "active", width: 55,
      render: (_: any, __: any, i: number) => (
        <Checkbox checked={rows[i]?.active !== false} onChange={(e) => updateRow(i, { active: e.target.checked })} />
      ),
    },
  ];

  return (
    <Card title={<Space><FaSearch /> Variant Matrix — {rows.length} variants</Space>} style={cardStyle}
      extra={
        <Space wrap>
          <Input.Search size="large" placeholder="Search SKU..." value={searchSku}
            onChange={(e) => setSearchSku(e.target.value)} style={{ width: 200 }} />
          <Checkbox checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)}>Show inactive</Checkbox>
          <Button icon={<FaMagic />} size="small" onClick={generate}>Regenerate</Button>
          <Button icon={<FaSearch />} size="small" onClick={() => bulkSet("stock", true)}>All Stock</Button>
          <Button icon={<FaDownload />} size="small" onClick={() => bulkSet("active", true)}>Activate All</Button>
          <Button size="small" onClick={() => bulkSet("overridePrice", "")}>Clear Prices</Button>
        </Space>
      }
    >
      <Row gutter={16} style={{ marginBottom: 16 }} align="middle">
        <Col>
          <Space>
            <Text><InfoCircleOutlined style={{ marginRight: 4 }} />Bulk Price Adjustment:</Text>
            <Select value={bulkField} onChange={setBulkField} size="small" style={{ width: 140 }}>
              <Select.Option value="overridePrice">Override Price</Select.Option>
              <Select.Option value="stock">Stock</Select.Option>
            </Select>
            {bulkField === "overridePrice" && (
              <>
                <InputNumber size="small" style={{ width: 100 }} value={bulkPercent}
                  onChange={(v) => setBulkPercent(v || 0)} addonAfter="%" placeholder="%" />
                <Button size="small" icon={<FaPercentage />} onClick={bulkApplyPercent}>Apply %</Button>
              </>
            )}
          </Space>
        </Col>
      </Row>

      <Space style={{ marginBottom: 12, display: "flex", flexWrap: "wrap", gap: 4 }} align="center">
        <Text style={{ fontWeight: 600 }}>Price Effects:</Text>
        {Object.entries(effects).filter(([_, v]) => Number(v) !== 0).map(([key, val]) => (
          <Tag key={key} color={Number(val) > 0 ? "green" : "red"}>{key}: {Number(val) > 0 ? "+" : ""}{String(val)}</Tag>
        ))}
        {!Object.entries(effects).some(([_, v]) => Number(v) !== 0) && <Text type="secondary">None set</Text>}
      </Space>

      <Table dataSource={filteredRows.map((r, i) => ({ ...r, key: i }))} columns={columns}
        pagination={rows.length > 50 ? { pageSize: 50, showSizeChanger: true } : false}
        size="small" scroll={{ x: 1100 }} bordered
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={types.length + 7}>
              <Text type="secondary">{filteredRows.length} of {rows.length} variants shown</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              <Text strong style={{ color: "var(--primary)" }}>{formatMoney(totalSum)}</Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </Card>
  );
}

export default MatrixPanel;
