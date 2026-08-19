"use client";

import React from "react";
import { Steps, Typography, Progress } from "antd";
import {
  FolderOutlined,
  ShopOutlined,
  GlobalOutlined,
  DollarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import type { OnboardingStepNumber } from "./types";

const { Text } = Typography;

interface OnboardingStepperProps {
  currentStep: OnboardingStepNumber;
  onStepClick?: (step: OnboardingStepNumber) => void;
}

export default function OnboardingStepper({ currentStep, onStepClick }: OnboardingStepperProps) {
  const t = useTranslations();

  const stepItems = [
    {
      title: t("settings.onboarding.steps.project"),
      icon: <FolderOutlined />,
    },
    {
      title: t("settings.onboarding.steps.store"),
      icon: <ShopOutlined />,
    },
    {
      title: t("settings.onboarding.steps.language"),
      icon: <GlobalOutlined />,
    },
    {
      title: t("settings.onboarding.steps.currency"),
      icon: <DollarOutlined />,
    },
    {
      title: t("settings.onboarding.steps.review"),
      icon: <CheckCircleOutlined />,
    },
  ];

  const currentIdx = Math.min(Math.max(currentStep - 1, 0), 4);
  const percent = Math.round(((currentIdx + 1) / 5) * 100);

  return (
    <div style={{ width: "100%", marginBottom: 28 }}>
      {/* Desktop Stepper */}
      <div className="onboarding-stepper-desktop" style={{ display: "block" }}>
        <Steps
          current={currentIdx}
          items={stepItems.map((item, idx) => ({
            ...item,
            disabled: idx >= currentStep,
          }))}
          onChange={(step) => {
            if (onStepClick && step < currentStep) {
              onStepClick((step + 1) as OnboardingStepNumber);
            }
          }}
          size="small"
          responsive={false}
          style={{
            background: "#FFFFFF",
            padding: "16px 20px",
            borderRadius: 14,
            border: "1px solid #F1F5F9",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
          }}
        />
      </div>

      {/* Mobile Stepper Header */}
      <div className="onboarding-stepper-mobile" style={{ display: "none", background: "#FFFFFF", padding: 14, borderRadius: 12, border: "1px solid #F1F5F9" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <Text strong style={{ fontSize: 14, color: "#1E293B" }}>
            {stepItems[currentIdx]?.title}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t("settings.onboarding.stepCounter", {
              current: currentIdx + 1,
              total: 5,
            })}
          </Text>
        </div>
        <Progress percent={percent} size="small" strokeColor="#F7931E" showInfo={false} />
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .onboarding-stepper-desktop {
            display: none !important;
          }
          .onboarding-stepper-mobile {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
