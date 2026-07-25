"use client";
import { useState, useEffect } from "react";
import api from "@/api/api-context";
import route_paths from "@/helper/route_paths";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Modal,
  Tag,
  Spin,
  Steps,
  Result,
  Alert,
  message,
} from "antd";
import {
  ThunderboltOutlined,
  CheckCircleOutlined,
  RightCircleOutlined,
  ShopOutlined,
  FileTextOutlined,
  BuildOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface Preset {
  name: string;
  slug: string;
  category: string;
  description: string;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  color: string;
  features: string[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Restaurant & Cafe": <ShopOutlined />,
  "Content & Blog": <FileTextOutlined />,
  "Business & Corporate": <BuildOutlined />,
};

const categoryGradients: Record<string, string> = {
  "Restaurant & Cafe": "linear-gradient(135deg, #bd002f 0%, #97001f 100%)",
  "Content & Blog": "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
  "Business & Corporate": "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
};

export default function PresetsView() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [installing, setInstalling] = useState<string | null>(null);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [installProgress, setInstallProgress] = useState<string[]>([]);
  const [installDone, setInstallDone] = useState(false);

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    setLoading(true);
    try {
      const resp = await api.get("/api/v1/management/presets");
      const data = resp.data?.data || [];
      setPresets(data);
      const cats = Array.from(new Set(data.map((p: Preset) => p.category))) as string[];
      setCategories(cats);
    } catch {
      message.error("Failed to load presets");
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = async (preset: Preset) => {
    setSelectedPreset(preset);
    setInstallModalOpen(true);
    setInstalling(preset.slug);
    setInstallProgress([]);
    setInstallDone(false);

    try {
      const resp = await api.post(`/api/v1/management/presets/${preset.slug}/install`);

      const steps = resp.data?.data || [];
      const statuses = steps.map((s: any) => `${s.step || s.Step}: ${s.name || s.Name} — ${s.status || s.Status}`);
      setInstallProgress(statuses);

      if (resp.data?.success) {
        setInstallDone(true);
        message.success(`Preset "${preset.name}" installed successfully!`);
      }
    } catch (err: any) {
      setInstallProgress([`Error: ${err?.response?.data?.message || err.message}`]);
    } finally {
      setInstalling(null);
    }
  };

  const filteredPresets = activeCategory === "all"
    ? presets
    : presets.filter((p) => p.category === activeCategory);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <Spin size="large" tip="Loading presets..." />
      </div>
    );
  }

  return (
    <div style={{ padding: 0 }}>
      {/* Hero Section */}
      <Card
        style={{
          marginBottom: "32px",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          border: "none",
          borderRadius: "16px",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={4}>
              <Title level={2} style={{ margin: 0 }}>
                <ThunderboltOutlined style={{ marginRight: "12px" }} />
                Website Presets
              </Title>
              <Text style={{ fontSize: "16px" }}>
                Choose a preset to instantly create a complete website with all components
              </Text>
            </Space>
          </Col>
          <Col>
            <Button
              icon={<GlobalOutlined />}
              size="large"
              onClick={loadPresets}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Category Filters */}
      <Row gutter={[12, 12]} style={{ marginBottom: "24px" }}>
        <Col>
          <Tag
            color={activeCategory === "all" ? "blue" : "default"}
            style={{ padding: "4px 16px", cursor: "pointer", fontSize: "14px", borderRadius: "20px" }}
            onClick={() => setActiveCategory("all")}
          >
            All Presets
          </Tag>
        </Col>
        {categories.map((cat) => (
          <Col key={cat}>
            <Tag
              color={activeCategory === cat ? "blue" : "default"}
              style={{ padding: "4px 16px", cursor: "pointer", fontSize: "14px", borderRadius: "20px" }}
              onClick={() => setActiveCategory(cat)}
            >
              {categoryIcons[cat]} {cat}
            </Tag>
          </Col>
        ))}
      </Row>

      {/* Preset Grid */}
      {filteredPresets.length === 0 ? (
        <Alert
          message="No presets found"
          description="No presets available for this category."
          type="info"
          showIcon
        />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredPresets.map((preset) => (
            <Col xs={24} sm={12} lg={8} key={preset.slug}>
              <Card
                hoverable
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  height: "100%",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                bodyStyle={{ padding: 0 }}
              >
                {/* Card Header with gradient */}
                <div
                  style={{
                    background: categoryGradients[preset.category] || "linear-gradient(135deg, #6366f1, #4f46e5)",
                    padding: "32px 24px 24px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      marginBottom: "16px",
                    }}
                  >
                    {categoryIcons[preset.category] || <ThunderboltOutlined />}
                  </div>
                  <Title level={3} style={{ margin: 0 }}>
                    {preset.name}
                  </Title>
                  <Tag style={{ marginTop: "8px", borderRadius: "12px" }}>{preset.category}</Tag>
                </div>

                {/* Card Body */}
                <div style={{ padding: "20px 24px" }}>
                  <Paragraph
                    style={{
                      minHeight: "40px",
                      marginBottom: "16px",
                    }}
                  >
                    {preset.description}
                  </Paragraph>

                  {/* Features */}
                  <div style={{ marginBottom: "20px" }}>
                    <Text strong style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                      What you get:
                    </Text>
                    <div style={{ marginTop: "8px" }}>
                      {preset.features?.slice(0, 4).map((feature, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <CheckCircleOutlined style={{ fontSize: "12px" }} />
                          <Text style={{ fontSize: "13px" }}>{feature}</Text>
                        </div>
                      ))}
                      {preset.features?.length > 4 && (
                        <Text style={{ fontSize: "12px" }}>
                          +{preset.features.length - 4} more
                        </Text>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<ThunderboltOutlined />}
                    loading={installing === preset.slug}
                    onClick={() => handleInstall(preset)}
                    style={{
                      height: "44px",
                      borderRadius: "10px",
                      fontWeight: 600,
                      background: categoryGradients[preset.category] || "#6366f1",
                      border: "none",
                    }}
                  >
                    Install Preset
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Install Progress Modal */}
      <Modal
        title={
          <Space>
            <ThunderboltOutlined />
            Installing: {selectedPreset?.name}
          </Space>
        }
        open={installModalOpen}
        onCancel={() => {
          if (!installDone) return;
          setInstallModalOpen(false);
          setInstallDone(false);
          setInstallProgress([]);
        }}
        footer={
          installDone ? (
            <Space>
              <Button onClick={() => {
                setInstallModalOpen(false);
                setInstallDone(false);
                setInstallProgress([]);
              }}>
                Close
              </Button>
              <Button
                type="primary"
                icon={<RightCircleOutlined />}
                onClick={() => {
                  setInstallModalOpen(false);
                  setInstallDone(false);
                  setInstallProgress([]);
                  window.location.href = route_paths.pages;
                }}
              >
                View Pages
              </Button>
            </Space>
          ) : null
        }
        closable={installDone}
        width={600}
      >
        {installProgress.length > 0 ? (
          <Steps
            direction="vertical"
            size="small"
            current={installProgress.length - 1}
            items={installProgress.map((step, idx) => ({
              title: step,
              status: idx < installProgress.length - 1
                ? "finish"
                : installDone
                  ? "finish"
                  : "process",
            }))}
          />
        ) : (
          <Spin tip="Installing all components..." />
        )}

        {installDone && (
          <Result
            status="success"
            title="Installation Complete!"
            subTitle={`The "${selectedPreset?.name}" preset has been installed with all components. You can now customize everything.`}
          />
        )}
      </Modal>

      {/* Empty State */}
      {!loading && presets.length === 0 && (
        <Card style={{ textAlign: "center", padding: "48px" }}>
          <Title level={4}>No Presets Available</Title>
          <Paragraph>
            There are no presets configured. Please contact your system administrator.
          </Paragraph>
        </Card>
      )}
    </div>
  );
}
