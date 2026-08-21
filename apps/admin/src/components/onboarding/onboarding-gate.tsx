"use client";

import React, { useState, useEffect } from "react";
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
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);

  useEffect(() => {
    if (!flow.isLoadingData && !initialCheckDone) {
      setIsOnboardingActive(!flow.onboardingState.isComplete);
      setInitialCheckDone(true);
    }
  }, [flow.isLoadingData, flow.onboardingState.isComplete, initialCheckDone]);

  // While initially loading projects/store state from backend, show clean loading state (no flickering)
  if (!initialCheckDone || (flow.isLoadingData && !isOnboardingActive)) {
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

  // If onboarding is active, render the Onboarding flow until user explicitly finishes
  if (isOnboardingActive) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <OnboardingWizard
          flow={flow}
          onFinish={() => setIsOnboardingActive(false)}
        />
      </motion.div>
    );
  }

  // Otherwise, render Dashboard
  return <>{children}</>;
}
