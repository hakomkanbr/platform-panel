"use client";
import React, { useState } from "react";
import { Spin, Typography, Alert } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProjectProvider, useProject } from "@/contexts/ProjectContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

const { Text } = Typography;

function LoadingScreen({ message }: { message: string }) {
  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      height: "100vh", flexDirection: "column", gap: 20,
      background: "var(--bg-page)",
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: "var(--gradient-primary)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 24px rgba(99,102,241,0.3)",
      }}>
        <ShoppingCartOutlined style={{ fontSize: 28, color: "#fff" }} />
      </div>
      <Spin size="large" />
      <Text type="secondary" style={{ fontSize: 14 }}>{message}</Text>
    </div>
  );
}

function ProjectGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, error } = useProject();

  if (isLoading) return <LoadingScreen message="Initializing workspace..." />;

  if (error) {
    return (
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        height: "100vh", flexDirection: "column", gap: 16, padding: 24,
        background: "var(--bg-page)",
      }}>
        <Alert type="error" message="Project Error" description={error} showIcon style={{ maxWidth: 500 }} />
      </div>
    );
  }

  return <>{children}</>;
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const [user] = useState<string>("");

  return (
    <ProjectProvider>
      <ProjectGuard>
        <SubscriptionProvider>
          <DashboardLayout user={user}>{children}</DashboardLayout>
        </SubscriptionProvider>
      </ProjectGuard>
    </ProjectProvider>
  );
}
