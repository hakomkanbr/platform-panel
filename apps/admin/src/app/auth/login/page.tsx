"use client";

import React, { useState, useCallback } from "react";
import {
  Button,
  Input,
  Typography,
  Space,
  Checkbox,
  Divider,
  message,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  ArrowRightOutlined,
  WindowsOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi, useAuth } from "@repo/auth";

const { Text } = Typography;
const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "https://localhost:52562";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const handleLogin = useCallback(async () => {
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const result = await authApi.login(email.trim(), password);
      if (result.success && result.data) {
        document.cookie = `access_token=${result.data.accessToken}; path=/; max-age=${result.data.expiresIn}; SameSite=Lax;`;
        document.cookie = `refresh_token=${result.data.refreshToken}; path=/; max-age=${result.data.expiresIn * 10}; SameSite=Lax`;
        document.cookie = `AuthToken=${result.data.accessToken}; path=/; max-age=${result.data.expiresIn}; SameSite=Lax;`;
        login(result.data.accessToken, result.data.refreshToken, {
          ...result.data.user,
          tenantId: result.data.user.tenantId ?? undefined,
        });
        message.success(
          `Welcome back${result.data.user.firstName ? `, ${result.data.user.firstName}` : ""}!`,
        );
        if (redirectUrl) {
          const res = await fetch(`${GATEWAY_URL}/api/v1/auth/sso/request-ticket`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${result.data.accessToken}`,
            },
            body: JSON.stringify({ refreshToken: result.data.refreshToken }),
          }).then((r) => r.json()).catch(() => null);
          if (res?.success && res.data?.ticket) {
            window.location.href = `${redirectUrl}?ticket=${res.data.ticket}`;
          } else {
            window.location.href = redirectUrl;
          }
        } else {
          router.push("/admin");
        }
      } else {
        setError(result.error?.message || "Invalid email or password");
        setShakeKey((k) => k + 1);
      }
    } catch {
      setError("Connection error. Please try again.");
      setShakeKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  }, [email, password, router, redirectUrl]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <>
      {error && (
        <motion.div
          key={shakeKey}
          initial={{ opacity: 0, y: -8, x: 0 }}
          animate={{ opacity: 1, y: 0, x: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="auth-error"
        >
          {error}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
      >
        <div style={{ marginBottom: 18 }}>
          <label className="auth-label">Email Address</label>
          <Input
            size="large"
            placeholder="Enter your email"
            className="auth-input-wrapper"
            prefix={<MailOutlined style={{ color: "#9ca3af", fontSize: 16 }} />}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <label className="auth-label" style={{ marginBottom: 0 }}>
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="auth-link"
              style={{ fontSize: 12, fontWeight: 400 }}
            >
              Forgot password?
            </Link>
          </div>
          <Input
            size="large"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="auth-input-wrapper"
            prefix={<LockOutlined style={{ color: "#9ca3af", fontSize: 16 }} />}
            suffix={
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  cursor: "pointer",
                  color: "#9ca3af",
                  fontSize: 14,
                  display: "flex",
                }}
              >
                {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              </span>
            }
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div style={{ marginBottom: 20, marginTop: 14 }}>
          <Checkbox
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            style={{ color: "#6b7280", fontSize: 13 }}
          >
            Remember me
          </Checkbox>
        </div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            type="primary"
            size="large"
            onClick={handleLogin}
            loading={loading}
            disabled={loading}
            className="auth-btn-gradient"
          >
            <Space>
              Sign In to Dashboard
              <ArrowRightOutlined />
            </Space>
          </Button>
        </motion.div>

        <Divider style={{ borderColor: "#f0f0f0", margin: "20px 0" }}>
          <Text style={{ color: "#9ca3af", fontSize: 12 }}>or</Text>
        </Divider>

        <Space style={{ width: "100%", display: "flex" }} size={10}>
          <Button
            icon={<GoogleOutlined style={{ fontSize: 15 }} />}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              color: "#6b7280",
              fontSize: 13,
              background: "#fff",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#6366f1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            Google
          </Button>
          <Button
            icon={<WindowsOutlined style={{ fontSize: 15 }} />}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              color: "#6b7280",
              fontSize: 13,
              background: "#fff",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#6366f1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            Microsoft
          </Button>
        </Space>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Text style={{ color: "#6b7280", fontSize: 13 }}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="auth-link">
              Create one
            </Link>
          </Text>
        </div>
      </motion.div>
    </>
  );
}
