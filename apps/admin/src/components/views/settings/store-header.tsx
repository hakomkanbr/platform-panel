"use client";

import React from "react";
import {
  Avatar,
  Typography,
  Button,
  Space,
  Tag,
  Select,
  Tooltip,
  message,
} from "antd";
import {
  ShopOutlined,
  SwapOutlined,
  ExportOutlined,
  CopyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { ProjectDetailDto, ProjectDto } from "@repo/shared-types";
import { useTranslations } from "@repo/localization";
import { getStoreUrl } from "@repo/utils";

const { Title, Text } = Typography;

interface StoreHeaderProps {
  project: ProjectDetailDto;
  projects: ProjectDto[];
  activeProjectId: string;
  onSwitchProject: (projectId: string) => void;
}

export default function StoreHeader({
  project,
  projects,
  activeProjectId,
  onSwitchProject,
}: StoreHeaderProps) {
  const t = useTranslations();
  const projectLogo = project.logoUrl || project.logo;

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        border: "1px solid #E2E8F0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        padding: "24px 28px",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <Space align="start" size={18}>
          {projectLogo ? (
            <Avatar
              src={projectLogo}
              size={64}
              shape="square"
              style={{
                borderRadius: 14,
                border: "1px solid #E2E8F0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                objectFit: "contain",
                background: "#FFFFFF",
              }}
            />
          ) : (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 14,
                background: "rgba(247, 147, 30, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(247, 147, 30, 0.2)",
              }}
            >
              <ShopOutlined style={{ fontSize: 32, color: "#F7931E" }} />
            </div>
          )}

          <Space direction="vertical" size={4}>
            <Space align="center" wrap>
              <Title level={3} style={{ margin: 0, fontWeight: 700, color: "#0F172A" }}>
                {project.name}
              </Title>
              {project.slug && (
                <Tag
                  color="orange"
                  style={{
                    borderRadius: 6,
                    fontWeight: 600,
                    fontSize: 12,
                    borderColor: "#FED7AA",
                    background: "#FFF7ED",
                    color: "#C2410C",
                  }}
                >
                  /{project.slug}
                </Tag>
              )}
              <Tag color="green" icon={<CheckCircleOutlined />} style={{ borderRadius: 6 }}>
                {t("settings.statusActive")}
              </Tag>
            </Space>

            <Text type="secondary" style={{ fontSize: 14, maxWidth: 650, display: "block" }}>
              {project.description || t("settings.noDescriptionProvided")}
            </Text>

            {project.slug && (
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#9A3412",
                    background: "#FFF7ED",
                    padding: "3px 10px",
                    borderRadius: 6,
                    border: "1px solid #FED7AA",
                    fontWeight: 500,
                    wordBreak: "break-all",
                  }}
                >
                  {getStoreUrl(project.slug)}
                </Text>
                <Tooltip title={t("settings.copyStoreUrl")}>
                  <Button
                    size="small"
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={() => {
                      navigator.clipboard.writeText(getStoreUrl(project.slug));
                      message.success(t("settings.storeCopied"));
                    }}
                  />
                </Tooltip>
              </div>
            )}
          </Space>
        </Space>

        <Space wrap size={10} style={{ alignSelf: "flex-start" }}>
          {projects.length > 1 && (
            <Select
              value={activeProjectId}
              onChange={onSwitchProject}
              style={{ width: 190 }}
              placeholder={t("settings.switchStore")}
              suffixIcon={<SwapOutlined style={{ color: "#F7931E" }} />}
              options={projects.map((p) => ({
                value: p.id,
                label: (
                  <Space size={6}>
                    <ShopOutlined style={{ color: "#F7931E" }} />
                    <span>{p.name}</span>
                  </Space>
                ),
              }))}
            />
          )}

          {project.slug && (
            <Button
              type="primary"
              icon={<ShopOutlined />}
              onClick={() => window.open(getStoreUrl(project.slug), "_blank")}
              style={{
                borderRadius: 8,
                background: "linear-gradient(135deg, #F7931E 0%, #EA580C 100%)",
                borderColor: "#F7931E",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 2px 8px rgba(247, 147, 30, 0.3)",
              }}
            >
              <span>{t("settings.visitStore")}</span>
              <ExportOutlined style={{ fontSize: 11 }} />
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
}