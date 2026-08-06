"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Button,
  Input,
  Typography,
  Space,
  Select,
  Checkbox,
  message,
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
    <>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Text style={{ color: "#374151", fontSize: 17, fontWeight: 600, display: "block" }}>
          {stepConfigs[step].title}
        </Text>
        <div style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>
          {stepConfigs[step].desc}
        </div>
      </div>

      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 0,
        marginBottom: 24,
        padding: "0 8px",
      }}>
        {stepConfigs.map((cfg, i) => (
          <React.Fragment key={cfg.id}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <motion.div
                animate={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: i <= step
                    ? "linear-gradient(135deg, #F7931E, #E67E00)"
                    : "#fff",
                  color: i <= step ? "#fff" : "#9ca3af",
                  fontSize: 16,
                  border: i > step ? "1.5px solid #d1d5db" : "none",
                  boxShadow: i === step
                    ? "0 0 0 4px rgba(247,147,30,0.15)"
                    : i < step
                      ? "0 2px 8px rgba(247,147,30,0.25)"
                      : "none",
                }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {i < step ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span style={{ fontWeight: 600 }}>{i + 1}</span>
                )}
              </motion.div>
              <span style={{
                fontSize: 11,
                color: i === step ? "#F7931E" : i < step ? "#22c55e" : "#9ca3af",
                fontWeight: i === step ? 600 : 400,
                transition: "color 0.3s",
              }}>
                {cfg.label}
              </span>
            </div>
            {i < stepConfigs.length - 1 && (
              <div style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                paddingTop: 0,
                margin: "0 6px",
              }}>
                <motion.div
                  animate={{
                    height: 2,
                    width: "100%",
                    borderRadius: 1,
                    background: i < step
                      ? "linear-gradient(90deg, #F7931E, #E67E00)"
                      : "#e5e7eb",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
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
            className="auth-error"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div style={{ border: "1px solid #f0f0f0", borderRadius: 10, padding: 16, marginBottom: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div>
                  <label className="auth-label">{t("auth.register.firstName")}</label>
                  <Input
                    size="large" placeholder={t("auth.register.firstNamePlaceholder")}
                    className="auth-input-wrapper"
                    prefix={<UserOutlined style={{ color: "#9ca3af", fontSize: 15 }} />}
                    value={form.firstName}
                    onChange={(e) => updateForm("firstName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="auth-label">{t("auth.register.lastName")}</label>
                  <Input
                    size="large" placeholder={t("auth.register.lastNamePlaceholder")}
                    className="auth-input-wrapper"
                    prefix={<UserOutlined style={{ color: "#9ca3af", fontSize: 15 }} />}
                    value={form.lastName}
                    onChange={(e) => updateForm("lastName", e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div>
                  <label className="auth-label">{t("auth.register.email")}</label>
                  <Input
                    size="large" placeholder={t("auth.register.emailPlaceholder")}
                    className="auth-input-wrapper"
                    prefix={<MailOutlined style={{ color: "#9ca3af", fontSize: 15 }} />}
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="auth-label">{t("auth.register.password")}</label>
                  <Input.Password
                    size="large" placeholder={t("auth.register.createPasswordPlaceholder")}
                    className="auth-input-wrapper"
                    prefix={<LockOutlined style={{ color: "#9ca3af", fontSize: 15 }} />}
                    value={form.password}
                    onChange={(e) => { setPasswordDirty(true); updateForm("password", e.target.value); }}
                    iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                  />
                </div>
              </div>
              {passwordDirty && form.password && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 3 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div key={i} animate={{ flex: 1, height: 3, borderRadius: 2, background: strength.score / 25 >= i ? strength.color : "#e5e7eb" }} />
                    ))}
                  </div>
                  <Text style={{ color: strength.color, fontSize: 11, fontWeight: 500 }}>{t(`auth.register.${strength.labelKey}`)}</Text>
                </div>
              )}

              <div>
                <label className="auth-label">{t("auth.register.confirmPassword")}</label>
                <Input.Password
                  size="large" placeholder={t("auth.register.repeatPasswordPlaceholder")}
                  className="auth-input-wrapper"
                  prefix={<LockOutlined style={{ color: "#9ca3af", fontSize: 15 }} />}
                  value={form.confirmPassword}
                  onChange={(e) => updateForm("confirmPassword", e.target.value)}
                  iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <Text style={{ color: "#ef4444", fontSize: 11, marginTop: 4, display: "block" }}>{t("auth.register.passwordsDoNotMatch")}</Text>
                )}
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button type="primary" size="large" onClick={handleNext} className="auth-btn-gradient">
                <Space>{t("auth.register.continue")} <ArrowRightOutlined /></Space>
              </Button>
            </motion.div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div style={{ border: "1px solid #f0f0f0", borderRadius: 10, padding: 16, marginBottom: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div>
                  <label className="auth-label">{t("auth.register.companyName")}</label>
                  <Input
                    size="large" placeholder={t("auth.register.companyPlaceholder")}
                    className="auth-input-wrapper"
                    prefix={<BankOutlined style={{ color: "#9ca3af", fontSize: 15 }} />}
                    value={form.companyName}
                    onChange={(e) => updateForm("companyName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="auth-label">{t("auth.register.industry")}</label>
                  <Select
                    size="large" placeholder={t("auth.register.selectIndustry")}
                    value={form.industry || undefined}
                    onChange={(v) => updateForm("industry", v)}
                    style={{ width: "100%" }}
                    options={INDUSTRIES.map((ind) => ({ label: t(`auth.register.industries.${ind.key}`), value: ind.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="auth-label">{t("auth.register.teamSize")}</label>
                <Select
                  size="large" placeholder={t("auth.register.howManyPeople")}
                  value={form.teamSize || undefined}
                  onChange={(v) => updateForm("teamSize", v)}
                  style={{ width: "100%" }}
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

            <Space style={{ width: "100%" }} size={10}>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} style={{ flex: 1 }}>
                <Button size="large" icon={<ArrowLeftOutlined />} onClick={handleBack} className="auth-btn-outline">
                  {t("auth.register.back")}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} style={{ flex: 1 }}>
                <Button type="primary" size="large" onClick={handleNext} className="auth-btn-gradient">
                  <Space>{t("auth.register.continue")} <ArrowRightOutlined /></Space>
                </Button>
              </motion.div>
            </Space>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "#f0fdf4", border: "1.5px solid #bbf7d0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                <CheckCircleFilled style={{ fontSize: 28, color: "#22c55e" }} />
              </motion.div>
              <Text style={{ color: "#374151", fontSize: 15, fontWeight: 600, display: "block" }}>{t("auth.register.reviewInformation")}</Text>
              <div style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>{t("auth.register.reviewBeforeCreate")}</div>
            </div>

            <div style={{ border: "1px solid #f0f0f0", borderRadius: 10, padding: 16, marginBottom: 16 }}>
              {[
                { label: t("auth.register.name"), value: `${form.firstName} ${form.lastName}`, icon: <UserOutlined style={{ fontSize: 14 }} /> },
                { label: t("auth.register.email"), value: form.email, icon: <MailOutlined style={{ fontSize: 14 }} /> },
                { label: t("auth.register.company"), value: form.companyName, icon: <BankOutlined style={{ fontSize: 14 }} /> },
                { label: t("auth.register.industry"), value: form.industry || t("auth.register.notSpecified"), icon: <GlobalOutlined style={{ fontSize: 14 }} /> },
                { label: t("auth.register.teamSize"), value: form.teamSize ? t("auth.register.teamSizePeople", { count: form.teamSize }) : t("auth.register.notSpecified"), icon: <TeamOutlined style={{ fontSize: 14 }} /> },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < 4 ? "1px solid #f3f4f6" : "none" }}
                >
                  <span style={{ color: "#9ca3af", width: 18, display: "flex", justifyContent: "center" }}>{item.icon}</span>
                  <div style={{ flex: 1, display: "flex", justifyContent: "space-between" }}>
                    <Text style={{ color: "#6b7280", fontSize: 12 }}>{item.label}</Text>
                    <Text style={{ color: "#374151", fontSize: 13, fontWeight: 500 }}>{item.value}</Text>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <Checkbox checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} style={{ color: "#6b7280", fontSize: 12 }}>
                {t("auth.register.agreeTo")}{" "}
                <Link href="/terms" className="auth-link" style={{ fontSize: 12 }}>{t("auth.register.termsOfService")}</Link>{" "}
                {t("auth.register.and")}{" "}
                <Link href="/privacy" className="auth-link" style={{ fontSize: 12 }}>{t("auth.register.privacyPolicy")}</Link>
              </Checkbox>
            </div>

            <Space style={{ width: "100%" }} size={10}>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} style={{ flex: 1 }}>
                <Button size="large" icon={<ArrowLeftOutlined />} onClick={handleBack} className="auth-btn-outline">
                  {t("auth.register.back")}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} style={{ flex: 1 }}>
                <Button
                  type="primary" size="large"
                  onClick={handleRegister} loading={loading}
                  disabled={loading || !acceptedTerms}
                  className="auth-btn-gradient"
                >
                  <Space>{t("auth.register.createAccount")} <ArrowRightOutlined /></Space>
                </Button>
              </motion.div>
            </Space>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ textAlign: "center", marginTop: 18 }}>
        <Text style={{ color: "#6b7280", fontSize: 13 }}>
          {t("auth.register.alreadyHaveAccount")}{" "}
          <Link href="/auth/login" className="auth-link">
            {t("auth.register.signIn")}
          </Link>
        </Text>
      </div>
    </>
  );
}
