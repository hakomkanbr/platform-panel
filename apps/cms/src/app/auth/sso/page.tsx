"use client";

import { useEffect, useRef } from "react";
import { Spin, Typography, Card, Space } from "antd";

const { Text, Title } = Typography;
const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "https://localhost:52562";

export default function SsoPage() {
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const ticket = params.get("ticket");

    if (!ticket) {
      window.location.href = `${process.env.NEXT_PUBLIC_MAIN_APP_URL}/auth/login`;
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${GATEWAY_URL}/api/v1/auth/sso/exchange-ticket`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticket }),
        });
        const json = await res.json();

        if (json.success && json.data) {
          document.cookie = `access_token=${json.data.accessToken}; path=/; max-age=86400; SameSite=Lax;`;
          document.cookie = `refresh_token=${json.data.refreshToken}; path=/; max-age=2592000; SameSite=Lax;`;
          window.location.href = "/admin";
        } else {
          window.location.href = `${process.env.NEXT_PUBLIC_MAIN_APP_URL}/auth/login`;
        }
      } catch {
        window.location.href = `${process.env.NEXT_PUBLIC_MAIN_APP_URL}/auth/login`;
      }
    })();
  }, []);

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
            <Text type="secondary">Authenticating...</Text>
          </Space>
        </Space>
      </Card>
    </div>
  );
}
