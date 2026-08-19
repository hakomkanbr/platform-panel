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
  GlobalOutlined,
  SearchOutlined,
  CheckCircleFilled,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { LANGUAGES, LANGUAGE_FLAGS, type ProjectLanguageDto } from "@repo/shared-types";
import type { OnboardingFormData } from "./types";

const { Title, Text } = Typography;

interface Step3LanguageSelectorProps {
  initialData: OnboardingFormData;
  projectLanguages?: ProjectLanguageDto[];
  onSubmit: (languageData: {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
    rtl: boolean;
  }) => Promise<void>;
  onBack: () => void;
  loading: boolean;
  error?: string | null;
}

export default function Step3LanguageSelector({
  initialData,
  projectLanguages = [],
  onSubmit,
  onBack,
  loading,
  error,
}: Step3LanguageSelectorProps) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCode, setSelectedCode] = useState<string>(
    initialData.defaultLanguageCode || "ar"
  );

  // Combine standard languages with any custom project languages
  const availableLanguages = useMemo(() => {
    const map = new Map<string, { code: string; name: string; nativeName: string; flag: string; rtl: boolean }>();

    // Seed defaults
    LANGUAGES.forEach((lang) => {
      map.set(lang.code.toLowerCase(), {
        code: lang.code,
        name: lang.name,
        nativeName: lang.nativeName,
        flag: LANGUAGE_FLAGS[lang.code] || "🏳️",
        rtl: lang.rtl === 1,
      });
    });

    // Add any existing project languages
    projectLanguages.forEach((pl) => {
      map.set(pl.code.toLowerCase(), {
        code: pl.code,
        name: pl.name,
        nativeName: pl.nativeName,
        flag: pl.flag || LANGUAGE_FLAGS[pl.code] || "🏳️",
        rtl: pl.rtl,
      });
    });

    return Array.from(map.values());
  }, [projectLanguages]);

  const filteredLanguages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return availableLanguages;
    return availableLanguages.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [availableLanguages, searchQuery]);

  const handleSelect = (lang: (typeof availableLanguages)[number]) => {
    setSelectedCode(lang.code);
  };

  const handleContinue = async () => {
    const chosen = availableLanguages.find(
      (l) => l.code.toLowerCase() === selectedCode.toLowerCase()
    );
    if (!chosen) return;

    await onSubmit({
      code: chosen.code,
      name: chosen.name,
      nativeName: chosen.nativeName,
      flag: chosen.flag,
      rtl: chosen.rtl,
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
            background: "#F5F3FF",
            color: "#7C3AED",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            marginBottom: 12,
          }}
        >
          <GlobalOutlined />
        </div>
        <Title level={3} style={{ margin: 0, fontWeight: 800, color: "#0F172A" }}>
          {t("settings.onboarding.language.title")}
        </Title>
        <Text type="secondary" style={{ fontSize: 14, marginTop: 4, display: "block" }}>
          {t("settings.onboarding.language.desc")}
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
          placeholder={t("settings.onboarding.language.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          size="large"
          style={{ borderRadius: 10 }}
        />
      </div>

      {/* Language Grid */}
      <div
        style={{
          maxHeight: 340,
          overflowY: "auto",
          paddingRight: 4,
          marginBottom: 24,
        }}
      >
        {filteredLanguages.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t("settings.onboarding.language.noLanguages")}
          />
        ) : (
          <Row gutter={[12, 12]}>
            {filteredLanguages.map((lang) => {
              const isSelected =
                lang.code.toLowerCase() === selectedCode.toLowerCase();
              return (
                <Col xs={24} sm={12} md={8} key={lang.code}>
                  <div
                    onClick={() => handleSelect(lang)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: `2px solid ${isSelected ? "#7C3AED" : "#F1F5F9"}`,
                      background: isSelected ? "#FAF5FF" : "#FFFFFF",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow: isSelected
                        ? "0 4px 12px rgba(124, 58, 237, 0.12)"
                        : "0 1px 3px rgba(0,0,0,0.02)",
                    }}
                  >
                    <Space size={12}>
                      <span style={{ fontSize: 28, lineHeight: 1 }}>
                        {lang.flag}
                      </span>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Text strong style={{ fontSize: 14, color: "#1E293B" }}>
                            {lang.nativeName}
                          </Text>
                          <Tag
                            style={{
                              fontSize: 10,
                              borderRadius: 4,
                              margin: 0,
                              background: "#F1F5F9",
                              border: "none",
                            }}
                          >
                            {lang.code.toUpperCase()}
                          </Tag>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {lang.name}
                          </Text>
                          <Tag
                            color={lang.rtl ? "purple" : "blue"}
                            style={{ fontSize: 9, borderRadius: 4, lineHeight: "16px", padding: "0 4px" }}
                          >
                            {lang.rtl ? "RTL" : "LTR"}
                          </Tag>
                        </div>
                      </div>
                    </Space>

                    {isSelected && (
                      <CheckCircleFilled
                        style={{ color: "#7C3AED", fontSize: 20 }}
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
