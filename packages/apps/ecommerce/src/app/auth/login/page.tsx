"use client";

import React, { useState, useCallback } from "react";
import { Button, Input, Typography, Space, Checkbox, Divider, message } from "antd";
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, GoogleOutlined, ArrowRightOutlined, WindowsOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";

const { Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const handleLogin = useCallback(async () => {
    if (!email.trim()) { setError("Please enter your email"); return; }
    if (!password) { setError("Please enter your password"); return; }
    setError(null);
    setLoading(true);

    try {
      const result = await authApi.login(email.trim(), password);
      if (result.success && result.data) {
        document.cookie = `access_token=${result.data.accessToken}; path=/; max-age=${result.data.expiresIn}; SameSite=Lax;`;
        document.cookie = `refresh_token=${result.data.refreshToken}; path=/; max-age=${result.data.expiresIn * 10}; SameSite=Lax`;
        login(result.data.accessToken, result.data.refreshToken, {
          ...result.data.user, tenantId: result.data.user.tenantId ?? undefined,
        });
        message.success(`Welcome back${result.data.user.firstName ? `, ${result.data.user.firstName}` : ""}!`);
        router.push("/panel");
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
  }, [email, password, router, login]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.35 }}
    >
      <div style={{ marginBottom: 6 }}>
        <Text style={{ color: "#374151", fontSize: 20, fontWeight: 700, display: "block", letterSpacing: "-0.03em" }}>
          Sign in
        </Text>
        <Text style={{ color: "#6b7280", fontSize: 14, marginTop: 4, display: "block" }}>
          Welcome back to your admin panel
        </Text>
      </div>

      {error && (
        <motion.div
          key={shakeKey}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0, x: [0, -8, 8, -4, 4, 0] }}
          transition={{ duration: 0.4 }}
          style={{
            padding: "10px 14px", borderRadius: 8, marginBottom: 16,
            background: "#fef2f2", border: "1px solid #fecaca",
            color: "#dc2626", fontSize: 13, textAlign: "center",
          }}
        >
          {error}
        </motion.div>
      )}

      <div style={{ marginBottom: 18 }}>
        <label style={{ color: "#374151", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
          Email Address
        </label>
        <Input
          size="large"
          placeholder="Enter your email"
          prefix={<MailOutlined style={{ color: "#9ca3af", fontSize: 15 }} />}
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(null); }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{ borderRadius: 10, height: 46, padding: "0 14px" }}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <label style={{ color: "#374151", fontSize: 13, fontWeight: 500, display: "block" }}>
            Password
          </label>
          <Link href="/auth/forgot-password" style={{ color: "#6366f1", fontSize: 12, fontWeight: 500, textDecoration: "none" }}>
            Forgot password?
          </Link>
        </div>
        <Input
          size="large"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          prefix={<LockOutlined style={{ color: "#9ca3af", fontSize: 15 }} />}
          suffix={
            <span onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer", color: "#9ca3af", display: "flex" }}>
              {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            </span>
          }
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(null); }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{ borderRadius: 10, height: 46, padding: "0 14px" }}
        />
      </div>

      <div style={{ marginBottom: 20, marginTop: 14 }}>
        <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ color: "#6b7280", fontSize: 13 }}>
          Remember me
        </Checkbox>
      </div>

      <motion.div whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}>
        <Button
          type="primary" size="large" onClick={handleLogin}
          loading={loading} disabled={loading}
          style={{
            width: "100%", height: 46, borderRadius: 10, fontSize: 15, fontWeight: 600,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            border: "none", boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
          }}
        >
          <Space>
            Sign In <ArrowRightOutlined />
          </Space>
        </Button>
      </motion.div>

      <Divider style={{ borderColor: "#f0f0f0", margin: "20px 0" }}>
        <Text style={{ color: "#9ca3af", fontSize: 12 }}>or continue with</Text>
      </Divider>

      <Space style={{ width: "100%" }} size={12}>
        <Button icon={<GoogleOutlined />} style={{ flex: 1, height: 42, borderRadius: 10, border: "1px solid #e5e7eb", color: "#6b7280", fontSize: 13, background: "#fff" }}>
          Google
        </Button>
        <Button icon={<WindowsOutlined />} style={{ flex: 1, height: 42, borderRadius: 10, border: "1px solid #e5e7eb", color: "#6b7280", fontSize: 13, background: "#fff" }}>
          Microsoft
        </Button>
      </Space>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Text style={{ color: "#6b7280", fontSize: 13 }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>
            Create one
          </Link>
        </Text>
      </div>
    </motion.div>
  );
}
