"use client";

import React from "react";
import { Button, Drawer, Typography } from "antd";
import type { FormInstance } from "antd";

const { Text } = Typography;

export interface DrawerFormProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  width?: number | string;
  loading?: boolean;
  submitLabel?: string;
  onFinish?: (values: Record<string, unknown>) => void | Promise<void>;
  form?: FormInstance;
  children: React.ReactNode;
  extra?: React.ReactNode;
  footer?: React.ReactNode;
}

export const DrawerForm: React.FC<DrawerFormProps> = ({
  open,
  onClose,
  title,
  description,
  width = 520,
  loading,
  submitLabel = "Save",
  onFinish,
  form,
  children,
  extra,
  footer,
}) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={width}
      destroyOnClose
      style={{ maxWidth: "100vw" }}
      title={
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Text strong style={{ fontSize: 18, color: "var(--text-primary)" }}>
              {title}
            </Text>
            {extra}
          </div>
          {description && (
            <Text
              type="secondary"
              style={{ fontSize: 13, display: "block", marginTop: 4, color: "var(--text-secondary)" }}
            >
              {description}
            </Text>
          )}
        </div>
      }
      footer={
        footer ?? (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="primary"
              loading={loading}
              onClick={() => {
                if (form) form.submit();
                else onFinish?.({});
              }}
            >
              {loading ? "Please wait..." : submitLabel}
            </Button>
          </div>
        )
      }
    >
      {children}
    </Drawer>
  );
};
