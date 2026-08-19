"use client";
import React, { useState, useMemo, Suspense } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Card,
  Input,
  Popconfirm,
  message,
  Tag,
  Tooltip,
  Modal,
  Form,
  Select,
  Switch,
  InputNumber,
  Spin,
  Row,
  Col,
  Statistic,
  Tabs,
  Empty,
  Divider,
  Alert,
  Badge,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  CalculatorOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  PercentageOutlined,
  AccountBookOutlined,
  StarOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useTaxClasses, useTaxRates, useCreateTaxClass, useUpdateTaxClass, useCreateTaxRate, useUpdateTaxRate } from "@/hooks/useTaxes";
import { taxesApi } from "@/lib/api/taxes";
import type { TaxClass, TaxRate, TaxClassFormData, TaxRateFormData, TaxCalculationResult } from "@/types";

const { Title, Text, Paragraph } = Typography;

const COMMON_COUNTRIES = [
  { value: "SA", label: "🇸🇦 Saudi Arabia (SA)" },
  { value: "AE", label: "🇦🇪 United Arab Emirates (AE)" },
  { value: "KW", label: "🇰🇼 Kuwait (KW)" },
  { value: "BH", label: "🇧🇭 Bahrain (BH)" },
  { value: "OM", label: "🇴🇲 Oman (OM)" },
  { value: "QA", label: "🇶🇦 Qatar (QA)" },
  { value: "EG", label: "🇪🇬 Egypt (EG)" },
  { value: "JO", label: "🇯🇴 Jordan (JO)" },
  { value: "US", label: "🇺🇸 United States (US)" },
  { value: "GB", label: "🇬🇧 United Kingdom (GB)" },
  { value: "*", label: "🌐 All Countries / Rest of World (*)" },
];

function TaxesContent() {
  const [activeTab, setActiveTab] = useState<string>("classes");
  const [classSearch, setClassSearch] = useState("");
  const [selectedClassIdForRates, setSelectedClassIdForRates] = useState<string | undefined>(undefined);

  // Queries
  const { classes, count: classesCount, loading: loadingClasses, refetch: refetchClasses } = useTaxClasses({ search: classSearch, pageSize: 50 });
  const { rates, count: ratesCount, loading: loadingRates, refetch: refetchRates } = useTaxRates({
    taxClassId: selectedClassIdForRates,
    pageSize: 100,
  });

  // Mutations
  const { create: createClass, submitting: creatingClass } = useCreateTaxClass();
  const { update: updateClass, submitting: updatingClass } = useUpdateTaxClass();
  const { create: createRate, submitting: creatingRate } = useCreateTaxRate();
  const { update: updateRate, submitting: updatingRate } = useUpdateTaxRate();

  // Modals state
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<TaxClass | null>(null);
  const [classForm] = Form.useForm();

  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<TaxRate | null>(null);
  const [rateForm] = Form.useForm();

  // Calculator state
  const [calcForm] = Form.useForm();
  const [calculating, setCalculating] = useState(false);
  const [calcResult, setCalcResult] = useState<TaxCalculationResult | null>(null);

  // KPIs
  const stats = useMemo(() => {
    const totalClasses = classes.length;
    const activeClasses = classes.filter((c) => c.isActive).length;
    const defaultClass = classes.find((c) => c.isDefault);
    const totalRates = rates.length;
    const activeRates = rates.filter((r) => r.isActive).length;
    return { totalClasses, activeClasses, defaultClass, totalRates, activeRates };
  }, [classes, rates]);

  // Tax Class Handlers
  const handleOpenCreateClass = () => {
    setEditingClass(null);
    classForm.resetFields();
    classForm.setFieldsValue({ isDefault: false, displayOrder: 0 });
    setClassModalOpen(true);
  };

  const handleOpenEditClass = (record: TaxClass) => {
    setEditingClass(record);
    classForm.setFieldsValue({
      name: record.name,
      code: record.code,
      description: record.description,
      isDefault: record.isDefault,
      displayOrder: record.displayOrder,
    });
    setClassModalOpen(true);
  };

  const handleSaveClass = async () => {
    try {
      const values = await classForm.validateFields();
      if (editingClass) {
        await updateClass(editingClass.id, values as TaxClassFormData);
        message.success("Tax class updated successfully");
      } else {
        await createClass(values as TaxClassFormData);
        message.success("Tax class created successfully");
      }
      setClassModalOpen(false);
      refetchClasses();
    } catch (e: any) {
      if (e?.message) message.error(e.message);
    }
  };

  const handleToggleClassActive = async (record: TaxClass, checked: boolean) => {
    try {
      await taxesApi.toggleClassStatus(record.id, checked);
      message.success(`Tax class ${checked ? "activated" : "deactivated"}`);
      refetchClasses();
    } catch (e: any) {
      message.error(e?.message || "Failed to update status");
    }
  };

  const handleDeleteClass = async (id: string) => {
    try {
      await taxesApi.deleteClass(id);
      message.success("Tax class deleted");
      refetchClasses();
      refetchRates();
    } catch (e: any) {
      message.error(e?.message || "Failed to delete tax class");
    }
  };

  // Tax Rate Handlers
  const handleOpenCreateRate = (taxClassId?: string) => {
    setEditingRate(null);
    rateForm.resetFields();
    rateForm.setFieldsValue({
      taxClassId: taxClassId || (classes[0]?.id ?? ""),
      rate: 15,
      countryCode: "SA",
      priority: 1,
      isCompound: false,
      isShippingTaxable: true,
    });
    setRateModalOpen(true);
  };

  const handleOpenEditRate = (record: TaxRate) => {
    setEditingRate(record);
    rateForm.setFieldsValue({
      taxClassId: record.taxClassId,
      name: record.name,
      rate: record.rate,
      countryCode: record.countryCode,
      stateCode: record.stateCode,
      postalCode: record.postalCode,
      priority: record.priority,
      isCompound: record.isCompound,
      isShippingTaxable: record.isShippingTaxable,
    });
    setRateModalOpen(true);
  };

  const handleSaveRate = async () => {
    try {
      const values = await rateForm.validateFields();
      if (editingRate) {
        await updateRate(editingRate.id, values as TaxRateFormData);
        message.success("Tax rate updated successfully");
      } else {
        await createRate(values as TaxRateFormData);
        message.success("Tax rate created successfully");
      }
      setRateModalOpen(false);
      refetchRates();
      refetchClasses();
    } catch (e: any) {
      if (e?.message) message.error(e.message);
    }
  };

  const handleToggleRateActive = async (record: TaxRate, checked: boolean) => {
    try {
      await taxesApi.toggleRateStatus(record.id, checked);
      message.success(`Tax rate ${checked ? "activated" : "deactivated"}`);
      refetchRates();
    } catch (e: any) {
      message.error(e?.message || "Failed to update rate status");
    }
  };

  const handleDeleteRate = async (id: string) => {
    try {
      await taxesApi.deleteRate(id);
      message.success("Tax rate deleted");
      refetchRates();
      refetchClasses();
    } catch (e: any) {
      message.error(e?.message || "Failed to delete tax rate");
    }
  };

  // Calculator
  const handleCalculateTax = async () => {
    try {
      const values = await calcForm.validateFields();
      setCalculating(true);
      const res = await taxesApi.calculate(values);
      setCalcResult(res);
    } catch (e: any) {
      if (e?.message) message.error(e.message);
    } finally {
      setCalculating(false);
    }
  };

  // Tables Columns
  const classColumns = [
    {
      title: "Tax Class Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: TaxClass) => (
        <Space direction="vertical" size={2}>
          <Space>
            <Text strong style={{ fontSize: 14 }}>{name}</Text>
            {record.isDefault && (
              <Tag color="gold" icon={<StarOutlined />}>Default Class</Tag>
            )}
          </Space>
          {record.description && (
            <Text type="secondary" style={{ fontSize: 12 }}>{record.description}</Text>
          )}
        </Space>
      ),
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code: string) => (
        <Tag color="blue" style={{ fontFamily: "monospace", fontSize: 12 }}>{code}</Tag>
      ),
    },
    {
      title: "Tax Rates",
      dataIndex: "ratesCount",
      key: "ratesCount",
      render: (count: number, record: TaxClass) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            setSelectedClassIdForRates(record.id);
            setActiveTab("rates");
          }}
        >
          {count} {count === 1 ? "Rate Rule" : "Rate Rules"} →
        </Button>
      ),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: TaxClass) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleClassActive(record, checked)}
        />
      ),
    },
    {
      title: "Order",
      dataIndex: "displayOrder",
      key: "displayOrder",
      width: 80,
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      render: (_: any, record: TaxClass) => (
        <Space>
          <Tooltip title="Add Rate for this Class">
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() => handleOpenCreateRate(record.id)}
            />
          </Tooltip>
          <Tooltip title="Edit Class">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenEditClass(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete tax class?"
            description="All attached tax rate rules will also be deleted."
            onConfirm={() => handleDeleteClass(record.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rateColumns = [
    {
      title: "Rate Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: TaxRate) => (
        <Space direction="vertical" size={2}>
          <Text strong>{name}</Text>
          {record.taxClassName && (
            <Tag color="cyan" style={{ fontSize: 11 }}>Class: {record.taxClassName}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Rate %",
      dataIndex: "rate",
      key: "rate",
      render: (rate: number) => (
        <Tag color="green" style={{ fontSize: 14, fontWeight: "bold", padding: "2px 8px" }}>
          {Number(rate).toFixed(2)}%
        </Tag>
      ),
    },
    {
      title: "Country / Region",
      key: "country",
      render: (_: any, record: TaxRate) => (
        <Space>
          <GlobalOutlined style={{ color: "#1677ff" }} />
          <Text>{record.countryCode === "*" ? "Global (*)" : record.countryCode}</Text>
          {record.stateCode && <Tag color="default">{record.stateCode}</Tag>}
          {record.postalCode && <Text type="secondary" style={{ fontSize: 11 }}>({record.postalCode})</Text>}
        </Space>
      ),
    },
    {
      title: "Attributes",
      key: "attributes",
      render: (_: any, record: TaxRate) => (
        <Space size={4} wrap>
          {record.isCompound && <Tag color="purple">Compound</Tag>}
          {record.isShippingTaxable && <Tag color="blue">Shipping Taxable</Tag>}
          <Tag color="default">Priority: {record.priority}</Tag>
        </Space>
      ),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: TaxRate) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleRateActive(record, checked)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 110,
      render: (_: any, record: TaxRate) => (
        <Space>
          <Tooltip title="Edit Rate">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenEditRate(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete tax rate?"
            onConfirm={() => handleDeleteRate(record.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 12px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            <AccountBookOutlined style={{ marginRight: 8, color: "#1677ff" }} />
            Taxes & VAT Management
          </Title>
          <Text type="secondary">
            Configure tax classes, regional VAT rates, compound taxation, and rules linked to catalog products.
          </Text>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              refetchClasses();
              refetchRates();
            }}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={activeTab === "rates" ? () => handleOpenCreateRate() : handleOpenCreateClass}
          >
            {activeTab === "rates" ? "New Tax Rate" : "New Tax Class"}
          </Button>
        </Space>
      </div>

      {/* KPI Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" style={{ borderRadius: 10 }}>
            <Statistic
              title="Tax Classes"
              value={stats.totalClasses}
              suffix={<Text type="secondary" style={{ fontSize: 12 }}>({stats.activeClasses} Active)</Text>}
              prefix={<AccountBookOutlined style={{ color: "#1677ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" style={{ borderRadius: 10 }}>
            <Statistic
              title="Tax Rate Rules"
              value={stats.totalRates}
              suffix={<Text type="secondary" style={{ fontSize: 12 }}>({stats.activeRates} Active)</Text>}
              prefix={<PercentageOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" style={{ borderRadius: 10 }}>
            <Statistic
              title="Default Tax Class"
              value={stats.defaultClass?.name || "None"}
              valueStyle={{ fontSize: 16, fontWeight: "bold" }}
              prefix={<StarOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" style={{ borderRadius: 10 }}>
            <Statistic
              title="Tax Calculation Engine"
              value="Active (Inclusive/Exclusive)"
              valueStyle={{ fontSize: 14, color: "#13c2c2" }}
              prefix={<RocketOutlined style={{ color: "#13c2c2" }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Card style={{ borderRadius: 12 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "classes",
              label: (
                <span>
                  <AccountBookOutlined /> Tax Classes ({classes.length})
                </span>
              ),
              children: (
                <div>
                  <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <Input
                      placeholder="Search tax classes..."
                      prefix={<SearchOutlined />}
                      value={classSearch}
                      onChange={(e) => setClassSearch(e.target.value)}
                      style={{ maxWidth: 320 }}
                      allowClear
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreateClass}>
                      Add Tax Class
                    </Button>
                  </div>
                  <Table
                    columns={classColumns}
                    dataSource={classes}
                    rowKey="id"
                    loading={loadingClasses}
                    pagination={{ pageSize: 15 }}
                    locale={{ emptyText: <Empty description="No tax classes configured yet." /> }}
                  />
                </div>
              ),
            },
            {
              key: "rates",
              label: (
                <span>
                  <PercentageOutlined /> Tax Rates & Rules ({rates.length})
                </span>
              ),
              children: (
                <div>
                  <div
                    style={{
                      marginBottom: 16,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <Space wrap>
                      <Select
                        placeholder="Filter by Tax Class"
                        value={selectedClassIdForRates}
                        onChange={setSelectedClassIdForRates}
                        allowClear
                        style={{ minWidth: 220 }}
                        options={[
                          { value: "", label: "All Tax Classes" },
                          ...classes.map((c) => ({ value: c.id, label: `${c.name} (${c.code})` })),
                        ]}
                      />
                      {selectedClassIdForRates && (
                        <Tag
                          closable
                          onClose={() => setSelectedClassIdForRates(undefined)}
                          color="blue"
                        >
                          Filtered by selected class
                        </Tag>
                      )}
                    </Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenCreateRate(selectedClassIdForRates)}>
                      Add Tax Rate
                    </Button>
                  </div>
                  <Table
                    columns={rateColumns}
                    dataSource={rates}
                    rowKey="id"
                    loading={loadingRates}
                    pagination={{ pageSize: 20 }}
                    locale={{ emptyText: <Empty description="No tax rates configured." /> }}
                  />
                </div>
              ),
            },
            {
              key: "simulator",
              label: (
                <span>
                  <CalculatorOutlined /> Tax Calculation Simulator
                </span>
              ),
              children: (
                <div style={{ maxWidth: 800, margin: "0 auto", padding: "16px 0" }}>
                  <Alert
                    message="Live Tax Calculation Tester"
                    description="Simulate cart/order totals against active tax rules for different countries, classes, and shipping rates."
                    type="info"
                    showIcon
                    style={{ marginBottom: 20 }}
                  />
                  <Card title="Simulation Parameters" size="small" style={{ marginBottom: 20 }}>
                    <Form
                      form={calcForm}
                      layout="vertical"
                      initialValues={{
                        amount: 100,
                        countryCode: "SA",
                        shippingAmount: 20,
                        taxClassId: classes.find((c) => c.isDefault)?.id || classes[0]?.id,
                      }}
                      onFinish={handleCalculateTax}
                    >
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="amount"
                            label="Taxable Subtotal Amount (SAR / USD)"
                            rules={[{ required: true, message: "Required" }]}
                          >
                            <InputNumber style={{ width: "100%" }} min={0} step={1} precision={2} />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="shippingAmount" label="Shipping Fee Amount">
                            <InputNumber style={{ width: "100%" }} min={0} step={1} precision={2} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="countryCode"
                            label="Destination Country (ISO2)"
                            rules={[{ required: true, message: "Required" }]}
                          >
                            <Select showSearch options={COMMON_COUNTRIES} />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="taxClassId" label="Target Tax Class">
                            <Select
                              options={classes.map((c) => ({
                                value: c.id,
                                label: `${c.name} ${c.isDefault ? "(Default)" : ""}`,
                              }))}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Button type="primary" htmlType="submit" loading={calculating} icon={<CalculatorOutlined />}>
                        Simulate Calculation
                      </Button>
                    </Form>
                  </Card>

                  {calcResult && (
                    <Card title="Calculation Breakdown" size="small" style={{ background: "rgba(22, 119, 255, 0.03)" }}>
                      <Row gutter={[16, 16]}>
                        <Col span={6}>
                          <Statistic title="Subtotal" value={calcResult.subtotal} precision={2} />
                        </Col>
                        <Col span={6}>
                          <Statistic title="Items Tax" value={calcResult.taxAmount} precision={2} valueStyle={{ color: "#52c41a" }} />
                        </Col>
                        <Col span={6}>
                          <Statistic title="Shipping Tax" value={calcResult.shippingTaxAmount} precision={2} valueStyle={{ color: "#13c2c2" }} />
                        </Col>
                        <Col span={6}>
                          <Statistic title="Grand Total" value={calcResult.totalWithTax} precision={2} valueStyle={{ color: "#1677ff", fontWeight: "bold" }} />
                        </Col>
                      </Row>
                      <Divider style={{ margin: "16px 0" }} />
                      <Text strong>Applied Tax Rules:</Text>
                      {calcResult.appliedTaxes?.length ? (
                        <div style={{ marginTop: 8 }}>
                          {calcResult.appliedTaxes.map((tax, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "6px 0",
                                borderBottom: "1px dashed rgba(0,0,0,0.08)",
                              }}
                            >
                              <Space>
                                <CheckCircleOutlined style={{ color: "#52c41a" }} />
                                <Text>{tax.name} ({tax.rate}%)</Text>
                                {tax.isCompound && <Tag color="purple">Compound</Tag>}
                                {tax.isShippingTaxable && <Tag color="blue">Applies on Shipping</Tag>}
                              </Space>
                              <Text strong>{Number(tax.taxAmount).toFixed(2)}</Text>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                          No specific tax rates matched this destination / tax class (0% tax applied).
                        </Text>
                      )}
                    </Card>
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Tax Class Modal */}
      <Modal
        title={editingClass ? "Edit Tax Class" : "Create New Tax Class"}
        open={classModalOpen}
        onOk={handleSaveClass}
        onCancel={() => setClassModalOpen(false)}
        confirmLoading={creatingClass || updatingClass}
        destroyOnClose
      >
        <Form form={classForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Class Name"
            rules={[{ required: true, message: "Please enter a tax class name" }]}
          >
            <Input placeholder="e.g. Standard VAT, Zero-Rated, Exempt" />
          </Form.Item>

          <Form.Item
            name="code"
            label="Class Code"
            rules={[{ required: true, message: "Please enter a unique code" }]}
          >
            <Input placeholder="e.g. STANDARD, REDUCED, EXEMPT" style={{ textTransform: "uppercase" }} />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Optional notes about when to apply this tax class" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="isDefault" label="Is Default Tax Class?" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="displayOrder" label="Display Order">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Tax Rate Modal */}
      <Modal
        title={editingRate ? "Edit Tax Rate Rule" : "Create New Tax Rate Rule"}
        open={rateModalOpen}
        onOk={handleSaveRate}
        onCancel={() => setRateModalOpen(false)}
        confirmLoading={creatingRate || updatingRate}
        destroyOnClose
      >
        <Form form={rateForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="taxClassId"
            label="Tax Class"
            rules={[{ required: true, message: "Please select a tax class" }]}
          >
            <Select
              options={classes.map((c) => ({
                value: c.id,
                label: `${c.name} (${c.code})`,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="Rate Name"
            rules={[{ required: true, message: "Please enter a rate name" }]}
          >
            <Input placeholder="e.g. KSA VAT 15%, UAE VAT 5%" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rate"
                label="Rate Percentage (%)"
                rules={[{ required: true, message: "Please enter percentage rate" }]}
              >
                <InputNumber min={0} max={100} step={0.01} precision={2} style={{ width: "100%" }} suffix="%" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="countryCode"
                label="Country Code"
                rules={[{ required: true, message: "Please select country" }]}
              >
                <Select showSearch options={COMMON_COUNTRIES} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="stateCode" label="State / Province Code (Optional)">
                <Input placeholder="e.g. RUH, DXB, CA (or leave empty for all)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="Calculation Priority">
                <InputNumber min={1} style={{ width: "100%" }} placeholder="1 = First" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="isCompound" label="Compound Tax (Calculate on subtotal + previous taxes)" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isShippingTaxable" label="Apply Tax to Shipping Fee" valuePropName="checked">
                <Switch defaultChecked />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default function TaxesPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <Spin size="large" />
        </div>
      }
    >
      <TaxesContent />
    </Suspense>
  );
}
