"use client";

import React from "react";
import { Alert } from "antd";
import { TranslationOutlined } from "@ant-design/icons";
import type { ProjectDetailDto } from "@repo/shared-types";
import { useTranslations } from "@repo/localization";
import LanguageTable from "@/components/languages/language-table";

interface LanguagesTabProps {
  project: ProjectDetailDto;
}

export default function LanguagesTab({ project }: LanguagesTabProps) {
  const t = useTranslations();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "4px 0" }}>
      <Alert
        type="info"
        showIcon
        icon={<TranslationOutlined />}
        message={t("settings.tabs.languages")}
        description={t("settings.tabDescriptions.languages")}
        style={{ borderRadius: 10, background: "#F8FAFC", borderColor: "#E2E8F0" }}
      />
      <LanguageTable projectId={project.id} />
    </div>
  );
}