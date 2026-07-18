"use client";

import { useEffect } from "react";
import { useAuth } from "@repo/auth";
import { Spin, Typography, Card, Space } from "antd";
import { useRouter } from "next/navigation";

const { Text, Title } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/admin");
      } else {
        const callbackUrl = encodeURIComponent("http://localhost:3001/auth/sso");
        window.location.href = `http://localhost:3000/auth/login?redirect=${callbackUrl}`;
      }
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Card
        style={{
          width: 420,
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          textAlign: "center",
          padding: 24,
        }}
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Title level={3} style={{ margin: 0 }}>CMS Admin</Title>

          <Space direction="vertical" size={12}>
            <Spin size="large" />
            <Text type="secondary">Redirecting to SSO...</Text>
          </Space>
        </Space>
      </Card>
    </div>
  );
}