import { Alert, Button, Space, Typography, message } from "antd";
import { CopyOutlined, WarningOutlined, KeyOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

interface RevealSecretProps {
  secret: string;
  keyName: string;
}

export default function RevealSecret({ secret, keyName }: RevealSecretProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      message.success("Secret copied to clipboard!");
    } catch {
      message.error("Failed to copy secret");
    }
  };

  return (
    <div>
      <Alert
        type="warning"
        showIcon
        icon={<WarningOutlined />}
        message="This secret will never be shown again."
        description="Make sure to copy and store it in a secure location. If you lose it, you will need to rotate the key."
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
            API Key Secret for &quot;{keyName}&quot;
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
            Copy Secret
          </Button>
        </Space>
      </div>
    </div>
  );
}
