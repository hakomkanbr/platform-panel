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
} from "@ant-design/icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "@repo/localization";
import { authApi, useAuth } from "@repo/auth";

const { Text, Title } = Typography;
const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL || "https://platformapi.bremix.tech";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
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
      setError(t("auth.login.emailRequired"));
      return;
    }
    if (!password) {
      setError(t("auth.login.passwordRequired"));
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
          t("auth.login.welcomeBackMessage", {
            name: result.data.user.firstName ? `, ${result.data.user.firstName}` : "",
          }),
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
        setError(result.error?.message || t("auth.login.invalidCredentials"));
        setShakeKey((k) => k + 1);
      }
    } catch {
      setError(t("auth.login.connectionError"));
      setShakeKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  }, [email, password, router, redirectUrl, t, login]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="auth-header-section">
        <Title level={2} className="auth-main-title">
          {t("auth.login.welcomeBack")}
        </Title>
        <Text className="auth-subtitle">
          {t("auth.login.subtitle")}
        </Text>
      </div>

      {error && (
        <motion.div
          key={shakeKey}
          initial={{ opacity: 0, y: -8, x: 0 }}
          animate={{ opacity: 1, y: 0, x: [0, -8, 8, -8, 8, 0] }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="auth-error-banner"
        >
          {error}
        </motion.div>
      )}

      {/* Email Input */}
      <div className="auth-form-group">
        <label className="auth-label">
          {t("auth.login.emailLabel")}
        </label>
        <Input
          size="large"
          type="email"
          autoComplete="email"
          placeholder={t("auth.login.emailPlaceholder")}
          prefix={<MailOutlined style={{ color: "#9CA3AF", fontSize: 16, marginInlineEnd: 4 }} />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          className="auth-input-custom"
        />
      </div>

      {/* Password Input */}
      <div className="auth-form-group">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <label className="auth-label" style={{ marginBottom: 0 }}>
            {t("auth.login.passwordLabel")}
          </label>
          <Link
            href="/auth/forgot-password"
            style={{ color: "#F7931E", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
          >
            {t("auth.login.forgotPassword")}
          </Link>
        </div>
        <Input
          size="large"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••••••"
          prefix={<LockOutlined style={{ color: "#9CA3AF", fontSize: 16, marginInlineEnd: 4 }} />}
          suffix={
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer", color: "#9CA3AF", display: "flex", padding: 4 }}
              aria-label={showPassword ? "Hide password" : "Show password"}
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
          className="auth-input-custom"
        />
      </div>

      {/* Remember me */}
      <div className="auth-action-row">
        <Checkbox
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          style={{ color: "#4B5563", fontSize: 13 }}
        >
          {t("auth.login.rememberMe")}
        </Checkbox>
      </div>

      {/* Sign In Button */}
      <motion.button
        onClick={handleLogin}
        disabled={loading}
        whileHover={loading ? {} : { scale: 1.01 }}
        whileTap={loading ? {} : { scale: 0.99 }}
        className="auth-submit-btn"
      >
        {loading ? (
          <>
            <Spin size="small" style={{ color: "#fff" }} />
            <span>{t("auth.login.authenticating")}</span>
          </>
        ) : (
          <>
            <span>{t("auth.login.signIn")}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(var(--auth-dir-scale, 1))" }}>
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
          margin: "22px 0",
        }}
      >
        <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
        <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>{t("auth.login.or")}</span>
        <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
      </div>

      {/* Social SSO Button */}
      <div>
        <button
          type="button"
          disabled
          className="auth-secondary-btn"
          style={{ cursor: "not-allowed", opacity: 0.75 }}
        >
          <GoogleOutlined style={{ fontSize: 16, color: "#9CA3AF" }} />
          <span>{t("auth.login.google")}</span>
        </button>
      </div>

      {/* Register Footer */}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Text style={{ color: "#6B7280", fontSize: 13 }}>
          {t("auth.login.needWorkspace")}{" "}
          <Link href="/auth/register" style={{ color: "#F7931E", fontWeight: 700, textDecoration: "none" }}>
            {t("auth.login.createAccount")}
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