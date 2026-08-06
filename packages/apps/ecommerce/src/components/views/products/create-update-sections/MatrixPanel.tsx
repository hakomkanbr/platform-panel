import {
  Button, Card, Checkbox, Col, Input, InputNumber, Row, Space, Table,
  Tag, Typography, Tooltip, Upload, message, Select, Tabs, Divider,
} from "antd";
import { useState, useMemo } from "react";
import { cardStyle } from "../styles/style";
import autoPrice from "../helper/autoPrice";
import finalUnitPrice from "../helper/finalUnitPrice";
import formatMoney from "@/lib/formatMoney";
import { InfoCircleOutlined, DownOutlined, UpOutlined, SettingOutlined } from "@ant-design/icons";
import {
  FaImage, FaMagic, FaPlus, FaTrash, FaSearch, FaDownload,
  FaSortAmountDown, FaQuestionCircle, FaFileExcel, FaPercentage,
} from "react-icons/fa";
import type { ProductSetupData, VariantType, VariantRow } from "@/types";

const { Text } = Typography;
const { TabPane } = Tabs;

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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const updateRow = (index: number, data: Partial<VariantRow>) =>
    setRows((old) => old.map((r, i) => (i === index ? { ...r, ...data } : r)));

  const bulkSet = (field: keyof VariantRow, value: any) =>
    setRows((old) => old.map((r, i) => (selectedRowKeys.length === 0 || selectedRowKeys.includes(i)) ? { ...r, [field]: value } : r));

  const bulkApplyPercent = () => {
    if (!bulkPercent || bulkField !== "overridePrice") return;
    setRows((old) => old.map((r, i) => {
      if (selectedRowKeys.length > 0 && !selectedRowKeys.includes(i)) return r;
      const currentPrice = finalUnitPrice(product, r, effects);
      const newPrice = currentPrice * (1 + bulkPercent / 100);
      return { ...r, overridePrice: String(Math.round(newPrice * 100) / 100) };
    }));
    message.success(`Applied ${bulkPercent}% to selected prices`);
  };

  const filteredRows = useMemo(() => rows.filter((r, i) => {
    if (searchSku && !r.sku?.toLowerCase().includes(searchSku.toLowerCase())) return false;
    if (!showInactive && r.active === false) return false;
    return true;
  }), [rows, searchSku, showInactive]);

  const handleRowImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => updateRow(index, { imagee: e.target?.result as string });
    return false;
  };

  const columns = [
    {
      title: "Image", key: "imagee", width: 70,
      render: (_: any, __: any, i: number) => {
        const row = rows[i];
        return row?.imagee ? (
          <Tooltip title="Click to remove"><img src={row.imagee} alt="" className="variant-image-thumb"
            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
            onClick={() => updateRow(i, { imagee: "" })} /></Tooltip>
        ) : (
          <Upload beforeUpload={(file) => handleRowImageUpload(i, file)} showUploadList={false} accept="image/*">
            <div style={{ width: 40, height: 40, borderRadius: 4, border: "1px dashed var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "var(--bg-subtle)" }}>
              <FaImage style={{ fontSize: 14, color: "var(--text-tertiary)" }} />
            </div>
          </Upload>
        );
      },
    },
    { 
      title: "Variant", 
      key: "name", 
      render: (_: any, __: any, i: number) => {
        const row = rows[i];
        const variantName = types.map(t => row.attrs?.[t.id] || "").join(" / ");
        return (
          <Space direction="vertical" size={0}>
            <Text strong>{product.name}</Text>
            <Text type="secondary">{variantName || "Default"}</Text>
          </Space>
        );
      }
    },
    {
      title: "SKU", key: "sku", width: 140,
      render: (_: any, __: any, i: number) => (
        <Input size="small" value={rows[i]?.sku || ""} onChange={(e) => updateRow(i, { sku: e.target.value })} />
      ),
    },
    {
      title: "Price", key: "finalPrice", width: 110,
      render: (_: any, __: any, i: number) => (
        <Space direction="vertical" size={0}>
            <Text strong style={{ color: "var(--primary)" }}>{formatMoney(finalUnitPrice(product, rows[i], effects))}</Text>
            {rows[i]?.overridePrice ? <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>Override</Tag> : <Text type="secondary" style={{ fontSize: 10 }}>Inherited</Text>}
        </Space>
      ),
    },
    { title: "Inventory", key: "stock", width: 90,
      render: (_: any, __: any, i: number) => (
        <Checkbox checked={rows[i]?.stock || false} onChange={(e) => updateRow(i, { stock: e.target.checked })}>Track</Checkbox>
      ),
    },
    { title: "Status", key: "active", width: 90,
      render: (_: any, __: any, i: number) => (
        <Tag color={rows[i]?.active !== false ? "green" : "red"}>{rows[i]?.active !== false ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      title: "Actions", key: "actions", width: 70,
      render: (_: any, __: any, i: number) => (
          <Tooltip title="Toggle Status">
            <Button size="small" type="text" icon={<SettingOutlined />} onClick={() => updateRow(i, { active: rows[i]?.active === false })} />
          </Tooltip>
      ),
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const expandedRowRender = (record: any) => {
    const i = record.key;
    return (
      <div style={{ padding: '16px 24px', background: 'var(--bg-subtle)', borderRadius: 8, margin: '8px 0' }}>
        <Tabs defaultActiveKey="pricing" size="small">
          <TabPane tab="Pricing & Inventory" key="pricing">
            <Row gutter={24}>
              <Col span={8}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Price Override</Text>
                  <InputNumber 
                    prefix="$" 
                    style={{ width: "100%" }} 
                    value={rows[i]?.overridePrice}
                    onChange={(v) => updateRow(i, { overridePrice: v ? String(v) : "" })} 
                    placeholder={`Default: ${formatMoney(product.basePrice)}`}
                  />
                </Space>
              </Col>
              <Col span={8}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Compare-at Price</Text>
                  <InputNumber prefix="$" style={{ width: "100%" }} placeholder="Optional" />
                </Space>
              </Col>
              <Col span={8}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Cost per item</Text>
                  <InputNumber prefix="$" style={{ width: "100%" }} placeholder="Optional" />
                </Space>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Shipping & Dimensions" key="shipping">
            <Row gutter={24}>
              <Col span={8}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Weight (kg)</Text>
                  <InputNumber style={{ width: "100%" }} placeholder="0.00" />
                </Space>
              </Col>
              <Col span={16}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Dimensions (L x W x H)</Text>
                  <Space.Compact style={{ width: '100%' }}>
                      <InputNumber placeholder="Length" />
                      <InputNumber placeholder="Width" />
                      <InputNumber placeholder="Height" />
                  </Space.Compact>
                </Space>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Identifiers" key="identifiers">
            <Row gutter={24}>
              <Col span={12}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Barcode (ISBN, UPC, GTIN, etc.)</Text>
                  <Input placeholder="e.g. 123456789012" />
                </Space>
              </Col>
              <Col span={12}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Internal Code</Text>
                  <Input placeholder="Optional internal reference" />
                </Space>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    );
  };

  return (
    <Card title={<Space><FaLayerGroup /> Variant Workspace — {rows.length} variants</Space>} style={cardStyle}
      extra={
        <Space wrap>
          <Input.Search size="middle" placeholder="Search SKU..." value={searchSku}
            onChange={(e) => setSearchSku(e.target.value)} style={{ width: 200 }} />
          <Checkbox checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)}>Show inactive</Checkbox>
          <Button type="primary" icon={<FaMagic />} size="middle" onClick={generate}>Generate Missing Variants</Button>
        </Space>
      }
    >
      <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg-subtle)', borderRadius: 6 }}>
        <Space wrap align="center">
          <Text strong>Bulk Operations {selectedRowKeys.length > 0 ? `(${selectedRowKeys.length} selected)` : '(All)'}:</Text>
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
          <Divider type="vertical" />
          <Button size="small" onClick={() => bulkSet("stock", true)}>Track Inventory</Button>
          <Button size="small" onClick={() => bulkSet("active", true)}>Activate</Button>
          <Button size="small" danger onClick={() => bulkSet("active", false)}>Deactivate</Button>
        </Space>
      </div>

      <Table 
        rowSelection={rowSelection}
        dataSource={filteredRows.map((r, i) => ({ ...r, key: i }))} 
        columns={columns}
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
          expandRowByClick: false,
        }}
        pagination={rows.length > 50 ? { pageSize: 50, showSizeChanger: true } : false}
        size="middle" 
        scroll={{ x: 1000 }} 
        bordered
      />
    </Card>
  );
}

export default MatrixPanel;
