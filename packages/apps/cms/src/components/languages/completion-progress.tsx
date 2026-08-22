import { Progress, Tooltip } from "antd";
import { useTranslations } from "@repo/localization";

interface CompletionProgressProps {
  percent: number;
  size?: "small" | "default";
}

export default function CompletionProgress({ percent, size = "default" }: CompletionProgressProps) {
  const t = useTranslations();
  const color =
    percent >= 100 ? "#52c41a" : percent >= 50 ? "#faad14" : percent >= 25 ? "#F7931E" : "#ff4d4f";

  return (
    <Tooltip title={t("settings.languages.translatedPercent", { percent: percent.toFixed(1) })}>
      <Progress
        percent={Math.round(percent)}
        size={size === "small" ? [60, 12] : [100, 16]}
        strokeColor={color}
        showInfo={false}
        style={{ margin: 0 }}
      />
    </Tooltip>
  );
}
