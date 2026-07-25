import { Progress, Tooltip } from "antd";

interface CompletionProgressProps {
  percent: number;
  size?: "small" | "default";
}

export default function CompletionProgress({ percent, size = "default" }: CompletionProgressProps) {
  const color =
    percent >= 100 ? "#52c41a" : percent >= 50 ? "#faad14" : percent >= 25 ? "#F7931E" : "#ff4d4f";

  return (
    <Tooltip title={`${percent.toFixed(1)}% translated`}>
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
