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

const { Text, Title } = Typography;

const INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Education", "E-commerce",
  "Real Estate", "Media & Entertainment", "Consulting", "Manufacturing", "Other",
];

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 10;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[a-z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  if (score < 30) return { score, label: "Weak", color: "#ef4444" };
  if (score < 50) return { score, label: "Fair", color: "#f59e0b" };
  if (score < 75) return { score, label: "Strong", color: "#22c55e" };
  return { score, label: "Very Strong", color: "#6366f1" };
}

const stepConfigs = [
  { id: 0, label: "Account", icon: <UserOutlined />, title: "Create your account", desc: "Fill in your personal details" },
  { id: 1, label: "Company", icon: <BankOutlined />, title: "Company details", desc: "Tell us about your business" },
  { id: 2, label: "Review", icon: <CheckCircleFilled />, title: "Almost done!", desc: "Review and confirm your information" },
];

export default function RegisterPage() {
  const router = useRouter();
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
    if (!form.firstName.trim()) { setError("First name is required"); return false; }
    if (!form.lastName.trim()) { setError("Last name is required"); return false; }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) { setError("Valid email is required"); return false; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return false; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return false; }
    return true;
  };

  const handleNext = useCallback(() => {
    setError(null);
    if (step === 0 && checkStep1()) setStep(1);
    else if (step === 1) {
      if (!form.companyName.trim()) { setError("Company name is required"); return; }
      setStep(2);
    }
  }, [step, form]);

  const handleBack = useCallback(() => {
    setError(null);
    if (step > 0) setStep(step - 1);
  }, [step]);

  const handleRegister = useCallback(async () => {
    if (!acceptedTerms) { setError("Please accept the terms of service"); return; }
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
        message.success("Account created successfully!");
        router.push(`/auth/verify-email?email=${encodeURIComponent(form.email)}`);
      } else {
        setError(result.error?.message || "Registration failed");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [form, acceptedTerms, router]);

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
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "#fff",
                  color: i <= step ? "#fff" : "#9ca3af",
                  fontSize: 16,
                  border: i > step ? "1.5px solid #d1d5db" : "none",
                  boxShadow: i === step
                    ? "0 0 0 4px rgba(99,102,241,0.15)"
                    : i < step
                      ? "0 2px 8px rgba(99,102,241,0.25)"
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
                color: i === step ? "#6366f1" : i < step ? "#22c55e" : "#9ca3af",
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
                      ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
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
                  <label className="auth-label">First name</label>
                  <Input
                    size="large" placeholder="John"
                    className="auth-input-wrapper"
                    prefix={<UserOutlined style={{ color: "#9ca3af", fontSize: 15 }} />}
                    value={form.firstName}
                    onChange={(e) => updateForm("firstName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="auth-label">Last name</label>
                  <Input
                    size="large" placeholder="Doe"
                    className="auth-input-wrapper"
                    prefix={<UserOutlined style={{ color: "#9ca3af", fontSize: 15 }} />}
                    value={form.lastName}
                    onChange={(e) => updateForm("lastName", e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div>
                  <label className="auth-label">Email</label>
                  <Input
                    size="large" placeholder="you@company.com"
                    className="auth-input-wrapper"
                    prefix={<MailOutlined style={{ color: "#9ca3af", fontSize: 15 }} />}
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="auth-label">Password</label>
                  <Input.Password
                    size="large" placeholder="Create a password"
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
                  <Text style={{ color: strength.color, fontSize: 11, fontWeight: 500 }}>{strength.label}</Text>
                </div>
              )}

              <div>
                <label className="auth-label">Confirm password</label>
                <Input.Password
                  size="large" placeholder="Repeat your password"
                  className="auth-input-wrapper"
                  prefix={<LockOutlined style={{ color: "#9ca3af", fontSize: 15 }} />}
                  value={form.confirmPassword}
                  onChange={(e) => updateForm("confirmPassword", e.target.value)}
                  iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <Text style={{ color: "#ef4444", fontSize: 11, marginTop: 4, display: "block" }}>Passwords do not match</Text>
                )}
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button type="primary" size="large" onClick={handleNext} className="auth-btn-gradient">
                <Space>Continue <ArrowRightOutlined /></Space>
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
                  <label className="auth-label">Company name</label>
                  <Input
                    size="large" placeholder="Acme Inc."
                    className="auth-input-wrapper"
                    prefix={<BankOutlined style={{ color: "#9ca3af", fontSize: 15 }} />}
                    value={form.companyName}
                    onChange={(e) => updateForm("companyName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="auth-label">Industry</label>
                  <Select
                    size="large" placeholder="Select your industry"
                    value={form.industry || undefined}
                    onChange={(v) => updateForm("industry", v)}
                    style={{ width: "100%" }}
                    options={INDUSTRIES.map((i) => ({ label: i, value: i }))}
                  />
                </div>
              </div>

              <div>
                <label className="auth-label">Team size</label>
                <Select
                  size="large" placeholder="How many people?"
                  value={form.teamSize || undefined}
                  onChange={(v) => updateForm("teamSize", v)}
                  style={{ width: "100%" }}
                  options={[
                    { label: "Just me", value: 1 },
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
                  Back
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} style={{ flex: 1 }}>
                <Button type="primary" size="large" onClick={handleNext} className="auth-btn-gradient">
                  <Space>Continue <ArrowRightOutlined /></Space>
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
              <Text style={{ color: "#374151", fontSize: 15, fontWeight: 600, display: "block" }}>Review your information</Text>
              <div style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>Please review before creating your account</div>
            </div>

            <div style={{ border: "1px solid #f0f0f0", borderRadius: 10, padding: 16, marginBottom: 16 }}>
              {[
                { label: "Name", value: `${form.firstName} ${form.lastName}`, icon: <UserOutlined style={{ fontSize: 14 }} /> },
                { label: "Email", value: form.email, icon: <MailOutlined style={{ fontSize: 14 }} /> },
                { label: "Company", value: form.companyName, icon: <BankOutlined style={{ fontSize: 14 }} /> },
                { label: "Industry", value: form.industry || "Not specified", icon: <GlobalOutlined style={{ fontSize: 14 }} /> },
                { label: "Team size", value: form.teamSize ? `${form.teamSize} people` : "Not specified", icon: <TeamOutlined style={{ fontSize: 14 }} /> },
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
                I agree to the{" "}
                <Link href="/terms" className="auth-link" style={{ fontSize: 12 }}>Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" className="auth-link" style={{ fontSize: 12 }}>Privacy Policy</Link>
              </Checkbox>
            </div>

            <Space style={{ width: "100%" }} size={10}>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} style={{ flex: 1 }}>
                <Button size="large" icon={<ArrowLeftOutlined />} onClick={handleBack} className="auth-btn-outline">
                  Back
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} style={{ flex: 1 }}>
                <Button
                  type="primary" size="large"
                  onClick={handleRegister} loading={loading}
                  disabled={loading || !acceptedTerms}
                  className="auth-btn-gradient"
                >
                  <Space>Create Account <ArrowRightOutlined /></Space>
                </Button>
              </motion.div>
            </Space>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ textAlign: "center", marginTop: 18 }}>
        <Text style={{ color: "#6b7280", fontSize: 13 }}>
          Already have an account?{" "}
          <Link href="/auth/login" className="auth-link">
            Sign in
          </Link>
        </Text>
      </div>
    </>
  );
}
