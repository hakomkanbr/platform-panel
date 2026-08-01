"use client";
import React from "react";
import { Tabs, Typography } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { KeyOutlined } from "@ant-design/icons";

const { Title } = Typography;

const settingsTabs = [
  { key: "api-keys", label: "API Keys", icon: <KeyOutlined /> },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = pathname.split("/").pop() || "api-keys";

  return (
    <div style={{ padding: 24, margin: "0 auto" }}>
      <Title level={3} style={{ marginBottom: 8 }}>Settings</Title>
      <Tabs
        activeKey={currentTab}
        items={settingsTabs.map((tab) => ({
          key: tab.key,
          label: (
            <span>
              {tab.icon}
              <span style={{ marginLeft: 8 }}>{tab.label}</span>
            </span>
          ),
        }))}
        onTabClick={(key) => router.push(`/panel/settings/${key}`)}
        style={{ marginBottom: 24 }}
      />
      {children}
    </div>
  );
}
