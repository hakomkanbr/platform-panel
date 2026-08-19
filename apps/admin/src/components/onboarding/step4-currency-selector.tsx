"use client";

import React, { useState, useMemo } from "react";
import {
  Button,
  Typography,
  Space,
  Alert,
  Card,
  Input,
  Row,
  Col,
  Tag,
  Empty,
} from "antd";
import {
  DollarOutlined,
  SearchOutlined,
  CheckCircleFilled,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import type { CurrencyItem } from "@/components/currencies/types";
import type { OnboardingFormData } from "./types";

const { Title, Text } = Typography;

interface Step4CurrencySelectorProps {
  initialData: OnboardingFormData;
  currencyCatalog: CurrencyItem[];
  onSubmit: (currencyData: {
    id?: string;
    code: string;
    name: string;
    symbol: string;
    flag: string;
  }) => Promise<void>;
  onBack: () => void;
  loading: boolean;
  error?: string | null;
}

export default function Step4CurrencySelector({
  initialData,
  currencyCatalog = [],
  onSubmit,
  onBack,
  loading,
  error,
}: Step4CurrencySelectorProps) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCode, setSelectedCode] = useState<string>(
    initialData.defaultCurrencyCode || "SAR"
  );

  const filteredCurrencies = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return currencyCatalog;
    return currencyCatalog.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.nameAr.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [currencyCatalog, searchQuery]);

  const handleSelect = (c: CurrencyItem) => {
    setSelectedCode(c.code);
  };

  const handleContinue = async () => {
    const chosen = currencyCatalog.find(
      (c) => c.code.toLowerCase() === selectedCode.toLowerCase()
    );
    if (!chosen) return;

    await onSubmit({
      id: chosen.id,
      code: chosen.code,
      name: chosen.nameAr || chosen.nameEn,
      symbol: chosen.symbol,
      flag: chosen.flagIcon,
    });
  };

  return (
    <Card
      styles={{ body: { padding: 32 } }}
      style={{
        borderRadius: 16,
        border: "1px solid #E2E8F0",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        background: "#FFFFFF",
      }}
    >
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "#ECFDF5",
            color: "#059669",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            marginBottom: 12,
          }}
        >
          <DollarOutlined />
        </div>
        <Title level={3} style={{ margin: 0, fontWeight: 800, color: "#0F172A" }}>
          {t("settings.onboarding.currency.title")}
        </Title>
        <Text type="secondary" style={{ fontSize: 14, marginTop: 4, display: "block" }}>
          {t("settings.onboarding.currency.desc")}
        </Text>
      </div>

      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          style={{ marginBottom: 20, borderRadius: 8 }}
        />
      )}

      {/* Search Input */}
      <div style={{ marginBottom: 20 }}>
        <Input
          prefix={<SearchOutlined style={{ color: "#94A3B8" }} />}
          placeholder={t("settings.onboarding.currency.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          size="large"
          style={{ borderRadius: 10 }}
        />
      </div>

      {/* Currency Grid */}
      <div
        style={{
          maxHeight: 340,
          overflowY: "auto",
          paddingRight: 4,
          marginBottom: 24,
        }}
      >
        {filteredCurrencies.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t("settings.onboarding.currency.noCurrencies")}
          />
        ) : (
          <Row gutter={[12, 12]}>
            {filteredCurrencies.map((cur) => {
              const isSelected =
                cur.code.toLowerCase() === selectedCode.toLowerCase();
              return (
                <Col xs={24} sm={12} md={8} key={cur.code}>
                  <div
                    onClick={() => handleSelect(cur)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: `2px solid ${isSelected ? "#059669" : "#F1F5F9"}`,
                      background: isSelected ? "#F0FDF4" : "#FFFFFF",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow: isSelected
                        ? "0 4px 12px rgba(5, 150, 105, 0.12)"
                        : "0 1px 3px rgba(0,0,0,0.02)",
                    }}
                  >
                    <Space size={12}>
                      <span style={{ fontSize: 28, lineHeight: 1 }}>
                        {cur.flagIcon}
                      </span>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Text strong style={{ fontSize: 14, color: "#1E293B" }}>
                            {cur.nameAr || cur.nameEn}
                          </Text>
                          <Tag
                            style={{
                              fontSize: 10,
                              borderRadius: 4,
                              margin: 0,
                              background: "#F1F5F9",
                              border: "none",
                              fontFamily: "monospace",
                            }}
                          >
                            {cur.code}
                          </Tag>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {cur.nameEn}
                          </Text>
                          <Tag
                            color="gold"
                            style={{ fontSize: 11, fontWeight: 700, borderRadius: 4, lineHeight: "16px", padding: "0 6px" }}
                          >
                            {cur.symbol}
                          </Tag>
                        </div>
                      </div>
                    </Space>

                    {isSelected && (
                      <CheckCircleFilled
                        style={{ color: "#059669", fontSize: 20 }}
                      />
                    )}
                  </div>
                </Col>
              );
            })}
          </Row>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
        <Button
          onClick={onBack}
          disabled={loading}
          size="large"
          style={{ borderRadius: 10, minWidth: 120, fontWeight: 600, height: 46 }}
        >
          <Space>
            <ArrowLeftOutlined />
            <span>{t("settings.onboarding.buttons.back")}</span>
          </Space>
        </Button>

        <Button
          type="primary"
          onClick={handleContinue}
          loading={loading}
          disabled={loading || !selectedCode}
          size="large"
          style={{
            borderRadius: 10,
            minWidth: 160,
            fontWeight: 700,
            background: "#F7931E",
            borderColor: "#F7931E",
            height: 46,
          }}
        >
          <Space>
            <span>{t("settings.onboarding.buttons.saveAndContinue")}</span>
            <ArrowRightOutlined />
          </Space>
        </Button>
      </div>
    </Card>
  );
}
