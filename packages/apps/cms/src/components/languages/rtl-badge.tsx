import { Tag } from "antd";

export default function RtlBadge({ rtl }: { rtl: boolean }) {
  if (!rtl) return null;
  return (
    <Tag color="purple" style={{ borderRadius: 4 }}>
      RTL
    </Tag>
  );
}
