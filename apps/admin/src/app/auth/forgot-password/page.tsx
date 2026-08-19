"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Input, Typography, Spin } from "antd";
import {
  MailOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { authApi } from "@repo/auth";
import { useTranslations } from "@repo/localization";

const { Text, Title } = Typography;

export default function ForgotPasswordPage() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = useCallback(async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError(t("auth.forgot.emailInvalid"));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
      setCountdown(10);
    } catch {
      setError(t("auth.forgot.sendFailed"));
    } finally {
      setLoading(false);
    }
  }, [email, t]);

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
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
            {t("auth.forgot.checkInbox")}
          </Title>
          <div
            style={{
              color: "#6B7280",
              fontSize: 14,
              marginTop: 8,
              lineHeight: 1.6,
            }}
          >
            {t("auth.forgot.sentTo")}{" "}
            <Text style={{ color: "#1F2937", fontWeight: 700 }}>{email}</Text>
          </div>
          <div style={{ color: "#9CA3AF", fontSize: 13, marginTop: 18 }}>
            {t("auth.forgot.redirecting", { seconds: countdown })}
          </div>
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="auth-header-section" style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={2} className="auth-main-title">
              {t("auth.forgot.title")}
            </Title>
            <Text className="auth-subtitle">
              {t("auth.forgot.subtitle")}
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
            <label className="auth-label">{t("auth.forgot.emailLabel")}</label>
            <Input
              size="large"
              type="email"
              placeholder={t("auth.forgot.emailPlaceholder")}
              prefix={
                <MailOutlined style={{ color: "#9CA3AF", fontSize: 16, marginInlineEnd: 4 }} />
              }
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="auth-input-custom"
            />
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
                <span>{t("auth.forgot.sendResetLink")}</span>
              </>
            ) : (
              <>
                <span>{t("auth.forgot.sendResetLink")}</span>
                <ArrowRightOutlined />
              </>
            )}
          </motion.button>

          <div style={{ textAlign: "center", marginTop: 22 }}>
            <Link
              href="/auth/login"
              style={{ color: "#6B7280", fontSize: 13, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <ArrowLeftOutlined style={{ fontSize: 12 }} />
              <span>{t("auth.forgot.backToLogin")}</span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
