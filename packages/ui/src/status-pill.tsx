"use client";

import React from "react";

export interface StatusPillProps {
  status: "healthy" | "degraded" | "offline" | "maintenance" | "active";
  label?: string;
  size?: "sm" | "md";
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  label,
  size = "md",
}) => {
  const configs = {
    healthy: {
      bg: "#D1FAE5",
      color: "#065F46",
      dot: "var(--success)",
      defaultText: "Healthy",
    },
    active: {
      bg: "#D1FAE5",
      color: "#065F46",
      dot: "var(--success)",
      defaultText: "Active",
    },
    degraded: {
      bg: "#FEF3C7",
      color: "#92400E",
      dot: "var(--warning)",
      defaultText: "Degraded",
    },
    offline: {
      bg: "#FEE2E2",
      color: "#991B1B",
      dot: "var(--error)",
      defaultText: "Offline",
    },
    maintenance: {
      bg: "#E3F2FD",
      color: "#1E40AF",
      dot: "var(--blue)",
      defaultText: "Maintenance",
    },
  };

  const current = configs[status] || configs.healthy;
  const isSmall = size === "sm";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: isSmall ? 4 : 6,
        padding: isSmall ? "1px 8px" : "3px 10px",
        borderRadius: 9999,
        background: current.bg,
        color: current.color,
        fontSize: isSmall ? 11 : 12,
        fontWeight: 600,
        lineHeight: 1.4,
        userSelect: "none",
      }}
    >
      <span
        style={{
          width: isSmall ? 5 : 6,
          height: isSmall ? 5 : 6,
          borderRadius: "50%",
          background: current.dot,
          display: "inline-block",
        }}
      />
      <span>{label || current.defaultText}</span>
    </div>
  );
};
