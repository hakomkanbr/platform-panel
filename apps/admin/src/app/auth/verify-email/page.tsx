"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { Typography, Spin } from "antd";
import {
  MailOutlined,
  ReloadOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@repo/auth";
import { useTranslations } from "@repo/localization";

const { Text, Title } = Typography;

function VerifyEmailPageContent() {
  const router = useRouter();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!email || email === "your email") return;
    intervalRef.current = setInterval(async () => {
      try {
        const result = await authApi.verifyStatus(email);
        if (result.success && result.data?.verified) {
          setVerified(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => router.push("/admin"), 1500);
        }
      } catch {}
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [email, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = useCallback(async () => {
    if (countdown > 0) return;
    setResending(true);
    try {
      await authApi.forgotPassword(email);
      setCountdown(60);
    } catch {
    } finally {
      setResending(false);
    }
  }, [email, countdown]);

  return (
    <AnimatePresence mode="wait">
      {verified ? (
        <motion.div
          key="verified"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
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
            {t("auth.verify.emailVerified")}
          </Title>
          <div style={{ color: "#6B7280", fontSize: 13, marginTop: 6 }}>
            {t("auth.verify.redirectingDashboard")}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="pending"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center" }}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: "linear-gradient(135deg, #F7931E 0%, #E67E00 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 24px rgba(247, 147, 30, 0.3)",
            }}
          >
            <MailOutlined style={{ fontSize: 26, color: "#FFFFFF" }} />
          </motion.div>

          <Title level={2} className="auth-main-title" style={{ fontSize: 22, textAlign: "center" }}>
            {t("auth.verify.checkInbox")}
          </Title>
          <div
            style={{
              color: "#6B7280",
              fontSize: 13,
              marginTop: 6,
              lineHeight: 1.6,
            }}
          >
            {t("auth.verify.sentTo")}{" "}
            <Text style={{ color: "#1F2937", fontWeight: 700 }}>{email}</Text>
          </div>

          <div
            style={{
              margin: "18px 0",
              padding: "12px 14px",
              borderRadius: 10,
              background: "#F9FAFB",
              border: "1px solid #F3F4F6",
              color: "#6B7280",
              fontSize: 12,
              lineHeight: 1.5,
              textAlign: "start",
            }}
          >
            {t("auth.verify.noEmail")}
          </div>

          <button
            onClick={handleResend}
            disabled={countdown > 0 || resending}
            className="auth-submit-btn"
            style={{
              background: countdown > 0 ? "#9CA3AF" : undefined,
              boxShadow: countdown > 0 ? "none" : undefined,
            }}
          >
            {resending ? (
              <Spin size="small" style={{ color: "#fff" }} />
            ) : (
              <ReloadOutlined />
            )}
            <span>
              {countdown > 0
                ? t("auth.verify.resendIn", { seconds: countdown })
                : t("auth.verify.resendVerification")}
            </span>
          </button>

          <div style={{ marginTop: 18, textAlign: "center" }}>
            <Link
              href="/auth/login"
              style={{ color: "#6B7280", fontSize: 13, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span>{t("auth.verify.backToLogin")}</span>
              <ArrowRightOutlined style={{ fontSize: 12 }} />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: 48 }}><Spin size="large" /></div>}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
