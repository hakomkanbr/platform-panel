import { Modal, Typography, Alert, Space, message } from "antd";
import { SyncOutlined, WarningOutlined } from "@ant-design/icons";
import { useState } from "react";
import { apiKeyService } from "./service";
import RevealSecret from "./reveal-secret";
import type { ApiKeyDto, CreateApiKeyResponse } from "./types";

const { Text } = Typography;

interface RotateDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  keyData: ApiKeyDto;
  onSuccess: (result: CreateApiKeyResponse) => void;
}

export default function RotateDialog({ open, onClose, projectId, keyData, onSuccess }: RotateDialogProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreateApiKeyResponse | null>(null);

  const handleRotate = async () => {
    setLoading(true);
    try {
      const res = await apiKeyService.rotate(projectId, keyData.id);
      setResult(res);
      onSuccess(res);
    } catch {
      message.error("Failed to rotate API key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <SyncOutlined style={{ color: "#faad14" }} />
          Rotate API Key
        </Space>
      }
      open={open}
      onCancel={() => {
        setResult(null);
        onClose();
      }}
      footer={null}
      width={520}
      destroyOnClose
    >
      {!result ? (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Alert
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            message="You are about to rotate this API key"
            description={`This will invalidate the current key "${keyData.name}" immediately. Any services using this key will stop working until updated with the new key.`}
          />

          <div
            style={{
              background: "#f8fafc",
              padding: 16,
              borderRadius: 8,
              border: "1px solid #e2e8f0",
            }}
          >
            <Space direction="vertical" size={4}>
              <Text strong>Key to rotate:</Text>
              <Text code>{keyData.prefix}...</Text>
              <Text type="secondary">Environment: {keyData.environment}</Text>
            </Space>
          </div>

          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <button
              onClick={() => {
                setResult(null);
                onClose();
              }}
              style={{
                padding: "8px 20px",
                borderRadius: 6,
                border: "1px solid #d9d9d9",
                background: "white",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleRotate}
              disabled={loading}
              style={{
                padding: "8px 20px",
                borderRadius: 6,
                border: "none",
                background: "#faad14",
                color: "white",
                cursor: "pointer",
                fontWeight: 500,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Rotating..." : "Rotate Key"}
            </button>
          </Space>
        </Space>
      ) : (
        <RevealSecret secret={result.secret} keyName={keyData.name} />
      )}
    </Modal>
  );
}
