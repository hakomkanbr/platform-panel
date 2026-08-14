"use client";

import { Space, Typography } from "antd";
import { GlobalOutlined, ShopOutlined } from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import type { ApiKeyScope } from "./types";

const { Text, Title } = Typography;

interface ScopeSummaryProps {
  scope: ApiKeyScope;
  projectName?: string;
}

export default function ScopeSummary({ scope, projectName }: ScopeSummaryProps) {
  const t = useTranslations();
  const isMarketplace = scope === "marketplace_projects";

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: 16,
          background: "#fafbfc",
        }}
      >
        <Space size="middle" align="start">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: isMarketplace ? "#f3f0ff" : "#e8f7ee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isMarketplace ? "#722ed1" : "#10b981",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {isMarketplace ? <GlobalOutlined /> : <ShopOutlined />}
          </div>
          <Space direction="vertical" size={2}>
            {isMarketplace ? (
              <>
                <Title level={5} style={{ margin: 0 }}>
                  {t("settings.apiKeys.scopeParticipatingStores")}
                </Title>
                <Text type="secondary">
                  {t("settings.apiKeys.scopeParticipatingStoresDesc")}
                </Text>
              </>
            ) : (
              <>
                <Title level={5} style={{ margin: 0 }}>
                  {t("settings.apiKeys.thisStore")}
                </Title>
                <Text type="secondary">
                  {projectName
                    ? t("settings.apiKeys.scopeThisStoreProjectDesc", { projectName })
                    : t("settings.apiKeys.scopeThisStoreDesc")}
                </Text>
              </>
            )}
          </Space>
        </Space>
      </div>
    </Space>
  );
}