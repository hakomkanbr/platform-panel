"use client";

import React, { useState, useCallback, useMemo, Suspense } from "react";
import { Input, Typography, Spin } from "antd";
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@repo/auth";
import { useTranslations } from "@repo/localization";

const { Text, Title } = Typography;

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 10;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[a-z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  if (score < 30) return { score, labelKey: "strengthWeak", color: "#ef4444" };
  if (score < 50) return { score, labelKey: "strengthFair", color: "#f59e0b" };
  if (score < 75) return { score, labelKey: "strengthStrong", color: "#22c55e" };
  return { score, labelKey: "strengthVeryStrong", color: "#F7931E" };
}

function ResetPasswordPageContent() {
  const router = useRouter();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const handleSubmit = useCallback(async () => {
    if (password.length < 8) {
      setError(t("auth.reset.minChars"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("auth.reset.passwordsDoNotMatch"));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await authApi.resetPassword(
        token,
        password,
        confirmPassword,
      );
      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        setError(
          result.error?.message || t("auth.reset.resetFailed"),
        );
      }
    } catch {
      setError(t("auth.reset.connectionError"));
    } finally {
      setLoading(false);
    }
  }, [password, confirmPassword, token, router, t]);

  if (!token) {
    return (
      <div style={{ textAlign: "center", padding: "12px 0" }}>
        <div
          style={{
            margin: "0 auto 16px",
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: "#FEF2F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <Title level={3} className="auth-main-title" style={{ fontSize: 18, textAlign: "center" }}>
          {t("auth.reset.invalidOrExpired")}
        </Title>
        <div
          style={{
            color: "#6B7280",
            fontSize: 13,
            marginTop: 6,
            marginBottom: 20,
            lineHeight: 1.5,
          }}
        >
          {t("auth.reset.invalidLinkDesc")}
        </div>
        <Link href="/auth/forgot-password" style={{ textDecoration: "none" }}>
          <button className="auth-submit-btn" style={{ width: "auto", padding: "0 24px", margin: "0 auto" }}>
            {t("auth.reset.requestNewLink")}
          </button>
        </Link>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {success ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: "center", padding: "12px 0" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "#F0FDF4",
              border: "1.5px solid #BBF7D0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <Title level={3} className="auth-main-title" style={{ fontSize: 20, textAlign: "center" }}>
            {t("auth.reset.resetSuccessful")}
          </Title>
          <div style={{ color: "#6B7280", fontSize: 13, marginTop: 6 }}>
            {t("auth.reset.redirecting")}
          </div>
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="auth-header-section" style={{ textAlign: "center", marginBottom: 22 }}>
            <Title level={2} className="auth-main-title">
              {t("auth.reset.title")}
            </Title>
            <Text className="auth-subtitle">
              {t("auth.reset.subtitle")}
            </Text>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="auth-error-banner"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="auth-form-group">
            <label className="auth-label">{t("auth.reset.newPassword")}</label>
            <Input.Password
              size="large"
              placeholder={t("auth.reset.enterNewPassword")}
              prefix={
                <LockOutlined style={{ color: "#9CA3AF", fontSize: 16, marginInlineEnd: 4 }} />
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className="auth-input-custom"
            />
            {password && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        background:
                          strength.score / 25 >= i
                            ? strength.color
                            : "#E5E7EB",
                        transition: "background 0.3s ease",
                      }}
                    />
                  ))}
                </div>
                <Text
                  style={{
                    color: strength.color,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {t(`auth.reset.${strength.labelKey}`)}
                </Text>
              </div>
            )}
          </div>

          <div className="auth-form-group">
            <label className="auth-label">{t("auth.reset.confirmPassword")}</label>
            <Input.Password
              size="large"
              placeholder={t("auth.reset.repeatNewPassword")}
              prefix={
                <LockOutlined style={{ color: "#9CA3AF", fontSize: 16, marginInlineEnd: 4 }} />
              }
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className="auth-input-custom"
            />
            {confirmPassword && password !== confirmPassword && (
              <Text
                style={{
                  color: "#EF4444",
                  fontSize: 11,
                  marginTop: 4,
                  display: "block",
                }}
              >
                {t("auth.reset.passwordsDoNotMatch")}
              </Text>
            )}
          </div>

          <div
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              background: "#F9FAFB",
              border: "1px solid #F3F4F6",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: "#4B5563",
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 8,
                display: "block",
              }}
            >
              {t("auth.reset.requirements")}
            </Text>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
              {[
                { key: "reqChars", test: (p: string) => p.length >= 8 },
                { key: "reqUppercase", test: (p: string) => /[A-Z]/.test(p) },
                { key: "reqNumber", test: (p: string) => /[0-9]/.test(p) },
                { key: "reqSpecial", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
              ].map((req) => (
                <div
                  key={req.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {req.test(password) ? (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <div style={{ width: 12, height: 12, borderRadius: "50%", border: "1.5px solid #D1D5DB" }} />
                  )}
                  <Text
                    style={{
                      color: req.test(password) ? "#10B981" : "#6B7280",
                      fontSize: 11,
                      fontWeight: req.test(password) ? 600 : 400,
                      transition: "color 0.2s",
                    }}
                  >
                    {t(`auth.reset.${req.key}`)}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="auth-submit-btn"
          >
            {loading ? (
              <>
                <Spin size="small" style={{ color: "#fff" }} />
                <span>{t("auth.reset.submit")}</span>
              </>
            ) : (
              <>
                <span>{t("auth.reset.submit")}</span>
                <ArrowRightOutlined />
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: 48 }}><Spin size="large" /></div>}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
