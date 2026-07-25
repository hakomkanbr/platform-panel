import { Modal, Steps, Button, Form, Input, Select, DatePicker, Space, Typography, Card, Tag, Descriptions, message } from "antd";
import {
  KeyOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  EyeOutlined,
  CheckOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import EnvironmentSelector from "./environment-selector";
import PermissionSelector from "./permission-selector";
import RevealSecret from "./reveal-secret";
import { apiKeyService } from "./service";
import type { ApiKeyFormData, CreateApiKeyResponse, ApiKeyEnvironment, ApiKeyExpiration, ApiKeyPermission } from "./types";

const { Text, Title } = Typography;
const { TextArea } = Input;

interface CreateApiKeyDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  onSuccess: () => void;
}

const steps = [
  { title: "General", icon: <KeyOutlined /> },
  { title: "Environment", icon: <EnvironmentOutlined /> },
  { title: "Expiration", icon: <ClockCircleOutlined /> },
  { title: "Permissions", icon: <SafetyOutlined /> },
  { title: "Review", icon: <EyeOutlined /> },
];

const expirationOptions: { value: ApiKeyExpiration; label: string }[] = [
  { value: "never", label: "Never" },
  { value: "30days", label: "30 Days" },
  { value: "90days", label: "90 Days" },
  { value: "1year", label: "1 Year" },
  { value: "custom", label: "Custom Date" },
];

function getExpirationLabel(value: ApiKeyExpiration): string {
  return expirationOptions.find((o) => o.value === value)?.label || value;
}

export default function CreateApiKeyDialog({ open, onClose, projectId, onSuccess }: CreateApiKeyDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreateApiKeyResponse | null>(null);
  const [formData, setFormData] = useState<ApiKeyFormData>({
    name: "",
    description: "",
    environment: "development",
    expiration: "never",
    customExpirationDate: undefined,
    permissions: [],
    ipRestrictions: "",
    allowedDomains: "",
    rateLimit: undefined,
    metadata: "",
  });

  const updateField = <K extends keyof ApiKeyFormData>(key: K, value: ApiKeyFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep === 0 && !formData.name.trim()) {
      message.warning("Please enter a key name");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const permissions: ApiKeyPermission[] = formData.permissions;
      const res = await apiKeyService.create(projectId, {
        name: formData.name,
        description: formData.description || undefined,
        environment: formData.environment,
        expiration: formData.expiration,
        customExpirationDate: formData.expiration === "custom" ? formData.customExpirationDate : null,
        permissions,
        ipRestrictions: formData.ipRestrictions ? formData.ipRestrictions.split(",").map((s) => s.trim()).filter(Boolean) : [],
        allowedDomains: formData.allowedDomains ? formData.allowedDomains.split(",").map((s) => s.trim()).filter(Boolean) : [],
        rateLimit: formData.rateLimit,
        metadata: formData.metadata ? JSON.parse(formData.metadata) : undefined,
      });
      setResult(res);
      setCurrentStep(steps.length);
      onSuccess();
    } catch {
      message.error("Failed to create API key");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setResult(null);
    setFormData({
      name: "",
      description: "",
      environment: "development",
      expiration: "never",
      customExpirationDate: undefined,
      permissions: [],
      ipRestrictions: "",
      allowedDomains: "",
      rateLimit: undefined,
      metadata: "",
    });
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Text strong style={{ display: "block", marginBottom: 4 }}>
                Key Name <span style={{ color: "#ff4d4f" }}>*</span>
              </Text>
              <Input
                placeholder="e.g., Production API Key"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                size="large"
                style={{ borderRadius: 6 }}
              />
            </div>
            <div>
              <Text strong style={{ display: "block", marginBottom: 4 }}>
                Description
              </Text>
              <TextArea
                placeholder="Optional description for this key"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                style={{ borderRadius: 6 }}
              />
            </div>
          </Space>
        );

      case 1:
        return (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
              Choose the environment for this API key.
            </Text>
            <EnvironmentSelector
              value={formData.environment}
              onChange={(val) => updateField("environment", val)}
            />
          </Space>
        );

      case 2:
        return (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
              Set when this API key should expire.
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
                  Expiration Date
                </Text>
                <DatePicker
                  value={formData.customExpirationDate ? dayjs(formData.customExpirationDate) : null}
                  onChange={(date) => updateField("customExpirationDate", date?.toISOString())}
                  style={{ width: "100%" }}
                  size="large"
                />
              </div>
            )}
            {formData.expiration !== "never" && formData.expiration !== "custom" && (
              <Tag color="blue" style={{ marginTop: 8 }}>
                Expires in {formData.expiration}
              </Tag>
            )}
          </Space>
        );

      case 3:
        return (
          <PermissionSelector
            value={formData.permissions}
            onChange={(val) => updateField("permissions", val)}
          />
        );

      case 4:
        return (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={5}>Review API Key</Title>
            <Card style={{ borderRadius: 8 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Name">{formData.name}</Descriptions.Item>
                {formData.description && (
                  <Descriptions.Item label="Description">{formData.description}</Descriptions.Item>
                )}
                <Descriptions.Item label="Environment">
                  <Tag
                    color={
                      formData.environment === "production"
                        ? "red"
                        : formData.environment === "staging"
                          ? "orange"
                          : "blue"
                    }
                  >
                    {formData.environment}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Expiration">
                  {getExpirationLabel(formData.expiration)}
                  {formData.customExpirationDate && ` - ${dayjs(formData.customExpirationDate).format("MMM DD, YYYY")}`}
                </Descriptions.Item>
                <Descriptions.Item label="Permissions">
                  {formData.permissions.length === 0 ? (
                    <Text type="secondary">None</Text>
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
          {result ? "API Key Created" : "Create API Key"}
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
            Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button
              type="primary"
              onClick={handleNext}
              icon={<RightOutlined />}
              style={{ borderRadius: 6 }}
            >
              Next
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleCreate}
              loading={loading}
              icon={<CheckOutlined />}
              style={{ borderRadius: 6 }}
            >
              Create Key
            </Button>
          )}
        </Space>
      )}

      {result && (
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={handleClose} style={{ borderRadius: 6 }}>
            Done
          </Button>
        </Space>
      )}
    </Modal>
  );
}
