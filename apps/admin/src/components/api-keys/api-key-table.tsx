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
import { useTranslations } from "@repo/localization";
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
  const t = useTranslations();
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
      message.error(t("settings.apiKeys.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [projectId, t]);

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
        message.success(t("settings.apiKeys.disabledSuccess"));
      } else if (key.status === "disabled") {
        await apiKeyService.enable(projectId, key.id);
        message.success(t("settings.apiKeys.enabledSuccess"));
      }
      fetchKeys();
    } catch {
      message.error(t("settings.apiKeys.updateStatusFailed"));
    }
  };

  const columns = [
    {
      title: t("common.fields.name"),
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
      title: t("settings.apiKeys.access"),
      key: "access",
      width: 140,
      render: (_: unknown, record: ApiKeyDto) => {
        const level = record.accessLevel ?? resolveAccessLevel(record.permissions);
        const levelKey =
          level === "read_only"
            ? "readOnly"
            : level === "standard_read"
              ? "standardRead"
              : "customRead";
        return (
          <Space size={4}>
            <LockOutlined style={{ color: "#10b981", fontSize: 12 }} />
            <Tag color={accessLevelColors[level]} style={{ marginInlineEnd: 0 }}>
              {t(`settings.apiKeys.levels.${levelKey}` as any) || accessLevelLabel(level)}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: t("settings.apiKeys.scope"),
      key: "scope",
      width: 130,
      render: (_: unknown, record: ApiKeyDto) =>
        record.scope === "marketplace_projects" ? (
          <Tag icon={<GlobalOutlined />} color="purple">
            {t("settings.apiKeys.marketplace")}
          </Tag>
        ) : (
          <Tag icon={<ShopOutlined />} color="green">
            {t("settings.apiKeys.thisStore")}
          </Tag>
        ),
    },
    {
      title: t("settings.apiKeys.environment"),
      dataIndex: "environment",
      key: "environment",
      width: 120,
      render: (env: string) => (
        <Tag
          color={
            env === "production" ? "red" : env === "staging" ? "orange" : "blue"
          }
        >
          {t(`settings.apiKeys.environments.${env}` as any) || env}
        </Tag>
      ),
    },
    {
      title: t("settings.apiKeys.expires"),
      dataIndex: "expiresAt",
      key: "expiresAt",
      width: 120,
      render: (val: string | null) =>
        val ? (
          <Text type={dayjs(val).isBefore(dayjs()) ? "danger" : "secondary"}>
            {dayjs(val).format("MMM DD, YYYY")}
          </Text>
        ) : (
          <Text type="secondary">{t("settings.apiKeys.never")}</Text>
        ),
    },
    {
      title: t("common.fields.status"),
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: ApiKeyDto["status"]) => <ApiKeyStatus status={status} />,
    },
    {
      title: t("settings.created"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (val: string) => (
        <Text type="secondary">{dayjs(val).format("MMM DD, YYYY")}</Text>
      ),
    },
    {
      title: t("settings.actions"),
      key: "actions",
      width: 180,
      fixed: "right" as const,
      render: (_: unknown, record: ApiKeyDto) => (
        <Space size="small">
          <Tooltip title={t("common.actions.edit")}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedKey(record);
                message.info(t("settings.apiKeys.editComingSoon"));
              }}
            />
          </Tooltip>
          <Tooltip title={t("settings.apiKeys.rotateKey")}>
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
          <Tooltip title={record.status === "active" ? t("settings.apiKeys.disable") : t("settings.apiKeys.enable")}>
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
          <Tooltip title={t("common.actions.delete")}>
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
            placeholder={t("settings.apiKeys.searchPlaceholder")}
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260, borderRadius: 6 }}
            allowClear
          />
          <Text type="secondary">{t("settings.apiKeys.keysCount", { count: filteredKeys.length })}</Text>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateOpen(true)}
          style={{ borderRadius: 6 }}
        >
          {t("settings.apiKeys.createApiKey")}
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
          showTotal: (total) => (
            <span style={{ marginInlineEnd: 12 }}>
              {t("settings.apiKeys.keysCount", { count: total })}
            </span>
          ),
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