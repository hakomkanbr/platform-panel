import { Tag } from "antd";
import {
  CheckCircleOutlined,
  StopOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import type { ApiKeyStatus as TApiKeyStatus } from "./types";

const statusConfig: Record<TApiKeyStatus, { color: string; icon: React.ReactNode; label: string }> = {
  active: {
    color: "green",
    icon: <CheckCircleOutlined />,
    label: "Active",
  },
  disabled: {
    color: "orange",
    icon: <StopOutlined />,
    label: "Disabled",
  },
  revoked: {
    color: "red",
    icon: <MinusCircleOutlined />,
    label: "Revoked",
  },
};

export default function ApiKeyStatus({ status }: { status: TApiKeyStatus }) {
  const config = statusConfig[status];
  return (
    <Tag icon={config.icon} color={config.color}>
      {config.label}
    </Tag>
  );
}
