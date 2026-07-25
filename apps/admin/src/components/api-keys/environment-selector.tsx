import { Radio, Space, Tag } from "antd";
import {
  CodeOutlined,
  RocketOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import type { ApiKeyEnvironment } from "./types";

const environments: { value: ApiKeyEnvironment; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "development", label: "Development", icon: <CodeOutlined />, color: "blue" },
  { value: "staging", label: "Staging", icon: <ExperimentOutlined />, color: "orange" },
  { value: "production", label: "Production", icon: <RocketOutlined />, color: "red" },
];

interface EnvironmentSelectorProps {
  value?: ApiKeyEnvironment;
  onChange?: (value: ApiKeyEnvironment) => void;
}

export default function EnvironmentSelector({ value, onChange }: EnvironmentSelectorProps) {
  return (
    <Radio.Group value={value} onChange={(e) => onChange?.(e.target.value)}>
      <Space direction="vertical" style={{ width: "100%" }}>
        {environments.map((env) => (
          <Radio.Button
            key={env.value}
            value={env.value}
            style={{
              height: 48,
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              width: "100%",
              borderRadius: 8,
              marginBottom: 4,
            }}
          >
            <Space>
              {env.icon}
              <span>{env.label}</span>
              <Tag color={env.color} style={{ marginLeft: 8 }}>
                {env.value}
              </Tag>
            </Space>
          </Radio.Button>
        ))}
      </Space>
    </Radio.Group>
  );
}
