"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Empty,
  Input,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import {
  ApiOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  PlusOutlined,
  SearchOutlined,
  ShopOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useTenantId, useProjects, useSetMarketplaceMember } from "@repo/hooks";
import { useTranslations } from "@repo/localization";
import { motion } from "framer-motion";
import { PageTransition, AnimatedCard } from "@repo/ui";
import CreateApiKeyDialog from "@/components/api-keys/create-api-key-dialog";
import type { ProjectDto } from "@repo/shared-types";

const { Title, Text } = Typography;

export default function MarketplacePage() {
  const t = useTranslations();
  const tenantId = useTenantId();
  const {
    data: projects = [],
    isLoading: projectsLoading,
    error,
  } = useProjects(tenantId);
  const setMarketplaceMember = useSetMarketplaceMember();

  const [search, setSearch] = useState("");
  const [ownerProjectId, setOwnerProjectId] = useState<string | undefined>();
  const [createKeyOpen, setCreateKeyOpen] = useState(false);

  useEffect(() => {
    if (!ownerProjectId && projects.length > 0) {
      setOwnerProjectId(projects[0].id);
    }
  }, [projects, ownerProjectId]);

  const filtered = useMemo(() => {
    if (!search) return projects;
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q),
    );
  }, [projects, search]);

  const handleToggle = (project: ProjectDto, enabled: boolean) => {
    setMarketplaceMember.mutate({ projectId: project.id, enabled, tenantId });
  };

  const ownerProjectName = projects.find((p) => p.id === ownerProjectId)?.name;

  if (projectsLoading) {
    return (
      <PageTransition>
        <div className="section-header">
          <Title level={3}>{t("dashboard.marketplace.title")}</Title>
          <Text type="secondary">{t("dashboard.marketplace.subtitle")}</Text>
        </div>
        <div style={{ textAlign: "center", padding: 80 }}>
          <Spin size="large" />
        </div>
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
          <Text type="danger">
            {t("dashboard.marketplace.loadFailed", { error: error.message })}
          </Text>
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
            {t("dashboard.marketplace.title")}
          </Title>
          <Text type="secondary">{t("dashboard.marketplace.subtitle")}</Text>
        </div>
      </div>

      <Card
        style={{
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          marginBottom: 24,
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Alert
            type="info"
            showIcon
            icon={<GlobalOutlined />}
            message={t("dashboard.marketplace.infoTitle")}
            description={t("dashboard.marketplace.infoDesc")}
          />
          <Space align="center">
            <Input
              placeholder={t("dashboard.marketplace.searchPlaceholder")}
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 300, borderRadius: 6 }}
              allowClear
            />
            <Text type="secondary">
              {t("dashboard.marketplace.storesCount", {
                filteredCount: filtered.length,
                availableCount: projects.filter((p) => p.isMarketplaceMember)
                  .length,
              })}
            </Text>
          </Space>
        </Space>
      </Card>

      <AnimatedCard>
        {filtered.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction="vertical" align="center">
                <ShopOutlined
                  style={{ fontSize: 28, color: "var(--primary)" }}
                />
                <Text type="secondary" style={{ fontSize: 15 }}>
                  {t("dashboard.marketplace.noStoresFound")}
                </Text>
              </Space>
            }
          />
        ) : (
          <div>
            {filtered.map((project, idx) => (
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
                      idx < filtered.length - 1
                        ? "1px solid var(--border-light)"
                        : "none",
                    transition: "background 0.15s",
                    borderRadius:
                      idx === 0
                        ? "12px 12px 0 0"
                        : idx === filtered.length - 1
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
                  <Space>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: "var(--primary-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: project.isMarketplaceMember
                          ? "#10b981"
                          : "var(--primary)",
                        fontSize: 18,
                      }}
                    >
                      <ShopOutlined />
                    </div>
                    <Space direction="vertical" size={1}>
                      <Text strong style={{ fontSize: 14 }}>
                        {project.name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {project.slug}
                      </Text>
                    </Space>
                  </Space>
                  <Space>
                    <Tag
                      color={project.isMarketplaceMember ? "green" : "default"}
                      style={{ borderRadius: 4, fontSize: 11 }}
                      icon={
                        project.isMarketplaceMember ? (
                          <CheckCircleOutlined />
                        ) : undefined
                      }
                    >
                      {project.isMarketplaceMember
                        ? t("dashboard.marketplace.statusAvailable")
                        : t("dashboard.marketplace.statusNotAvailable")}
                    </Tag>
                    {project.isMarketplaceMember ? (
                      <Button
                        size="small"
                        danger
                        icon={<StopOutlined />}
                        loading={setMarketplaceMember.isPending}
                        style={{ borderRadius: 8 }}
                        onClick={() => handleToggle(project, false)}
                      >
                        {t("dashboard.marketplace.btnRemove")}
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        loading={setMarketplaceMember.isPending}
                        style={{ borderRadius: 8 }}
                        onClick={() => handleToggle(project, true)}
                      >
                        {t("dashboard.marketplace.btnAdd")}
                      </Button>
                    )}
                  </Space>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatedCard>

      {/* <Card
        title={
          <Space>
            <ApiOutlined style={{ color: "#F7931E" }} />
            {t("dashboard.marketplace.apiTitle")}
          </Space>
        }
        style={{
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          marginTop: 24,
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Text type="secondary">{t("dashboard.marketplace.apiDesc")}</Text>
          <Space wrap>
            <Select
              placeholder={t("dashboard.marketplace.apiSelectPlaceholder")}
              value={ownerProjectId}
              onChange={setOwnerProjectId}
              options={projects.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
              style={{ width: 280 }}
            />
            <Button
              type="primary"
              icon={<ApiOutlined />}
              disabled={!ownerProjectId}
              onClick={() => setCreateKeyOpen(true)}
              style={{ borderRadius: 6 }}
            >
              {t("dashboard.marketplace.apiBtnCreate")}
            </Button>
          </Space>
        </Space>
      </Card> */}

      <CreateApiKeyDialog
        open={createKeyOpen}
        onClose={() => setCreateKeyOpen(false)}
        projectId={ownerProjectId || ""}
        projectName={ownerProjectName}
        defaultScope="marketplace_projects"
        defaultAccessLevel="standard_read"
        title={t("dashboard.marketplace.apiBtnCreate")}
        onSuccess={() => {
          setCreateKeyOpen(false);
        }}
      />
    </PageTransition>
  );
}
