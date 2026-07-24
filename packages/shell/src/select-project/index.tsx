// @ts-nocheck
"use client";

import React from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Avatar,
} from "antd";
import {
  FolderOutlined,
  SelectOutlined,
  SettingOutlined,
  TeamOutlined,
  DatabaseOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

interface ProjectItem {
  id: string;
  name: string;
  slug?: string;
  description?: string;
}

interface SelectProjectPageProps {
  projects: ProjectItem[];
  loading?: boolean;
  emptyMessage?: string;
  title?: string;
  subtitle?: string;
  onSelectProject: (project: ProjectItem) => void;
}

const PROJECT_ICONS = [
  FolderOutlined,
  SettingOutlined,
  TeamOutlined,
  DatabaseOutlined,
  RocketOutlined,
];

const SelectProjectPage: React.FC<SelectProjectPageProps> = ({
  projects,
  loading = false,
  emptyMessage = "No projects available. Contact your administrator.",
  title = "Project Selection",
  subtitle = "Select a project to access its tools and manage your content",
  onSelectProject,
}) => {
  const getProjectIcon = (index: number) => {
    return PROJECT_ICONS[index % PROJECT_ICONS.length];
  };

  const [selectingId, setSelectingId] = React.useState<string | null>(null);

  const handleSelect = (project: ProjectItem) => {
    setSelectingId(project.id);
    onSelectProject(project);
  };

  if (loading || selectingId) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
          <Text
            style={{
              display: "block",
              marginTop: 24,
              color: "#022349",
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            {loading ? "Loading..." : "Redirecting to selected project..."}
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
      }}
    >
      <div style={{ position: "relative", zIndex: 10, padding: 32 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Avatar
              size={90}
              icon={<FolderOutlined />}
              style={{
                background: "linear-gradient(to right, #F7931E, #E67E00)",
                boxShadow: "0 12px 24px rgba(247, 147, 30, 0.3)",
                marginBottom: 24,
              }}
            />
            <Title
              level={1}
              style={{
                color: "#022349",
                marginBottom: 16,
                fontWeight: "bold",
              }}
            >
              {title}
            </Title>
            <Text
              style={{
                color: "#475569",
                fontSize: 18,
                maxWidth: 720,
                margin: "0 auto",
                lineHeight: 1.6,
                display: "block",
              }}
            >
              {subtitle}
            </Text>
          </div>

          <Row gutter={[32, 32]} justify="center">
            {projects.map((project, index) => {
              const IconComponent = getProjectIcon(index);

              return (
                <Col key={project.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    style={{
                      height: "100%",
                      boxShadow: "0 6px 20px rgba(2, 35, 73, 0.1)",
                      transition: "all 0.3s",
                      background: "#ffffff",
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                    }}
                    actions={[
                      <Button
                        key="select"
                        type="primary"
                        icon={<SelectOutlined />}
                        block
                        size="large"
                        onClick={() => handleSelect(project)}
                        style={{
                          background:
                            "linear-gradient(to right, #F7931E, #E67E00)",
                          border: "none",
                          color: "#fff",
                          boxShadow: "0 4px 12px rgba(247, 147, 30, 0.2)",
                          transition: "all 0.3s",
                          borderRadius: 6,
                        }}
                      >
                        Select Project
                      </Button>,
                    ]}
                  >
                    <div style={{ textAlign: "center", marginBottom: 24 }}>
                      <Avatar
                        size={64}
                        icon={<IconComponent />}
                        style={{
                          background:
                            "linear-gradient(to right, #F7931E, #E67E00)",
                          boxShadow: "0 8px 16px rgba(247, 147, 30, 0.2)",
                          marginBottom: 16,
                        }}
                      />
                      <Title
                        level={3}
                        style={{
                          marginBottom: 12,
                          color: "#022349",
                          fontWeight: "bold",
                        }}
                      >
                        {project.name}
                      </Title>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                        }}
                      >
                        {project.description && (
                          <Text
                            type="secondary"
                            style={{ fontSize: 13, display: "block" }}
                          >
                            {project.description}
                          </Text>
                        )}

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 8,
                            background: "#f1f5f9",
                            borderRadius: 8,
                            padding: 8,
                          }}
                        >
                          <Text style={{ color: "#334155", fontSize: 14 }}>
                            Slug:
                          </Text>
                          <Text
                            style={{
                              color: "#022349",
                              fontFamily: "monospace",
                              fontSize: 14,
                              background: "#e2e8f0",
                              padding: "2px 8px",
                              borderRadius: 4,
                            }}
                          >
                            {project.slug || project.id}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {projects.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 80 }}>
              <Avatar
                size={64}
                icon={<FolderOutlined />}
                style={{
                  background: "#cbd5e1",
                  marginBottom: 24,
                  color: "#fff",
                }}
              />
              <Title
                level={3}
                style={{ color: "#022349", marginBottom: 16 }}
              >
                No Projects Available
              </Title>
              <Text style={{ color: "#64748b", fontSize: 16 }}>
                {emptyMessage}
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectProjectPage;
