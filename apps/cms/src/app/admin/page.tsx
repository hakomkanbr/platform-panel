"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Typography,
  Avatar,
  Tag,
  Tooltip,
  Input,
} from "antd";
import {
  PlusOutlined,
  AppstoreOutlined,
  UserAddOutlined,
  FolderOutlined,
  RightOutlined,
  ClockCircleOutlined,
  StarFilled,
  GithubOutlined,
  CodeOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const recentProjects = [
  {
    id: 1,
    name: "Ecommerce Platform",
    description: "Full-featured online store with payments and inventory",
    apps: 3,
    lastOpened: "2 hours ago",
    color: "#6366f1",
  },
  {
    id: 2,
    name: "Content Management",
    description: "Blog and documentation portal",
    apps: 2,
    lastOpened: "Yesterday",
    color: "#10b981",
  },
  {
    id: 3,
    name: "Customer Dashboard",
    description: "Analytics and reporting interface",
    apps: 1,
    lastOpened: "3 days ago",
    color: "#f59e0b",
  },
];

const favoriteProjects = [
  {
    id: 4,
    name: "CRM System",
    description: "Customer relationship management",
    apps: 4,
    color: "#ef4444",
  },
  {
    id: 5,
    name: "HR Portal",
    description: "Employee management and payroll",
    apps: 2,
    color: "#8b5cf6",
  },
];

const quickActions = [
  {
    title: "Quick Start",
    description: "Install a website preset",
    icon: <ThunderboltOutlined />,
    href: "/admin/presets",
    color: "#fbbf24",
  },
  {
    title: "Create Project",
    description: "Set up a new workspace",
    icon: <PlusOutlined />,
    href: "/admin/projects/new",
    color: "#6366f1",
  },
  {
    title: "Browse Applications",
    description: "Explore the App Library",
    icon: <AppstoreOutlined />,
    href: "/admin/app-library",
    color: "#10b981",
  },
  {
    title: "Invite Team Member",
    description: "Add someone to your team",
    icon: <UserAddOutlined />,
    href: "/admin/users",
    color: "#f59e0b",
  },
];

const recentActivity = [
  {
    id: 1,
    action: "open Ecommerce app",
    project: "Ecommerce Platform",
    time: "1 hour ago",
    icon: <ShoppingCartOutlined />,
  },
  {
    id: 2,
    action: "Deployed CMS update",
    project: "Content Management",
    time: "3 hours ago",
    icon: <FileTextOutlined />,
  },
  {
    id: 3,
    action: "Generated new API key",
    project: "CRM System",
    time: "5 hours ago",
    icon: <CodeOutlined />,
  },
  {
    id: 4,
    action: "Added database",
    project: "Customer Dashboard",
    time: "1 day ago",
    icon: <DatabaseOutlined />,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="platform-home">
      {/* Welcome Section */}
      <div className="welcome-section" style={{ marginBottom: 48 }}>
        <div style={{ marginBottom: 4 }}>
          <Text
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            {greeting}, Abdulhekim 👋
          </Text>
        </div>
        <Title
          level={2}
          style={{
            margin: "4px 0",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          Welcome back
        </Title>
        <Text style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          Continue managing your platform
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Recent Projects */}
        <Col xs={24} xl={16}>
          <div
            className="section-header"
            style={{
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Space>
              <ClockCircleOutlined
                style={{ color: "var(--primary)", fontSize: 16 }}
              />
              <Title
                level={4}
                style={{ margin: 0, fontSize: 16, fontWeight: 600 }}
              >
                Recent Projects
              </Title>
            </Space>
            <Button
              type="text"
              icon={<RightOutlined />}
              onClick={() => router.push("/admin/projects")}
            >
              View all
            </Button>
          </div>
          <Row gutter={[16, 16]}>
            {recentProjects.map((project) => (
              <Col xs={24} sm={12} key={project.id}>
                <ProjectCard project={project} />
              </Col>
            ))}
          </Row>

          {/* Favorite Projects */}
          <div
            className="section-header"
            style={{
              margin: "32px 0 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Space>
              <StarFilled style={{ color: "#f59e0b", fontSize: 16 }} />
              <Title
                level={4}
                style={{ margin: 0, fontSize: 16, fontWeight: 600 }}
              >
                Favorite Projects
              </Title>
            </Space>
            <Button
              type="text"
              icon={<RightOutlined />}
              onClick={() => router.push("/admin/projects?tab=favorites")}
            >
              View all
            </Button>
          </div>
          <Row gutter={[16, 16]}>
            {favoriteProjects.map((project) => (
              <Col xs={24} sm={12} key={project.id}>
                <ProjectCard project={project} />
              </Col>
            ))}
          </Row>
        </Col>

        {/* Right Column */}
        <Col xs={24} xl={8}>
          {/* Quick Actions */}
          <Card className="platform-card" style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <Title
                level={4}
                style={{ margin: 0, fontSize: 16, fontWeight: 600 }}
              >
                Quick Actions
              </Title>
            </div>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              {quickActions.map((action) => (
                <div
                  key={action.title}
                  className="quick-action-item"
                  onClick={() => router.push(action.href)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    borderRadius: 12,
                    cursor: "pointer",
                    border: "1px solid var(--border-light)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.background = "var(--primary-light)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-light)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: `var(--primary-light)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      color: "var(--primary)",
                      flexShrink: 0,
                    }}
                  >
                    {action.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ fontSize: 14, display: "block" }}>
                      {action.title}
                    </Text>
                    <Text
                      style={{ fontSize: 12, color: "var(--text-secondary)" }}
                    >
                      {action.description}
                    </Text>
                  </div>
                  <RightOutlined
                    style={{ color: "var(--text-tertiary)", fontSize: 12 }}
                  />
                </div>
              ))}
            </Space>
          </Card>

          {/* Recent Activity */}
          <Card className="platform-card">
            <div style={{ marginBottom: 16 }}>
              <Title
                level={4}
                style={{ margin: 0, fontSize: 16, fontWeight: 600 }}
              >
                Recent Activity
              </Title>
            </div>
            <Space direction="vertical" size={0} style={{ width: "100%" }}>
              {recentActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom:
                      index < recentActivity.length - 1
                        ? "1px solid var(--border-light)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "var(--primary-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      color: "var(--primary)",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {activity.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ fontSize: 13, display: "block" }}>
                      {activity.action}
                    </Text>
                    <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                      <Text
                        style={{ fontSize: 12, color: "var(--text-secondary)" }}
                      >
                        {activity.project}
                      </Text>
                      <Text
                        style={{ fontSize: 12, color: "var(--text-tertiary)" }}
                      >
                        ·
                      </Text>
                      <Text
                        style={{ fontSize: 12, color: "var(--text-tertiary)" }}
                      >
                        {activity.time}
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  const router = useRouter();
  return (
    <Card
      className="platform-card project-card"
      hoverable
      style={{ borderRadius: 14, cursor: "pointer" }}
      onClick={() => router.push(`/admin/projects/${project.id}`)}
      bodyStyle={{ padding: 20 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `${project.color}12`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            color: project.color,
            flexShrink: 0,
          }}
        >
          <FolderOutlined />
        </div>
        {project.lastOpened && (
          <Tag
            style={{
              borderRadius: 6,
              fontSize: 11,
              padding: "0 8px",
              lineHeight: "22px",
              background: "var(--bg-subtle)",
              border: "1px solid var(--border-light)",
              color: "var(--text-tertiary)",
            }}
          >
            {project.lastOpened}
          </Tag>
        )}
      </div>
      <Title level={5} style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
        {project.name}
      </Title>
      <Text
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          display: "block",
          marginTop: 4,
          lineHeight: 1.4,
        }}
      >
        {project.description}
      </Text>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 16,
          paddingTop: 14,
          borderTop: "1px solid var(--border-light)",
        }}
      >
        <Text style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
          {project.apps} {project.apps === 1 ? "application" : "applications"}
        </Text>
        <Button
          type="primary"
          size="small"
          style={{ height: 30, fontSize: 12, borderRadius: 8 }}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/projects/${project.id}`);
          }}
        >
          Open
        </Button>
      </div>
    </Card>
  );
}
