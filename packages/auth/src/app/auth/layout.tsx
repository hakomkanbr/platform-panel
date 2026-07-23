"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        position: "relative",
        overflow: "auto",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "#fff",
          borderRadius: 16,
          maxWidth: 500,
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ padding: "32px 36px 28px", textAlign: "center" }}>
          <Link href="https://bremix.tech" style={{ display: "inline-block" }}>
            <img
              src="/assets/images/logo-png.png"
              alt="logo"
              width={240}
              height={70}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Link>

          <div
            style={{
              color: "#6b7280",
              fontSize: 14,
              marginTop: 8,
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            Welcome back to your admin panel
          </div>

          <div style={{ textAlign: "left", marginTop: 22 }}>
            {children}
          </div>

          <div
            style={{
              marginTop: 22,
              paddingTop: 14,
              color: "#9ca3af",
              fontSize: 12,
            }}
          >
            Powered by{" "}
            <a
              href="https://bremix.tech"
              style={{ color: "#F7931E", textDecoration: "none" }}
            >
              Bremix Tech
            </a>{" "}
            &copy; Secure &amp; Modern
          </div>
        </div>
      </motion.div>
    </div>
  );
}
