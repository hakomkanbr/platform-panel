import { Modal, Steps, Button, Space, Typography, Card, DatePicker, Descriptions, message, Radio, Alert, Input, Tag, Select } from "antd";
import {
  KeyOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  CheckOutlined,
  RightOutlined,
  LeftOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import { useTranslations } from "@repo/localization";
import AccessSelector from "./access-selector";
import ScopeSummary from "./scope-summary";
import RevealSecret from "./reveal-secret";
import { apiKeyService } from "./service";
import { accessLevelLabel, presetPermissions, scopeLabel } from "./access-levels";
import type {
  ApiKeyFormData,
  CreateApiKeyResponse,
  ApiKeyAccessLevel,
  ApiKeyScope,
} from "./types";

const { Text, Title } = Typography;
const { TextArea } = Input;

interface CreateApiKeyDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  onSuccess: () => void;
  projectName?: string;
  defaultScope?: ApiKeyScope;
  defaultAccessLevel?: ApiKeyAccessLevel;
  title?: string;
}

const accessLevelColors: Record<ApiKeyAccessLevel, string> = {
  read_only: "green",
  standard_read: "blue",
  custom_read: "purple",
};

export default function CreateApiKeyDialog({
  open,
  onClose,
  projectId,
  onSuccess,
  projectName,
  defaultScope = "current_project",
  defaultAccessLevel = "read_only",
  title,
}: CreateApiKeyDialogProps) {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreateApiKeyResponse | null>(null);
  const [formData, setFormData] = useState<ApiKeyFormData>(() => ({
    name: "",
    description: "",
    accessLevel: defaultAccessLevel,
    scope: defaultScope,
    environment: "development",
    expiration: "never",
    customExpirationDate: undefined,
    permissions: presetPermissions(defaultAccessLevel),
    ipRestrictions: "",
    allowedDomains: "",
    rateLimit: undefined,
    metadata: "",
  }));

  const steps = [
    { title: t("settings.apiKeys.steps.general"), icon: <KeyOutlined /> },
    { title: t("settings.apiKeys.steps.access"), icon: <LockOutlined /> },
    { title: t("settings.apiKeys.steps.scope"), icon: <GlobalOutlined /> },
    { title: t("settings.apiKeys.steps.expiration"), icon: <ClockCircleOutlined /> },
    { title: t("settings.apiKeys.steps.review"), icon: <EyeOutlined /> },
  ];

  const expirationOptions: { value: ApiKeyFormData["expiration"]; label: string }[] = [
    { value: "never", label: t("settings.apiKeys.never") },
    { value: "30days", label: t("settings.apiKeys.days30") },
    { value: "90days", label: t("settings.apiKeys.days90") },
    { value: "1year", label: t("settings.apiKeys.year1") },
    { value: "custom", label: t("settings.apiKeys.customDate") },
  ];

  function getExpirationLabel(value: string): string {
    return expirationOptions.find((o) => o.value === value)?.label || value;
  }

  const updateField = <K extends keyof ApiKeyFormData>(
    key: K,
    value: ApiKeyFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setCurrentStep(0);
    setResult(null);
    setFormData({
      name: "",
      description: "",
      accessLevel: defaultAccessLevel,
      scope: defaultScope,
      environment: "development",
      expiration: "never",
      customExpirationDate: undefined,
      permissions: presetPermissions(defaultAccessLevel),
      ipRestrictions: "",
      allowedDomains: "",
      rateLimit: undefined,
      metadata: "",
    });
  };

  const handleNext = () => {
    if (currentStep === 0 && !formData.name.trim()) {
      message.warning(t("settings.apiKeys.enterKeyNameWarning"));
      return;
    }
    if (
      currentStep === 1 &&
      formData.accessLevel === "custom_read" &&
      formData.permissions.length === 0
    ) {
      message.warning(t("settings.apiKeys.selectPermissionWarning"));
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const permissions =
        formData.accessLevel === "custom_read"
          ? formData.permissions
          : presetPermissions(formData.accessLevel);
      const res = await apiKeyService.create(projectId, {
        name: formData.name,
        description: formData.description || undefined,
        keyType:
          formData.scope === "marketplace_projects" ? "marketplace" : "developer",
        scope: formData.scope,
        environment: formData.environment,
        expiration: formData.expiration,
        customExpirationDate:
          formData.expiration === "custom" ? formData.customExpirationDate : null,
        permissions,
        ipRestrictions: formData.ipRestrictions
          ? formData.ipRestrictions.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        allowedDomains: formData.allowedDomains
          ? formData.allowedDomains.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        rateLimit: formData.rateLimit,
        metadata: formData.metadata ? JSON.parse(formData.metadata) : undefined,
      });
      setResult(res);
      setCurrentStep(steps.length);
      onSuccess();
    } catch {
      message.error(t("settings.apiKeys.createFailed"));
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Text strong style={{ display: "block", marginBottom: 4 }}>
                {t("settings.apiKeys.keyName")} <span style={{ color: "#ff4d4f" }}>*</span>
              </Text>
              <Input
                placeholder={t("settings.apiKeys.keyNamePlaceholder")}
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                size="large"
                style={{ borderRadius: 6 }}
              />
            </div>
            <div>
              <Text strong style={{ display: "block", marginBottom: 4 }}>
                {t("common.fields.description")}
              </Text>
              <TextArea
                placeholder={t("settings.apiKeys.descriptionPlaceholder")}
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                style={{ borderRadius: 6 }}
              />
            </div>
            <div>
              <Text strong style={{ display: "block", marginBottom: 4 }}>
                {t("settings.apiKeys.environment")}
              </Text>
              <Radio.Group
                value={formData.environment}
                onChange={(e) => updateField("environment", e.target.value)}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Radio value="development">{t("settings.apiKeys.environments.development")}</Radio>
                  <Radio value="staging">{t("settings.apiKeys.environments.staging")}</Radio>
                  <Radio value="production">{t("settings.apiKeys.environments.production")}</Radio>
                </Space>
              </Radio.Group>
            </div>
          </Space>
        );

      case 1:
        return (
          <AccessSelector
            accessLevel={formData.accessLevel}
            permissions={formData.permissions}
            onChange={(level, permissions) => {
              updateField("accessLevel", level);
              updateField("permissions", permissions);
            }}
          />
        );

      case 2:
        return (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
              {t("settings.apiKeys.scopeDesc")}
            </Text>
            <ScopeSummary scope={formData.scope} projectName={projectName} />
          </Space>
        );

      case 3:
        return (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
              {t("settings.apiKeys.expirationDesc")}
            </Text>
            <Select
              value={formData.expiration}
              onChange={(val) => updateField("expiration", val)}
              style={{ width: "100%" }}
              size="large"
              options={expirationOptions}
            />
            {formData.expiration === "custom" && (
              <div style={{ marginTop: 12 }}>
                <Text strong style={{ display: "block", marginBottom: 4 }}>
                  {t("settings.apiKeys.expirationDate")}
                </Text>
                <DatePicker
                  value={
                    formData.customExpirationDate
                      ? dayjs(formData.customExpirationDate)
                      : null
                  }
                  onChange={(date) =>
                    updateField("customExpirationDate", date?.toISOString())
                  }
                  style={{ width: "100%" }}
                  size="large"
                />
              </div>
            )}
            {formData.expiration !== "never" &&
              formData.expiration !== "custom" && (
                <Tag color="blue" style={{ marginTop: 8 }}>
                  {t("settings.apiKeys.expiresIn", { val: getExpirationLabel(formData.expiration) })}
                </Tag>
              )}
          </Space>
        );

      case 4: {
        const levelKey =
          formData.accessLevel === "read_only"
            ? "readOnly"
            : formData.accessLevel === "standard_read"
              ? "standardRead"
              : "customRead";
        return (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={5}>{t("settings.apiKeys.reviewTitle")}</Title>
            <Alert
              type="warning"
              showIcon
              icon={<LockOutlined />}
              message={t("settings.apiKeys.readOnlyAlertTitle")}
              description={t("settings.apiKeys.readOnlyAlertDesc")}
            />
            <Card style={{ borderRadius: 8 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label={t("common.fields.name")}>
                  {formData.name}
                </Descriptions.Item>
                {formData.description && (
                  <Descriptions.Item label={t("common.fields.description")}>
                    {formData.description}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label={t("settings.apiKeys.access")}>
                  <Tag color={accessLevelColors[formData.accessLevel]}>
                    {t(`settings.apiKeys.levels.${levelKey}` as any) || accessLevelLabel(formData.accessLevel)}
                  </Tag>
                  <Tag color="green">
                    <LockOutlined /> {t("settings.apiKeys.readOnlyTag")}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t("settings.apiKeys.scope")}>
                  <Tag
                    color={
                      formData.scope === "marketplace_projects"
                        ? "purple"
                        : "green"
                    }
                  >
                    {formData.scope === "marketplace_projects"
                      ? t("settings.apiKeys.marketplace")
                      : t("settings.apiKeys.thisStore")}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t("settings.apiKeys.environment")}>
                  <Tag
                    color={
                      formData.environment === "production"
                        ? "red"
                        : formData.environment === "staging"
                          ? "orange"
                          : "blue"
                    }
                  >
                    {t(`settings.apiKeys.environments.${formData.environment}` as any) || formData.environment}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t("settings.apiKeys.expires")}>
                  {getExpirationLabel(formData.expiration)}
                  {formData.customExpirationDate &&
                    ` - ${dayjs(formData.customExpirationDate).format("MMM DD, YYYY")}`}
                </Descriptions.Item>
                <Descriptions.Item label={t("settings.apiKeys.steps.access")}>
                  {formData.permissions.length === 0 ? (
                    <Text type="secondary">{t("settings.apiKeys.none")}</Text>
                  ) : (
                    <Space wrap>
                      {formData.permissions.map((p) => (
                        <Tag key={p.resource} color="blue">
                          {p.resource}: {p.actions.join(", ")}
                        </Tag>
                      ))}
                    </Space>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        );
      }

      case 5:
        return result ? (
          <RevealSecret secret={result.secret} keyName={formData.name} />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <Modal
      title={
        <Space>
          <KeyOutlined style={{ color: "#F7931E" }} />
          {result ? t("settings.apiKeys.apiKeyCreated") : (title || t("settings.apiKeys.createApiKey"))}
        </Space>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={640}
      destroyOnClose
    >
      {!result && (
        <Steps
          current={currentStep}
          items={steps}
          size="small"
          style={{ marginBottom: 24 }}
        />
      )}

      <div style={{ minHeight: 260, marginBottom: 24 }}>{renderStep()}</div>

      {currentStep < steps.length && !result && (
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Button
            onClick={handlePrev}
            disabled={currentStep === 0}
            icon={<LeftOutlined />}
            style={{ borderRadius: 6 }}
          >
            {t("common.actions.back")}
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button
              type="primary"
              onClick={handleNext}
              icon={<RightOutlined />}
              style={{ borderRadius: 6 }}
            >
              {t("common.actions.next")}
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleCreate}
              loading={loading}
              icon={<CheckOutlined />}
              style={{ borderRadius: 6 }}
            >
              {t("settings.apiKeys.createKeyBtn")}
            </Button>
          )}
        </Space>
      )}

      {result && (
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={handleClose} style={{ borderRadius: 6 }}>
            {t("settings.apiKeys.done")}
          </Button>
        </Space>
      )}
    </Modal>
  );
}