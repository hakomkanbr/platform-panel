"use client";
import React, { useMemo } from "react";
import { Select, Spin } from "antd";
import { useProject } from "@/contexts/ProjectContext";

export default function ProjectSelect() {
  const { project, projects, projectId, isLoading, isProjectsLoading, switchProject, loadProjectsList } = useProject();

  const options = useMemo(() => {
    const list = projects.map((p: any) => ({ value: p.id, label: p.name }));
    if (project && !list.some((o) => o.value === project.id)) {
      list.unshift({ value: project.id, label: project.name });
    }
    return list;
  }, [projects, project]);

  return (
    <Select
      size="small"
      style={{ minWidth: 160 }}
      value={projectId || undefined}
      loading={isProjectsLoading}
      notFoundContent={isProjectsLoading ? <Spin size="small" /> : "No projects"}
      options={options}
      disabled={isLoading}
      onDropdownVisibleChange={(open) => { if (open) loadProjectsList(); }}
      onChange={(value) => switchProject(value)}
    />
  );
}
