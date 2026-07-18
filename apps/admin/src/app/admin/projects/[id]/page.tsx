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
} from "@ant-design/icons";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTenantId } from "@/hooks/useTenantId";
import {
  useProject,
  useAppCatalog,
  useCurrentCapabilities,
  useUpdateProject,
  useDeleteProject,
} from "@/hooks/useApps";
import AppLauncher from "@/components/apps/AppLauncher";
import { motion } from "framer-motion";
import AnimatedCard from "@/components/common/AnimatedCard";
import PageTransition from "@/components/common/PageTransition";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "https://localhost:52562";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

async function handleOpenCms() {
  try {
    const accessToken = getCookie("access_token") || getCookie("AuthToken");
    const refreshToken = getCookie("refresh_token");
    if (!accessToken) {
      window.location.href = "http://localhost:3001";
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
      window.location.href = `http://localhost:3001/auth/sso?ticket=${json.data.ticket}`;
    }
  } catch {
    window.location.href = "http://localhost:3001";
  }
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = useTenantId();
  const projectId = params.id as string;
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
        <Space>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="primary"
              icon={<ApiOutlined />}
              onClick={handleOpenCms}
              style={{
                borderRadius: 8,
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                boxShadow: "0 2px 8px rgba(102, 126, 234, 0.4)",
              }}
            >
              CMS
            </Button>
          </motion.div>
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

      <AnimatedCard
        data-tour="project-apps"
        title={
          <Space>
            <AppstoreOutlined style={{ color: "var(--primary)" }} />
            <span>App Launcher</span>
          </Space>
        }
        style={{ minHeight: 300 }}
      >
        <AppLauncher
          project={project}
          appCatalog={appCatalog}
          capabilities={capabilities}
          tenantId={tid}
          isLoadingCapabilities={isLoadingCapabilities}
        />
      </AnimatedCard>

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
