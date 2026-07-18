'use client';

import { useState } from "react";
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
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

const categories = [
  { key: "all", label: "All" },
  { key: "business", label: "Business" },
  { key: "commerce", label: "Commerce" },
  { key: "content", label: "Content" },
  { key: "finance", label: "Finance" },
  { key: "operations", label: "Operations" },
  { key: "marketing", label: "Marketing" },
  { key: "analytics", label: "Analytics" },
];

interface AppItem {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  status: "installed" | "available" | "coming-soon";
  color: string;
}

const applications: AppItem[] = [
  { id: 1, name: "Ecommerce", description: "Full online store with cart, payments, and inventory management", icon: <ShoppingCartOutlined />, category: "commerce", status: "available", color: "#6366f1" },
  { id: 2, name: "CMS", description: "Content management system with rich editor and media library", icon: <FileTextOutlined />, category: "content", status: "installed", color: "#10b981" },
  { id: 3, name: "CRM", description: "Customer relationship management with pipeline tracking", icon: <TeamOutlined />, category: "business", status: "available", color: "#f59e0b" },
  { id: 4, name: "Invoicing", description: "Send invoices, track payments, and manage billing", icon: <DollarOutlined />, category: "finance", status: "coming-soon", color: "#ef4444" },
  { id: 5, name: "Analytics", description: "Track metrics, create dashboards, and visualize data", icon: <BarChartOutlined />, category: "analytics", status: "available", color: "#8b5cf6" },
  { id: 6, name: "Email Marketing", description: "Design and send email campaigns to your audience", icon: <MailOutlined />, category: "marketing", status: "coming-soon", color: "#06b6d4" },
  { id: 7, name: "File Storage", description: "Secure cloud storage for documents and media", icon: <CloudOutlined />, category: "operations", status: "available", color: "#ec4899" },
  { id: 8, name: "Authentication", description: "User authentication with SSO and MFA support", icon: <SafetyOutlined />, category: "operations", status: "installed", color: "#14b8a6" },
  { id: 9, name: "API Gateway", description: "Manage, secure, and monitor your API endpoints", icon: <ApiOutlined />, category: "operations", status: "available", color: "#f97316" },
];

const statusConfig = {
  installed: { label: "Installed", color: "var(--success)", bg: "var(--success-light)" },
  available: { label: "Available", color: "var(--primary)", bg: "var(--primary-light)" },
  "coming-soon": { label: "Coming Soon", color: "var(--text-tertiary)", bg: "var(--bg-subtle)" },
};

export default function AppLibraryPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = applications.filter((app) => {
    const matchSearch = app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || app.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="platform-page">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em" }}>
          App Library
        </Title>
        <Text style={{ color: "var(--text-secondary)", fontSize: 14, display: "block", marginTop: 6 }}>
          Browse and install applications for your projects
        </Text>
      </div>

      {/* Search and Filters */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <Input
          prefix={<SearchOutlined style={{ color: "var(--text-tertiary)" }} />}
          placeholder="Search applications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 320, height: 44, borderRadius: 12, border: "1px solid var(--border)" }}
        />
        <Radio.Group
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          optionType="button"
          buttonStyle="solid"
          size="large"
          style={{ display: "flex", flexWrap: "wrap", gap: 4 }}
        >
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
      </div>

      {/* App Cards Grid */}
      <Row gutter={[20, 20]}>
        {filtered.map((app) => {
          const status = statusConfig[app.status];
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
                bodyStyle={{ padding: 28, display: "flex", flexDirection: "column", height: "100%" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: `${app.color}10`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    color: app.color,
                    marginBottom: 18,
                    transition: "all 0.25s ease",
                  }}
                  className="app-icon"
                >
                  {app.icon}
                </div>

                {/* Name & Description */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <Title level={4} style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>
                      {app.name}
                    </Title>
                    <Tag
                      style={{
                        borderRadius: 6,
                        fontSize: 11,
                        margin: 0,
                        background: status.bg,
                        color: status.color,
                        border: "none",
                        fontWeight: 500,
                        padding: "0 10px",
                        lineHeight: "22px",
                      }}
                    >
                      {status.label}
                    </Tag>
                  </div>
                  <Text style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, display: "block" }}>
                    {app.description}
                  </Text>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 10, marginTop: 20, paddingTop: 18, borderTop: "1px solid var(--border-light)" }}>
                  {app.status === "installed" && (
                    <>
                      <Button type="primary" size="middle" style={{ flex: 1, borderRadius: 10, height: 38, fontSize: 13 }}
                        onClick={() => router.push("/admin/projects")}>
                        Open
                      </Button>
                      <Button size="middle" style={{ borderRadius: 10, height: 38, fontSize: 13 }}>Configure</Button>
                    </>
                  )}
                  {app.status === "available" && (
                    <>
                      <Button type="primary" size="middle" style={{ flex: 1, borderRadius: 10, height: 38, fontSize: 13 }}>
                        Install
                      </Button>
                      <Button size="middle" style={{ borderRadius: 10, height: 38, fontSize: 13 }}>Learn More</Button>
                    </>
                  )}
                  {app.status === "coming-soon" && (
                    <Button size="middle" style={{ flex: 1, borderRadius: 10, height: 38, fontSize: 13 }} disabled>
                      Coming Soon
                    </Button>
                  )}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
