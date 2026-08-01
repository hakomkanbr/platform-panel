"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Table, Button, Modal, Form, Input, Select, Tag, Space, Typography, Alert,
  Tooltip, Badge, App, Empty,
} from "antd";
import {
  PlusOutlined, KeyOutlined, CopyOutlined, EyeOutlined,
  EyeInvisibleOutlined, ReloadOutlined, DeleteOutlined,
} from "@ant-design/icons";
import { useProject } from "@/contexts/ProjectContext";
import { apiKeysApi, storeApiKey, removeStoredApiKey, API_KEY_STORAGE_KEY } from "@/lib/api/api-keys";
import type { ApiKeyDto, ApiKeyGeneratedResponse, CreateApiKeyRequest } from "@/types";
import { API_KEY_SCOPE_OPTIONS } from "@/types";

const { Text, Paragraph } = Typography;
const envColors: Record<string, string> = {
  production: "red",
  sandbox: "orange",
  development: "blue",
};

export default function ApiKeysPage() {
  const { projectId, project } = useProject();
  const { notification } = App.useApp();

  const [keys, setKeys] = useState<ApiKeyDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newKeyResult, setNewKeyResult] = useState<ApiKeyGeneratedResponse | null>(null);
  const [form] = Form.useForm<CreateApiKeyRequest>();
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  const loadKeys = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const data = await apiKeysApi.list(projectId);
      setKeys(data);
    } catch (err: any) {
      notification.error({ message: "Failed to load API keys", description: err?.message });
    } finally {
      setLoading(false);
    }
  }, [projectId, notification]);

  useEffect(() => {
    if (projectId) loadKeys();
  }, [projectId, loadKeys]);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      if (!projectId) return;
      const result = await apiKeysApi.create(projectId, {
        name: values.name,
        environment: values.environment,
        scopes: values.scopes || [],
        allowedIPs: values.allowedIPs || undefined,
        expiresAt: values.expiresAt || undefined,
      });
      setNewKeyResult(result);
      await loadKeys();
      form.resetFields();
    } catch (err: any) {
      if (err?.message) {
        notification.error({ message: "Failed to create API key", description: err.message });
      }
    }
  };

  const handleDelete = (keyId: string, keyName: string) => {
    Modal.confirm({
      title: "Revoke API Key",
      content: `Are you sure you want to revoke "${keyName}"? This action cannot be undone.`,
      okText: "Revoke",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        if (!projectId) return;
        try {
          await apiKeysApi.delete(projectId, keyId);
          notification.success({ message: "API key revoked" });
          removeStoredApiKey();
          loadKeys();
        } catch (err: any) {
          notification.error({ message: "Failed to revoke API key", description: err?.message });
        }
      },
    });
  };

  const handleRegenerate = (keyId: string, keyName: string) => {
    Modal.confirm({
      title: "Regenerate API Key",
      content: `Are you sure you want to regenerate "${keyName}"? The old key will stop working immediately.`,
      okText: "Regenerate",
      cancelText: "Cancel",
      onOk: async () => {
        if (!projectId) return;
        try {
          const result = await apiKeysApi.regenerate(projectId, keyId);
          setNewKeyResult(result);
          loadKeys();
        } catch (err: any) {
          notification.error({ message: "Failed to regenerate API key", description: err?.message });
        }
      },
    });
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    storeApiKey(key);
    notification.success({ message: "API key copied to clipboard and saved to session" });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: ApiKeyDto) => (
        <Space>
          <KeyOutlined style={{ opacity: 0.5 }} />
          <Text strong>{name}</Text>
          {!record.isActive && <Tag color="default">Disabled</Tag>}
        </Space>
      ),
    },
    {
      title: "Key",
      dataIndex: "maskedKey",
      key: "maskedKey",
      width: 280,
      render: (masked: string, record: ApiKeyDto) => {
        const isRevealed = revealedKeys.has(record.id);
        return (
          <Space>
            <Text code style={{ fontSize: 12, fontFamily: "monospace" }}>
              {masked}
            </Text>
            <Tooltip title={isRevealed ? "Hide" : "Reveal"}>
              <Button
                type="text"
                size="small"
                icon={isRevealed ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                onClick={() => {
                  setRevealedKeys((prev) => {
                    const next = new Set(prev);
                    if (next.has(record.id)) next.delete(record.id);
                    else next.add(record.id);
                    return next;
                  });
                }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
    {
      title: "Environment",
      dataIndex: "environment",
      key: "environment",
      width: 120,
      render: (env: string) => <Tag color={envColors[env] || "default"}>{env}</Tag>,
    },
    {
      title: "Scopes",
      dataIndex: "scopes",
      key: "scopes",
      render: (scopes: string[]) => (
        <Space size={4} wrap>
          {scopes.length === 0 && <Text type="secondary">No scopes</Text>}
          {scopes.map((s) => (
            <Tag key={s} style={{ fontSize: 11 }}>{s}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Expires",
      dataIndex: "expiresAt",
      key: "expiresAt",
      width: 120,
      sorter: (a: ApiKeyDto, b: ApiKeyDto) => {
        if (!a.expiresAt && !b.expiresAt) return 0;
        if (!a.expiresAt) return 1;
        if (!b.expiresAt) return -1;
        return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
      },
      render: (date: string | null) => {
        if (!date) return <Text type="secondary">Never</Text>;
        const d = new Date(date);
        const expired = d < new Date();
        return (
          <Text style={{ color: expired ? "#ff4d4f" : undefined }}>
            {expired ? "Expired" : d.toLocaleDateString()}
          </Text>
        );
      },
    },
    {
      title: "IP Restriction",
      dataIndex: "allowedIPs",
      key: "allowedIPs",
      width: 140,
      render: (ips: string | null) =>
        ips ? <Tag>{ips}</Tag> : <Text type="secondary">None</Text>,
    },
    {
      title: "Last Used",
      dataIndex: "lastUsedAt",
      key: "lastUsedAt",
      width: 120,
      render: (date: string | null) =>
        date ? new Date(date).toLocaleDateString() : <Text type="secondary">Never</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: unknown, record: ApiKeyDto) => (
        <Space>
          <Tooltip title="Regenerate">
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => handleRegenerate(record.id, record.name)}
            />
          </Tooltip>
          <Tooltip title="Revoke">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id, record.name)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <Text strong style={{ fontSize: 16 }}>API Keys</Text>
          <br />
          <Text type="secondary">
            API keys allow external applications (storefront, mobile apps, etc.) to authenticate with your project without user login.
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setNewKeyResult(null); setCreateOpen(true); }}>
          Create API Key
        </Button>
      </div>

      {typeof window !== "undefined" && sessionStorage.getItem(API_KEY_STORAGE_KEY) && (
        <Alert
          type="info"
          showIcon
          message="Active API Key in session"
          description="An API key is stored in your current session. It will be used for storefront API requests."
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      <Table
        dataSource={keys}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        locale={{ emptyText: <Empty description="No API keys yet. Create one to connect your storefront." /> }}
      />

      <Modal
        title={newKeyResult ? "API Key Created" : "Create New API Key"}
        open={createOpen}
        onCancel={() => { setCreateOpen(false); setNewKeyResult(null); }}
        footer={null}
        width={600}
        destroyOnClose
      >
        {newKeyResult ? (
          <div>
            <Alert
              type="warning"
              showIcon
              message="Copy your API key now"
              description="You won't be able to see it again. Store it securely (e.g., environment variables)."
              style={{ marginBottom: 16 }}
            />
            <div style={{
              background: "#f5f5f5",
              border: "1px solid #d9d9d9",
              borderRadius: 6,
              padding: "12px 16px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: "monospace",
              fontSize: 13,
              wordBreak: "break-all",
            }}>
              <Text code copyable={{ text: newKeyResult.rawSecretKey }} style={{ fontSize: 13 }}>
                {newKeyResult.rawSecretKey}
              </Text>
              <Button
                type="primary"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => handleCopyKey(newKeyResult.rawSecretKey)}
              >
                Copy
              </Button>
            </div>
            <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0 }}>
              <strong>Key Name:</strong> {newKeyResult.apiKey.name} &middot;
              <strong> Environment:</strong> {newKeyResult.apiKey.environment} &middot;
              <strong> Scopes:</strong> {newKeyResult.apiKey.scopes.join(", ") || "none"}
              {newKeyResult.apiKey.allowedIPs && <> &middot; <strong>IP:</strong> {newKeyResult.apiKey.allowedIPs}</>}
              {newKeyResult.apiKey.expiresAt && <> &middot; <strong>Expires:</strong> {new Date(newKeyResult.apiKey.expiresAt).toLocaleDateString()}</>}
            </Paragraph>
            <div style={{ marginTop: 16, textAlign: "right" }}>
              <Button onClick={() => { setCreateOpen(false); setNewKeyResult(null); }}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleCreate}>
            <Form.Item name="name" label="Key Name" rules={[{ required: true, message: "Please enter a name" }]}>
              <Input placeholder="e.g., My Storefront" />
            </Form.Item>
            <Form.Item name="environment" label="Environment" rules={[{ required: true }]} initialValue="production">
              <Select
                options={[
                  { label: "Production", value: "production" },
                  { label: "Sandbox", value: "sandbox" },
                  { label: "Development", value: "development" },
                ]}
              />
            </Form.Item>
            <Form.Item name="scopes" label="Permissions (Scopes)">
              <Select
                mode="multiple"
                placeholder="Select permissions (leave empty for full access)"
                options={API_KEY_SCOPE_OPTIONS}
                allowClear
              />
            </Form.Item>
            <Form.Item name="allowedIPs" label="IP Whitelist (optional)" help="Comma-separated IPs or CIDR ranges. Leave empty to allow all IPs.">
              <Input placeholder="e.g., 192.168.1.100, 10.0.0.0/24" />
            </Form.Item>
            <Form.Item name="expiresAt" label="Expiration Date (optional)">
              <Input type="date" />
            </Form.Item>
            <div style={{ textAlign: "right" }}>
              <Button style={{ marginRight: 8 }} onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">Create</Button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
}
