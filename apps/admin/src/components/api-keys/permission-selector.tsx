import { Checkbox, Collapse, Tag, Space, Typography } from "antd";
import { API_KEY_PERMISSIONS } from "@repo/shared-types";
import type { ApiKeyPermission } from "./types";
import { useMemo } from "react";

const { Text } = Typography;

interface PermissionSelectorProps {
  value?: ApiKeyPermission[];
  onChange?: (value: ApiKeyPermission[]) => void;
}

export default function PermissionSelector({ value = [], onChange }: PermissionSelectorProps) {
  const selectedMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const p of value) {
      map[p.resource] = new Set(p.actions);
    }
    return map;
  }, [value]);

  const handleActionToggle = (resource: string, action: string, checked: boolean) => {
    const current = new Set(selectedMap[resource] || []);
    if (checked) {
      current.add(action);
    } else {
      current.delete(action);
    }
    const newPermissions: ApiKeyPermission[] = [];
    for (const group of API_KEY_PERMISSIONS) {
      const actions = group.resource === resource ? current : selectedMap[group.resource];
      if (actions && actions.size > 0) {
        newPermissions.push({ resource: group.resource, actions: Array.from(actions) });
      }
    }
    onChange?.(newPermissions);
  };

  const isAllSelected = (resource: string, actions: readonly { value: string; label: string }[]) => {
    const current = selectedMap[resource];
    if (!current) return false;
    return actions.every((a) => current.has(a.value));
  };

  const isAnySelected = (resource: string) => {
    const current = selectedMap[resource];
    return current && current.size > 0;
  };

  const handleSelectAll = (resource: string, actions: readonly { value: string; label: string }[], checked: boolean) => {
    const current = new Set<string>();
    if (checked) {
      for (const a of actions) current.add(a.value);
    }
    const newPermissions: ApiKeyPermission[] = [];
    for (const group of API_KEY_PERMISSIONS) {
      const set = group.resource === resource ? current : selectedMap[group.resource];
      if (set && set.size > 0) {
        newPermissions.push({ resource: group.resource, actions: Array.from(set) });
      }
    }
    onChange?.(newPermissions);
  };

  const items = API_KEY_PERMISSIONS.map((group) => ({
    key: group.resource,
    label: (
      <Space>
        <span>{group.label}</span>
        {isAnySelected(group.resource) && (
          <Tag color="blue">
            {selectedMap[group.resource]?.size || 0}/{group.actions.length}
          </Tag>
        )}
      </Space>
    ),
    children: (
      <div style={{ padding: "8px 0" }}>
        <Checkbox
          checked={isAnySelected(group.resource) ? isAllSelected(group.resource, group.actions) : false}
          indeterminate={isAnySelected(group.resource) && !isAllSelected(group.resource, group.actions)}
          onChange={(e) => handleSelectAll(group.resource, group.actions, e.target.checked)}
          style={{ marginBottom: 12 }}
        >
          <Text strong>Select All</Text>
        </Checkbox>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {group.actions.map((action) => (
            <Checkbox
              key={action.value}
              checked={selectedMap[group.resource]?.has(action.value) || false}
              onChange={(e) => handleActionToggle(group.resource, action.value, e.target.checked)}
            >
              {action.label}
            </Checkbox>
          ))}
        </div>
      </div>
    ),
  }));

  return (
    <div>
      <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
        Select the permissions this API key should have. Each permission grants access to specific resources and actions.
      </Text>
      <Collapse
        items={items}
        defaultActiveKey={API_KEY_PERMISSIONS.filter((g) => isAnySelected(g.resource)).map((g) => g.resource)}
        style={{ borderRadius: 8 }}
      />
    </div>
  );
}
