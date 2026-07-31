"use client";

import React from "react";
import { Select, Typography, Space, Avatar } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import type { ApplicationDefinition } from "@repo/application-types";

const { Text } = Typography;
const { Option } = Select;

interface ApplicationSelectorProps {
  applications: ApplicationDefinition[];
}

export function ApplicationSelector({ applications }: ApplicationSelectorProps) {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string | undefined;
  const currentAppSlug = params?.appSlug as string | undefined;

  const handleChange = (appSlug: string | undefined) => {
    if (!appSlug || !projectId) return;
    router.push(`/admin/projects/${projectId}/${appSlug}`);
  };

  if (applications.length === 0) return null;

  return (
    <Select
      value={currentAppSlug ?? undefined}
      placeholder="Switch application..."
      onChange={handleChange}
      style={{ minWidth: 180, maxWidth: 280 }}
      size="middle"
      optionLabelProp="label"
    >
      {applications.map((app) => (
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
            </div>
          </div>
        </Option>
      ))}
    </Select>
  );
}
