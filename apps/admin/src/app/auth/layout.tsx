"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslations } from "@repo/localization";
import {
  LayoutOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  ShopOutlined,
  RiseOutlined,
} from "@ant-design/icons";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations();
  const isRegister = pathname === "/auth/register";
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        width: "100vw",
        background: "#0B0D12",
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Left Column: Ambient Product Showcase (Visible on Large Screens) */}
      <div
        style={{
          flex: 1.2,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 56px",
          background: "linear-gradient(135deg, #0F1117 0%, #16181F 50%, #0F1117 100%)",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          overflow: "hidden",
        }}
        className="auth-showcase-column"
      >
        {/* Animated Background Spheres */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            left: "-150px",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(247,147,30,0.18) 0%, rgba(0,0,0,0) 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: 450,
            height: 450,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,159,227,0.18) 0%, rgba(0,0,0,0) 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        {/* Brand Header */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center" }}>
          <Image 
            src="/assets/images/logo-png.png" 
            alt="Logo"
            width={140}
            height={40}
            style={{ height: 36, width: "auto", objectFit: "contain" }}
            priority
          />
        </div>

        {/* Middle Showcase Content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "relative", zIndex: 2, margin: "auto 0", maxWidth: 540 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 9999,
              background: "rgba(247, 147, 30, 0.12)",
              border: "1px solid rgba(247, 147, 30, 0.25)",
              color: "#F7931E",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            <ThunderboltOutlined /> {t("auth.layout.badge")}
          </div>

          <h1
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.15,
              letterSpacing: "-0.04em",
              marginBottom: 16,
            }}
          >
            {t("auth.layout.headline")} <span style={{ color: "#F7931E" }}>{t("auth.layout.headlineHighlight")}</span>{t("auth.layout.headlineSuffix")}
          </h1>

          <p style={{ fontSize: 16, color: "#9CA3AF", lineHeight: 1.6, marginBottom: 32 }}>
            {t("auth.layout.description")}
          </p>

          {/* Interactive Stats Showcase Card */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              backdropFilter: "blur(16px)",
              borderRadius: 16,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              padding: 24,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#009FE3", fontSize: 13, marginBottom: 4 }}>
                <ShopOutlined /> <span>{t("auth.layout.applications")}</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF", display: "block", whiteSpace: "nowrap" }}>{t("auth.layout.appsCount")}</span>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#10B981", fontSize: 13, marginBottom: 4 }}>
                <CheckCircleOutlined /> <span>{t("auth.layout.uptime")}</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF", display: "block", whiteSpace: "nowrap" }}>{t("auth.layout.uptimeValue")}</span>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#F7931E", fontSize: 13, marginBottom: 4 }}>
                <RiseOutlined /> <span>{t("auth.layout.architecture")}</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF", display: "block", whiteSpace: "nowrap" }}>{t("auth.layout.architectureValue")}</span>
            </div>
          </div>
        </motion.div>

        {/* Footer Security Note */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 12, color: "#6B7280", fontSize: 13 }}>
          <SafetyCertificateOutlined style={{ color: "#10B981", fontSize: 18 }} />
          <span>{t("auth.layout.security")}</span>
        </div>
      </div>

      {/* Right Column: Sleek Auth Form Container */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          background: "#FAFBFC",
          position: "relative",
        }}
      >
        <div style={{ width: "100%", maxWidth: isRegister ? 560 : 420 }}>
          {children}
        </div>
      </div>
    </div>
  );
}