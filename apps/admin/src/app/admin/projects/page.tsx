"use client";

import React, { useState } from "react";
import {
  Typography,
  Space,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Alert,
  message,
  Empty,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  AppstoreOutlined,
  WarningOutlined,
  DeleteOutlined,
  EyeOutlined,
  FolderOutlined,
  CalendarOutlined,
  CodeOutlined,
  ShopOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useTenantId } from "@repo/hooks";
import {
  useProjects,
  useCreateProject,
  useDeleteProject,
  useCurrentCapabilities,
} from "@repo/hooks";
import { useCanConsume } from "@repo/hooks";
import { useTranslations } from "@repo/localization";
import { getStoreUrl } from "@repo/utils";
import Link from "next/link";
import dayjs from "dayjs";
import type { ProjectDto } from "@repo/shared-types";
import { AnimatedCard, PageTransition } from "@repo/ui";
import { TableSkeleton } from "@repo/ui";

const { Title, Text } = Typography;

export default function ProjectCenterPage() {
  const t = useTranslations();
  const tenantId = useTenantId();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [limitModalVisible, setLimitModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const { data: projects = [], isLoading, error } = useProjects(tenantId);
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const canConsumeMutation = useCanConsume();
  const { data: capabilities } = useCurrentCapabilities(tenantId);

  const maxProjects = capabilities?.["max_projects"]?.value ?? 5;

  const handleCreateProject = async (values: any) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await canConsumeMutation.mutateAsync({
        tenantId: tenantId || "current",
        capabilityCode: "max_projects",
        requestedAmount: 1,
      });

      if (!result.allowed) {
        setLimitModalVisible(true);
        return;
      }

      await createProject.mutateAsync({
        request: { name: values.name, description: values.description || "" },
        tenantId,
      });

      setCreateModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Create project error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject.mutateAsync({ id, tenantId });
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="section-header">
          <Title level={3}>Project Center</Title>
          <Text type="secondary">
            Manage your projects and launch applications
          </Text>
        </div>
        <TableSkeleton />
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <Text type="danger">Failed to load projects: {error.message}</Text>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div className="section-header" style={{ marginBottom: 0 }}>
          <Title level={3} style={{ margin: 0 }}>
            Project Center
          </Title>
          <Text type="secondary">
            Manage your projects and launch applications
          </Text>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
            size="large"
            style={{ borderRadius: 10, height: 42, paddingInline: 24 }}
          >
            Create Project
          </Button>
        </motion.div>
      </div>

      <AnimatedCard data-tour="projects-list">
        {projects.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction="vertical" align="center">
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: "var(--primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 8px",
                  }}
                >
                  <FolderOutlined
                    style={{ fontSize: 28, color: "var(--primary)" }}
                  />
                </div>
                <Text type="secondary" style={{ fontSize: 15 }}>
                  No projects yet
                </Text>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Create your first project to start using apps
                </Text>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setCreateModalVisible(true)}
                  style={{ marginTop: 8, borderRadius: 8 }}
                >
                  Create Project
                </Button>
              </Space>
            }
          />
        ) : (
          <div>
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.2 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    borderBottom:
                      idx < projects.length - 1
                        ? "1px solid var(--border-light)"
                        : "none",
                    transition: "background 0.15s",
                    borderRadius:
                      idx === 0
                        ? "12px 12px 0 0"
                        : idx === projects.length - 1
                          ? "0 0 12px 12px"
                          : 0,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--primary-light)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <Link
                    href={`/admin/projects/${project.id}`}
                    style={{ textDecoration: "none", color: "inherit", flex: 1, minWidth: 0 }}
                  >
                    <Space style={{ cursor: "pointer" }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: "var(--primary-light)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--primary)",
                          fontSize: 18,
                        }}
                      >
                        <FolderOutlined />
                      </div>
                      <Space direction="vertical" size={1}>
                        <Text strong style={{ fontSize: 14 }}>
                          {project.name}
                        </Text>
                        <Space size={12}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {project.slug}
                          </Text>
                          <Tag
                            color={
                              project.enabledAppCount > 0 ? "blue" : "default"
                            }
                            style={{ borderRadius: 4, fontSize: 10 }}
                          >
                            {project.enabledAppCount}/{project.appCount} apps
                          </Tag>
                        </Space>
                      </Space>
                    </Space>
                  </Link>
                  <Space size={8}>
                    <Text type="secondary" style={{ fontSize: 12, marginRight: 8 }}>
                      {dayjs(project.createdAt).format("MMM DD, YYYY")}
                    </Text>

                    {project.slug && (
                      <Button
                        size="small"
                        icon={<ShopOutlined style={{ color: "#F7931E" }} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(getStoreUrl(project.slug), "_blank");
                        }}
                        style={{
                          borderRadius: 8,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          borderColor: "#FED7AA",
                          background: "#FFF7ED",
                          color: "#C2410C",
                          fontWeight: 500,
                        }}
                      >
                        <span>{t("common.actions.visitStore")}</span>
                        <ExportOutlined style={{ fontSize: 10 }} />
                      </Button>
                    )}

                    <Link href={`/admin/projects/${project.id}`}>
                      <Button
                        size="small"
                        icon={<EyeOutlined />}
                        style={{ borderRadius: 8 }}
                      >
                        {t("common.actions.manage")}
                      </Button>
                    </Link>

                    <Popconfirm
                      title="Delete this project?"
                      description="This will remove all app configurations for this project."
                      onConfirm={() => handleDeleteProject(project.id)}
                    >
                      <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        style={{ borderRadius: 8 }}
                      />
                    </Popconfirm>
                  </Space>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatedCard>

      <Modal
        title={
          <Space>
            <PlusOutlined style={{ color: "var(--primary)" }} /> Create New
            Project
          </Space>
        }
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
          setSubmitting(false);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setCreateModalVisible(false);
              form.resetFields();
              setSubmitting(false);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="create"
            type="primary"
            onClick={() => form.submit()}
            loading={submitting}
            disabled={submitting}
          >
            Create
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateProject}>
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: "Please enter a project name" }]}
          >
            <Input
              prefix={
                <FolderOutlined style={{ color: "var(--text-tertiary)" }} />
              }
              placeholder="e.g., My E-commerce Site"
            />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea
              rows={3}
              placeholder="Brief description of this project"
            />
          </Form.Item>
          <Alert
            type="info"
            message={`Max projects allowed: ${projects.length} / ${maxProjects}`}
            showIcon
            style={{ marginTop: 8, borderRadius: 8 }}
          />
        </Form>
      </Modal>

      <Modal
        title={
          <Space>
            <WarningOutlined style={{ color: "var(--warning)" }} /> Limit
            Reached
          </Space>
        }
        open={limitModalVisible}
        onCancel={() => setLimitModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setLimitModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="upgrade"
            type="primary"
            onClick={() => {
              setLimitModalVisible(false);
              window.location.href = "/admin/billing";
            }}
          >
            Upgrade Plan
          </Button>,
        ]}
      >
        <Alert
          type="warning"
          message="Project Limit Reached"
          description={`You have reached the maximum number of projects (${maxProjects}) allowed for your current plan.`}
          style={{ marginBottom: 16, borderRadius: 8 }}
          showIcon
        />
      </Modal>
    </PageTransition>
  );
}
