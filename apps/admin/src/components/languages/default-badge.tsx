import { Tag } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

export default function DefaultBadge({ isDefault }: { isDefault: boolean }) {
  if (!isDefault) return null;
  return (
    <Tag icon={<CheckCircleOutlined />} color="green" style={{ borderRadius: 4 }}>
      Default
    </Tag>
  );
}
