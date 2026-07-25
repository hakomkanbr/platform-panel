import { Modal, Typography, Alert, Space, message } from "antd";
import { DeleteOutlined, WarningOutlined } from "@ant-design/icons";
import { useState } from "react";
import { apiKeyService } from "./service";
import type { ApiKeyDto } from "./types";

const { Text } = Typography;

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  keyData: ApiKeyDto;
  onSuccess: () => void;
}

export default function DeleteDialog({ open, onClose, projectId, keyData, onSuccess }: DeleteDialogProps) {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    try {
      await apiKeyService.delete(projectId, keyData.id);
      message.success("API key deleted successfully");
      onSuccess();
      onClose();
    } catch {
      message.error("Failed to delete API key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <DeleteOutlined style={{ color: "#ff4d4f" }} />
          Delete API Key
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
      destroyOnClose
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Alert
          type="error"
          showIcon
          icon={<WarningOutlined />}
          message="This action cannot be undone"
          description={`You are about to permanently delete the API key "${keyData.name}". All services using this key will immediately lose access.`}
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
            <Text strong>Key to delete:</Text>
            <Text>Name: {keyData.name}</Text>
            <Text code>{keyData.prefix}...</Text>
            <Text type="secondary">Environment: {keyData.environment}</Text>
          </Space>
        </div>

        <div>
          <Text style={{ display: "block", marginBottom: 8 }}>
            Type <Text code strong>delete</Text> to confirm:
          </Text>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder='Type "delete" to confirm'
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #d9d9d9",
              fontSize: 14,
            }}
          />
        </div>

        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
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
            onClick={handleDelete}
            disabled={confirmText !== "delete" || loading}
            style={{
              padding: "8px 20px",
              borderRadius: 6,
              border: "none",
              background: "#ff4d4f",
              color: "white",
              cursor: "pointer",
              fontWeight: 500,
              opacity: confirmText !== "delete" || loading ? 0.5 : 1,
            }}
          >
            {loading ? "Deleting..." : "Delete Key"}
          </button>
        </Space>
      </Space>
    </Modal>
  );
}
