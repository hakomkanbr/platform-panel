"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslations, LocaleSwitcher } from "@repo/localization";
import {
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  ShopOutlined,
  RiseOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import "./auth.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations();
  const isRegister = pathname === "/auth/register";

  return (
    <div className="auth-root-wrapper">
      {/* Left Column: Ambient Product Showcase (Visible on Large Screens >= 1024px) */}
      <div className="auth-showcase-column">
        {/* Animated Ambient Glow Spheres */}
        <div className="auth-ambient-orb-1" />
        <div className="auth-ambient-orb-2" />

        {/* Brand Header */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center" }}>
          <Link href="https://bremix.tech" target="_blank" rel="noopener noreferrer">
            <Image
              src="/assets/images/logo-png.png"
              alt="Logo"
              width={150}
              height={44}
              style={{ height: 38, width: "auto", objectFit: "contain" }}
              priority
            />
          </Link>
        </div>

        {/* Middle Showcase Content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "relative", zIndex: 2, margin: "auto 0", maxWidth: 560 }}
        >
          <div className="auth-showcase-badge">
            <ThunderboltOutlined /> {t("auth.layout.badge")}
          </div>

          <h1 className="auth-showcase-title">
            {t("auth.layout.headline")}{" "}
            <span style={{ color: "#F7931E" }}>{t("auth.layout.headlineHighlight")}</span>
            {t("auth.layout.headlineSuffix")}
          </h1>

          <p className="auth-showcase-desc">
            {t("auth.layout.description")}
          </p>

          {/* Interactive Stats Showcase Card */}
          <div className="auth-stats-grid">
            <div className="auth-stat-card">
              <div className="auth-stat-header" style={{ color: "#009FE3" }}>
                <ShopOutlined /> <span>{t("auth.layout.applications")}</span>
              </div>
              <span className="auth-stat-value">{t("auth.layout.appsCount")}</span>
            </div>
            <div className="auth-stat-card">
              <div className="auth-stat-header" style={{ color: "#10B981" }}>
                <CheckCircleOutlined /> <span>{t("auth.layout.uptime")}</span>
              </div>
              <span className="auth-stat-value">{t("auth.layout.uptimeValue")}</span>
            </div>
            <div className="auth-stat-card">
              <div className="auth-stat-header" style={{ color: "#F7931E" }}>
                <RiseOutlined /> <span>{t("auth.layout.architecture")}</span>
              </div>
              <span className="auth-stat-value">{t("auth.layout.architectureValue")}</span>
            </div>
          </div>
        </motion.div>

        {/* Footer Security Note */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 12, color: "#9CA3AF", fontSize: 13 }}>
          <SafetyCertificateOutlined style={{ color: "#10B981", fontSize: 18 }} />
          <span>{t("auth.layout.security")}</span>
        </div>
      </div>

      {/* Right Column: Sleek Auth Form Container (Responsive across all screens) */}
      <div className="auth-form-column">
        {/* Top Utility Bar (Mobile Branding + Language Switcher) */}
        <header className="auth-top-bar">
          <div className="auth-mobile-logo">
            <Link href="https://bremix.tech" target="_blank" rel="noopener noreferrer">
              <Image
                src="/assets/images/logo-png.png"
                alt="Logo"
                width={130}
                height={38}
                style={{ height: 32, width: "auto", objectFit: "contain" }}
                priority
              />
            </Link>
          </div>
          <div style={{ marginInlineStart: "auto" }}>
            <LocaleSwitcher />
          </div>
        </header>

        {/* Center Form Card */}
        <main className={`auth-card-container ${isRegister ? "is-register" : ""}`}>
          <div className="auth-card">
            {children}
          </div>
        </main>

        {/* Bottom Copyright Footer */}
        <footer className="auth-bottom-footer">
          <SafetyCertificateOutlined style={{ color: "#10B981" }} />
          <span>Powered by Bremix Tech • Enterprise Platform</span>
        </footer>
      </div>
    </div>
  );
}