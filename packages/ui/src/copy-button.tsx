"use client";

import React, { useState } from "react";
import { Button, Tooltip } from "antd";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";

export interface CopyButtonProps {
  text: string;
  label?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, label }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <Tooltip title={copied ? "Copied" : "Copy"}>
      <Button
        type="text"
        size="small"
        icon={copied ? <CheckOutlined style={{ color: "var(--success)" }} /> : <CopyOutlined />}
        onClick={copy}
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </Button>
    </Tooltip>
  );
};
