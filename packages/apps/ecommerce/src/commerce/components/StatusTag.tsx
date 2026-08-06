"use client";

import React from "react";
import { Tag } from "antd";
import { useTranslations } from "@repo/localization";

const PRESETS: Record<string, { color: string; labelKey: string }> = {
  published: { color: "green", labelKey: "catalog.status.published" },
  live: { color: "green", labelKey: "catalog.status.live" },
  active: { color: "green", labelKey: "catalog.status.active" },
  draft: { color: "orange", labelKey: "catalog.status.draft" },
  unpublished: { color: "default", labelKey: "catalog.status.unpublished" },
  archived: { color: "default", labelKey: "catalog.status.archived" },
  inactive: { color: "default", labelKey: "catalog.status.inactive" },
  pending: { color: "gold", labelKey: "catalog.status.pending" },
};

export interface StatusTagProps {
  value?: string | number | null;
  label?: string;
}

export const StatusTag: React.FC<StatusTagProps> = ({ value, label }) => {
  const t = useTranslations();
  let text = "";
  if (value === undefined || value === null || value === "") {
    text = "\u2014";
  } else if (typeof value === "number") {
    text = value === 1 ? "active" : value === 2 ? "inactive" : String(value);
  } else {
    text = String(value);
  }

  const preset = PRESETS[text.toLowerCase()];
  if (preset) {
    return <Tag color={preset.color}>{label ?? t(preset.labelKey)}</Tag>;
  }
  return <Tag>{label ?? text}</Tag>;
};
