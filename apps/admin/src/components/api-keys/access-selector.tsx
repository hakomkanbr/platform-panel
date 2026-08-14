"use client";

import { Alert, Checkbox, Collapse, Radio, Space, Tag, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { API_KEY_READ_PERMISSIONS } from "@repo/shared-types";
import type { ApiKeyPermissionGroup } from "@repo/shared-types";
import { useMemo } from "react";
import { useTranslations } from "@repo/localization";
import { ACCESS_LEVEL_OPTIONS, presetPermissions } from "./access-levels";
import type { ApiKeyAccessLevel, ApiKeyPermission } from "./types";

const { Text } = Typography;

interface AccessSelectorProps {
  accessLevel: ApiKeyAccessLevel;
  permissions: ApiKeyPermission[];
  onChange: (accessLevel: ApiKeyAccessLevel, permissions: ApiKeyPermission[]) => void;
}

export default function AccessSelector({
  accessLevel,
  permissions,
  onChange,
}: AccessSelectorProps) {
  const t = useTranslations();
  const selectedSet = useMemo(
    () => new Set(permissions.map((p) => p.resource)),
    [permissions],
  );

  const modules = useMemo(() => {
    const map = new Map<string, ApiKeyPermissionGroup[]>();
    for (const group of API_KEY_READ_PERMISSIONS) {
      const list = map.get(group.module) || ([] as ApiKeyPermissionGroup[]);
      list.push(group);
      map.set(group.module, list);
    }
    return Array.from(map.entries());
  }, []);

  const handleLevelChange = (level: ApiKeyAccessLevel) => {
    onChange(
      level,
      level === "custom_read" ? permissions : presetPermissions(level),
    );
  };

  const toggleResource = (resource: string, checked: boolean) => {
    const next = new Set(selectedSet);
    if (checked) {
      next.add(resource);
    } else {
      next.delete(resource);
    }
    const nextPermissions: ApiKeyPermission[] = [];
    for (const group of API_KEY_READ_PERMISSIONS) {
      if (next.has(group.resource)) {
        nextPermissions.push({ resource: group.resource, actions: ["read"] });
      }
    }
    onChange("custom_read", nextPermissions);
  };

  const presetHint =
    accessLevel === "read_only"
      ? ["Products", "Categories"]
      : accessLevel === "standard_read"
        ? ["Products", "Categories", "Orders", "Customers", "Inventory"]
        : [];

  const customItems = modules.map(([module, groups]) => ({
    key: module,
    label: (
      <Space>
        <span>{module}</span>
        {groups.filter((g) => selectedSet.has(g.resource)).length > 0 && (
          <Tag color="blue">
            {groups.filter((g) => selectedSet.has(g.resource)).length}/
            {groups.length}
          </Tag>
        )}
      </Space>
    ),
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {groups.map((group) => (
          <Checkbox
            key={group.resource}
            checked={selectedSet.has(group.resource) || false}
            onChange={(e) => toggleResource(group.resource, e.target.checked)}
          >
            <Text strong>{group.label}</Text>
            <Text type="secondary" style={{ fontSize: 12, marginInlineStart: 8 }}>
              {group.actions.map((a) => a.label).join(", ")}
            </Text>
          </Checkbox>
        ))}
      </div>
    ),
  }));

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Alert
        type="info"
        showIcon
        icon={<LockOutlined />}
        message={t("settings.apiKeys.readOnlyAlertTitle")}
        description={t("settings.apiKeys.readOnlyKeysDesc")}
      />

      <div>
        <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
          {t("settings.apiKeys.chooseAccessLevel")}
        </Text>
        <Radio.Group
          value={accessLevel}
          onChange={(e) => handleLevelChange(e.target.value)}
          style={{ width: "100%" }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {ACCESS_LEVEL_OPTIONS.map((option) => {
              const levelKey =
                option.value === "read_only"
                  ? "readOnly"
                  : option.value === "standard_read"
                    ? "standardRead"
                    : "customRead";
              return (
                <Radio
                  key={option.value}
                  value={option.value}
                  style={{ display: "block", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: 8 }}
                >
                  <Space direction="vertical" size={0}>
                    <Text strong>{t(`settings.apiKeys.levels.${levelKey}` as any) || option.label}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {t(`settings.apiKeys.levels.${levelKey}Desc` as any) || option.description}
                    </Text>
                  </Space>
                </Radio>
              );
            })}
          </Space>
        </Radio.Group>
      </div>

      {accessLevel !== "custom_read" && presetHint.length > 0 && (
        <Space wrap>
          {presetHint.map((item) => (
            <Tag key={item} color="blue">
              {item}
            </Tag>
          ))}
        </Space>
      )}

      {accessLevel === "custom_read" && (
        <div>
          <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
            {t("settings.apiKeys.selectPermissionsDesc")}
          </Text>
          <Collapse
            items={customItems}
            style={{ borderRadius: 8 }}
            defaultActiveKey={modules.filter((m) =>
              m[1].some((g) => selectedSet.has(g.resource)),
            ).map((m) => m[0])}
          />
        </div>
      )}
    </Space>
  );
}