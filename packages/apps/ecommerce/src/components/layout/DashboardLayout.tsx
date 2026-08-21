"use client";
import React, { useState } from "react";
import { Layout, Button, Space, Typography, theme, Dropdown } from "antd";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import Sidebar from "./Sidebar";
import { logout } from "@/lib/auth/keycloak";
import { getRefreshToken } from "@/lib/auth/keycloak.client";
import { useProject } from "@/contexts/ProjectContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import ProjectSelect from "./ProjectSelect";

const { Header, Content } = Layout;
const { Text } = Typography;

export default function DashboardLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const { project } = useProject();
  const { planName, isLoading } = useSubscription();

  const userMenuItems = [
    { key: "profile", icon: <UserOutlined />, label: "Profile" },
    { key: "settings", icon: <SettingOutlined />, label: "Settings" },
    { key: "change-password", icon: <KeyOutlined />, label: "Change Password" },
    { type: "divider" as const },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout", danger: true },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") logout(getRefreshToken() ?? "");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout
        style={{
          marginLeft: collapsed ? 60 : 243,
          transition: "margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Header
          style={{
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 99,
          }}
        >
          <Space size={12}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16, color: "var(--text-secondary)" }}
            />
            {project && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: 6,
                  background: "var(--primary-subtle)",
                  color: "var(--primary)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {project.name}
              </span>
            )}
            <ProjectSelect />
            {!isLoading && planName && planName !== "unknown" && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 10px",
                  borderRadius: 12,
                  background: planName === "free" ? "rgba(234,179,8,0.15)" : "rgba(34,197,94,0.15)",
                  color: planName === "free" ? "#eab308" : "#22c55e",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {planName}
              </span>
            )}
          </Space>
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            trigger={["click"]}
          >
            <Button
              type="text"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                height: 36,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--gradient-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UserOutlined style={{ fontSize: 14, color: "#fff" }} />
              </div>
              <Text style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                {user || "Admin"}
              </Text>
            </Button>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, minHeight: 280 }}>
          <div
            style={{
              minHeight: 280,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
