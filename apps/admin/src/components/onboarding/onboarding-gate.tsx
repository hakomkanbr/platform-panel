"use client";

import React, { useState } from "react";
import { Spin, Typography } from "antd";
import { motion } from "framer-motion";
import { useTranslations } from "@repo/localization";
import { useOnboardingFlow } from "./use-onboarding-flow";
import OnboardingWizard from "./onboarding-wizard";

const { Text } = Typography;

interface OnboardingGateProps {
  children: React.ReactNode;
}

export default function OnboardingGate({ children }: OnboardingGateProps) {
  const t = useTranslations();
  const flow = useOnboardingFlow();
  const [forceShowDashboard, setForceShowDashboard] = useState(false);

  // While initially loading projects/store state from backend, show clean loading state (no flickering)
  if (flow.isLoadingData && !forceShowDashboard) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          gap: 16,
        }}
      >
        <Spin size="large" />
        <Text type="secondary" style={{ fontSize: 14 }}>
          {t("settings.onboarding.checkingState")}
        </Text>
      </div>
    );
  }

  // If onboarding is incomplete, gate the dashboard and show the Onboarding flow
  if (!flow.onboardingState.isComplete && !forceShowDashboard) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <OnboardingWizard onFinish={() => setForceShowDashboard(true)} />
      </motion.div>
    );
  }

  // Otherwise, render Dashboard
  return <>{children}</>;
}
