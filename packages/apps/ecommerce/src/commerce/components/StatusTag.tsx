"use client";

import React from "react";
import { Tag } from "antd";
import { useTranslations } from "@repo/localization";

export interface StatusTagProps {
  value?: string | number | null;
  label?: string;
  type?: "priceList" | "productPrice" | "general";
}

const STATUS_CONFIG: Record<
  string,
  { color: string; ar: string; en: string }
> = {
  draft: { color: "orange", ar: "مسودة", en: "Draft" },
  active: { color: "green", ar: "نشط", en: "Active" },
  published: { color: "blue", ar: "منشور", en: "Published" },
  live: { color: "green", ar: "مباشر", en: "Live" },
  inactive: { color: "default", ar: "غير نشط", en: "Inactive" },
  unpublished: { color: "default", ar: "غير منشور", en: "Unpublished" },
  archived: { color: "default", ar: "مؤرشف", en: "Archived" },
  pending: { color: "gold", ar: "قيد المراجعة", en: "Pending" },
  approved: { color: "green", ar: "معتمد", en: "Approved" },
  rejected: { color: "red", ar: "مرفوض", en: "Rejected" },
};

function normalizeStatus(value?: string | number | null): string {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "number") {
    switch (value) {
      case 1:
        return "draft";
      case 2:
        return "active";
      case 3:
        return "published";
      case 4:
        return "archived";
      case 5:
        return "published"; // or active
      case 6:
        return "archived";
      default:
        return String(value);
    }
  }
  return String(value).toLowerCase().trim();
}

export const StatusTag: React.FC<StatusTagProps> = ({ value, label }) => {
  const t = useTranslations();
  if (value === undefined || value === null || value === "") {
    return <Tag>—</Tag>;
  }

  const normalized = normalizeStatus(value);
  const config = STATUS_CONFIG[normalized];

  if (config) {
    const isArabic = typeof document !== "undefined" && document.documentElement.lang?.startsWith("ar");
    const displayLabel = label ?? (isArabic ? config.ar : config.en);
    return <Tag color={config.color}>{displayLabel}</Tag>;
  }

  return <Tag>{label ?? String(value)}</Tag>;
};
