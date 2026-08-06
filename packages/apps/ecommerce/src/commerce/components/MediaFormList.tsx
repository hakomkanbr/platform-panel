"use client";

import React, { useState } from "react";
import { Button, Card, Input, InputNumber, Select, Space, Typography } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { enumOptions } from "../types/enums";
import type { MediaItem } from "../types/catalog";

const { Text } = Typography;

export interface MediaFormListProps {
  value?: MediaItem[];
  onChange?: (items: MediaItem[]) => void;
  disabled?: boolean;
}

export const MediaFormList: React.FC<MediaFormListProps> = ({ value, onChange, disabled }) => {
  const t = useTranslations();
  const items = value ?? [];
  const [draftUrl, setDraftUrl] = useState("");
  const [draftType, setDraftType] = useState<number>(1);

  const update = (index: number, patch: Partial<MediaItem>) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange?.(next);
  };

  const remove = (index: number) => {
    onChange?.(items.filter((_, i) => i !== index));
  };

  const add = () => {
    if (!draftUrl.trim()) return;
    onChange?.([...items, { url: draftUrl.trim(), type: draftType, sortOrder: items.length }]);
    setDraftUrl("");
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={12}>
      {items.map((item, index) => (
        <Card key={item.id ?? index} size="small" style={{ borderRadius: 12 }}>
          <Space direction="vertical" style={{ width: "100%" }} size={8}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {item.type === 1 || item.type === undefined ? (
                <img
                  src={item.url}
                  alt={item.altText || t("catalog.media.altFallback")}
                  style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", background: "#f1f5f9" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 8,
                    background: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-secondary)",
                    fontSize: 20,
                  }}
                >
                  {enumOptions("mediaType", t).find((o) => o.value === item.type)?.label?.slice(0, 2) ?? "MD"}
                </div>
              )}
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  value={item.url}
                  disabled={disabled}
                  placeholder={t("catalog.media.placeholderUrl")}
                  onChange={(e) => update(index, { url: e.target.value })}
                />
                <Select
                  value={item.type}
                  disabled={disabled}
                  options={enumOptions("mediaType", t)}
                  style={{ width: 140 }}
                  onChange={(type) => update(index, { type })}
                />
              </Space.Compact>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={disabled}
                onClick={() => remove(index)}
              />
            </div>
            <Space style={{ width: "100%" }} size={8}>
              <Input
                value={item.altText}
                disabled={disabled}
                placeholder={t("catalog.media.altText")}
                onChange={(e) => update(index, { altText: e.target.value })}
                style={{ flex: 1 }}
              />
              <InputNumber
                value={item.sortOrder}
                disabled={disabled}
                placeholder={t("catalog.media.order")}
                style={{ width: 90 }}
                onChange={(v) => update(index, { sortOrder: v ?? undefined })}
              />
            </Space>
          </Space>
        </Card>
      ))}

      <div style={{ display: "flex", gap: 8 }}>
        <Input
          value={draftUrl}
          disabled={disabled}
          placeholder={t("catalog.media.pasteUrl")}
          onChange={(e) => setDraftUrl(e.target.value)}
          onPressEnter={add}
          style={{ flex: 1 }}
        />
        <Button icon={<PlusOutlined />} onClick={add} disabled={disabled || !draftUrl.trim()}>
          {t("catalog.media.addMedia")}
        </Button>
      </div>

      {items.length === 0 && (
        <Text type="secondary" style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          {t("catalog.media.emptyText")}
        </Text>
      )}
    </Space>
  );
};
