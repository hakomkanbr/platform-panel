import { Modal, Typography, Alert, Space, message } from "antd";
import { DeleteOutlined, WarningOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useTranslations } from "@repo/localization";
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
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    try {
      await apiKeyService.delete(projectId, keyData.id);
      message.success(t("settings.apiKeys.deleteSuccess"));
      onSuccess();
      onClose();
    } catch {
      message.error(t("settings.apiKeys.deleteFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <DeleteOutlined style={{ color: "#ff4d4f" }} />
          {t("settings.apiKeys.deleteTitle")}
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
          message={t("settings.apiKeys.deleteAlertTitle")}
          description={t("settings.apiKeys.deleteAlertDesc", { name: keyData.name })}
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
            <Text strong>{t("settings.apiKeys.keyToDelete")}</Text>
            <Text>{t("common.fields.name")}: {keyData.name}</Text>
            <Text code>{keyData.prefix}...</Text>
            <Text type="secondary">{t("settings.apiKeys.environment")}: {t(`settings.apiKeys.environments.${keyData.environment}` as any) || keyData.environment}</Text>
          </Space>
        </div>

        <div>
          <Text style={{ display: "block", marginBottom: 8 }}>
            {t("settings.apiKeys.deleteConfirmPrompt")}
          </Text>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={t("settings.apiKeys.deleteConfirmPlaceholder")}
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
            {t("common.actions.cancel")}
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
            {loading ? t("settings.apiKeys.deleting") : t("settings.apiKeys.deleteKeyBtn")}
          </button>
        </Space>
      </Space>
    </Modal>
  );
}
