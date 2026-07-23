"use client";

import { useState, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Typography,
  Input,
  Tag,
  Radio,
  Empty,
  Spin,
  Select,
  message,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  TeamOutlined,
  DollarOutlined,
  BarChartOutlined,
  MailOutlined,
  CloudOutlined,
  SafetyOutlined,
  ApiOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import {
  useAppCatalog,
  useProjects,
  useEnableApp,
  useDisableApp,
  useProject,
} from "@/hooks/useApps";
import { useTenantId } from "@/hooks/useTenantId";
import { StatSkeleton } from "@/components/common/SkeletonLoader";

const { Title, Text } = Typography;

const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  commerce: {
    label: "Commerce",
    color: "#F7931E",
    icon: <ShoppingCartOutlined />,
  },
  content: { label: "Content", color: "#10b981", icon: <FileTextOutlined /> },
  business: { label: "Business", color: "#f59e0b", icon: <TeamOutlined /> },
  finance: { label: "Finance", color: "#ef4444", icon: <DollarOutlined /> },
  analytics: {
    label: "Analytics",
    color: "#F7931E",
    icon: <BarChartOutlined />,
  },
  marketing: { label: "Marketing", color: "#06b6d4", icon: <MailOutlined /> },
  operations: {
    label: "Operations",
    color: "#ec4899",
    icon: <CloudOutlined />,
  },
};

function getAppIcon(capabilityCode: string): React.ReactNode {
  const code = capabilityCode?.toLowerCase() || "";
  if (code.includes("cms") || code.includes("content"))
    return <FileTextOutlined />;
  if (
    code.includes("commerce") ||
    code.includes("shop") ||
    code.includes("ecom")
  )
    return <ShoppingCartOutlined />;
  if (code.includes("crm") || code.includes("customer"))
    return <TeamOutlined />;
  if (
    code.includes("invoice") ||
    code.includes("billing") ||
    code.includes("finance")
  )
    return <DollarOutlined />;
  if (code.includes("analytics") || code.includes("metric"))
    return <BarChartOutlined />;
  if (code.includes("email") || code.includes("market"))
    return <MailOutlined />;
  if (code.includes("storage") || code.includes("file"))
    return <CloudOutlined />;
  if (code.includes("auth") || code.includes("sso")) return <SafetyOutlined />;
  if (code.includes("api") || code.includes("gateway")) return <ApiOutlined />;
  return <FileTextOutlined />;
}

function getAppColor(capabilityCode: string): string {
  const code = capabilityCode?.toLowerCase() || "";
  if (code.includes("cms") || code.includes("content")) return "#10b981";
  if (code.includes("commerce") || code.includes("shop")) return "#F7931E";
  if (code.includes("crm") || code.includes("customer")) return "#f59e0b";
  if (code.includes("invoice") || code.includes("billing")) return "#ef4444";
  if (code.includes("analytics")) return "#F7931E";
  if (code.includes("email") || code.includes("market")) return "#06b6d4";
  if (code.includes("storage") || code.includes("file")) return "#ec4899";
  if (code.includes("auth") || code.includes("sso")) return "#14b8a6";
  if (code.includes("api") || code.includes("gateway")) return "#f97316";
  return "#009FE3";
}

function extractCategory(capabilityCode: string): string {
  const code = capabilityCode?.toLowerCase() || "";
  if (
    code.includes("cms") ||
    code.includes("content") ||
    code.includes("publish")
  )
    return "content";
  if (
    code.includes("commerce") ||
    code.includes("shop") ||
    code.includes("ecom") ||
    code.includes("store")
  )
    return "commerce";
  if (code.includes("crm") || code.includes("customer")) return "business";
  if (
    code.includes("invoice") ||
    code.includes("billing") ||
    code.includes("payment")
  )
    return "finance";
  if (
    code.includes("analytics") ||
    code.includes("metric") ||
    code.includes("report")
  )
    return "analytics";
  if (
    code.includes("email") ||
    code.includes("market") ||
    code.includes("campaign")
  )
    return "marketing";
  return "operations";
}

export default function AppLibraryPage() {
  const router = useRouter();
  const tenantId = useTenantId();
  const { data: appCatalog = [], isLoading: catalogLoading } = useAppCatalog();
  const { data: projects = [], isLoading: projectsLoading } =
    useProjects(tenantId);
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(undefined);
  const { data: projectDetail } = useProject(selectedProjectId || "", tenantId);
  const enableApp = useEnableApp();
  const disableApp = useDisableApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const enabledAppCatalogIds = useMemo(() => {
    if (!projectDetail?.apps) return new Set<string>();
    return new Set(
      projectDetail.apps.filter((a) => a.isEnabled).map((a) => a.appCatalogId),
    );
  }, [projectDetail]);

  const allEnabledAppCatalogIds = useMemo(() => {
    const ids = new Set<string>();
    projects.forEach((p) => {
      if (p.appCount > 0) {
        projects
          .filter((pr) => pr.id === p.id)
          .forEach((pr) => {
            if (pr.enabledAppCount > 0) ids.add(pr.id);
          });
      }
    });
    return ids;
  }, [projects]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    appCatalog.forEach((app) => cats.add(extractCategory(app.capabilityCode)));
    return Array.from(cats).map((key) => ({
      key,
      label:
        CATEGORY_CONFIG[key]?.label ||
        key.charAt(0).toUpperCase() + key.slice(1),
    }));
  }, [appCatalog]);

  const filtered = useMemo(() => {
    return appCatalog.filter((app) => {
      const matchSearch =
        app.displayName?.toLowerCase().includes(search.toLowerCase()) ||
        app.name?.toLowerCase().includes(search.toLowerCase()) ||
        app.description?.toLowerCase().includes(search.toLowerCase()) ||
        app.capabilityCode?.toLowerCase().includes(search.toLowerCase());
      const appCategory = extractCategory(app.capabilityCode);
      const matchCategory = category === "all" || appCategory === category;
      return matchSearch && matchCategory;
    });
  }, [appCatalog, search, category]);

  const isLoading = catalogLoading;

  if (isLoading) {
    return (
      <div className="platform-page">
        <div style={{ marginBottom: 32 }}>
          <Title
            level={2}
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            App Library
          </Title>
          <Text
            style={{
              color: "var(--text-secondary)",
              fontSize: 14,
              display: "block",
              marginTop: 6,
            }}
          >
            Browse and install applications for your projects
          </Text>
        </div>
        <StatSkeleton />
      </div>
    );
  }

  const handleInstall = async (appCatalogId: string) => {
    if (!selectedProjectId) {
      message.warning("Please select a project first");
      return;
    }
    await enableApp.mutateAsync({
      projectId: selectedProjectId,
      request: { appCatalogId },
      tenantId,
    });
  };

  const handleUninstall = async (appCatalogId: string) => {
    if (!selectedProjectId) {
      message.warning("Please select a project first");
      return;
    }
    await disableApp.mutateAsync({
      projectId: selectedProjectId,
      request: { appCatalogId },
      tenantId,
    });
  };

  const isInstalledInProject = (appCatalogId: string) => {
    if (!selectedProjectId || !enabledAppCatalogIds) return false;
    return enabledAppCatalogIds.has(appCatalogId);
  };

  return (
    <div className="platform-page">
      <div style={{ marginBottom: 32 }}>
        <Title
          level={2}
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          App Library
        </Title>
        <Text
          style={{
            color: "var(--text-secondary)",
            fontSize: 14,
            display: "block",
            marginTop: 6,
          }}
        >
          Browse and install applications for your projects
        </Text>
      </div>

      {/* Search and Filters */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 28,
          flexWrap: "wrap",
        }}
      >
        <Input
          prefix={<SearchOutlined style={{ color: "var(--text-tertiary)" }} />}
          placeholder="Search applications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: 320,
            height: 44,
            borderRadius: 12,
            border: "1px solid var(--border)",
          }}
        />
        <Radio.Group
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          optionType="button"
          buttonStyle="solid"
          size="large"
          style={{ display: "flex", flexWrap: "wrap", gap: 4 }}
        >
          <Radio.Button
            key="all"
            value="all"
            style={{
              borderRadius: 8,
              height: 36,
              lineHeight: "36px",
              fontSize: 13,
              border: "1px solid var(--border)",
              margin: 0,
            }}
          >
            All
          </Radio.Button>
          {categories.map((cat) => (
            <Radio.Button
              key={cat.key}
              value={cat.key}
              style={{
                borderRadius: 8,
                height: 36,
                lineHeight: "36px",
                fontSize: 13,
                border: "1px solid var(--border)",
                margin: 0,
              }}
            >
              {cat.label}
            </Radio.Button>
          ))}
        </Radio.Group>

        <Select
          placeholder="Select project (optional)"
          allowClear
          style={{ width: 240, borderRadius: 12 }}
          value={selectedProjectId}
          onChange={(val) => setSelectedProjectId(val)}
          options={projects.map((p) => ({ label: p.name, value: p.id }))}
        />
      </div>

      {/* App Cards Grid */}
      {filtered.length === 0 ? (
        <Card style={{ borderRadius: 16, padding: 48 }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction="vertical" align="center">
                <Text type="secondary" style={{ fontSize: 14 }}>
                  No applications found
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {search
                    ? "Try a different search term"
                    : "No applications available in the catalog"}
                </Text>
              </Space>
            }
          />
        </Card>
      ) : (
        <Row gutter={[20, 20]}>
          {filtered.map((app) => {
            const appColor = getAppColor(app.capabilityCode);
            const installed = isInstalledInProject(app.id);
            return (
              <Col xs={24} sm={12} lg={8} key={app.id}>
                <Card
                  hoverable
                  className="platform-card app-library-card"
                  style={{
                    borderRadius: 16,
                    cursor: "default",
                    height: "100%",
                    transition: "all 0.25s ease",
                  }}
                  styles={{
                    body: {
                      padding: 28,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    },
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: `${appColor}10`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                      color: appColor,
                      marginBottom: 18,
                      transition: "all 0.25s ease",
                    }}
                    className="app-icon"
                  >
                    {getAppIcon(app.capabilityCode)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <Title
                        level={4}
                        style={{ margin: 0, fontSize: 17, fontWeight: 600 }}
                      >
                        {app.displayName || app.name}
                      </Title>
                      <Tag
                        style={{
                          borderRadius: 6,
                          fontSize: 11,
                          margin: 0,
                          border: "none",
                          fontWeight: 500,
                          padding: "0 10px",
                          lineHeight: "22px",
                          background: installed ? "#D1FAE5" : "#F3F4F6",
                          color: installed ? "#065F46" : "#6B7280",
                        }}
                      >
                        {installed ? "Installed" : "Available"}
                      </Tag>
                    </div>
                    <Text
                      style={{
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                        display: "block",
                      }}
                    >
                      {app.description}
                    </Text>
                    {app.capabilityCode && (
                      <Text
                        style={{
                          fontSize: 11,
                          color: "var(--text-tertiary)",
                          display: "block",
                          marginTop: 4,
                        }}
                      >
                        {app.capabilityCode}
                      </Text>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginTop: 20,
                      paddingTop: 18,
                      borderTop: "1px solid var(--border-light)",
                    }}
                  >
                    <Button
                      type="primary"
                      size="middle"
                      style={{
                        flex: 1,
                        borderRadius: 10,
                        height: 38,
                        fontSize: 13,
                      }}
                      icon={<EyeOutlined />}
                      onClick={() =>
                        selectedProjectId
                          ? router.push(`/admin/projects/${selectedProjectId}`)
                          : router.push("/admin/projects")
                      }
                    >
                      Open
                    </Button>
                    <Button
                      size="middle"
                      style={{ borderRadius: 10, height: 38, fontSize: 13 }}
                      onClick={() => router.push(`/admin/projects`)}
                    >
                      Create Project
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}
