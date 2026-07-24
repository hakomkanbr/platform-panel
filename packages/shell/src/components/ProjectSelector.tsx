"use client";

import React from "react";
import { Select, Typography, Space, Avatar } from "antd";
import { FolderOutlined } from "@ant-design/icons";
import { useShell } from "../context/ShellContext";
import type { QuickProject } from "../context/ShellContext";

const { Text } = Typography;
const { Option } = Select;

interface ProjectSelectorProps {
  projects?: QuickProject[];
  loading?: boolean;
  onProjectChange?: (project: QuickProject) => void;
}

export function ProjectSelector({ projects: propProjects, loading, onProjectChange }: ProjectSelectorProps) {
  const { currentProject, setCurrentProject, projects: ctxProjects, projectsLoading: ctxLoading, basePath } = useShell();
  const projects = propProjects ?? ctxProjects;
  const isLoading = loading ?? ctxLoading;

  const handleChange = (value: string | undefined) => {
    if (!value) return;
    const project = projects.find((p) => p.id === value);
    if (project) {
      setCurrentProject(project);
      onProjectChange?.(project);
    }
  };

  if (isLoading || projects.length === 0) return null;

  return (
    <Select
      value={currentProject?.id ?? undefined}
      placeholder="Select project..."
      onChange={handleChange}
      allowClear
      style={{ minWidth: 200, maxWidth: 300 }}
      size="middle"
      optionLabelProp="label"
    >
      {projects.map((project) => (
        <Option
          key={project.id}
          value={project.id}
          label={
            <Space>
              <Avatar size={20} icon={<FolderOutlined />} style={{ background: "#F7931E" }} />
              <Text>{project.name}</Text>
            </Space>
          }
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar size={24} icon={<FolderOutlined />} style={{ background: project.color || "#F7931E" }} />
            <div>
              <Text strong style={{ fontSize: 14 }}>{project.name}</Text>
              {project.description && (
                <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                  {project.description}
                </Text>
              )}
            </div>
          </div>
        </Option>
      ))}
    </Select>
  );
}