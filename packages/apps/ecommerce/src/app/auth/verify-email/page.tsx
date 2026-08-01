"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Typography } from "antd";
import { MailOutlined, ReloadOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/auth";

const { Text } = Typography;

export default function VerifyEmailPage() {
  const router = useRouter();
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
          setTimeout(() => router.push("/panel"), 1500);
        }
      } catch {}
    }, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [email, router]);

  useEffect(() => {
    if (countdown > 0) { const t = setTimeout(() => setCountdown(countdown - 1), 1000); return () => clearTimeout(t); }
  }, [countdown]);

  const handleResend = useCallback(async () => {
    if (countdown > 0) return;
    setResending(true);
    try { await authApi.forgotPassword(email); setCountdown(60); }
    catch {}
    finally { setResending(false); }
  }, [email, countdown]);

  return (
    <AnimatePresence mode="wait">
      {verified ? (
        <motion.div key="verified" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }} style={{ textAlign: "center", padding: "8px 0" }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ width: 52, height: 52, borderRadius: "50%", background: "#f0fdf4", border: "1.5px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <Text style={{ color: "#374151", fontSize: 16, fontWeight: 600, display: "block" }}>Email verified!</Text>
          <div style={{ color: "#6b7280", fontSize: 13, marginTop: 6 }}>Redirecting to your dashboard...</div>
        </motion.div>
      ) : (
        <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center" }}>
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: "0 6px 20px rgba(99,102,241,0.25)" }}>
            <MailOutlined style={{ fontSize: 24, color: "#fff" }} />
          </motion.div>
          <Text style={{ color: "#374151", fontSize: 16, fontWeight: 600, display: "block" }}>Check your inbox</Text>
          <div style={{ color: "#6b7280", fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
            We sent a verification link to <Text style={{ color: "#374151", fontWeight: 600 }}>{email}</Text>
          </div>
          <div style={{ margin: "18px 0", padding: 12, borderRadius: 8, background: "#fafafa", color: "#6b7280", fontSize: 12, lineHeight: 1.5 }}>
            Didn&apos;t receive the email? Check your spam folder or request a new one below.
          </div>
          <Button type="primary" size="large" icon={<ReloadOutlined />} onClick={handleResend} loading={resending} disabled={countdown > 0 || resending}
            style={{ width: "100%", height: 42, borderRadius: 8, fontSize: 14, fontWeight: 500, border: "none", background: countdown > 0 ? "#9ca3af" : "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend verification email"}
          </Button>
          <div style={{ marginTop: 14 }}>
            <Link href="/auth/login" style={{ color: "#6366f1", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
              <ArrowRightOutlined style={{ marginRight: 4 }} /> Back to login
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
