"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    }}>
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", top: "-50%", left: "-20%",
        width: "600px", height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: "-30%", right: "-10%",
        width: "500px", height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "rgba(255,255,255,0.98)",
          backdropFilter: "blur(20px)",
          borderRadius: 20,
          boxShadow: "0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
          maxWidth: 420,
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ padding: "36px 40px 32px", textAlign: "center" }}>
          <Link href="https://bremix.tech" style={{ display: "inline-block" }}>
            <img
              src="/assets/images/logo-png.png"
              alt="logo"
              width={200}
              height={58}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Link>

          <div style={{ textAlign: "left", marginTop: 24 }}>{children}</div>

          <div style={{
            marginTop: 24, paddingTop: 16,
            borderTop: "1px solid #f3f4f6",
            color: "#9ca3af", fontSize: 12,
          }}>
            Powered by{" "}
            <a href="https://bremix.tech" style={{ color: "#6366f1", textDecoration: "none", fontWeight: 500 }}>
              Bremix Tech
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
