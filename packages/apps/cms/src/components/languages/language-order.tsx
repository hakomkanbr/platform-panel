import { useState, useCallback, useRef } from "react";
import { Typography } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface LanguageOrderProps {
  order: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export default function LanguageOrder({ order, onDragStart, onDragEnd }: LanguageOrderProps) {
  const [dragging, setDragging] = useState(false);

  const handleDragStart = useCallback(() => {
    setDragging(true);
    onDragStart?.();
  }, [onDragStart]);

  const handleDragEnd = useCallback(() => {
    setDragging(false);
    onDragEnd?.();
  }, [onDragEnd]);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        cursor: "grab",
        display: "flex",
        alignItems: "center",
        gap: 8,
        opacity: dragging ? 0.5 : 1,
      }}
    >
      <MenuOutlined style={{ color: "#bfbfbf", fontSize: 14 }} />
      <Text type="secondary">{order}</Text>
    </div>
  );
}
