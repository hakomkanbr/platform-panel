"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Input,
  Typography,
  Select,
  Checkbox,
  message,
  Spin,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  BankOutlined,
  TeamOutlined,
  GlobalOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@repo/auth";
import { useTranslations } from "@repo/localization";

const { Text, Title } = Typography;

const INDUSTRIES = [
  { key: "technology", value: "Technology" },
  { key: "healthcare", value: "Healthcare" },
  { key: "finance", value: "Finance" },
  { key: "education", value: "Education" },
  { key: "ecommerce", value: "E-commerce" },
  { key: "realEstate", value: "Real Estate" },
  { key: "mediaEntertainment", value: "Media & Entertainment" },
  { key: "consulting", value: "Consulting" },
  { key: "manufacturing", value: "Manufacturing" },
  { key: "other", value: "Other" },
];

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 10;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[a-z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  if (score < 30) return { score, labelKey: "strengthWeak", color: "#ef4444" };
  if (score < 50) return { score, labelKey: "strengthFair", color: "#f59e0b" };
  if (score < 75) return { score, labelKey: "strengthStrong", color: "#22c55e" };
  return { score, labelKey: "strengthVeryStrong", color: "#F7931E" };
}

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations();

  const stepConfigs = [
    { id: 0, label: t("auth.register.stepAccount"), icon: <UserOutlined />, title: t("auth.register.createAccountTitle"), desc: t("auth.register.createAccountDesc") },
    { id: 1, label: t("auth.register.stepCompany"), icon: <BankOutlined />, title: t("auth.register.companyDetailsTitle"), desc: t("auth.register.companyDetailsDesc") },
    { id: 2, label: t("auth.register.stepReview"), icon: <CheckCircleFilled />, title: t("auth.register.almostDoneTitle"), desc: t("auth.register.almostDoneDesc") },
  ];
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [passwordDirty, setPasswordDirty] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
    companyName: "", industry: "", teamSize: 0,
  });

  const updateForm = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const strength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  const checkStep1 = () => {
    if (!form.firstName.trim()) { setError(t("auth.register.firstNameRequired")); return false; }
    if (!form.lastName.trim()) { setError(t("auth.register.lastNameRequired")); return false; }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) { setError(t("auth.register.validEmailRequired")); return false; }
    if (form.password.length < 8) { setError(t("auth.register.passwordMinChars")); return false; }
    if (form.password !== form.confirmPassword) { setError(t("auth.register.passwordsDoNotMatch")); return false; }
    return true;
  };

  const handleNext = useCallback(() => {
    setError(null);
    if (step === 0 && checkStep1()) setStep(1);
    else if (step === 1) {
      if (!form.companyName.trim()) { setError(t("auth.register.companyNameRequired")); return; }
      setStep(2);
    }
  }, [step, form, t]);

  const handleBack = useCallback(() => {
    setError(null);
    if (step > 0) setStep(step - 1);
  }, [step]);

  const handleRegister = useCallback(async () => {
    if (!acceptedTerms) { setError(t("auth.register.acceptTerms")); return; }
    setError(null);
    setLoading(true);
    try {
      const result = await authApi.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        companyName: form.companyName,
        industry: form.industry,
        teamSize: form.teamSize || undefined,
      });
      if (result.success) {
        message.success(t("auth.register.accountCreated"));
        router.push(`/auth/verify-email?email=${encodeURIComponent(form.email)}`);
      } else {
        setError(result.error?.message || t("auth.register.registrationFailed"));
      }
    } catch {
      setError(t("auth.register.connectionError"));
    } finally {
      setLoading(false);
    }
  }, [form, acceptedTerms, router, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header section */}
      <div className="auth-header-section" style={{ textAlign: "center", marginBottom: 20 }}>
        <Title level={2} className="auth-main-title">
          {stepConfigs[step].title}
        </Title>
        <Text className="auth-subtitle">
          {stepConfigs[step].desc}
        </Text>
      </div>

      {/* Stepper Bar */}
      <div className="auth-stepper-container">
        {stepConfigs.map((cfg, i) => (
          <React.Fragment key={cfg.id}>
            <div className="auth-step-item">
              <div
                className="auth-step-circle"
                style={{
                  background: i <= step
                    ? "linear-gradient(135deg, #F7931E, #E67E00)"
                    : "#FFFFFF",
                  color: i <= step ? "#FFFFFF" : "#9CA3AF",
                  border: i > step ? "1.5px solid #D1D5DB" : "none",
                  boxShadow: i === step
                    ? "0 0 0 4px rgba(247, 147, 30, 0.15)"
                    : i < step
                      ? "0 2px 8px rgba(247, 147, 30, 0.25)"
                      : "none",
                }}
              >
                {i < step ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span
                className="auth-step-label"
                style={{
                  color: i === step ? "#F7931E" : i < step ? "#10B981" : "#9CA3AF",
                  fontWeight: i === step ? 700 : 500,
                }}
              >
                {cfg.label}
              </span>
            </div>
            {i < stepConfigs.length - 1 && (
              <div
                className="auth-step-line"
                style={{
                  background: i < step
                    ? "linear-gradient(90deg, #F7931E, #E67E00)"
                    : "#E5E7EB",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="auth-error-banner"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* Step 0: Account Details */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div style={{ background: "#F9FAFB", border: "1px solid #F3F4F6", borderRadius: 14, padding: "clamp(14px, 3vw, 20px)", marginBottom: 18 }}>
              {/* First Name & Last Name */}
              <div className="auth-form-grid-2">
                <div>
                  <label className="auth-label">{t("auth.register.firstName")}</label>
                  <Input
                    size="large"
                    placeholder={t("auth.register.firstNamePlaceholder")}
                    prefix={<UserOutlined style={{ color: "#9CA3AF", fontSize: 15, marginInlineEnd: 4 }} />}
                    value={form.firstName}
                    onChange={(e) => updateForm("firstName", e.target.value)}
                    className="auth-input-custom"
                  />
                </div>
                <div>
                  <label className="auth-label">{t("auth.register.lastName")}</label>
                  <Input
                    size="large"
                    placeholder={t("auth.register.lastNamePlaceholder")}
                    prefix={<UserOutlined style={{ color: "#9CA3AF", fontSize: 15, marginInlineEnd: 4 }} />}
                    value={form.lastName}
                    onChange={(e) => updateForm("lastName", e.target.value)}
                    className="auth-input-custom"
                  />
                </div>
              </div>

              {/* Email & Password */}
              <div className="auth-form-grid-2">
                <div>
                  <label className="auth-label">{t("auth.register.email")}</label>
                  <Input
                    size="large"
                    type="email"
                    placeholder={t("auth.register.emailPlaceholder")}
                    prefix={<MailOutlined style={{ color: "#9CA3AF", fontSize: 15, marginInlineEnd: 4 }} />}
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    className="auth-input-custom"
                  />
                </div>
                <div>
                  <label className="auth-label">{t("auth.register.password")}</label>
                  <Input.Password
                    size="large"
                    placeholder={t("auth.register.createPasswordPlaceholder")}
                    prefix={<LockOutlined style={{ color: "#9CA3AF", fontSize: 15, marginInlineEnd: 4 }} />}
                    value={form.password}
                    onChange={(e) => { setPasswordDirty(true); updateForm("password", e.target.value); }}
                    iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                    className="auth-input-custom"
                  />
                </div>
              </div>

              {/* Password Strength Indicator */}
              {passwordDirty && form.password && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 4,
                          borderRadius: 2,
                          background: strength.score / 25 >= i ? strength.color : "#E5E7EB",
                          transition: "background 0.3s ease",
                        }}
                      />
                    ))}
                  </div>
                  <Text style={{ color: strength.color, fontSize: 11, fontWeight: 600 }}>
                    {t(`auth.register.${strength.labelKey}`)}
                  </Text>
                </div>
              )}

              {/* Confirm Password */}
              <div>
                <label className="auth-label">{t("auth.register.confirmPassword")}</label>
                <Input.Password
                  size="large"
                  placeholder={t("auth.register.repeatPasswordPlaceholder")}
                  prefix={<LockOutlined style={{ color: "#9CA3AF", fontSize: 15, marginInlineEnd: 4 }} />}
                  value={form.confirmPassword}
                  onChange={(e) => updateForm("confirmPassword", e.target.value)}
                  iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                  className="auth-input-custom"
                />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <Text style={{ color: "#EF4444", fontSize: 11, marginTop: 4, display: "block" }}>
                    {t("auth.register.passwordsDoNotMatch")}
                  </Text>
                )}
              </div>
            </div>

            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="auth-submit-btn"
            >
              <span>{t("auth.register.continue")}</span>
              <ArrowRightOutlined />
            </motion.button>
          </motion.div>
        )}

        {/* Step 1: Company Details */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div style={{ background: "#F9FAFB", border: "1px solid #F3F4F6", borderRadius: 14, padding: "clamp(14px, 3vw, 20px)", marginBottom: 18 }}>
              <div className="auth-form-grid-2">
                <div>
                  <label className="auth-label">{t("auth.register.companyName")}</label>
                  <Input
                    size="large"
                    placeholder={t("auth.register.companyPlaceholder")}
                    prefix={<BankOutlined style={{ color: "#9CA3AF", fontSize: 15, marginInlineEnd: 4 }} />}
                    value={form.companyName}
                    onChange={(e) => updateForm("companyName", e.target.value)}
                    className="auth-input-custom"
                  />
                </div>
                <div>
                  <label className="auth-label">{t("auth.register.industry")}</label>
                  <Select
                    size="large"
                    placeholder={t("auth.register.selectIndustry")}
                    value={form.industry || undefined}
                    onChange={(v) => updateForm("industry", v)}
                    style={{ width: "100%", height: 48 }}
                    options={INDUSTRIES.map((ind) => ({ label: t(`auth.register.industries.${ind.key}`), value: ind.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="auth-label">{t("auth.register.teamSize")}</label>
                <Select
                  size="large"
                  placeholder={t("auth.register.howManyPeople")}
                  value={form.teamSize || undefined}
                  onChange={(v) => updateForm("teamSize", v)}
                  style={{ width: "100%", height: 48 }}
                  options={[
                    { label: t("auth.register.teamJustMe"), value: 1 },
                    { label: "2-10", value: 5 },
                    { label: "11-50", value: 25 },
                    { label: "51-200", value: 100 },
                    { label: "200+", value: 300 },
                  ]}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={handleBack} className="auth-secondary-btn">
                <ArrowLeftOutlined />
                <span>{t("auth.register.back")}</span>
              </button>
              <button onClick={handleNext} className="auth-submit-btn">
                <span>{t("auth.register.continue")}</span>
                <ArrowRightOutlined />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Review & Submit */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "#F0FDF4",
                  border: "1.5px solid #BBF7D0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                }}
              >
                <CheckCircleFilled style={{ fontSize: 26, color: "#10B981" }} />
              </motion.div>
              <Text style={{ color: "#374151", fontSize: 16, fontWeight: 700, display: "block" }}>
                {t("auth.register.reviewInformation")}
              </Text>
              <div style={{ color: "#6B7280", fontSize: 13, marginTop: 2 }}>
                {t("auth.register.reviewBeforeCreate")}
              </div>
            </div>

            <div style={{ background: "#F9FAFB", border: "1px solid #F3F4F6", borderRadius: 14, padding: "clamp(12px, 3vw, 18px)", marginBottom: 16 }}>
              {[
                { label: t("auth.register.name"), value: `${form.firstName} ${form.lastName}`, icon: <UserOutlined style={{ fontSize: 14 }} /> },
                { label: t("auth.register.email"), value: form.email, icon: <MailOutlined style={{ fontSize: 14 }} /> },
                { label: t("auth.register.company"), value: form.companyName, icon: <BankOutlined style={{ fontSize: 14 }} /> },
                { label: t("auth.register.industry"), value: form.industry || t("auth.register.notSpecified"), icon: <GlobalOutlined style={{ fontSize: 14 }} /> },
                { label: t("auth.register.teamSize"), value: form.teamSize ? t("auth.register.teamSizePeople", { count: form.teamSize }) : t("auth.register.notSpecified"), icon: <TeamOutlined style={{ fontSize: 14 }} /> },
              ].map((item, i) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 0",
                    borderBottom: i < 4 ? "1px solid #E5E7EB" : "none",
                  }}
                >
                  <span style={{ color: "#9CA3AF", width: 20, display: "flex", justifyContent: "center" }}>{item.icon}</span>
                  <div style={{ flex: 1, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                    <Text style={{ color: "#6B7280", fontSize: 12 }}>{item.label}</Text>
                    <Text style={{ color: "#1F2937", fontSize: 13, fontWeight: 600 }}>{item.value}</Text>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 18 }}>
              <Checkbox
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                style={{ color: "#6B7280", fontSize: 12, lineHeight: 1.5 }}
              >
                {t("auth.register.agreeTo")}{" "}
                <Link href="/terms" style={{ color: "#F7931E", fontWeight: 600, textDecoration: "none" }}>
                  {t("auth.register.termsOfService")}
                </Link>{" "}
                {t("auth.register.and")}{" "}
                <Link href="/privacy" style={{ color: "#F7931E", fontWeight: 600, textDecoration: "none" }}>
                  {t("auth.register.privacyPolicy")}
                </Link>
              </Checkbox>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={handleBack} className="auth-secondary-btn">
                <ArrowLeftOutlined />
                <span>{t("auth.register.back")}</span>
              </button>
              <button
                onClick={handleRegister}
                disabled={loading || !acceptedTerms}
                className="auth-submit-btn"
              >
                {loading ? (
                  <>
                    <Spin size="small" style={{ color: "#fff" }} />
                    <span>{t("auth.register.createAccount")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("auth.register.createAccount")}</span>
                    <ArrowRightOutlined />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Already have account */}
      <div style={{ textAlign: "center", marginTop: 22 }}>
        <Text style={{ color: "#6B7280", fontSize: 13 }}>
          {t("auth.register.alreadyHaveAccount")}{" "}
          <Link href="/auth/login" style={{ color: "#F7931E", fontWeight: 700, textDecoration: "none" }}>
            {t("auth.register.signIn")}
          </Link>
        </Text>
      </div>
    </motion.div>
  );
}
