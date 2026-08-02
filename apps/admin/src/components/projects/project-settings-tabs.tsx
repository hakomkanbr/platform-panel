"use client";

import { Tabs, Typography, Space, Card, Empty, Button } from "antd";
import {
  SettingOutlined,
  TeamOutlined,
  GlobalOutlined,
  KeyOutlined,
  TranslationOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import ApiKeyTable from "@/components/api-keys/api-key-table";
import LanguageTable from "@/components/languages/language-table";
import type { ProjectDetailDto } from "@repo/shared-types";

const { Title, Text } = Typography;

interface ProjectSettingsTabsProps {
  project: ProjectDetailDto;
}

function GeneralSettings({ project }: { project: ProjectDetailDto }) {
  return (
    <div style={{ padding: "8px 0" }}>
      <Card
        title={
          <Space>
            <SettingOutlined style={{ color: "#F7931E" }} />
            Project Information
          </Space>
        }
        style={{ borderRadius: 8, marginBottom: 16 }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
              Project Name
            </Text>
            <Text strong>{project.name}</Text>
          </div>
          <div>
            <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
              Slug
            </Text>
            <Text code>{project.slug}</Text>
          </div>
          <div>
            <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
              Description
            </Text>
            <Text>{project.description || "No description"}</Text>
          </div>
        </div>
      </Card>
    </div>
  );
}

function MembersSettings() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 0",
      }}
    >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Space direction="vertical" size={8}>
            <Text strong>Team Members</Text>
            <Text type="secondary">Invite team members to collaborate on this project.</Text>
          </Space>
        }
      >
        <Button type="primary" style={{ borderRadius: 6 }}>
          Invite Members
        </Button>
      </Empty>
    </div>
  );
}

function DomainsSettings() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 0",
      }}
    >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Space direction="vertical" size={8}>
            <Text strong>Custom Domains</Text>
            <Text type="secondary">Configure custom domains for your project applications.</Text>
          </Space>
        }
      >
        <Button type="primary" style={{ borderRadius: 6 }}>
          Add Domain
        </Button>
      </Empty>
    </div>
  );
}

export default function ProjectSettingsTabs({ project }: ProjectSettingsTabsProps) {
  const items = [
    {
      key: "general",
      label: (
        <Space>
          <SettingOutlined />
          General
        </Space>
      ),
      children: <GeneralSettings project={project} />,
    },
    {
      key: "members",
      label: (
        <Space>
          <TeamOutlined />
          Members
        </Space>
      ),
      children: <MembersSettings />,
    },
    {
      key: "domains",
      label: (
        <Space>
          <GlobalOutlined />
          Domains
        </Space>
      ),
      children: <DomainsSettings />,
    },
    {
      key: "api-keys",
      label: (
        <Space>
          <KeyOutlined />
          API Keys
        </Space>
      ),
      children: <ApiKeyTable projectId={project.id} />,
    },
    {
      key: "languages",
      label: (
        <Space>
          <TranslationOutlined />
          Languages
        </Space>
      ),
      children: <LanguageTable projectId={project.id} />,
    },
  ];

  return (
    <Card
      style={{
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Tabs
        tabPosition="top"
        items={items}
        size="large"
        tabBarStyle={{
          marginBottom: 24,
          borderBottom: "2px solid #f1f5f9",
        }}
        animated={{ inkBar: true, tabPane: true }}
      />
    </Card>
  );
}
