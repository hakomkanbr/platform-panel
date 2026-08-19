"use client";

import React from "react";
import { Alert } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import type { ProjectDetailDto } from "@repo/shared-types";
import { useTranslations } from "@repo/localization";
import CurrencySettingsPanel from "@/components/currencies/currency-settings-panel";

interface CurrenciesTabProps {
  project: ProjectDetailDto;
}

export default function CurrenciesTab({ project }: CurrenciesTabProps) {
  const t = useTranslations();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "4px 0" }}>
      <Alert
        type="info"
        showIcon
        icon={<DollarOutlined />}
        message={t("settings.tabs.currencies")}
        description={t("settings.tabDescriptions.currencies")}
        style={{ borderRadius: 10, background: "#F8FAFC", borderColor: "#E2E8F0" }}
      />
      <CurrencySettingsPanel projectId={project.id} />
    </div>
  );
}