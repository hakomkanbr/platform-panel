"use client";

import React, { useState, useCallback, Suspense } from "react";
import {
  Input,
  Typography,
  Checkbox,
  message,
  Spin,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  WindowsOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi, useAuth } from "@repo/auth";

const { Text, Title } = Typography;
const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL || "https://platformapi.bremix.tech";

function LoginPageContent() {
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
      setError("Please enter your email address");
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
          const res = await fetch(
            `${GATEWAY_URL}/api/v1/auth/sso/request-ticket`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${result.data.accessToken}`,
              },
              body: JSON.stringify({ refreshToken: result.data.refreshToken }),
            },
          )
            .then((r) => r.json())
            .catch(() => null);
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
      setError("Connection error. Please check your credentials.");
      setShakeKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  }, [email, password, router, redirectUrl]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "#FFFFFF",
        borderRadius: 20,
        padding: "40px 36px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.06)",
        border: "1px solid #E5E7EB",
      }}
    >
      <div style={{ marginBottom: 28, textAlign: "left" }}>
        <Title level={2} style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1F2937", letterSpacing: "-0.03em" }}>
          Welcome back
        </Title>
        <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4, display: "block" }}>
          Sign in to access your Share2Sells workspace
        </Text>
      </div>

      {error && (
        <motion.div
          key={shakeKey}
          initial={{ opacity: 0, y: -8, x: 0 }}
          animate={{ opacity: 1, y: 0, x: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#DC2626",
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          {error}
        </motion.div>
      )}

      {/* Email Input */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
          Work Email
        </label>
        <Input
          size="large"
          placeholder="name@company.com"
          prefix={<MailOutlined style={{ color: "#9CA3AF", fontSize: 16 }} />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          style={{
            borderRadius: 10,
            height: 46,
            fontSize: 14,
            border: "1.5px solid #E5E7EB",
          }}
        />
      </div>

      {/* Password Input */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: 0 }}>
            Password
          </label>
          <Link
            href="/auth/forgot-password"
            style={{ color: "#F7931E", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
          >
            Forgot password?
          </Link>
        </div>
        <Input
          size="large"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••••••"
          prefix={<LockOutlined style={{ color: "#9CA3AF", fontSize: 16 }} />}
          suffix={
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer", color: "#9CA3AF", display: "flex" }}
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
          style={{
            borderRadius: 10,
            height: 46,
            fontSize: 14,
            border: "1.5px solid #E5E7EB",
          }}
        />
      </div>

      {/* Remember me */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center" }}>
        <Checkbox
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          style={{ color: "#4B5563", fontSize: 13 }}
        >
          Remember this device for 30 days
        </Checkbox>
      </div>

      {/* Sign In Button */}
      <motion.button
        onClick={handleLogin}
        disabled={loading}
        whileHover={loading ? {} : { scale: 1.01 }}
        whileTap={loading ? {} : { scale: 0.99 }}
        style={{
          width: "100%",
          height: 48,
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 700,
          border: "none",
          background: "linear-gradient(135deg, #F7931E 0%, #E67E00 100%)",
          color: "#FFFFFF",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 4px 14px rgba(247, 147, 30, 0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          transition: "all 0.2s ease",
        }}
      >
        {loading ? (
          <>
            <Spin size="small" style={{ color: "#fff" }} />
            <span>Authenticating...</span>
          </>
        ) : (
          <>
            <span>Sign in to Platform</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </>
        )}
      </motion.button>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          margin: "24px 0",
        }}
      >
        <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
        <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>or sign in with</span>
        <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
      </div>

      {/* Social SSO Buttons */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button"
          style={{
            flex: 1,
            height: 42,
            borderRadius: 10,
            border: "1.5px solid #E5E7EB",
            background: "#FFFFFF",
            color: "#4B5563",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.2s ease",
          }}
        >
          <GoogleOutlined style={{ fontSize: 16, color: "#EA4335" }} />
          Google
        </button>
        <button
          type="button"
          style={{
            flex: 1,
            height: 42,
            borderRadius: 10,
            border: "1.5px solid #E5E7EB",
            background: "#FFFFFF",
            color: "#4B5563",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.2s ease",
          }}
        >
          <WindowsOutlined style={{ fontSize: 16, color: "#00A4EF" }} />
          Microsoft
        </button>
      </div>

      {/* Register Footer */}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Text style={{ color: "#6B7280", fontSize: 13 }}>
          Need a new workspace?{" "}
          <Link href="/auth/register" style={{ color: "#F7931E", fontWeight: 600, textDecoration: "none" }}>
            Create an account
          </Link>
        </Text>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", padding: 48 }}>
          <Spin size="large" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}