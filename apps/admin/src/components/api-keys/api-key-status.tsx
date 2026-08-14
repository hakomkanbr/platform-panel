import { Tag } from "antd";
import {
  CheckCircleOutlined,
  StopOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import type { ApiKeyStatus as TApiKeyStatus } from "./types";

export default function ApiKeyStatus({ status }: { status: TApiKeyStatus }) {
  const t = useTranslations();

  const statusConfig: Record<TApiKeyStatus, { color: string; icon: React.ReactNode; label: string }> = {
    active: {
      color: "green",
      icon: <CheckCircleOutlined />,
      label: t("settings.apiKeys.statusActive"),
    },
    disabled: {
      color: "orange",
      icon: <StopOutlined />,
      label: t("settings.apiKeys.statusDisabled"),
    },
    revoked: {
      color: "red",
      icon: <MinusCircleOutlined />,
      label: t("settings.apiKeys.statusRevoked"),
    },
  };

  const config = statusConfig[status] ?? statusConfig.disabled;
  return (
    <Tag icon={config.icon} color={config.color}>
      {config.label}
    </Tag>
  );
}
