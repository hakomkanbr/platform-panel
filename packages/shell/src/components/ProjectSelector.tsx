"use client";

import React from "react";
import { Select, Typography, Space, Avatar } from "antd";
import { FolderOutlined } from "@ant-design/icons";
import { useShell } from "../context/ShellContext";
import type { QuickProject } from "../context/ShellContext";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const { Text } = Typography;
const { Option } = Select;

interface ProjectSelectorProps {
  projects?: QuickProject[];
  loading?: boolean;
  onProjectChange?: (project: QuickProject) => void;
}

export function ProjectSelector({
  projects: propProjects,
  loading,
  onProjectChange,
}: ProjectSelectorProps) {
  const {
    currentProject,
    setCurrentProject,
    projects: ctxProjects,
    projectsLoading: ctxLoading,
    basePath,
  } = useShell();
  const router = useRouter();
  const projects = propProjects ?? ctxProjects;
  const isLoading = loading ?? ctxLoading;

  const handleChange = (value: string | undefined) => {
    console.info("valuevaluevalue : ", value);
    if (!value) {
      setCurrentProject(null);
      Cookies.remove("ProjectId");
      Cookies.remove("ProjectName");
      Cookies.remove("ProjectSlug");
      if (typeof window !== "undefined") {
        localStorage.removeItem("ProjectId");
        localStorage.removeItem("ProjectName");
        localStorage.removeItem("ProjectSlug");
      }
      router.refresh();
      return;
    }
    const project = projects.find((p) => p.id === value);
    if (project) {
      setCurrentProject(project);
      onProjectChange?.(project);
      Cookies.set("ProjectId", project.id);
      Cookies.set("ProjectName", project.name);
      if (project.slug) {
        Cookies.set("ProjectSlug", project.slug);
      } else {
        Cookies.remove("ProjectSlug");
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("ProjectId", project.id);
        localStorage.setItem("ProjectName", project.name);
        if (project.slug) localStorage.setItem("ProjectSlug", project.slug);
      }
    }

    setTimeout(() => {
      router.refresh();
    }, 1000);
  };

  React.useEffect(() => {
    if (!isLoading && projects.length === 1) {
      const singleProject = projects[0];
      if (singleProject && currentProject?.id !== singleProject.id) {
        setCurrentProject(singleProject);
        onProjectChange?.(singleProject);
        Cookies.set("ProjectId", singleProject.id);
        Cookies.set("ProjectName", singleProject.name);
        if (singleProject.slug) {
          Cookies.set("ProjectSlug", singleProject.slug);
        } else {
          Cookies.remove("ProjectSlug");
        }
        if (typeof window !== "undefined") {
          localStorage.setItem("ProjectId", singleProject.id);
          localStorage.setItem("ProjectName", singleProject.name);
          if (singleProject.slug) localStorage.setItem("ProjectSlug", singleProject.slug);
        }
      }
    }
  }, [isLoading, projects, currentProject, setCurrentProject, onProjectChange]);

  console.info("current project : ", currentProject);

  if (isLoading || projects.length <= 1) return null;

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
              <Avatar
                size={20}
                icon={<FolderOutlined />}
                style={{ background: "#F7931E" }}
              />
              <Text>{project.name}</Text>
            </Space>
          }
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar
              size={24}
              icon={<FolderOutlined />}
              style={{ background: project.color || "#F7931E" }}
            />
            <div>
              <Text strong style={{ fontSize: 14 }}>
                {project.name}
              </Text>
              {project.description && (
                <Text
                  type="secondary"
                  style={{ fontSize: 12, display: "block" }}
                >
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
