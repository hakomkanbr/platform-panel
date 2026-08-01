"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button, Input, Typography } from "antd";
import { MailOutlined, ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { authApi } from "@/lib/api/auth";

const { Text } = Typography;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) { const t = setTimeout(() => setCountdown(countdown - 1), 1000); return () => clearTimeout(t); }
  }, [countdown]);

  const handleSubmit = useCallback(async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email address"); return; }
    setError(null); setLoading(true);
    try { await authApi.forgotPassword(email.trim()); setSent(true); setCountdown(10); }
    catch { setError("Failed to send reset email. Please try again."); }
    finally { setLoading(false); }
  }, [email]);

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }} style={{ textAlign: "center", padding: "8px 0" }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ width: 52, height: 52, borderRadius: "50%", background: "#f0fdf4", border: "1.5px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <Text style={{ color: "#374151", fontSize: 16, fontWeight: 600, display: "block" }}>Check your inbox</Text>
          <div style={{ color: "#6b7280", fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
            We sent a password reset link to <Text style={{ color: "#374151", fontWeight: 600 }}>{email}</Text>
          </div>
          <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 16 }}>Redirecting to login in {countdown}s...</div>
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ marginBottom: 6 }}>
            <Text style={{ color: "#374151", fontSize: 20, fontWeight: 700, display: "block", letterSpacing: "-0.03em" }}>Forgot password?</Text>
            <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
              Enter your email and we&apos;ll send you a reset link.
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ padding: "10px 14px", borderRadius: 8, marginBottom: 14, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13, textAlign: "center" }}>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ marginBottom: 20 }}>
            <label style={{ color: "#374151", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Email Address</label>
            <Input size="large" placeholder="Enter your email" prefix={<MailOutlined style={{ color: "#9ca3af", fontSize: 15 }} />}
              value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{ borderRadius: 10, height: 46, padding: "0 14px" }} />
          </div>

          <Button type="primary" size="large" onClick={handleSubmit} loading={loading} disabled={loading}
            style={{ width: "100%", height: 46, borderRadius: 10, fontSize: 15, fontWeight: 600, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}>
            Send reset link <ArrowRightOutlined />
          </Button>

          <div style={{ textAlign: "center", marginTop: 18 }}>
            <Link href="/auth/login" style={{ color: "#6366f1", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
              <ArrowLeftOutlined style={{ marginRight: 4 }} /> Back to login
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
