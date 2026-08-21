"use client";

import React from "react";
import { Typography, Tag, Space } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "@repo/localization";
import OnboardingStepper from "./onboarding-stepper";
import Step1ProjectStore from "./step1-project-store";
import Step2StoreInfo from "./step2-store-info";
import Step3LanguageSelector from "./step3-language-selector";
import Step4CurrencySelector from "./step4-currency-selector";
import Step5Marketplace from "./step5-marketplace";
import Step5ReviewComplete from "./step5-review-complete";
import OnboardingSuccess from "./onboarding-success";
import { useOnboardingFlow } from "./use-onboarding-flow";
import type { OnboardingStepNumber } from "./types";

const { Title, Text } = Typography;

interface OnboardingWizardProps {
  flow?: ReturnType<typeof useOnboardingFlow>;
  onFinish?: () => void;
}

export default function OnboardingWizard({ flow: externalFlow, onFinish }: OnboardingWizardProps) {
  const t = useTranslations();
  const internalFlow = useOnboardingFlow();
  const flow = externalFlow || internalFlow;

  const handleStepClick = (step: OnboardingStepNumber) => {
    flow.setCurrentStep(step);
  };

  const handleGoToDashboard = () => {
    if (onFinish) {
      onFinish();
    }
  };

  return (
    <div
      style={{
        maxWidth: 880,
        margin: "0 auto",
        padding: "16px 12px 40px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Banner */}
      {flow.currentStep <= 6 && (
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Tag
            color="orange"
            icon={<ThunderboltOutlined />}
            style={{
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            {t("settings.onboarding.welcomeBadge")}
          </Tag>
          <Title
            level={2}
            style={{
              margin: 0,
              fontWeight: 800,
              color: "#0F172A",
              letterSpacing: "-0.02em",
            }}
          >
            {t("settings.onboarding.title")}
          </Title>
          <Text
            type="secondary"
            style={{ fontSize: 15, marginTop: 6, display: "block" }}
          >
            {t("settings.onboarding.subtitle")}
          </Text>
        </div>
      )}

      {/* Stepper */}
      {flow.currentStep <= 6 && (
        <OnboardingStepper
          currentStep={flow.currentStep}
          onStepClick={handleStepClick}
        />
      )}

      {/* Step Content with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={flow.currentStep}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {flow.currentStep === 1 && (
            <Step1ProjectStore
              initialData={flow.formData}
              onSubmit={flow.submitStep1}
              loading={flow.submitting}
              error={flow.error}
            />
          )}

          {flow.currentStep === 2 && (
            <Step2StoreInfo
              initialData={flow.formData}
              onSubmit={flow.submitStep2}
              onBack={flow.goToPreviousStep}
              loading={flow.submitting}
              error={flow.error}
            />
          )}

          {flow.currentStep === 3 && (
            <Step3LanguageSelector
              initialData={flow.formData}
              projectLanguages={flow.projectLanguages}
              onSubmit={flow.submitStep3}
              onBack={flow.goToPreviousStep}
              loading={flow.submitting}
              error={flow.error}
            />
          )}

          {flow.currentStep === 4 && (
            <Step4CurrencySelector
              initialData={flow.formData}
              currencyCatalog={flow.currencyCatalog}
              onSubmit={flow.submitStep4}
              onBack={flow.goToPreviousStep}
              loading={flow.submitting}
              error={flow.error}
            />
          )}

          {flow.currentStep === 5 && (
            <Step5Marketplace
              initialData={flow.formData}
              onSubmit={flow.submitStep5}
              onBack={flow.goToPreviousStep}
              loading={flow.submitting}
              error={flow.error}
            />
          )}

          {flow.currentStep === 6 && (
            <Step5ReviewComplete
              formData={flow.formData}
              onComplete={flow.completeOnboarding}
              onBack={flow.goToPreviousStep}
              loading={flow.submitting}
              error={flow.error}
            />
          )}

          {flow.currentStep === 7 && (
            <OnboardingSuccess
              storeSlug={flow.formData.storeSlug}
              onGoToDashboard={handleGoToDashboard}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
