import { Tag } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useTranslations } from "@repo/localization";

export default function DefaultBadge({ isDefault }: { isDefault: boolean }) {
  const t = useTranslations();
  if (!isDefault) return null;
  return (
    <Tag icon={<CheckCircleOutlined />} color="green" style={{ borderRadius: 4 }}>
      {t("common.default")}
    </Tag>
  );
}
