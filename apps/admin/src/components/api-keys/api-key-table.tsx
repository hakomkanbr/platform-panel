"use client";

import { Table, Button, Space, Typography, Tag, Tooltip, Input, message } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  StopOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  KeyOutlined,
  LockOutlined,
  GlobalOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useState, useMemo, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ApiKeyStatus from "./api-key-status";
import CreateApiKeyDialog from "./create-api-key-dialog";
import RotateDialog from "./rotate-dialog";
import DeleteDialog from "./delete-dialog";
import { apiKeyService } from "./service";
import { accessLevelLabel, resolveAccessLevel } from "./access-levels";
import type { ApiKeyDto, CreateApiKeyResponse } from "./types";

dayjs.extend(relativeTime);

const { Text } = Typography;

interface ApiKeyTableProps {
  projectId: string;
  projectName?: string;
}

const accessLevelColors: Record<string, string> = {
  read_only: "green",
  standard_read: "blue",
  custom_read: "purple",
};

export default function ApiKeyTable({ projectId, projectName }: ApiKeyTableProps) {
  const [keys, setKeys] = useState<ApiKeyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [rotateOpen, setRotateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKeyDto | null>(null);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiKeyService.list(projectId);
      setKeys(data);
    } catch {
      message.error("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const filteredKeys = useMemo(() => {
    if (!search) return keys;
    const q = search.toLowerCase();
    return keys.filter(
      (k) =>
        k.name.toLowerCase().includes(q) ||
        k.prefix.toLowerCase().includes(q) ||
        k.environment.toLowerCase().includes(q),
    );
  }, [keys, search]);

  const handleToggleStatus = async (key: ApiKeyDto) => {
    try {
      if (key.status === "active") {
        await apiKeyService.disable(projectId, key.id);
        message.success("API key disabled");
      } else if (key.status === "disabled") {
        await apiKeyService.enable(projectId, key.id);
        message.success("API key enabled");
      }
      fetchKeys();
    } catch {
      message.error("Failed to update API key status");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 220,
      render: (_: string, record: ApiKeyDto) => (
        <Space>
          <KeyOutlined style={{ color: "#F7931E" }} />
          <Space direction="vertical" size={0}>
            <Text strong>{record.name}</Text>
            {record.description && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.description}
              </Text>
            )}
          </Space>
        </Space>
      ),
    },
    {
      title: "Access",
      key: "access",
      width: 140,
      render: (_: unknown, record: ApiKeyDto) => {
        const level = record.accessLevel ?? resolveAccessLevel(record.permissions);
        return (
          <Space size={4}>
            <LockOutlined style={{ color: "#10b981", fontSize: 12 }} />
            <Tag color={accessLevelColors[level]} style={{ marginInlineEnd: 0 }}>
              {accessLevelLabel(level)}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: "Scope",
      key: "scope",
      width: 130,
      render: (_: unknown, record: ApiKeyDto) =>
        record.scope === "marketplace_projects" ? (
          <Tag icon={<GlobalOutlined />} color="purple">
            Marketplace
          </Tag>
        ) : (
          <Tag icon={<ShopOutlined />} color="green">
            This store
          </Tag>
        ),
    },
    {
      title: "Environment",
      dataIndex: "environment",
      key: "environment",
      width: 120,
      render: (env: string) => (
        <Tag
          color={
            env === "production" ? "red" : env === "staging" ? "orange" : "blue"
          }
        >
          {env}
        </Tag>
      ),
    },
    {
      title: "Expires",
      dataIndex: "expiresAt",
      key: "expiresAt",
      width: 120,
      render: (val: string | null) =>
        val ? (
          <Text type={dayjs(val).isBefore(dayjs()) ? "danger" : "secondary"}>
            {dayjs(val).format("MMM DD, YYYY")}
          </Text>
        ) : (
          <Text type="secondary">Never</Text>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: ApiKeyDto["status"]) => <ApiKeyStatus status={status} />,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (val: string) => (
        <Text type="secondary">{dayjs(val).format("MMM DD, YYYY")}</Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      fixed: "right" as const,
      render: (_: unknown, record: ApiKeyDto) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedKey(record);
                message.info("Edit functionality coming soon");
              }}
            />
          </Tooltip>
          <Tooltip title="Rotate">
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => {
                setSelectedKey(record);
                setRotateOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title={record.status === "active" ? "Disable" : "Enable"}>
            <Button
              type="text"
              size="small"
              icon={
                record.status === "active" ? (
                  <StopOutlined />
                ) : (
                  <CheckCircleOutlined />
                )
              }
              onClick={() => handleToggleStatus(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                setSelectedKey(record);
                setDeleteOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Space>
          <Input
            placeholder="Search keys..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260, borderRadius: 6 }}
            allowClear
          />
          <Text type="secondary">{filteredKeys.length} keys</Text>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateOpen(true)}
          style={{ borderRadius: 6 }}
        >
          Create API Key
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredKeys}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `${total} keys`,
          style: { marginTop: 16 },
        }}
        style={{ borderRadius: 8 }}
      />

      <CreateApiKeyDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        projectId={projectId}
        projectName={projectName}
        onSuccess={fetchKeys}
      />

      {selectedKey && (
        <>
          <RotateDialog
            open={rotateOpen}
            onClose={() => {
              setRotateOpen(false);
              setSelectedKey(null);
            }}
            projectId={projectId}
            keyData={selectedKey}
            onSuccess={(_result: CreateApiKeyResponse) => {
              fetchKeys();
            }}
          />
          <DeleteDialog
            open={deleteOpen}
            onClose={() => {
              setDeleteOpen(false);
              setSelectedKey(null);
            }}
            projectId={projectId}
            keyData={selectedKey}
            onSuccess={fetchKeys}
          />
        </>
      )}
    </div>
  );
}