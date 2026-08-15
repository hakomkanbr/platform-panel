"use client";

import React, { useState } from "react";
import {
  Typography,
  Spin,
  Alert,
  Button,
  Space,
  Breadcrumb,
  Card,
  Modal,
  Form,
  Input,
  Tag,
  Statistic,
  Row,
  Col,
  Descriptions,
  Popconfirm,
  Switch,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  FolderOpenOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  KeyOutlined,
  ApiOutlined,
  SettingOutlined,
  ShopOutlined,
  ExportOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTenantId } from "@repo/hooks";
import {
  useProject,
  useAppCatalog,
  useCurrentCapabilities,
  useUpdateProject,
  useDeleteProject,
  useSetMarketplaceMember,
} from "@repo/hooks";
import { useTranslations } from "@repo/localization";
import { getStoreUrl } from "@repo/utils";
import { message } from "antd";
import AppLauncher from "@/components/apps/AppLauncher";
import ProjectSettingsTabs from "@/components/projects/project-settings-tabs";
import { motion } from "framer-motion";
import { AnimatedCard, PageTransition } from "@repo/ui";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL || "https://platformapi.bremix.tech";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

async function handleOpenCms() {
  try {
    const accessToken = getCookie("access_token") || getCookie("AuthToken");
    const refreshToken = getCookie("refresh_token");
    if (!accessToken) {
      window.location.href = "https://cms.share2sells.com";
      return;
    }

    const res = await fetch(`${GATEWAY_URL}/api/v1/auth/sso/request-ticket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });
    const json = await res.json();
    if (json.success && json.data?.ticket) {
      window.location.href = `https://cms.share2sells.com/auth/sso?ticket=${json.data.ticket}`;
    }
  } catch {
    window.location.href = "https://cms.share2sells.com";
  }
}

export default function ProjectDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const tenantId = useTenantId();
  const projectId = params.projectId as string;
  const tid = tenantId || "";

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();

  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useProject(projectId, tid || undefined);

  const { data: appCatalog = [] } = useAppCatalog();

  const { data: capabilities, isLoading: isLoadingCapabilities } =
    useCurrentCapabilities(tid || undefined);

  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const setMarketplaceMember = useSetMarketplaceMember();

  const handleToggleMarketplace = async (enabled: boolean) => {
    try {
      await setMarketplaceMember.mutateAsync({
        projectId,
        tenantId: tid || undefined,
        enabled,
      });
    } catch {
      // error handled in hook
    }
  };

  const handleUpdateProject = async (values: any) => {
    try {
      await updateProject.mutateAsync({
        id: projectId,
        request: { name: values.name, description: values.description },
        tenantId: tid || undefined,
      });
      setEditModalVisible(false);
    } catch {
      // error handled in hook
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject.mutateAsync({
        id: projectId,
        tenantId: tid || undefined,
      });
      router.push("/admin/projects");
    } catch {
      // error handled in hook
    }
  };

  const openEditModal = () => {
    if (!project) return;
    editForm.setFieldsValue({
      name: project.name,
      description: project.description,
    });
    setEditModalVisible(true);
  };

  if (projectLoading) {
    return (
      <PageTransition>
        <div style={{ textAlign: "center", padding: 80 }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Loading project...</Text>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (projectError || !project) {
    return (
      <PageTransition>
        <div style={{ padding: 0 }}>
          <Link href="/admin/projects">
            <Button
              icon={<ArrowLeftOutlined />}
              style={{ marginBottom: 16, borderRadius: 8 }}
            >
              Back to Projects
            </Button>
          </Link>
          <Alert
            type="error"
            message="Project not found"
            description={
              projectError?.message || "The project could not be loaded."
            }
            showIcon
            style={{ borderRadius: 12 }}
          />
        </div>
      </PageTransition>
    );
  }

  const enabledCount = project.apps.filter((a) => a.isEnabled).length;
  const totalCount = project.apps.length;

  return (
    <PageTransition>
      <Breadcrumb
        items={[
          { title: <Link href="/admin/projects">Projects</Link> },
          { title: project.name },
        ]}
        style={{ marginBottom: 16 }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <Space direction="vertical" size={4}>
          <Space>
            <Link href="/admin/projects">
              <Button type="text" icon={<ArrowLeftOutlined />} size="small" />
            </Link>
            <Title level={3} style={{ margin: 0 }}>
              <FolderOpenOutlined
                style={{ marginRight: 8, color: "var(--primary)" }}
              />
              {project.name}
            </Title>
            <Tag color="blue" style={{ borderRadius: 6 }}>
              {project.slug}
            </Tag>
          </Space>
          <Text type="secondary" style={{ marginLeft: 36 }}>
            {project.description || "No description"}
          </Text>
        </Space>
        <Space wrap>
          {project.slug && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="primary"
                icon={<ShopOutlined />}
                onClick={() => window.open(getStoreUrl(project.slug), "_blank")}
                style={{
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #F7931E 0%, #EA580C 100%)",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(247, 147, 30, 0.4)",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>{t("common.actions.visitStore")}</span>
                <ExportOutlined style={{ fontSize: 11 }} />
              </Button>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              icon={<EditOutlined />}
              onClick={openEditModal}
              style={{ borderRadius: 8 }}
            >
              Edit
            </Button>
          </motion.div>
          <Popconfirm
            title="Delete this project?"
            description="This will permanently remove all app configurations."
            onConfirm={handleDeleteProject}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              style={{ borderRadius: 8 }}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      </div>

      {project.slug && (
        <AnimatedCard
          style={{
            marginBottom: 24,
            background: "linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)",
            border: "1px solid #FED7AA",
            borderRadius: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <Space align="center" size={12}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#F7931E18",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#F7931E",
                  fontSize: 22,
                }}
              >
                <ShopOutlined />
              </div>
              <div>
                <Text strong style={{ fontSize: 15, color: "#1F2937", display: "block" }}>
                  {t("common.actions.storeUrl")}
                </Text>
                <Text
                  code
                  style={{
                    fontSize: 13,
                    color: "#C2410C",
                    background: "#FFF",
                    borderColor: "#FDBA74",
                    wordBreak: "break-all",
                  }}
                >
                  {getStoreUrl(project.slug)}
                </Text>
              </div>
            </Space>

            <Space>
              <Button
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(getStoreUrl(project.slug));
                  message.success(t("common.actions.storeCopied"));
                }}
                style={{ borderRadius: 8 }}
              >
                {t("common.actions.copyStoreUrl")}
              </Button>
              <Button
                type="primary"
                icon={<ExportOutlined />}
                onClick={() => window.open(getStoreUrl(project.slug), "_blank")}
                style={{
                  borderRadius: 8,
                  background: "#F7931E",
                  borderColor: "#F7931E",
                }}
              >
                {t("common.actions.visitStore")}
              </Button>
            </Space>
          </div>
        </AnimatedCard>
      )}

      <Row
        gutter={[20, 20]}
        style={{ marginBottom: 24 }}
        data-tour="project-stats"
      >
        <Col xs={24} sm={8}>
          <AnimatedCard>
            <Statistic
              title="Total Apps"
              value={totalCount}
              prefix={<AppstoreOutlined style={{ color: "var(--primary)" }} />}
              suffix={<Text type="secondary">in catalog</Text>}
              valueStyle={{ color: "var(--text-primary)" }}
            />
          </AnimatedCard>
        </Col>
        <Col xs={24} sm={8}>
          <AnimatedCard index={1}>
            <Statistic
              title="Enabled Apps"
              value={enabledCount}
              valueStyle={{
                color:
                  enabledCount > 0 ? "var(--success)" : "var(--text-tertiary)",
              }}
              prefix={
                <CheckCircleOutlined
                  style={{
                    color: enabledCount > 0 ? "var(--success)" : undefined,
                  }}
                />
              }
              suffix={<Text type="secondary">active</Text>}
            />
          </AnimatedCard>
        </Col>
        <Col xs={24} sm={8}>
          <AnimatedCard index={2}>
            <Statistic
              title="Created"
              value={dayjs(project.createdAt).format("MMM DD, YYYY")}
              prefix={<CalendarOutlined style={{ color: "var(--primary)" }} />}
              valueStyle={{ color: "var(--text-primary)" }}
            />
          </AnimatedCard>
        </Col>
      </Row>

      {/* <AnimatedCard
        data-tour="project-apps"
        title={
          <Space>
            <AppstoreOutlined style={{ color: "var(--primary)" }} />
            <span>App Launcher</span>
          </Space>
        }
        style={{ minHeight: 300, marginBottom: 24 }}
      >
        <AppLauncher
          project={project}
          appCatalog={appCatalog}
          capabilities={capabilities}
          tenantId={tid}
          isLoadingCapabilities={isLoadingCapabilities}
        />
      </AnimatedCard> */}

      <AnimatedCard
        title={
          <Space>
            <ShopOutlined style={{ color: "var(--primary)" }} />
            <span>Marketplace</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Space direction="vertical" size={2}>
            <Text strong>Join the marketplace</Text>
            <Text type="secondary">
              When enabled, this store joins the marketplace and becomes readable
              by company/marketplace API keys.
            </Text>
          </Space>
          <Space>
            {project.isMarketplaceMember && (
              <Tag color="purple" style={{ borderRadius: 6 }}>
                Subscribed
              </Tag>
            )}
            <Switch
              checked={project.isMarketplaceMember}
              onChange={handleToggleMarketplace}
              loading={setMarketplaceMember.isPending}
            />
          </Space>
        </Space>
      </AnimatedCard>

      <div style={{ marginTop: 0 }}>
        <Title level={4} style={{ marginBottom: 16 }}>
          <SettingOutlined style={{ marginRight: 8, color: "var(--primary)" }} />
          Project Settings
        </Title>
        <ProjectSettingsTabs project={project} />
      </div>

      <Modal
        title={
          <Space>
            <EditOutlined style={{ color: "var(--primary)" }} /> Edit Project
          </Space>
        }
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => editForm.submit()}
        confirmLoading={updateProject.isPending}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateProject}>
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </PageTransition>
  );
}
