'use client';

import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Typography,
  Avatar,
  Card,
  Spin,
  Empty,
  Space,
} from "antd";
import {
  PlusOutlined,
  AppstoreOutlined,
  UserAddOutlined,
  FolderOutlined,
  RightOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  CloudServerOutlined,
  ApiOutlined,
  TeamOutlined,
  ArrowUpOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { StatusPill } from "@repo/ui";
import { motion } from "framer-motion";
import { useAuth } from "@repo/auth";
import { useProjects, useAppCatalog, useCurrentCapabilities } from "@repo/hooks";
import { useCurrentSubscription, useInvoices } from "@repo/hooks";
import { useUsageSummary } from "@repo/hooks";
import { useTenantId } from "@repo/hooks";
import { StatSkeleton } from "@repo/ui";

const { Title, Text } = Typography;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const stagger = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function HomePage() {
  const router = useRouter();
  const tenantId = useTenantId();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");

  const { data: projects = [], isLoading: projectsLoading } = useProjects(tenantId);
  const { data: appCatalog = [], isLoading: catalogLoading } = useAppCatalog();
  const { data: capabilities } = useCurrentCapabilities(tenantId);
  const { data: subscription } = useCurrentSubscription(tenantId);
  const { data: invoices = [] } = useInvoices(tenantId);
  const { data: usageSummary } = useUsageSummary(tenantId);

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const isLoading = projectsLoading || catalogLoading;

  if (isLoading) {
    return (
      <div className="s2s-stagger" style={{ display: "flex", flexDirection: "column", gap: 28, paddingBottom: 32 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ background: "linear-gradient(135deg, #1F2937 0%, #111827 100%)", borderRadius: 20, padding: "36px 40px", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
            <Spin />
          </div>
        </motion.div>
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map((i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <StatSkeleton />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  const planName = subscription?.planName || "No Plan";
  const status = subscription?.status || "none";
  const isOnline = status === "active" || status === "trial";

  const totalApps = appCatalog.length;
  const totalProjects = projects.length;
  const totalInvoices = invoices.length;
  const totalMembers = capabilities?.["max_users"]?.value ?? 0;
  const apiUsage = usageSummary?.usages?.find((u) => u.capabilityCode === "API_CALLS" || u.capabilityCode === "max_api_calls");
  const apiCalls = apiUsage?.currentValue ?? 0;
  const apiLimit = apiUsage?.limitValue ?? 0;
  const apiPercentage = apiUsage?.percentageUsed ?? 0;

  const kpiData = [
    {
      title: "Total Projects",
      value: `${totalProjects} Projects`,
      trend: `${totalProjects > 0 ? "Active" : "No projects yet"}`,
      icon: <FolderOutlined />,
      accent: "#F7931E",
    },
    {
      title: "App Catalog",
      value: `${totalApps} Apps`,
      trend: `${appCatalog.filter((a) => a.isActive).length} active`,
      icon: <CloudServerOutlined />,
      accent: "#009FE3",
    },
    {
      title: "API Calls",
      value: apiLimit > 0 ? `${(apiCalls / 1000).toFixed(1)}K` : "N/A",
      trend: apiLimit > 0 ? `${apiPercentage.toFixed(0)}% of limit` : "No data",
      icon: <ApiOutlined />,
      accent: "#10B981",
    },
    {
      title: "Subscription",
      value: planName,
      trend: isOnline ? "Active" : status,
      icon: <TeamOutlined />,
      accent: "#8B5CF6",
    },
  ];

  const sortedProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const openApps = appCatalog.filter((a) => a.isActive);

  return (
    <div className="s2s-stagger" style={{ display: "flex", flexDirection: "column", gap: 28, paddingBottom: 32 }}>
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="platform-hero"
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1F2937 0%, #111827 100%)",
            borderRadius: 20,
            padding: "36px 40px",
            color: "#FFFFFF",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-100px",
              right: "-60px",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(247,147,30,0.2) 0%, rgba(0,0,0,0) 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-80px",
              left: "-40px",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,159,227,0.12) 0%, rgba(0,0,0,0) 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#F7931E", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {greeting}, {user?.firstName || user?.email || "User"}
                </span>
                <StatusPill status={isOnline ? "healthy" : "maintenance"} label={isOnline ? "Platform Online" : planName} size="sm" />
              </div>
              <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
                Share2Sells SaaS Workspace
              </h1>
              <p style={{ fontSize: 15, color: "#9CA3AF", marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
                {totalProjects > 0
                  ? `${totalProjects} project${totalProjects > 1 ? "s" : ""} running with ${totalApps} available applications.`
                  : "Start by creating your first project."}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => router.push("/admin/projects/new")}
                className="s2s-btn-premium"
              >
                New Project
              </Button>
              <Button
                onClick={() => router.push("/admin/app-library")}
                className="s2s-btn-glass"
              >
                App Library
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <Row gutter={[16, 16]}>
        {kpiData.map((stat, i) => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <motion.div
              custom={i}
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <Card
                className="s2s-kpi-card"
                styles={{ body: { padding: 22 } }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <Text style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", letterSpacing: "0.02em" }}>{stat.title}</Text>
                  <div
                    className="s2s-kpi-icon"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: `${stat.accent}12`,
                      color: stat.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                    }}
                  >
                    {stat.icon}
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#1F2937", lineHeight: 1.1, marginBottom: 8, letterSpacing: "-0.02em" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: "#10B981", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                  <ArrowUpOutlined style={{ fontSize: 10 }} /> {stat.trend}
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        <Col xs={24} xl={16}>
          {/* open Applications */}
          <div style={{ marginBottom: 28 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CloudServerOutlined style={{ color: "#009FE3", fontSize: 18 }} />
                  <Title level={4} style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1F2937" }}>
                    App Catalog
                  </Title>
                </div>
                <Button type="text" icon={<RightOutlined />} onClick={() => router.push("/admin/app-library")} style={{ color: "#F7931E", fontWeight: 600, padding: 0 }}>
                  Explore All
                </Button>
              </div>
            </motion.div>

            {appCatalog.length === 0 ? (
              <Card className="s2s-kpi-card" styles={{ body: { padding: 32 } }}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div style={{ textAlign: "center" }}>
                      <Text type="secondary" style={{ fontSize: 14 }}>No applications available</Text>
                    </div>
                  }
                />
              </Card>
            ) : (
              <Row gutter={[16, 16]}>
                {appCatalog.slice(0, 4).map((app, i) => (
                  <Col xs={24} sm={12} key={app.id}>
                    <motion.div
                      custom={i + 4}
                      initial="hidden"
                      animate="visible"
                      variants={stagger}
                    >
                      <Card
                        hoverable
                        className="s2s-app-card"
                        onClick={() => router.push(`/admin/app-library`)}
                        styles={{ body: { padding: 22 } }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                          <div
                            className="s2s-app-icon"
                            style={{
                              width: 46,
                              height: 46,
                              borderRadius: 12,
                              background: "#FAFBFC",
                              border: "1px solid #F3F4F6",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 20,
                              color: "#009FE3",
                              flexShrink: 0,
                            }}
                          >
                            <FileTextOutlined />
                          </div>
                          <StatusPill status={app.isActive ? "healthy" : "maintenance"} size="sm" />
                        </div>

                        <h5 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1F2937", lineHeight: 1.3 }}>
                          {app.displayName || app.name}
                        </h5>
                        <p style={{ fontSize: 12, color: "#6B7280", margin: "4px 0 0 0", lineHeight: 1.4 }}>
                          {app.description?.slice(0, 60)}{app.description?.length > 60 ? "..." : ""}
                        </p>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18, paddingTop: 14, borderTop: "1px solid #F3F4F6" }}>
                          <span style={{ fontSize: 11, color: "#9CA3AF" }}>{app.capabilityCode}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#F7931E" }}>
                            {app.isActive ? "open" : "Available"} &rarr;
                          </span>
                        </div>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            )}
          </div>

          {/* Recent Projects */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <FolderOutlined style={{ color: "#F7931E", fontSize: 18 }} />
                  <Title level={4} style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1F2937" }}>
                    Recent Projects
                  </Title>
                </div>
                <Button type="text" icon={<RightOutlined />} onClick={() => router.push("/admin/projects")} style={{ color: "#F7931E", fontWeight: 600, padding: 0 }}>
                  View All Projects
                </Button>
              </div>
            </motion.div>

            {sortedProjects.length === 0 ? (
              <Card className="s2s-kpi-card" styles={{ body: { padding: 32 } }}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Space direction="vertical" align="center">
                      <Text type="secondary" style={{ fontSize: 14 }}>No projects yet</Text>
                      <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/admin/projects/new")} style={{ borderRadius: 8 }}>
                        Create Project
                      </Button>
                    </Space>
                  }
                />
              </Card>
            ) : (
              <Row gutter={[16, 16]}>
                {sortedProjects.map((project, i) => (
                  <Col xs={24} key={project.id}>
                    <motion.div
                      custom={i + 6}
                      initial="hidden"
                      animate="visible"
                      variants={stagger}
                    >
                      <Card
                        hoverable
                        className="s2s-project-card"
                        onClick={() => router.push(`/admin/projects/${project.id}`)}
                        styles={{ body: { padding: 22 } }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: 14,
                                background: "#F7931E14",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 22,
                                color: "#F7931E",
                                flexShrink: 0,
                              }}
                            >
                              <FolderOutlined />
                            </div>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <h5 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1F2937" }}>
                                  {project.name}
                                </h5>
                              </div>
                              <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0 0", lineHeight: 1.4, maxWidth: 420 }}>
                                {project.description || project.slug}
                              </p>
                              <p style={{ fontSize: 11, color: "#9CA3AF", margin: "4px 0 0 0" }}>
                                {project.enabledAppCount}/{project.appCount} apps &middot; {project.slug}
                              </p>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <Button
                              type="primary"
                              size="middle"
                              className="s2s-btn-premium"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/admin/projects/${project.id}`);
                              }}
                            >
                              Open Workspace
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </Col>

        {/* Right Column */}
        <Col xs={24} xl={8}>
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.35 }}
          >
            <Card
              className="s2s-kpi-card"
              styles={{ body: { padding: 22 } }}
              style={{ marginBottom: 24 }}
            >
              <div style={{ marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Title level={4} style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1F2937" }}>
                  Quick Shortcuts
                </Title>
                <ThunderboltOutlined style={{ color: "#F7931E", fontSize: 16 }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { title: "Create New Project", description: "Set up a workspace environment", icon: <PlusOutlined />, href: "/admin/projects/new", color: "#F7931E" },
                  { title: "Explore App Library", description: "Install pre-built SaaS modules", icon: <AppstoreOutlined />, href: "/admin/app-library", color: "#009FE3" },
                  { title: "Invite Team Member", description: "Assign roles & permissions", icon: <UserAddOutlined />, href: "/admin/users", color: "#10B981" },
                ].map((action) => (
                  <div
                    key={action.title}
                    onClick={() => router.push(action.href)}
                    className="s2s-quick-action"
                  >
                    <div
                      className="s2s-quick-action-icon"
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        color: action.color,
                        flexShrink: 0,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      }}
                    >
                      {action.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text strong style={{ fontSize: 13, color: "#1F2937", display: "block", lineHeight: 1.3 }}>
                        {action.title}
                      </Text>
                      <Text style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.3 }}>{action.description}</Text>
                    </div>
                    <RightOutlined style={{ color: "#D1D5DB", fontSize: 11 }} />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
}
