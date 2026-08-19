"use client";

import React from "react";
import { Card, Button, Typography, Space } from "antd";
import {
  CheckCircleFilled,
  ExportOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useTranslations } from "@repo/localization";
import { getStoreUrl } from "@repo/utils";

const { Title, Text, Paragraph } = Typography;

interface OnboardingSuccessProps {
  storeSlug?: string;
  onGoToDashboard: () => void;
}

export default function OnboardingSuccess({
  storeSlug,
  onGoToDashboard,
}: OnboardingSuccessProps) {
  const t = useTranslations();
  const storeUrl = storeSlug ? getStoreUrl(storeSlug) : "";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card
        styles={{ body: { padding: "48px 32px" } }}
        style={{
          borderRadius: 20,
          border: "1px solid #BBF7D0",
          boxShadow: "0 12px 36px rgba(16, 185, 129, 0.1)",
          background: "linear-gradient(180deg, #F0FDF4 0%, #FFFFFF 100%)",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#DCFCE7",
            color: "#16A34A",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 42,
            marginBottom: 20,
            boxShadow: "0 8px 24px rgba(22, 163, 74, 0.2)",
          }}
        >
          <CheckCircleFilled />
        </motion.div>

        <Title
          level={2}
          style={{
            margin: 0,
            fontWeight: 800,
            color: "#0F172A",
            letterSpacing: "-0.02em",
          }}
        >
          {t("settings.onboarding.success.title")}
        </Title>

        <Paragraph
          style={{
            fontSize: 16,
            color: "#475569",
            maxWidth: 520,
            margin: "12px auto 32px",
            lineHeight: 1.6,
          }}
        >
          {t("settings.onboarding.success.subtitle")}
        </Paragraph>

        <Space size={16} wrap style={{ justifyContent: "center" }}>
          {storeUrl && (
            <Button
              size="large"
              icon={<ExportOutlined />}
              onClick={() => window.open(storeUrl, "_blank")}
              style={{
                borderRadius: 12,
                height: 48,
                paddingInline: 24,
                fontWeight: 600,
                borderColor: "#FED7AA",
                background: "#FFF7ED",
                color: "#C2410C",
              }}
            >
              {t("settings.onboarding.success.storeBtn")}
            </Button>
          )}

          <Button
            type="primary"
            size="large"
            icon={<DashboardOutlined />}
            onClick={onGoToDashboard}
            style={{
              borderRadius: 12,
              height: 48,
              paddingInline: 32,
              fontWeight: 700,
              background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
              borderColor: "#15803D",
              boxShadow: "0 6px 16px rgba(22, 163, 74, 0.25)",
            }}
          >
            {t("settings.onboarding.success.dashboardBtn")}
          </Button>
        </Space>
      </Card>
    </motion.div>
  );
}
