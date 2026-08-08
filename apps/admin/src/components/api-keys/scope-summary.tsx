"use client";

import { Space, Typography } from "antd";
import { GlobalOutlined, ShopOutlined } from "@ant-design/icons";
import type { ApiKeyScope } from "./types";

const { Text, Title } = Typography;

interface ScopeSummaryProps {
  scope: ApiKeyScope;
  projectName?: string;
}

export default function ScopeSummary({ scope, projectName }: ScopeSummaryProps) {
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
                  Access participating stores
                </Title>
                <Text type="secondary">
                  This key can read data from all stores available in
                  Marketplace. The platform resolves the stores automatically.
                </Text>
              </>
            ) : (
              <>
                <Title level={5} style={{ margin: 0 }}>
                  This store
                </Title>
                <Text type="secondary">
                  {projectName
                    ? `Read data from "${projectName}" only. This key cannot access any other store.`
                    : "Read data from this store only. This key cannot access any other store."}
                </Text>
              </>
            )}
          </Space>
        </Space>
      </div>
    </Space>
  );
}