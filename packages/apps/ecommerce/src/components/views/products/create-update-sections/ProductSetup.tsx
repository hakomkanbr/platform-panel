import {
  Button, Card, Col, Divider, Form, Input, InputNumber, Popconfirm,
  Row, Select, Space, Spin, Tag, Tooltip, TreeSelect, Typography, Upload, message,
} from "antd";
import { useEffect, useState } from "react";
import { cardStyle } from "../styles/style";
import UnitProduct from "@/Enum/unit";
import {
  MinusCircleOutlined, PlusOutlined, UploadOutlined, InfoCircleOutlined,
} from "@ant-design/icons";
import formatMoney from "@/lib/formatMoney";
import {
  FaArrowDown, FaArrowUp, FaImage, FaMagic, FaPlus, FaTrash, FaStar,
} from "react-icons/fa";
import TinyEditor from "@/components/common/tiny-editor";
import slug from "@/lib/slug";
import type { ProductSetupData, VariantType, ProductImages, Brand, Category } from "@/types";

const { Text, Title } = Typography;

interface ProductSetupProps {
  product: ProductSetupData;
  setProduct: (product: ProductSetupData | ((prev: ProductSetupData) => ProductSetupData)) => void;
  types: VariantType[];
  setTypes: (types: VariantType[] | ((prev: VariantType[]) => VariantType[])) => void;
  generate: () => void;
  rowsCount: number;
  valueImages: Record<string, string>;
  setValueImages: (images: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  effects: Record<string, number>;
  setEffects: (effects: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
  categories: Category[];
  brands: Brand[];
  productImages: ProductImages[];
  setProductImages: (images: ProductImages[] | ((prev: ProductImages[]) => ProductImages[])) => void;
}

function ProductSetup({
  product, setProduct, types, setTypes, generate, rowsCount,
  valueImages, setValueImages, effects, setEffects,
  categories, brands, productImages, setProductImages,
}: ProductSetupProps) {
  const [newType, setNewType] = useState("");
  const [newValues, setNewValues] = useState("");
  const [valueDrafts, setValueDrafts] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const shortId = Date.now().toString().slice(-6);

  const updateProduct = <K extends keyof ProductSetupData>(field: K, value: ProductSetupData[K]) =>
    setProduct((old) => ({ ...old, [field]: value }));

  const addType = () => {
    const name = newType.trim();
    const values = newValues.split(",").map((v) => v.trim()).filter(Boolean);
    if (!name || !values.length) { message.warning("Enter type name and values."); return; }
    setTypes((old) => [...old, { id: `${slug(name)}-${shortId}`, name, display: "button" as const, values }]);
    setNewType("");
    setNewValues("");
    setValueImages((old) => { const next = { ...old }; values.forEach((v) => { if (!next[v]) next[v] = ""; }); return next; });
  };

  const moveType = (index: number, direction: number) => {
    setTypes((old) => {
      const next = [...old];
      const target = index + direction;
      if (target < 0 || target >= next.length) return old;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const addValue = (typeId: string) => {
    const value = valueDrafts[typeId]?.trim();
    if (!value) return;
    setTypes((old) => old.map((type) =>
      type.id === typeId ? { ...type, values: Array.from(new Set([...type.values, value])) } : type));
    setEffects((old) => ({ ...old, [`${typeId}:${value}`]: 0 }));
    setValueImages((old) => ({ ...old, [value]: "" }));
    setValueDrafts((old) => ({ ...old, [typeId]: "" }));
  };

  const warning = product.startQty < product.minQty
    ? "Start quantity cannot be less than minimum."
    : product.stepQty <= 0
      ? "Increment must be 1 or greater."
      : (product.startQty - product.minQty) % product.stepQty !== 0
        ? "Start quantity does not match increment rule."
        : "";

  const toTree = (items: any[]): any[] =>
    items.map((i) => ({ title: i.name, value: i.id, key: i.id, children: i.children?.length ? toTree(i.children) : [] }));

  const handleProductImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductImages((old) => [...old, {
          url: e.target?.result as string,
          altText: file.name,
          isPrimary: old.length === 0,
          sortOrder: old.length,
          productId: "",
        }]);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch { setUploading(false); }
    return false;
  };

  const removeProductImage = (index: number) => {
    setProductImages((old) => old.filter((_, i) => i !== index));
  };

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} xl={16}>
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          <div className="form-card">
            <Title level={5} style={{ marginBottom: 20, color: "var(--text-primary)" }}>
              <FaStar style={{ color: "var(--primary)", marginRight: 8 }} />Product Information
            </Title>
            <Form layout="vertical">
              <Row gutter={[16, 0]}>
                <Col xs={24} md={12} xl={8}>
                  <Form.Item label="Product Name" required>
                    <Input size="large" value={product.name}
                      onChange={(e) => updateProduct("name", e.target.value)} placeholder="Enter product name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} xl={8}>
                  <Form.Item label="Category" required>
                    <TreeSelect size="large" treeData={toTree(categories || [])} treeDefaultExpandAll
                      labelInValue allowClear
                      value={product.categoryId ? { value: product.categoryId, label: product.category || "" } : undefined}
                      placeholder="Select category"
                      onChange={(value: any) => {
                        updateProduct("categoryId", value?.value || null);
                        updateProduct("category", value?.label || "");
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} xl={8}>
                  <Form.Item label="Brand">
                    <Select size="large" allowClear placeholder="Select brand"
                      value={product.brandId || undefined}
                      onChange={(value) => updateProduct("brandId", value)}>
                      {(brands || []).map((b) => (
                        <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} xl={8}>
                  <Form.Item label="Unit">
                    <Select size="large" value={product.unit} allowClear
                      onChange={(value) => updateProduct("unit", value)}
                      options={UnitProduct.map((u: any) => ({ value: u.id, label: u.value }))} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} xl={8}>
                  <Form.Item label="Base Price" required>
                    <InputNumber size="large" style={{ width: "100%" }} min={0} step={0.01}
                      value={product.basePrice}
                      formatter={(v: any) => v ? `${v}`.replace(".", ",") : ""}
                      parser={(v: any) => v?.replace(",", ".") ?? ""}
                      onChange={(value) => updateProduct("basePrice", Number(value || 0))} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} xl={8}>
                  <Form.Item label="VAT %">
                    <InputNumber size="large" style={{ width: "100%" }} min={0} max={100}
                      value={product.vatRate}
                      onChange={(value) => updateProduct("vatRate", Number(value || 0))} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Min Order Qty">
                    <InputNumber size="large" style={{ width: "100%" }} min={1} value={product.minQty}
                      onChange={(value) => updateProduct("minQty", Number(value || 0))} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Start Qty">
                    <InputNumber size="large" style={{ width: "100%" }} min={1} value={product.startQty}
                      onChange={(value) => updateProduct("startQty", Number(value || 0))} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Increment Step">
                    <InputNumber size="large" style={{ width: "100%" }} min={1} value={product.stepQty}
                      onChange={(value) => updateProduct("stepQty", Number(value || 0))} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>

          <div className="form-card">
            <Title level={5} style={{ marginBottom: 20, color: "var(--text-primary)" }}>
              <FaImage style={{ color: "var(--primary)", marginRight: 8 }} />Product Images
            </Title>
            <Row gutter={[12, 12]}>
              {productImages.map((img, idx) => (
                <Col key={idx}>
                  <div style={{ position: "relative", width: 100, height: 100, borderRadius: 12, overflow: "hidden",
                    border: img.isPrimary ? "3px solid var(--primary)" : "2px solid var(--border-light)" }}>
                    <img src={img.url} alt={img.altText} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {img.isPrimary && <Tag color="orange" style={{ position: "absolute", top: 4, left: 4, fontSize: 10 }}>Primary</Tag>}
                    <Tooltip title="Remove"><Button size="small" danger type="text" icon={<FaTrash />}
                      style={{ position: "absolute", top: 4, right: 4 }} onClick={() => removeProductImage(idx)} /></Tooltip>
                  </div>
                </Col>
              ))}
              <Col>
                <Upload beforeUpload={handleProductImageUpload} showUploadList={false} accept="image/*">
                  <Tooltip title="Upload product images">
                    <div style={{ width: 100, height: 100, borderRadius: 12, border: "2px dashed var(--border)",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", background: "var(--bg-subtle)" }}>
                      {uploading ? <Spin /> : <><PlusOutlined style={{ fontSize: 24, color: "var(--text-tertiary)" }} />
                        <Text style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>Upload</Text></>}
                    </div>
                  </Tooltip>
                </Upload>
              </Col>
            </Row>
          </div>

          <div className="form-card">
            <Title level={5} style={{ marginBottom: 20, color: "var(--text-primary)" }}>
              <FaMagic style={{ color: "var(--primary)", marginRight: 8 }} />Variant Types
            </Title>
            <div style={{ padding: 16, background: "var(--bg-subtle)", borderRadius: 12, marginBottom: 20 }}>
              <Row gutter={[12, 12]} align="middle">
                <Col xs={24} sm={8}>
                  <Input size="large" placeholder="e.g. Color" value={newType}
                    onChange={(e) => setNewType(e.target.value)} />
                </Col>
                <Col xs={24} sm={10}>
                  <Input size="large" placeholder="e.g. Red, Blue, Green" value={newValues}
                    onChange={(e) => setNewValues(e.target.value)} />
                </Col>
                <Col xs={12} sm={3}>
                  <Button size="large" type="primary" icon={<FaPlus />} onClick={addType} block>Add</Button>
                </Col>
                <Col xs={12} sm={3}>
                  <Button size="large" icon={<FaMagic />} onClick={generate} block>Generate ({rowsCount})</Button>
                </Col>
              </Row>
            </div>
            <Row gutter={[16, 16]}>
              {types.map((type, index) => (
                <Col xs={24} lg={12} key={type.id}>
                  <Card size="small" style={{ borderRadius: 12, border: "1px solid var(--border-light)" }}>
                    <Space direction="vertical" size={10} style={{ width: "100%" }}>
                      <Space.Compact style={{ width: "100%" }}>
                        <Input value={type.name}
                          onChange={(e) => setTypes((old) => old.map((item) =>
                            item.id === type.id ? { ...item, name: e.target.value } : item))} />
                        <Tooltip title="Move up"><Button icon={<FaArrowUp />} disabled={index === 0} onClick={() => moveType(index, -1)} /></Tooltip>
                        <Tooltip title="Move down"><Button icon={<FaArrowDown />} disabled={index === types.length - 1} onClick={() => moveType(index, 1)} /></Tooltip>
                        <Popconfirm title="Delete?" onConfirm={() => setTypes((old) => old.filter((item) => item.id !== type.id))}>
                          <Tooltip title="Delete"><Button danger icon={<FaTrash />} /></Tooltip>
                        </Popconfirm>
                      </Space.Compact>
                      <Select value={type.display} style={{ width: "100%" }}
                        onChange={(value) => setTypes((old) => old.map((item) =>
                          item.id === type.id ? { ...item, display: value } : item))}
                        options={[{ value: "button", label: "Button" }, { value: "dropdown", label: "Dropdown" }, { value: "image", label: "Image" }]} />
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {type.values.map((value) => {
                          const key = `${type.id}:${value}`;
                          return (
                            <div key={key} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", background: "var(--bg-subtle)", borderRadius: 8 }}>
                              <Tag style={{ margin: 0 }}>{value}</Tag>
                              <Tooltip title="Price effect">
                                <InputNumber size="small" style={{ width: 80 }} value={effects[key] || 0}
                                  onChange={(v) => setEffects((old) => ({ ...old, [key]: Number(v || 0) }))}
                                  placeholder="Effect" addonBefore="SAR" />
                              </Tooltip>
                              <Input size="small" style={{ width: 120 }} placeholder="Image URL"
                                value={valueImages[value] || ""}
                                onChange={(e) => setValueImages((old) => ({ ...old, [value]: e.target.value }))} />
                              <Tooltip title="Remove">
                                <Button danger size="small" icon={<FaTrash />}
                                  onClick={() => setTypes((old) => old.map((item) =>
                                    item.id === type.id ? { ...item, values: item.values.filter((x) => x !== value) } : item))} />
                              </Tooltip>
                            </div>
                          );
                        })}
                      </div>
                      <Input.Search size="small" placeholder="Add value..." value={valueDrafts[type.id] || ""}
                        onChange={(e) => setValueDrafts((old) => ({ ...old, [type.id]: e.target.value }))}
                        enterButton={<FaPlus />} onSearch={() => addValue(type.id)} />
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
            {warning && <div style={{ marginTop: 12, color: "var(--error)", fontSize: 13 }}>{warning}</div>}
          </div>

          <div className="form-card">
            <Title level={5} style={{ marginBottom: 16, color: "var(--text-primary)" }}>Properties</Title>
            <div style={{ borderRadius: 12, border: "1px solid var(--border-light)", overflow: "hidden" }}>
              {product.properties?.map((item, index) => (
                <Row key={index} gutter={[8, 8]} align="middle"
                  style={{ padding: "8px 12px", borderBottom: index < product.properties.length - 1 ? "1px solid var(--border-light)" : "none",
                    background: index % 2 === 0 ? "var(--bg-card)" : "transparent" }}>
                  <Col flex="1">
                    <Input variant="borderless" placeholder="Key (e.g. Weight)" value={item.key}
                      onChange={(e) => setProduct((prev) => ({ ...prev, properties: prev.properties.map((p, i) => i === index ? { ...p, key: e.target.value } : p) }))} />
                  </Col>
                  <Col flex="1">
                    <Input variant="borderless" placeholder="Value (e.g. 500g)" value={item.value}
                      onChange={(e) => setProduct((prev) => ({ ...prev, properties: prev.properties.map((p, i) => i === index ? { ...p, value: e.target.value } : p) }))} />
                  </Col>
                  <Col flex="40px" style={{ textAlign: "center" }}>
                    <Button type="text" danger icon={<MinusCircleOutlined />}
                      onClick={() => setProduct((prev) => ({ ...prev, properties: prev.properties.filter((_, i) => i !== index) }))} />
                  </Col>
                </Row>
              ))}
            </div>
            <Button type="dashed" style={{ marginTop: 12 }}
              onClick={() => setProduct((prev) => ({ ...prev, properties: [...prev.properties, { key: "", value: "" }] }))}
              icon={<PlusOutlined />}>Add Property</Button>
          </div>

          <div className="form-card">
            <Title level={5} style={{ marginBottom: 16, color: "var(--text-primary)" }}>Description</Title>
            <TinyEditor data={{ name: "description" }} value={product.description}
              onChange={(val: string) => updateProduct("description", val)} />
          </div>
        </Space>
      </Col>

      <Col xs={24} xl={8}>
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          <Card style={{ borderRadius: 16, textAlign: "center", background: "var(--gradient-card-1)", border: "none" }}>
            <Text type="secondary">Base Price</Text>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--primary)" }}>{formatMoney(product.basePrice)}</div>
          </Card>
          <Card style={{ borderRadius: 16, textAlign: "center", background: "var(--gradient-card-2)", border: "none" }}>
            <Text type="secondary">Variant Types</Text>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--secondary)" }}>{types.length}</div>
          </Card>
          <Card style={{ borderRadius: 16, textAlign: "center", background: "var(--gradient-card-3)", border: "none" }}>
            <Text type="secondary">Combinations</Text>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--info)" }}>{rowsCount}</div>
          </Card>
          <Card style={{ borderRadius: 16, textAlign: "center", background: "var(--gradient-card-4)", border: "none" }}>
            <Text type="secondary">Images</Text>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--purple)" }}>{productImages.length}</div>
          </Card>
        </Space>
      </Col>
    </Row>
  );
}

export default ProductSetup;
