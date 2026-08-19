"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  CalculatorOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PercentageOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { DataTable, DrawerForm } from "@repo/ui";
import { formatDateTime } from "@repo/utils";
import { useTranslations } from "@repo/localization";
import { CommerceShell } from "../../../components/CommerceShell";
import { getApiErrorMessage } from "../../../api/http";
import {
  useCalculateTax,
  useDeleteTaxClass,
  useDeleteTaxRate,
  useSaveTaxClass,
  useSaveTaxRate,
  useTaxClasses,
  useTaxRates,
  useToggleTaxClassStatus,
  useToggleTaxRateStatus,
} from "../../../hooks/useTaxes";
import type {
  TaxClassDto,
  TaxRateDto,
  TaxCalculationResult,
} from "../../../types/taxes";

const { Text, Title } = Typography;

const COMMON_COUNTRIES = [
  { code: "SA", nameAr: "المملكة العربية السعودية", nameEn: "Saudi Arabia", flag: "🇸🇦" },
  { code: "AE", nameAr: "الإمارات العربية المتحدة", nameEn: "United Arab Emirates", flag: "🇦🇪" },
  { code: "KW", nameAr: "الكويت", nameEn: "Kuwait", flag: "🇰🇼" },
  { code: "QA", nameAr: "قطر", nameEn: "Qatar", flag: "🇶🇦" },
  { code: "BH", nameAr: "البحرين", nameEn: "Bahrain", flag: "🇧🇭" },
  { code: "OM", nameAr: "عمان", nameEn: "Oman", flag: "🇴🇲" },
  { code: "EG", nameAr: "مصر", nameEn: "Egypt", flag: "🇪🇬" },
  { code: "JO", nameAr: "الأردن", nameEn: "Jordan", flag: "🇯🇴" },
  { code: "TR", nameAr: "تركيا", nameEn: "Turkey", flag: "🇹🇷" },
  { code: "US", nameAr: "الولايات المتحدة", nameEn: "United States", flag: "🇺🇸" },
  { code: "GB", nameAr: "المملكة المتحدة", nameEn: "United Kingdom", flag: "🇬🇧" },
];

export function TaxesPage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("classes");

  // Tax Classes State
  const [classPage, setClassPage] = useState(1);
  const [classPageSize, setClassPageSize] = useState(10);
  const [classSearch, setClassSearch] = useState("");
  const [classDrawerOpen, setClassDrawerOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<TaxClassDto | null>(null);
  const [classForm] = Form.useForm();

  // Tax Rates State
  const [ratePage, setRatePage] = useState(1);
  const [ratePageSize, setRatePageSize] = useState(10);
  const [rateClassFilter, setRateClassFilter] = useState<string | undefined>();
  const [rateCountryFilter, setRateCountryFilter] = useState<string | undefined>();
  const [rateDrawerOpen, setRateDrawerOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<TaxRateDto | null>(null);
  const [rateForm] = Form.useForm();

  // Simulator State
  const [simForm] = Form.useForm();
  const [simResult, setSimResult] = useState<TaxCalculationResult | null>(null);

  // Queries & Mutations
  const classesQuery = useTaxClasses({
    page: classPage,
    pageSize: classPageSize,
    search: classSearch || undefined,
  });
  const saveClass = useSaveTaxClass();
  const toggleClassStatus = useToggleTaxClassStatus();
  const deleteClass = useDeleteTaxClass();

  const ratesQuery = useTaxRates({
    page: ratePage,
    pageSize: ratePageSize,
    taxClassId: rateClassFilter,
    countryCode: rateCountryFilter,
  });
  const saveRate = useSaveTaxRate();
  const toggleRateStatus = useToggleTaxRateStatus();
  const deleteRate = useDeleteTaxRate();

  const calculateTax = useCalculateTax();

  // --- Handlers: Tax Class ---
  const openCreateClass = () => {
    setEditingClass(null);
    classForm.resetFields();
    classForm.setFieldsValue({ isDefault: false, displayOrder: 0 });
    setClassDrawerOpen(true);
  };

  const openEditClass = (record: TaxClassDto) => {
    setEditingClass(record);
    classForm.setFieldsValue({
      name: record.name,
      code: record.code,
      description: record.description,
      isDefault: record.isDefault,
      displayOrder: record.displayOrder ?? 0,
    });
    setClassDrawerOpen(true);
  };

  const onFinishClass = async (values: Record<string, unknown>) => {
    try {
      if (editingClass) {
        await saveClass.mutateAsync({
          id: editingClass.id,
          body: {
            name: values.name as string,
            code: values.code as string,
            description: values.description as string | undefined,
            isDefault: !!values.isDefault,
            displayOrder: Number(values.displayOrder ?? 0),
          },
        });
        message.success(t("pricing.taxes.classUpdated"));
      } else {
        await saveClass.mutateAsync({
          body: {
            name: values.name as string,
            code: values.code as string,
            description: values.description as string | undefined,
            isDefault: !!values.isDefault,
            displayOrder: Number(values.displayOrder ?? 0),
          },
        });
        message.success(t("pricing.taxes.classCreated"));
      }
      setClassDrawerOpen(false);
      classesQuery.refetch();
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  // --- Handlers: Tax Rate ---
  const openCreateRate = () => {
    setEditingRate(null);
    rateForm.resetFields();
    rateForm.setFieldsValue({
      countryCode: "SA",
      rate: 15,
      priority: 1,
      isCompound: false,
      isShippingTaxable: true,
      taxClassId: classesQuery.data?.data?.[0]?.id,
    });
    setRateDrawerOpen(true);
  };

  const openEditRate = (record: TaxRateDto) => {
    setEditingRate(record);
    rateForm.setFieldsValue({
      taxClassId: record.taxClassId,
      name: record.name,
      rate: record.rate,
      countryCode: record.countryCode,
      stateCode: record.stateCode,
      postalCode: record.postalCode,
      priority: record.priority ?? 1,
      isCompound: record.isCompound,
      isShippingTaxable: record.isShippingTaxable,
    });
    setRateDrawerOpen(true);
  };

  const onFinishRate = async (values: Record<string, unknown>) => {
    try {
      if (editingRate) {
        await saveRate.mutateAsync({
          id: editingRate.id,
          body: {
            taxClassId: values.taxClassId as string,
            name: values.name as string,
            rate: Number(values.rate),
            countryCode: (values.countryCode as string).toUpperCase(),
            stateCode: values.stateCode as string | undefined,
            postalCode: values.postalCode as string | undefined,
            priority: Number(values.priority ?? 1),
            isCompound: !!values.isCompound,
            isShippingTaxable: !!values.isShippingTaxable,
          },
        });
        message.success(t("pricing.taxes.rateUpdated"));
      } else {
        await saveRate.mutateAsync({
          body: {
            taxClassId: values.taxClassId as string,
            name: values.name as string,
            rate: Number(values.rate),
            countryCode: (values.countryCode as string).toUpperCase(),
            stateCode: values.stateCode as string | undefined,
            postalCode: values.postalCode as string | undefined,
            priority: Number(values.priority ?? 1),
            isCompound: !!values.isCompound,
            isShippingTaxable: !!values.isShippingTaxable,
          },
        });
        message.success(t("pricing.taxes.rateCreated"));
      }
      setRateDrawerOpen(false);
      ratesQuery.refetch();
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  // --- Handlers: Simulator ---
  const onSimulate = async (values: Record<string, unknown>) => {
    try {
      const res = await calculateTax.mutateAsync({
        taxClassId: values.taxClassId as string | undefined,
        amount: Number(values.amount ?? 0),
        countryCode: (values.countryCode as string || "SA").toUpperCase(),
        stateCode: values.stateCode as string | undefined,
        shippingAmount: Number(values.shippingAmount ?? 0),
        taxMode: Number(values.taxMode ?? 2),
      });
      setSimResult(res);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  // --- Columns: Classes ---
  const classColumns: TableColumnsType<TaxClassDto> = [
    {
      title: t("pricing.taxes.className"),
      key: "name",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
            {record.name}
            {record.isDefault && <Tag color="blue">{t("common.default")}</Tag>}
          </div>
          {record.description && (
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t("pricing.taxes.code"),
      dataIndex: "code",
      width: 140,
      render: (code) => <Tag color="geekblue">{code}</Tag>,
    },
    {
      title: t("pricing.taxes.ratesCount"),
      dataIndex: "ratesCount",
      width: 120,
      render: (count) => (
        <Tag color={count > 0 ? "cyan" : "default"}>
          {t("pricing.taxes.ratesCountBadge", { count: count ?? 0 })}
        </Tag>
      ),
    },
    {
      title: t("pricing.taxes.displayOrder"),
      dataIndex: "displayOrder",
      width: 100,
      render: (v) => v ?? 0,
    },
    {
      title: t("common.fields.status"),
      dataIndex: "isActive",
      width: 120,
      render: (isActive: boolean, record) => (
        <Switch
          checked={isActive}
          size="small"
          onChange={async (checked) => {
            try {
              await toggleClassStatus.mutateAsync({ id: record.id, isActive: checked });
              message.success(t("common.actions.statusUpdated"));
              classesQuery.refetch();
            } catch (e) {
              message.error(getApiErrorMessage(e));
            }
          }}
        />
      ),
    },
    {
      title: t("pricing.taxes.createdAt"),
      dataIndex: "createdAt",
      width: 150,
      render: (d) => (
        <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>
          {d ? formatDateTime(d) : "—"}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 110,
      render: (_, record) => (
        <Space>
          <Tooltip title={t("common.actions.edit")}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEditClass(record)}
            />
          </Tooltip>
          <Popconfirm
            title={t("pricing.taxes.deleteClassConfirm")}
            onConfirm={async () => {
              try {
                await deleteClass.mutateAsync(record.id);
                message.success(t("pricing.taxes.classDeleted"));
                classesQuery.refetch();
              } catch (e) {
                message.error(getApiErrorMessage(e));
              }
            }}
          >
            <Tooltip title={t("common.actions.delete")}>
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // --- Columns: Rates ---
  const rateColumns: TableColumnsType<TaxRateDto> = [
    {
      title: t("pricing.taxes.rateName"),
      key: "name",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.name}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            {record.taxClassName || t("pricing.taxes.standardClass")}
          </div>
        </div>
      ),
    },
    {
      title: t("pricing.taxes.ratePercent"),
      dataIndex: "rate",
      width: 110,
      render: (rate) => (
        <Tag color="green" style={{ fontWeight: 600, fontSize: 13 }}>
          {rate}%
        </Tag>
      ),
    },
    {
      title: t("pricing.taxes.country"),
      key: "location",
      width: 160,
      render: (_, record) => {
        const country = COMMON_COUNTRIES.find((c) => c.code === record.countryCode);
        return (
          <Space direction="vertical" size={0}>
            <span>
              {country?.flag} {record.countryCode} {country ? `(${country.nameAr})` : ""}
            </span>
            {record.stateCode && (
              <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                {t("pricing.taxes.state")}: {record.stateCode}
              </span>
            )}
          </Space>
        );
      },
    },
    {
      title: t("pricing.taxes.priority"),
      dataIndex: "priority",
      width: 90,
      render: (p) => p ?? 1,
    },
    {
      title: t("pricing.taxes.compound"),
      dataIndex: "isCompound",
      width: 100,
      render: (v) => (
        <Tag color={v ? "purple" : "default"}>
          {v ? t("pricing.taxes.compoundYes") : t("pricing.taxes.compoundNo")}
        </Tag>
      ),
    },
    {
      title: t("pricing.taxes.shippingTaxable"),
      dataIndex: "isShippingTaxable",
      width: 120,
      render: (v) => (
        <Tag color={v ? "blue" : "default"}>
          {v ? t("pricing.taxes.shippingYes") : t("pricing.taxes.shippingNo")}
        </Tag>
      ),
    },
    {
      title: t("common.fields.status"),
      dataIndex: "isActive",
      width: 100,
      render: (isActive: boolean, record) => (
        <Switch
          checked={isActive}
          size="small"
          onChange={async (checked) => {
            try {
              await toggleRateStatus.mutateAsync({ id: record.id, isActive: checked });
              message.success(t("common.actions.statusUpdated"));
              ratesQuery.refetch();
            } catch (e) {
              message.error(getApiErrorMessage(e));
            }
          }}
        />
      ),
    },
    {
      title: "",
      key: "actions",
      width: 110,
      render: (_, record) => (
        <Space>
          <Tooltip title={t("common.actions.edit")}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEditRate(record)}
            />
          </Tooltip>
          <Popconfirm
            title={t("pricing.taxes.deleteRateConfirm")}
            onConfirm={async () => {
              try {
                await deleteRate.mutateAsync(record.id);
                message.success(t("pricing.taxes.rateDeleted"));
                ratesQuery.refetch();
              } catch (e) {
                message.error(getApiErrorMessage(e));
              }
            }}
          >
            <Tooltip title={t("common.actions.delete")}>
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <CommerceShell
      title={t("pricing.taxes.title")}
      description={t("pricing.taxes.description")}
      breadcrumbs={[
        { title: t("pricing.title"), href: "/admin/pricing" },
        { title: t("pricing.taxes.title") },
      ]}
      actions={
        activeTab === "classes" ? (
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateClass}>
            {t("pricing.taxes.newClass")}
          </Button>
        ) : activeTab === "rates" ? (
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateRate}>
            {t("pricing.taxes.newRate")}
          </Button>
        ) : null
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "classes",
            label: (
              <Space>
                <SafetyCertificateOutlined />
                {t("pricing.taxes.classesTab")}
              </Space>
            ),
            children: (
              <DataTable<TaxClassDto>
                columns={classColumns}
                dataSource={classesQuery.data?.data ?? []}
                rowKey="id"
                loading={classesQuery.isLoading}
                error={classesQuery.error ? new Error(getApiErrorMessage(classesQuery.error)) : undefined}
                onRefresh={classesQuery.refetch}
                total={classesQuery.data?.count ?? 0}
                page={classPage}
                pageSize={classPageSize}
                onPageChange={(p, ps) => {
                  setClassPage(p);
                  setClassPageSize(ps);
                }}
                searchable
                searchPlaceholder={t("pricing.taxes.searchClassesPlaceholder")}
                onSearch={(term) => {
                  setClassSearch(term);
                  setClassPage(1);
                }}
                title={t("pricing.taxes.classesCount", { count: classesQuery.data?.count ?? 0 })}
                emptyTitle={t("pricing.taxes.noClassesTitle")}
                emptyDescription={t("pricing.taxes.noClassesDesc")}
                emptyAction={{ label: t("pricing.taxes.newClass"), onClick: openCreateClass }}
              />
            ),
          },
          {
            key: "rates",
            label: (
              <Space>
                <PercentageOutlined />
                {t("pricing.taxes.ratesTab")}
              </Space>
            ),
            children: (
              <DataTable<TaxRateDto>
                columns={rateColumns}
                dataSource={ratesQuery.data?.data ?? []}
                rowKey="id"
                loading={ratesQuery.isLoading}
                error={ratesQuery.error ? new Error(getApiErrorMessage(ratesQuery.error)) : undefined}
                onRefresh={ratesQuery.refetch}
                total={ratesQuery.data?.count ?? 0}
                page={ratePage}
                pageSize={ratePageSize}
                onPageChange={(p, ps) => {
                  setRatePage(p);
                  setRatePageSize(ps);
                }}
                filters={
                  <Space wrap>
                    <Select
                      placeholder={t("pricing.taxes.filterByClass")}
                      allowClear
                      style={{ width: 180 }}
                      value={rateClassFilter}
                      onChange={(v) => {
                        setRateClassFilter(v);
                        setRatePage(1);
                      }}
                      options={(classesQuery.data?.data ?? []).map((c) => ({
                        value: c.id,
                        label: c.name,
                      }))}
                    />
                    <Select
                      placeholder={t("pricing.taxes.filterByCountry")}
                      allowClear
                      style={{ width: 180 }}
                      value={rateCountryFilter}
                      onChange={(v) => {
                        setRateCountryFilter(v);
                        setRatePage(1);
                      }}
                      options={COMMON_COUNTRIES.map((c) => ({
                        value: c.code,
                        label: `${c.flag} ${c.code} - ${c.nameAr}`,
                      }))}
                    />
                  </Space>
                }
                title={t("pricing.taxes.ratesCount", { count: ratesQuery.data?.count ?? 0 })}
                emptyTitle={t("pricing.taxes.noRatesTitle")}
                emptyDescription={t("pricing.taxes.noRatesDesc")}
                emptyAction={{ label: t("pricing.taxes.newRate"), onClick: openCreateRate }}
              />
            ),
          },
          {
            key: "simulator",
            label: (
              <Space>
                <CalculatorOutlined />
                {t("pricing.taxes.simulatorTab")}
              </Space>
            ),
            children: (
              <div style={{ marginTop: 12 }}>
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={10}>
                    <Card
                      title={
                        <Space>
                          <CalculatorOutlined style={{ color: "#1890ff" }} />
                          {t("pricing.taxes.simulatorFormTitle")}
                        </Space>
                      }
                      style={{ borderRadius: 12 }}
                    >
                      <Form
                        form={simForm}
                        layout="vertical"
                        initialValues={{
                          amount: 100,
                          shippingAmount: 20,
                          taxMode: 2,
                          countryCode: "SA",
                        }}
                        onFinish={onSimulate}
                      >
                        <Form.Item
                          name="amount"
                          label={t("pricing.taxes.simBaseAmount")}
                          rules={[{ required: true }]}
                        >
                          <InputNumber min={0} step={0.01} style={{ width: "100%" }} prefix="SAR" />
                        </Form.Item>
                        <Form.Item name="shippingAmount" label={t("pricing.taxes.simShippingAmount")}>
                          <InputNumber min={0} step={0.01} style={{ width: "100%" }} prefix="SAR" />
                        </Form.Item>
                        <Form.Item name="taxClassId" label={t("pricing.taxes.simTaxClass")}>
                          <Select
                            allowClear
                            placeholder={t("pricing.taxes.selectTaxClassPlaceholder")}
                            options={(classesQuery.data?.data ?? []).map((c) => ({
                              value: c.id,
                              label: `${c.name} (${c.code})`,
                            }))}
                          />
                        </Form.Item>
                        <Form.Item
                          name="taxMode"
                          label={t("pricing.taxes.simTaxMode")}
                          rules={[{ required: true }]}
                        >
                          <Radio.Group>
                            <Radio value={1}>{t("pricing.priceLists.inclusive")}</Radio>
                            <Radio value={2}>{t("pricing.priceLists.exclusive")}</Radio>
                          </Radio.Group>
                        </Form.Item>
                        <Form.Item
                          name="countryCode"
                          label={t("pricing.taxes.country")}
                          rules={[{ required: true }]}
                        >
                          <Select
                            showSearch
                            optionFilterProp="label"
                            options={COMMON_COUNTRIES.map((c) => ({
                              value: c.code,
                              label: `${c.flag} ${c.code} - ${c.nameAr} (${c.nameEn})`,
                            }))}
                          />
                        </Form.Item>
                        <Form.Item name="stateCode" label={t("pricing.taxes.state")}>
                          <Input placeholder="e.g. Riyadh, Dubai..." />
                        </Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          block
                          loading={calculateTax.isPending}
                          icon={<CalculatorOutlined />}
                        >
                          {t("pricing.taxes.calculateAction")}
                        </Button>
                      </Form>
                    </Card>
                  </Col>

                  <Col xs={24} lg={14}>
                    {simResult ? (
                      <Space direction="vertical" size={16} style={{ width: "100%" }}>
                        <Card
                          title={t("pricing.taxes.simResultTitle")}
                          style={{ borderRadius: 12, backgroundColor: "#fcfdfe" }}
                        >
                          <Row gutter={[16, 16]}>
                            <Col span={8}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {t("pricing.taxes.simSubtotal")}
                              </Text>
                              <Title level={4} style={{ margin: "4px 0 0" }}>
                                {simResult.subtotal.toFixed(2)} SAR
                              </Title>
                            </Col>
                            <Col span={8}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {t("pricing.taxes.simItemTax")}
                              </Text>
                              <Title level={4} style={{ margin: "4px 0 0", color: "#fa8c16" }}>
                                +{simResult.taxAmount.toFixed(2)} SAR
                              </Title>
                            </Col>
                            <Col span={8}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {t("pricing.taxes.simShippingTax")}
                              </Text>
                              <Title level={4} style={{ margin: "4px 0 0", color: "#fa8c16" }}>
                                +{simResult.shippingTaxAmount.toFixed(2)} SAR
                              </Title>
                            </Col>
                            <Col span={12}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {t("pricing.taxes.simEffectiveRate")}
                              </Text>
                              <Title level={3} style={{ margin: "4px 0 0", color: "#1890ff" }}>
                                {simResult.effectiveRate.toFixed(2)}%
                              </Title>
                            </Col>
                            <Col span={12}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {t("pricing.taxes.simGrandTotal")}
                              </Text>
                              <Title level={3} style={{ margin: "4px 0 0", color: "#52c41a" }}>
                                {simResult.totalWithTax.toFixed(2)} SAR
                              </Title>
                            </Col>
                          </Row>

                          <Divider style={{ margin: "16px 0" }} />

                          <Title level={5} style={{ fontSize: 14, marginBottom: 8 }}>
                            {t("pricing.taxes.simAppliedRulesTitle")} ({simResult.appliedTaxes.length})
                          </Title>
                          {simResult.appliedTaxes.length === 0 ? (
                            <Text type="secondary">{t("pricing.taxes.simNoTaxesApplied")}</Text>
                          ) : (
                            <Table
                              size="small"
                              pagination={false}
                              dataSource={simResult.appliedTaxes}
                              rowKey="taxRateId"
                              columns={[
                                {
                                  title: t("pricing.taxes.rateName"),
                                  dataIndex: "name",
                                  key: "name",
                                },
                                {
                                  title: t("pricing.taxes.ratePercent"),
                                  dataIndex: "rate",
                                  key: "rate",
                                  render: (r) => `${r}%`,
                                },
                                {
                                  title: t("pricing.taxes.taxAmount"),
                                  dataIndex: "taxAmount",
                                  key: "taxAmount",
                                  render: (a) => `${a.toFixed(2)} SAR`,
                                },
                                {
                                  title: t("pricing.taxes.compound"),
                                  dataIndex: "isCompound",
                                  key: "isCompound",
                                  render: (v) => (v ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : <CloseCircleOutlined style={{ color: "#d9d9d9" }} />),
                                },
                              ]}
                            />
                          )}
                        </Card>
                      </Space>
                    ) : (
                      <Card style={{ borderRadius: 12, textAlign: "center", padding: "48px 0" }}>
                        <CalculatorOutlined style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }} />
                        <Title level={4} style={{ color: "var(--text-secondary)" }}>
                          {t("pricing.taxes.simPromptTitle")}
                        </Title>
                        <Text type="secondary">{t("pricing.taxes.simPromptDesc")}</Text>
                      </Card>
                    )}
                  </Col>
                </Row>
              </div>
            ),
          },
        ]}
      />

      {/* Drawer: Tax Class */}
      <DrawerForm
        open={classDrawerOpen}
        onClose={() => setClassDrawerOpen(false)}
        title={editingClass ? t("pricing.taxes.editClassTitle") : t("pricing.taxes.createClassTitle")}
        width={480}
        form={classForm}
        loading={saveClass.isPending}
        onFinish={onFinishClass}
        submitLabel={editingClass ? t("common.actions.saveChanges") : t("pricing.taxes.submitCreateClass")}
      >
        <Form form={classForm} layout="vertical" onFinish={onFinishClass}>
          <Form.Item
            name="name"
            label={t("pricing.taxes.className")}
            rules={[{ required: true, message: t("common.fields.nameRequired") }]}
          >
            <Input placeholder={t("pricing.taxes.classNamePlaceholder")} />
          </Form.Item>
          <Form.Item
            name="code"
            label={t("pricing.taxes.code")}
            rules={[{ required: true, message: t("common.fields.keyRequired") }]}
          >
            <Input placeholder="standard, reduced, zero-rated..." />
          </Form.Item>
          <Form.Item name="description" label={t("common.fields.description")}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="displayOrder" label={t("pricing.taxes.displayOrder")}>
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isDefault"
                label={t("pricing.taxes.isDefault")}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </DrawerForm>

      {/* Drawer: Tax Rate */}
      <DrawerForm
        open={rateDrawerOpen}
        onClose={() => setRateDrawerOpen(false)}
        title={editingRate ? t("pricing.taxes.editRateTitle") : t("pricing.taxes.createRateTitle")}
        width={520}
        form={rateForm}
        loading={saveRate.isPending}
        onFinish={onFinishRate}
        submitLabel={editingRate ? t("common.actions.saveChanges") : t("pricing.taxes.submitCreateRate")}
      >
        <Form form={rateForm} layout="vertical" onFinish={onFinishRate}>
          <Form.Item
            name="taxClassId"
            label={t("pricing.taxes.classesTab")}
            rules={[{ required: true, message: t("pricing.taxes.selectClassRequired") }]}
          >
            <Select
              options={(classesQuery.data?.data ?? []).map((c) => ({
                value: c.id,
                label: `${c.name} (${c.code})`,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label={t("pricing.taxes.rateName")}
            rules={[{ required: true, message: t("common.fields.nameRequired") }]}
          >
            <Input placeholder={t("pricing.taxes.rateNamePlaceholder")} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rate"
                label={t("pricing.taxes.ratePercent")}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} max={100} step={0.1} addonAfter="%" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label={t("pricing.taxes.priority")}>
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="countryCode"
            label={t("pricing.taxes.country")}
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              options={COMMON_COUNTRIES.map((c) => ({
                value: c.code,
                label: `${c.flag} ${c.code} - ${c.nameAr} (${c.nameEn})`,
              }))}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="stateCode" label={t("pricing.taxes.state")}>
                <Input placeholder="e.g. Riyadh, Dubai..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="postalCode" label={t("pricing.taxes.postalCode")}>
                <Input placeholder="e.g. 11564..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isCompound"
                label={t("pricing.taxes.compound")}
                valuePropName="checked"
                extra={t("pricing.taxes.compoundHint")}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isShippingTaxable"
                label={t("pricing.taxes.shippingTaxable")}
                valuePropName="checked"
                extra={t("pricing.taxes.shippingTaxableHint")}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </DrawerForm>
    </CommerceShell>
  );
}
