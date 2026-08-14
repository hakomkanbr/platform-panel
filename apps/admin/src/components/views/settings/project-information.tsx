"use client";

import React from "react";
import {
  Card,
  Descriptions,
  Typography,
  Space,
  Tag,
  Image,
  Button,
} from "antd";
import {
  FolderOpenOutlined,
  EditOutlined,
  PictureOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { ProjectDetailDto } from "@repo/shared-types";
import { useTranslations } from "@repo/localization";
import dayjs from "dayjs";

const { Text, Paragraph } = Typography;

interface ProjectInformationProps {
  project: ProjectDetailDto;
  onEdit: () => void;
  projectsCount: number;
}

export default function ProjectInformation({
  project,
  onEdit,
  projectsCount,
}: ProjectInformationProps) {
  const t = useTranslations();
  const logo = project.logoUrl || project.logo;

  return (
    <Card
      title={
        <Space>
          <FolderOpenOutlined style={{ color: "#F7931E" }} />
          <span>{t("settings.projectDetails")}</span>
        </Space>
      }
      extra={
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={onEdit}
          style={{ fontWeight: 600 }}
        >
          {t("settings.editProject")}
        </Button>
      }
      style={{ borderRadius: 12, border: "1px solid #e2e8f0", height: "100%" }}
    >
      <Descriptions
        bordered
        column={1}
        size="middle"
        labelStyle={{ fontWeight: 600, width: 150, background: "#F8FAFC" }}
      >
        <Descriptions.Item label={t("settings.projectName")}>
          <Text strong>{project.name}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={t("common.fields.slug")}>
          <Tag color="blue" style={{ fontSize: 13, borderRadius: 6 }}>
            {project.slug}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label={t("settings.logo")}>
          {logo ? (
            <Space align="center" size={12}>
              <Image
                src={logo}
                alt={project.name}
                width={44}
                height={44}
                style={{
                  borderRadius: 8,
                  objectFit: "contain",
                  border: "1px solid #e2e8f0",
                  padding: 2,
                  background: "#FFFFFF",
                }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {logo.startsWith("data:")
                  ? t("settings.uploadOption")
                  : logo.length > 30
                    ? `${logo.slice(0, 30)}...`
                    : logo}
              </Text>
            </Space>
          ) : (
            <Space>
              <PictureOutlined style={{ color: "#9CA3AF" }} />
              <Text type="secondary">{t("settings.noLogo")}</Text>
            </Space>
          )}
        </Descriptions.Item>
        <Descriptions.Item label={t("common.fields.status")}>
          <Tag color="green" icon={<CheckCircleOutlined />} style={{ borderRadius: 6 }}>
            {t("settings.statusActive")}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label={t("settings.created")}>
          <Space size={6}>
            <CalendarOutlined style={{ color: "#64748B" }} />
            <Text>{dayjs(project.createdAt).format("MMM DD, YYYY")}</Text>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label={t("settings.lastUpdated")}>
          <Text type="secondary">
            {project.updatedAt
              ? dayjs(project.updatedAt).format("MMM DD, YYYY")
              : "—"}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label={t("common.fields.description")}>
          <Paragraph style={{ margin: 0, color: "#475569" }}>
            {project.description || t("settings.noDescription")}
          </Paragraph>
        </Descriptions.Item>
      </Descriptions>

      {projectsCount > 0 && (
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px dashed #E2E8F0" }}>
          <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
            {t("settings.projectsCount", { count: projectsCount })}
          </Text>
        </div>
      )}
    </Card>
  );
}