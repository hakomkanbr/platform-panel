"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button, Input, Typography } from "antd";
import {
  MailOutlined, ArrowRightOutlined, ArrowLeftOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { authApi } from "@repo/auth";

const { Text } = Typography;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleSubmit = useCallback(async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
      setCountdown(10);
    } catch {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [email]);

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
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
            Check your inbox
          </Text>
          <div
            style={{
              color: "#6b7280",
              fontSize: 13,
              marginTop: 6,
              lineHeight: 1.5,
            }}
          >
            We sent a password reset link to{" "}
            <Text style={{ color: "#374151", fontWeight: 600 }}>{email}</Text>
          </div>
          <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 16 }}>
            Redirecting to login in {countdown}s...
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
              Forgot password?
            </Text>
            <div
              style={{
                color: "#6b7280",
                fontSize: 13,
                marginTop: 4,
                lineHeight: 1.5,
              }}
            >
              Enter your email and we&apos;ll send you a reset link.
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

          <div style={{ marginBottom: 20 }}>
            <label className="auth-label">Email Address</label>
            <Input
              size="large"
              placeholder="Enter your email"
              className="auth-input-wrapper"
              prefix={
                <MailOutlined style={{ color: "#9ca3af", fontSize: 16 }} />
              }
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
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
              Send reset link <ArrowRightOutlined />
            </Button>
          </motion.div>

          <div style={{ textAlign: "center", marginTop: 18 }}>
            <Link
              href="/auth/login"
              className="auth-link"
              style={{ fontSize: 13, fontWeight: 400 }}
            >
              <ArrowLeftOutlined style={{ marginRight: 4 }} />
              Back to login
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
