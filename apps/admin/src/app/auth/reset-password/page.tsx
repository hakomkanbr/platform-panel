"use client";

import React, { useState, useCallback, useMemo, Suspense } from "react";
import { Button, Input, Typography, Spin } from "antd";
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

const { Text } = Typography;

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 10;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[a-z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  if (score < 30) return { score, label: "Weak", color: "#ef4444" };
  if (score < 50) return { score, label: "Fair", color: "#f59e0b" };
  if (score < 75) return { score, label: "Strong", color: "#22c55e" };
  return { score, label: "Very Strong", color: "#6366f1" };
}

const requirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Number", test: (p: string) => /[0-9]/.test(p) },
  { label: "Special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function ResetPasswordPageContent() {
  const router = useRouter();
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
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
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
          result.error?.message || "Reset failed. The link may have expired.",
        );
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [password, confirmPassword, token, router]);

  if (!token) {
    return (
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <div
          style={{
            margin: "0 auto 14px",
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#fef2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <Text
          style={{
            color: "#374151",
            fontSize: 15,
            fontWeight: 600,
            display: "block",
          }}
        >
          Invalid or expired link
        </Text>
        <div
          style={{
            color: "#6b7280",
            fontSize: 13,
            marginTop: 6,
            marginBottom: 18,
            lineHeight: 1.5,
          }}
        >
          This password reset link is no longer valid.
        </div>
        <Link href="/auth/forgot-password">
          <Button
            type="primary"
            size="large"
            className="auth-btn-gradient"
            style={{ width: "auto", paddingInline: 20 }}
          >
            Request new reset link
          </Button>
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
          style={{ textAlign: "center", padding: "8px 0" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="auth-check-icon"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <Text
            style={{
              color: "#374151",
              fontSize: 16,
              fontWeight: 600,
              display: "block",
            }}
          >
            Password reset successful!
          </Text>
          <div style={{ color: "#6b7280", fontSize: 13, marginTop: 6 }}>
            Redirecting to login...
          </div>
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <Text
              style={{
                color: "#374151",
                fontSize: 16,
                fontWeight: 600,
                display: "block",
              }}
            >
              Reset your password
            </Text>
            <div
              style={{
                color: "#6b7280",
                fontSize: 13,
                marginTop: 4,
                lineHeight: 1.5,
              }}
            >
              Choose a new strong password for your account.
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="auth-error"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ marginBottom: 16 }}>
            <label className="auth-label">New password</label>
            <Input.Password
              size="large"
              placeholder="Enter new password"
              className="auth-input-wrapper"
              prefix={
                <LockOutlined style={{ color: "#9ca3af", fontSize: 16 }} />
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            {password && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 3 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        flex: 1,
                        height: 3,
                        borderRadius: 2,
                        background:
                          strength.score / 25 >= i
                            ? strength.color
                            : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>
                <Text
                  style={{
                    color: strength.color,
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                >
                  {strength.label}
                </Text>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="auth-label">Confirm password</label>
            <Input.Password
              size="large"
              placeholder="Repeat new password"
              className="auth-input-wrapper"
              prefix={
                <LockOutlined style={{ color: "#9ca3af", fontSize: 16 }} />
              }
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            {confirmPassword && password !== confirmPassword && (
              <Text
                style={{
                  color: "#ef4444",
                  fontSize: 11,
                  marginTop: 4,
                  display: "block",
                }}
              >
                Passwords do not match
              </Text>
            )}
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: "#fafafa",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: "#6b7280",
                fontSize: 11,
                fontWeight: 500,
                marginBottom: 6,
                display: "block",
              }}
            >
              Password requirements
            </Text>
            {requirements.map((req) => (
              <div
                key={req.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "2px 0",
                }}
              >
                {req.test(password) ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
                <Text
                  style={{
                    color: req.test(password) ? "#22c55e" : "#6b7280",
                    fontSize: 12,
                    transition: "color 0.2s",
                  }}
                >
                  {req.label}
                </Text>
              </div>
            ))}
          </div>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              type="primary"
              size="large"
              onClick={handleSubmit}
              loading={loading}
              disabled={loading}
              className="auth-btn-gradient"
            >
              Reset password <ArrowRightOutlined />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
