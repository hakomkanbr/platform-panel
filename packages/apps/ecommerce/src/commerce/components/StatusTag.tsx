"use client";

import React from "react";
import { Tag } from "antd";

const PRESETS: Record<string, { color: string; label: string }> = {
  published: { color: "green", label: "Published" },
  live: { color: "green", label: "Live" },
  active: { color: "green", label: "Active" },
  draft: { color: "orange", label: "Draft" },
  archived: { color: "default", label: "Archived" },
  inactive: { color: "default", label: "Inactive" },
  pending: { color: "gold", label: "Pending" },
};

export interface StatusTagProps {
  value?: string | number | null;
  label?: string;
}

export const StatusTag: React.FC<StatusTagProps> = ({ value, label }) => {
  let text = "";
  if (value === undefined || value === null || value === "") {
    text = "\u2014";
  } else if (typeof value === "number") {
    text = value === 1 ? "Active" : value === 2 ? "Inactive" : String(value);
  } else {
    text = String(value);
  }

  const preset = PRESETS[text.toLowerCase()];
  if (preset) {
    return <Tag color={preset.color}>{label ?? preset.label}</Tag>;
  }
  return <Tag>{label ?? text}</Tag>;
};
