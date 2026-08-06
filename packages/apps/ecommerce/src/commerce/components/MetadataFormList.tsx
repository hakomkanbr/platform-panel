"use client";

import React from "react";
import { Button, Input, Space, Typography } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import type { KeyValue } from "../types/common";

const { Text } = Typography;

export interface MetadataFormListProps {
  value?: KeyValue[];
  onChange?: (items: KeyValue[]) => void;
  disabled?: boolean;
}

export const MetadataFormList: React.FC<MetadataFormListProps> = ({ value, onChange, disabled }) => {
  const t = useTranslations();
  const items = value ?? [];

  const update = (index: number, patch: Partial<KeyValue>) => {
    onChange?.(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const remove = (index: number) => {
    onChange?.(items.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange?.([...items, { key: "", value: "" }]);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={8}>
      {items.map((item, index) => (
        <Space.Compact key={index} style={{ width: "100%" }}>
          <Input
            value={item.key}
            disabled={disabled}
            placeholder={t("catalog.metadata.key")}
            style={{ width: "30%" }}
            onChange={(e) => update(index, { key: e.target.value })}
          />
          <Input
            value={item.value}
            disabled={disabled}
            placeholder={t("catalog.metadata.value")}
            onChange={(e) => update(index, { value: e.target.value })}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            disabled={disabled}
            onClick={() => remove(index)}
          />
        </Space.Compact>
      ))}
      <Button icon={<PlusOutlined />} onClick={add} disabled={disabled}>
        {t("catalog.metadata.addField")}
      </Button>
      {items.length === 0 && (
        <Text type="secondary" style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          {t("catalog.metadata.emptyText")}
        </Text>
      )}
    </Space>
  );
};
