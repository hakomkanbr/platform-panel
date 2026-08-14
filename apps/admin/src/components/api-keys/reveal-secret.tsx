import { Alert, Button, Space, Typography, message } from "antd";
import { CopyOutlined, WarningOutlined, KeyOutlined } from "@ant-design/icons";
import { useTranslations } from "@repo/localization";

const { Text, Paragraph } = Typography;

interface RevealSecretProps {
  secret: string;
  keyName: string;
}

export default function RevealSecret({ secret, keyName }: RevealSecretProps) {
  const t = useTranslations();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      message.success(t("settings.apiKeys.secretCopied"));
    } catch {
      message.error(t("settings.apiKeys.copyFailed"));
    }
  };

  return (
    <div>
      <Alert
        type="warning"
        showIcon
        icon={<WarningOutlined />}
        message={t("settings.apiKeys.secretAlertTitle")}
        description={t("settings.apiKeys.secretAlertDesc")}
        style={{ marginBottom: 24, borderRadius: 8 }}
      />

      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong>
            <KeyOutlined style={{ marginRight: 8 }} />
            {t("settings.apiKeys.secretForKey", { keyName })}
          </Text>
          <Paragraph
            code
            copyable={false}
            style={{
              fontSize: 16,
              padding: 12,
              background: "#1f2937",
              color: "#10b981",
              borderRadius: 6,
              margin: 0,
              wordBreak: "break-all",
              fontFamily: "monospace",
            }}
          >
            {secret}
          </Paragraph>
          <Button
            type="primary"
            icon={<CopyOutlined />}
            onClick={handleCopy}
            size="large"
            style={{ width: "100%", borderRadius: 6 }}
          >
            {t("settings.apiKeys.copySecret")}
          </Button>
        </Space>
      </div>
    </div>
  );
}
