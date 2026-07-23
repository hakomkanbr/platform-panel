"use client";

import React from "react";
import { Drawer, Badge, Typography, Empty } from "antd";
import {
  BellOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "info" | "success" | "warning";
  read: boolean;
}

export interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  open,
  onClose,
}) => {
  return (
    <Drawer
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1F2937" }}>Notifications</span>
          <Badge
            count={0}
            style={{ backgroundColor: "#F7931E", fontWeight: 600 }}
          />
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={380}
      styles={{
        header: { borderBottom: "1px solid #E5E7EB", padding: "16px 20px" },
        body: { padding: "12px 20px" },
      }}
    >
      <div style={{ padding: "48px 16px", textAlign: "center", color: "#9CA3AF" }}>
        <BellOutlined style={{ fontSize: 32, opacity: 0.5, marginBottom: 8 }} />
        <p style={{ margin: 0, fontSize: 14 }}>No notifications yet</p>
      </div>
    </Drawer>
  );
};
