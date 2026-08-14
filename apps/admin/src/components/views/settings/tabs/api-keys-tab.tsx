"use client";

import React from "react";
import { Alert } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import type { ProjectDetailDto } from "@repo/shared-types";
import { useTranslations } from "@repo/localization";
import ApiKeyTable from "@/components/api-keys/api-key-table";

interface ApiKeysTabProps {
  project: ProjectDetailDto;
}

export default function ApiKeysTab({ project }: ApiKeysTabProps) {
  const t = useTranslations();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "4px 0" }}>
      <Alert
        type="info"
        showIcon
        icon={<KeyOutlined />}
        message={t("settings.tabs.apiKeys")}
        description={t("settings.tabDescriptions.apiKeys")}
        style={{ borderRadius: 10, background: "#F8FAFC", borderColor: "#E2E8F0" }}
      />
      <ApiKeyTable projectId={project.id} projectName={project.name} />
    </div>
  );
}