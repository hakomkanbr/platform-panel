"use client";

import React from "react";
import { Select, Typography, Space, Avatar } from "antd";
import { TeamOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;

interface Workspace {
  id: string;
  name: string;
  slug?: string;
}

interface WorkspaceSelectorProps {
  workspaces?: Workspace[];
  activeWorkspaceId?: string;
  onWorkspaceChange?: (workspace: Workspace) => void;
}

export function WorkspaceSelector({
  workspaces = [],
  activeWorkspaceId,
  onWorkspaceChange,
}: WorkspaceSelectorProps) {
  if (workspaces.length === 0) return null;

  const handleChange = (value: string | undefined) => {
    if (!value) return;
    const ws = workspaces.find((w) => w.id === value);
    if (ws) onWorkspaceChange?.(ws);
  };

  return (
    <Select
      value={activeWorkspaceId}
      placeholder="Workspace"
      onChange={handleChange}
      className="s2s-header-select s2s-workspace-select"
      style={{ minWidth: 160, maxWidth: 240 }}
      size="middle"
      optionLabelProp="label"
    >
      {workspaces.map((ws) => (
        <Option
          key={ws.id}
          value={ws.id}
          label={
            <Space>
              <Avatar size={20} icon={<TeamOutlined />} style={{ background: "#6366F1" }} />
              <Text>{ws.name}</Text>
            </Space>
          }
        >
          <Space>
            <Avatar size={24} icon={<TeamOutlined />} style={{ background: "#6366F1" }} />
            <Text strong>{ws.name}</Text>
          </Space>
        </Option>
      ))}
    </Select>
  );
}