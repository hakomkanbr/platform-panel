"use client";

import { useState } from "react";
import {
  Typography,
  Spin,
  Button,
  Space,
  Tag,
  Card,
  Descriptions,
  Empty,
  Form,
  Input,
  Modal,
} from "antd";
import {
  SettingOutlined,
  FolderOpenOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  IdcardOutlined,
  EditOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTenantId, useProject, useUpdateProject } from "@repo/hooks";
import { PageTransition } from "@repo/ui";
import ProjectSettingsTabs from "@/components/projects/project-settings-tabs";
import dayjs from "dayjs";

const { Title, Text } = Typography;

function getProjectId(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )ProjectId=([^;]+)`));
  return match ? decodeURIComponent(match[2]!) : null;
}

export default function ProjectOverview() {
  const router = useRouter();
  const tenantId = useTenantId();
  const tid = tenantId || "";
  const projectId = getProjectId() || "";

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();

  const {
    data: project,
    isLoading,
    error,
  } = useProject(projectId, tid || undefined);

  const updateProject = useUpdateProject();

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

  const openEditModal = () => {
    if (!project) return;
    editForm.setFieldsValue({
      name: project.name,
      description: project.description,
    });
    setEditModalVisible(true);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Loading project details...</Text>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <Empty
        style={{ marginTop: 60 }}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Space direction="vertical" size={8}>
            <Text strong>No project selected</Text>
            <Text type="secondary">
              {projectId
                ? "The selected project could not be loaded for settings."
                : "Pick a project from the header selector to see its details here."}
            </Text>
          </Space>
        }
      >
        <Button type="primary" onClick={() => router.push("/admin/projects")}>
          Go to Projects
        </Button>
      </Empty>
    );
  }

  return (
    <PageTransition>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <Space direction="vertical" size={6}>
          <Space align="center">
            <FolderOpenOutlined
              style={{ fontSize: 26, color: "var(--primary)" }}
            />
            <Title level={2} style={{ margin: 0 }}>
              {project.name}
            </Title>
            {project.slug && (
              <Tag color="blue" style={{ borderRadius: 6 }}>
                {project.slug}
              </Tag>
            )}
          </Space>
          <Text type="secondary" style={{ fontSize: 14, maxWidth: 600 }}>
            {project.description || "No description provided for this project."}
          </Text>
        </Space>
        <Button icon={<EditOutlined />} onClick={openEditModal} style={{ borderRadius: 8 }}>
          Edit Details
        </Button>
      </div>

      <Card
        style={{
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.08)",
          marginBottom: 24,
        }}
        title={
          <Space>
            <SettingOutlined style={{ color: "var(--primary)" }} />
            <span>Project Details</span>
          </Space>
        }
      >
        <Descriptions
          bordered
          column={{ xs: 1, sm: 2, md: 3 }}
          size="middle"
          labelStyle={{ fontWeight: 600, width: 160 }}
          contentStyle={{ color: "#1F2937" }}
        >
          <Descriptions.Item label="Project ID">
            <Space>
              <IdcardOutlined style={{ color: "#9CA3AF" }} />
              <Text style={{ wordBreak: "break-all" }}>{project.id}</Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Name">
            <FolderOpenOutlined style={{ color: "#9CA3AF", marginRight: 6 }} />
            {project.name}
          </Descriptions.Item>
          <Descriptions.Item label="Slug">
            {project.slug ? (
              <Tag color="blue" style={{ borderRadius: 6 }}>
                {project.slug}
              </Tag>
            ) : (
              "—"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={3}>
            <FileTextOutlined style={{ color: "#9CA3AF", marginRight: 6 }} />
            {project.description || "No description"}
          </Descriptions.Item>
          <Descriptions.Item label="Created">
            <Space>
              <CalendarOutlined style={{ color: "#9CA3AF" }} />
              {dayjs(project.createdAt).format("MMM DD, YYYY hh:mm A")}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            <Space>
              <ClockCircleOutlined style={{ color: "#9CA3AF" }} />
              {project.updatedAt
                ? dayjs(project.updatedAt).format("MMM DD, YYYY hh:mm A")
                : "—"}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color="green" style={{ borderRadius: 6 }}>
              Active
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        style={{
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.08)",
        }}
        title={
          <Space>
            <SettingOutlined style={{ color: "var(--primary)" }} />
            <span>Project Settings</span>
          </Space>
        }
      >
        <ProjectSettingsTabs project={project} />
      </Card>

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