"use client";

import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  ExpandOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "@repo/localization";
import dayjs from "dayjs";
import { currenciesService } from "./service";
import type {
  CurrencyItem,
  ExchangeRateItem,
  TenantCurrencySettings,
} from "./types";

const { Title, Text } = Typography;

interface CurrencySettingsPanelProps {
  projectId: string;
}

const EXCHANGE_RATE_SOURCES: Record<number, string> = {
  1: "System",
  2: "Manual",
  3: "European Central Bank",
  4: "Central Bank",
  5: "Open Exchange Rates",
  6: "Truncgil",
};

export default function CurrencySettingsPanel({ projectId }: CurrencySettingsPanelProps) {
  const t = useTranslations();

  const [catalog, setCatalog] = useState<CurrencyItem[]>([]);
  const [settings, setSettings] = useState<TenantCurrencySettings | null>(null);
  const [rates, setRates] = useState<ExchangeRateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // rate modal state
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<ExchangeRateItem | null>(null);
  const [rateFrom, setRateFrom] = useState<string | undefined>(undefined);
  const [rateTo, setRateTo] = useState<string | undefined>(undefined);
  const [rateValue, setRateValue] = useState<number | null>(null);
  const [rateSubmitting, setRateSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [catalogData, settingsData, ratesData] = await Promise.all([
        currenciesService.getCatalog(true),
        currenciesService.getTenantSettings(projectId),
        currenciesService.getExchangeRates(),
      ]);
      setCatalog(catalogData);
      setSettings(settingsData);
      setRates(ratesData.filter((r) => r.isCurrent));
    } catch {
      message.error(t("settings.currencies.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [projectId, t]);

  useEffect(() => {
    load();
  }, [load]);

  const currencyOptions = useMemo(
    () =>
      catalog.map((c) => ({
        value: c.code,
        label: (
          <Space>
            <span>{c.flagIcon}</span>
            <span>
              {c.code} - {c.nameEn}
            </span>
            <Text type="secondary">({c.symbol})</Text>
          </Space>
        ),
      })),
    [catalog],
  );

  const enabledMembers = useMemo(() => settings?.enabledCurrencies ?? [], [settings]);
  const enabledCodes = useMemo(
    () => new Set(enabledMembers.map((c) => c.currencyCode)),
    [enabledMembers],
  );

  const availableToEnable = useMemo(
    () => catalog.filter((c) => !enabledCodes.has(c.code) && c.isActive),
    [catalog, enabledCodes],
  );

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await currenciesService.updateTenantSettings(
        {
          baseCurrencyCode: settings.baseCurrencyCode,
          allowMultiCurrency: settings.allowMultiCurrency,
          autoUpdateExchangeRates: settings.autoUpdateExchangeRates,
          exchangeRateProvider: settings.exchangeRateProvider,
          enabledCurrencies: enabledMembers.map((c) => ({
            currencyCode: c.currencyCode,
            isPaymentEnabled: c.isPaymentEnabled,
            customExchangeRate: c.customExchangeRate ?? null,
          })),
        },
        projectId,
      );
      setSettings(updated);
      message.success(t("settings.currencies.settingsSaved"));
    } catch {
      message.error(t("settings.currencies.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnabled = (code: string, enabled: boolean) => {
    setSettings((prev) => {
      if (!prev) return prev;
      if (enabled) {
        const currency = catalog.find((c) => c.code === code);
        if (!currency) return prev;
        return {
          ...prev,
          enabledCurrencies: [
            ...prev.enabledCurrencies,
            {
              id: crypto.randomUUID(),
              currencyCode: currency.code,
              nameAr: currency.nameAr,
              nameEn: currency.nameEn,
              symbol: currency.symbol,
              flagIcon: currency.flagIcon,
              isPaymentEnabled: true,
              customExchangeRate: null,
              effectiveExchangeRate: 1,
            },
          ],
        };
      }
      const next = prev.enabledCurrencies.filter((c) => c.currencyCode !== code);
      if (prev.baseCurrencyCode === code) {
        const replacement = next.length > 0 ? next[0] : null;
        return {
          ...prev,
          enabledCurrencies: replacement ? [{ ...replacement, isPaymentEnabled: true }] : [],
          baseCurrencyCode: replacement?.currencyCode ?? "",
        };
      }
      return { ...prev, enabledCurrencies: next };
    });
  };

  const currencyColumns = [
    {
      title: t("settings.currencies.flag"),
      dataIndex: "flagIcon",
      key: "flagIcon",
      width: 60,
      render: (flag: string) => <span style={{ fontSize: 24, lineHeight: 1 }}>{flag || "🏳️"}</span>,
    },
    {
      title: t("settings.currencies.code"),
      dataIndex: "currencyCode",
      key: "currencyCode",
      width: 110,
      render: (code: string) => (
        <Space>
          <Tag style={{ fontFamily: "monospace", borderRadius: 4 }}>{code}</Tag>
          {settings?.baseCurrencyCode === code && (
            <Tag color="gold" style={{ borderRadius: 4, fontWeight: 600 }}>
              {t("settings.currencies.base")}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: t("common.fields.name"),
      key: "name",
      width: 200,
      render: (_: unknown, record: (typeof enabledMembers)[number]) => (
        <Text strong>{record.nameEn}</Text>
      ),
    },
    {
      title: t("settings.currencies.symbol"),
      dataIndex: "symbol",
      key: "symbol",
      width: 80,
    },
    {
      title: t("settings.currencies.paymentEnabled"),
      dataIndex: "isPaymentEnabled",
      key: "isPaymentEnabled",
      width: 140,
      render: (enabled: boolean, record: (typeof enabledMembers)[number]) => (
        <Switch
          checked={enabled}
          size="small"
          checkedChildren={t("settings.currencies.on")}
          unCheckedChildren={t("settings.currencies.off")}
          onChange={(checked) => {
            setSettings((prev) =>
              prev
                ? {
                    ...prev,
                    enabledCurrencies: prev.enabledCurrencies.map((c) =>
                      c.currencyCode === record.currencyCode
                        ? { ...c, isPaymentEnabled: checked }
                        : c,
                    ),
                  }
                : prev,
            );
          }}
        />
      ),
    },
    {
      title: t("settings.currencies.effectiveRate"),
      dataIndex: "effectiveExchangeRate",
      key: "effectiveExchangeRate",
      width: 120,
      render: (rate: number) => (
        <Text style={{ fontFamily: "monospace" }}>
          {typeof rate === "number" ? rate.toFixed(4) : "—"}
        </Text>
      ),
    },
    {
      title: t("settings.currencies.actions"),
      key: "actions",
      width: 80,
      fixed: "right" as const,
      render: (_: unknown, record: (typeof enabledMembers)[number]) => (
        <Tooltip title={t("settings.currencies.disable")}>
          <Popconfirm
            title={t("settings.currencies.disableConfirm", { code: record.currencyCode })}
            onConfirm={() => handleToggleEnabled(record.currencyCode, false)}
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Tooltip>
      ),
    },
  ];

  const ratesColumns = [
    {
      title: t("settings.currencies.from"),
      dataIndex: "fromCurrency",
      key: "fromCurrency",
      width: 110,
      render: (code: string) => <Tag style={{ fontFamily: "monospace" }}>{code}</Tag>,
    },
    {
      title: t("settings.currencies.to"),
      dataIndex: "toCurrency",
      key: "toCurrency",
      width: 110,
      render: (code: string) => <Tag style={{ fontFamily: "monospace" }}>{code}</Tag>,
    },
    {
      title: t("settings.currencies.rate"),
      dataIndex: "rate",
      key: "rate",
      width: 140,
      render: (rate: number) => (
        <Text strong style={{ fontFamily: "monospace" }}>
          {typeof rate === "number" ? rate.toFixed(6) : "—"}
        </Text>
      ),
    },
    {
      title: t("settings.currencies.source"),
      dataIndex: "source",
      key: "source",
      width: 180,
      render: (source: number) => <Tag color="blue">{EXCHANGE_RATE_SOURCES[source] ?? source}</Tag>,
    },
    {
      title: t("settings.currencies.effectiveDate"),
      dataIndex: "effectiveDate",
      key: "effectiveDate",
      width: 120,
      render: (date: string) => (
        <Text type="secondary">{dayjs(date).format("MMM DD, YYYY")}</Text>
      ),
    },
    {
      title: t("settings.currencies.status"),
      dataIndex: "isCurrent",
      key: "isCurrent",
      width: 100,
      render: (current: boolean) =>
        current ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            {t("settings.currencies.active")}
          </Tag>
        ) : (
          <Tag>{t("settings.currencies.inactive")}</Tag>
        ),
    },
    {
      title: t("settings.currencies.actions"),
      key: "actions",
      width: 120,
      fixed: "right" as const,
      render: (_: unknown, record: ExchangeRateItem) => (
        <Space size="small">
          <Tooltip title={t("common.actions.edit")}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingRate(record);
                setRateFrom(record.fromCurrency);
                setRateTo(record.toCurrency);
                setRateValue(record.rate);
                setRateModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title={t("common.actions.delete")}>
            <Popconfirm
              title={t("settings.currencies.deleteRateConfirm")}
              onConfirm={async () => {
                try {
                  await currenciesService.deleteExchangeRate(record.id);
                  message.success(t("settings.currencies.rateDeleted"));
                  load();
                } catch {
                  message.error(t("settings.currencies.rateDeleteFailed"));
                }
              }}
            >
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const submitRate = async () => {
    if (!rateFrom || !rateTo) {
      message.warning(t("settings.currencies.selectBothCurrencies"));
      return;
    }
    if (rateFrom === rateTo) {
      message.warning(t("settings.currencies.sameCurrencyWarning"));
      return;
    }
    if (rateValue === null || rateValue <= 0) {
      message.warning(t("settings.currencies.ratePositiveWarning"));
      return;
    }
    setRateSubmitting(true);
    try {
      if (editingRate) {
        await currenciesService.updateExchangeRate(editingRate.id, { rate: rateValue });
      } else {
        await currenciesService.setExchangeRate(
          { fromCurrency: rateFrom, toCurrency: rateTo, rate: rateValue },
          projectId,
        );
      }
      message.success(t("settings.currencies.rateSaved"));
      setRateModalOpen(false);
      load();
    } catch {
      message.error(t("settings.currencies.rateSaveFailed"));
    } finally {
      setRateSubmitting(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await currenciesService.syncExchangeRates();
      message.success(
        t("settings.currencies.syncSuccess", {
          upserted: result.upsertedRates,
          skipped: result.skippedUnchanged + result.skippedUnknownCurrency,
        }),
      );
      load();
    } catch {
      message.error(t("settings.currencies.syncFailed"));
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Configuration card */}
      <Card
        title={
          <Space>
            <ExpandOutlined style={{ color: "#F7931E" }} />
            <span>{t("settings.currencies.configuration")}</span>
          </Space>
        }
        style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
      >
        <Form layout="vertical">
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12} lg={6}>
              <Form.Item label={t("settings.currencies.baseCurrency")}>
                <Select
                  showSearch
                  value={settings?.baseCurrencyCode}
                  onChange={(value) =>
                    setSettings((prev) => (prev ? { ...prev, baseCurrencyCode: value } : prev))
                  }
                  options={currencyOptions.filter((o) => enabledCodes.has(o.value))}
                  style={{ width: "100%" }}
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Form.Item label={t("settings.currencies.allowMultiCurrency")}>
                <Switch
                  checked={settings?.allowMultiCurrency ?? false}
                  onChange={(checked) =>
                    setSettings((prev) => (prev ? { ...prev, allowMultiCurrency: checked } : prev))
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Form.Item label={t("settings.currencies.autoUpdate")}>
                <Switch
                  checked={settings?.autoUpdateExchangeRates ?? false}
                  onChange={(checked) =>
                    setSettings((prev) =>
                      prev ? { ...prev, autoUpdateExchangeRates: checked } : prev,
                    )
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Form.Item label={t("settings.currencies.provider")}>
                <Select
                  value={settings?.exchangeRateProvider}
                  onChange={(value) =>
                    setSettings((prev) => (prev ? { ...prev, exchangeRateProvider: value } : prev))
                  }
                  options={[
                    { value: 2, label: "Manual" },
                    { value: 3, label: "European Central Bank" },
                    { value: 4, label: "Central Bank" },
                    { value: 5, label: "Open Exchange Rates" },
                    { value: 6, label: "Truncgil" },
                  ]}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={handleSaveSettings}
              style={{ borderRadius: 6 }}
            >
              {t("settings.currencies.saveSettings")}
            </Button>
          </Row>
        </Form>
      </Card>

      {/* Enabled currencies card */}
      <Card
        title={
          <Space>
            <Title level={5} style={{ margin: 0 }}>
              {t("settings.currencies.supportedCurrencies")}
            </Title>
            <Select
              placeholder={t("settings.currencies.addCurrency")}
              size="small"
              value={undefined}
              onChange={(code: string) => handleToggleEnabled(code, true)}
              options={availableToEnable.map((c) => ({
                value: c.code,
                label: (
                  <Space>
                    <span>{c.flagIcon}</span>
                    <span>
                      {c.code} - {c.nameEn}
                    </span>
                  </Space>
                ),
              }))}
              style={{ minWidth: 220 }}
              suffixIcon={<PlusOutlined />}
              disabled={availableToEnable.length === 0}
            />
          </Space>
        }
        style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
      >
        <Table
          columns={currencyColumns}
          dataSource={enabledMembers}
          rowKey="currencyCode"
          pagination={false}
          scroll={{ x: 800 }}
          size="middle"
        />
      </Card>

      {/* Exchange rates card */}
      <Card
        title={
          <Space>
            <Title level={5} style={{ margin: 0 }}>
              {t("settings.currencies.exchangeRates")}
            </Title>
          </Space>
        }
        extra={
          <Space>
            <Button
              type="default"
              icon={<SyncOutlined />}
              loading={syncing}
              onClick={handleSync}
              style={{ borderRadius: 6 }}
            >
              {t("settings.currencies.syncRates")}
            </Button>
            <Button
              type="primary"
              ghost
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRate(null);
                setRateFrom(undefined);
                setRateTo(undefined);
                setRateValue(null);
                setRateModalOpen(true);
              }}
              style={{ borderRadius: 6 }}
            >
              {t("settings.currencies.addRate")}
            </Button>
          </Space>
        }
        style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
      >
        <Table
          columns={ratesColumns}
          dataSource={rates}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 900 }}
          size="middle"
        />
      </Card>

      {/* Add / edit rate modal */}
      <Modal
        title={
          editingRate
            ? t("settings.currencies.editRate")
            : t("settings.currencies.addRate")
        }
        open={rateModalOpen}
        onCancel={() => setRateModalOpen(false)}
        onOk={submitRate}
        confirmLoading={rateSubmitting}
        width={440}
        destroyOnClose
      >
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("settings.currencies.from")} required>
                <Select
                  showSearch
                  value={rateFrom}
                  onChange={setRateFrom}
                  options={enabledMembers.map((c) => ({
                    value: c.currencyCode,
                    label: `${c.flagIcon} ${c.currencyCode}`,
                  }))}
                  style={{ width: "100%" }}
                  disabled={!!editingRate}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t("settings.currencies.to")} required>
                <Select
                  showSearch
                  value={rateTo}
                  onChange={setRateTo}
                  options={enabledMembers.map((c) => ({
                    value: c.currencyCode,
                    label: `${c.flagIcon} ${c.currencyCode}`,
                  }))}
                  style={{ width: "100%" }}
                  disabled={!!editingRate}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={t("settings.currencies.rate")} required>
            <InputNumber
              value={rateValue}
              onChange={(v) => setRateValue(v)}
              min={0}
              precision={8}
              style={{ width: "100%" }}
              placeholder="e.g. 3.75"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}