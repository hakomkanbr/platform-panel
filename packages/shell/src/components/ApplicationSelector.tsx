"use client";

import React from "react";
import { Select, Typography, Space, Avatar } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { useAppRegistry } from "@repo/app-registry";
import { useShell } from "../context/ShellContext";

const { Text } = Typography;
const { Option } = Select;

interface ApplicationSelectorProps {
  onAppChange?: (appId: string) => void;
}

export function ApplicationSelector({ onAppChange }: ApplicationSelectorProps) {
  const { registeredApps, activeAppId, setActiveApp } = useAppRegistry();
  const { basePath } = useShell();

  const handleChange = (value: string | undefined) => {
    if (!value) return;
    setActiveApp(value);
    onAppChange?.(value);
  };

  if (registeredApps.length === 0) return null;

  return (
    <Select
      value={activeAppId ?? undefined}
      placeholder="Switch application..."
      onChange={handleChange}
      style={{ minWidth: 180, maxWidth: 280 }}
      size="middle"
      optionLabelProp="label"
    >
      {registeredApps.map((app) => (
        <Option
          key={app.id}
          value={app.id}
          label={
            <Space>
              {app.icon ? (
                <span style={{ fontSize: 16 }}>{app.icon}</span>
              ) : (
                <AppstoreOutlined style={{ color: "#009FE3" }} />
              )}
              <Text>{app.name}</Text>
            </Space>
          }
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar
              size={24}
              icon={app.icon || <AppstoreOutlined />}
              style={{ background: "#009FE3" }}
            />
            <div>
              <Text strong style={{ fontSize: 14 }}>{app.name}</Text>
              <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                {app.description}
              </Text>
            </div>
          </div>
        </Option>
      ))}
    </Select>
  );
}