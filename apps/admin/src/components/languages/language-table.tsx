"use client";

import { Table, Button, Space, Typography, Tag, Switch, Tooltip, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GlobalOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "@repo/localization";
import dayjs from "dayjs";
import { LANGUAGE_FLAGS } from "@repo/shared-types";
import { languageService } from "./service";
import AddLanguageDialog from "./add-language-dialog";
import CompletionProgress from "./completion-progress";
import DefaultBadge from "./default-badge";
import RtlBadge from "./rtl-badge";
import type { ProjectLanguageDto } from "./types";

const { Text } = Typography;

interface LanguageTableProps {
  projectId: string;
}

export default function LanguageTable({ projectId }: LanguageTableProps) {
  const t = useTranslations();
  const [languages, setLanguages] = useState<ProjectLanguageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<ProjectLanguageDto | null>(null);

  const fetchLanguages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await languageService.list(projectId);
      setLanguages(data);
    } catch {
      message.error(t("settings.languages.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [projectId, t]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  const handleToggleEnabled = async (lang: ProjectLanguageDto) => {
    try {
      if (lang.enabled) {
        await languageService.disable(projectId, lang.id);
        message.success(t("settings.languages.disabledSuccess"));
      } else {
        await languageService.enable(projectId, lang.id);
        message.success(t("settings.languages.enabledSuccess"));
      }
      fetchLanguages();
    } catch {
      message.error(t("settings.languages.updateStatusFailed"));
    }
  };

  const handleSetDefault = async (lang: ProjectLanguageDto) => {
    try {
      await languageService.setDefault(projectId, lang.id);
      message.success(t("settings.languages.defaultUpdatedSuccess"));
      fetchLanguages();
    } catch {
      message.error(t("settings.languages.defaultUpdateFailed"));
    }
  };

  const handleDelete = async (lang: ProjectLanguageDto) => {
    try {
      await languageService.delete(projectId, lang.id);
      message.success(t("settings.languages.deleteSuccess"));
      fetchLanguages();
    } catch {
      message.error(t("settings.languages.deleteFailed"));
    }
  };

  const columns = [
    {
      title: "",
      key: "order",
      width: 50,
      render: (_: unknown, _record: ProjectLanguageDto, index: number) => (
        <Text type="secondary">{index + 1}</Text>
      ),
    },
    {
      title: t("settings.languages.flag"),
      dataIndex: "flag",
      key: "flag",
      width: 60,
      render: (flag: string) => (
        <span style={{ fontSize: 24, lineHeight: 1 }}>{flag || "🏳️"}</span>
      ),
    },
    {
      title: t("common.fields.name"),
      dataIndex: "name",
      key: "name",
      width: 160,
      render: (name: string, record: ProjectLanguageDto) => (
        <Space>
          <Text strong>{name}</Text>
          <Text type="secondary">({record.nativeName})</Text>
          <RtlBadge rtl={record.rtl} />
        </Space>
      ),
    },
    {
      title: t("settings.languages.code"),
      dataIndex: "code",
      key: "code",
      width: 100,
      render: (code: string) => (
        <Tag style={{ fontFamily: "monospace", borderRadius: 4 }}>{code}</Tag>
      ),
    },
    {
      title: t("settings.languages.rtl"),
      dataIndex: "rtl",
      key: "rtl",
      width: 60,
      render: (rtl: boolean) => (rtl ? <Tag color="purple">{t("common.actions.yes")}</Tag> : <Tag>{t("common.actions.no")}</Tag>),
    },
    {
      title: t("common.default"),
      dataIndex: "isDefault",
      key: "isDefault",
      width: 80,
      render: (isDefault: boolean) => <DefaultBadge isDefault={isDefault} />,
    },
    {
      title: t("common.fields.status"),
      dataIndex: "enabled",
      key: "enabled",
      width: 100,
      render: (enabled: boolean, record: ProjectLanguageDto) => (
        <Switch
          checked={enabled}
          onChange={() => handleToggleEnabled(record)}
          size="small"
          checkedChildren={t("settings.languages.on")}
          unCheckedChildren={t("settings.languages.off")}
        />
      ),
    },
    {
      title: t("settings.languages.translation"),
      dataIndex: "translationCompletion",
      key: "translationCompletion",
      width: 140,
      render: (percent: number) => (
        <Space>
          <CompletionProgress percent={percent} />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {Math.round(percent)}%
          </Text>
        </Space>
      ),
    },
    {
      title: t("settings.created"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (val: string) => (
        <Text type="secondary">{dayjs(val).format("MMM DD, YYYY")}</Text>
      ),
    },
    {
      title: t("settings.actions"),
      key: "actions",
      width: 200,
      fixed: "right" as const,
      render: (_: unknown, record: ProjectLanguageDto) => (
        <Space size="small">
          {!record.isDefault && (
            <Tooltip title={t("settings.languages.setAsDefault")}>
              <Button
                type="text"
                size="small"
                icon={<CrownOutlined style={{ color: "#faad14" }} />}
                onClick={() => handleSetDefault(record)}
              />
            </Tooltip>
          )}
          <Tooltip title={t("common.actions.edit")}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditData(record);
                setDialogOpen(true);
              }}
            />
          </Tooltip>
          {!record.isDefault && (
            <Tooltip title={t("common.actions.delete")}>
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
              />
            </Tooltip>
          )}
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
          <GlobalOutlined style={{ color: "#F7931E", fontSize: 18 }} />
          <Text strong style={{ fontSize: 16 }}>
            {t("settings.languages.projectLanguages")}
          </Text>
          <Text type="secondary">{t("settings.languages.languagesCount", { count: languages.length })}</Text>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditData(null);
            setDialogOpen(true);
          }}
          style={{ borderRadius: 6 }}
        >
          {t("settings.languages.addLanguage")}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={languages}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1100 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => (
            <span style={{ marginInlineEnd: 12 }}>
              {t("settings.languages.languagesCount", { count: total })}
            </span>
          ),
          style: { marginTop: 16 },
        }}
        style={{ borderRadius: 8 }}
      />

      <AddLanguageDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditData(null);
        }}
        projectId={projectId}
        onSuccess={fetchLanguages}
        editData={editData}
      />
    </div>
  );
}
