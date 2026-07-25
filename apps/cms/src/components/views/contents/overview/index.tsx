"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/api-context";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Spin,
  Tag,
  Button,
  Statistic,
  Alert,
} from "antd";
import {
  FileTextOutlined,
  PlusOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface ModuleSummary {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  fieldCount: number;
  contentCount: number;
}

export default function ContentsOverview() {
  const [modules, setModules] = useState<ModuleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    setLoading(true);
    try {
      const resp = await api.get("/api/v1/cms/modules");
      setModules(resp.data?.data || []);
    } catch {
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
        <Spin size="large" tip="Loading modules..." />
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <Card>
        <Alert
          message="No Modules Found"
          description="Create a module first, then you can add content to it."
          type="info"
          showIcon
          action={
            <Button type="primary" onClick={() => router.push("/admin/modules")}>
              Go to Modules
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <div>
      <Row gutter={[24, 24]}>
        {modules.map((mod) => (
          <Col xs={24} sm={12} lg={8} key={mod.id}>
            <Card
              hoverable
              style={{ borderRadius: "12px", height: "100%" }}
              onClick={() => router.push(`/admin/${mod.slug}/contents`)}
            >
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Space>
                    <FileTextOutlined style={{ fontSize: "20px", color: "#6366f1" }} />
                    <Title level={4} style={{ margin: 0 }}>{mod.name}</Title>
                  </Space>
                  <Tag>{mod.slug}</Tag>
                </div>

                <Text style={{ color: "rgba(255,255,255,0.6)" }}>
                  {mod.description || "No description"}
                </Text>

                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="Fields"
                      value={mod.fieldCount || 0}
                      valueStyle={{ fontSize: "18px" }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Contents"
                      value={mod.contentCount || 0}
                      valueStyle={{ fontSize: "18px", color: "#6366f1" }}
                    />
                  </Col>
                </Row>

                <Button
                  type="primary"
                  block
                  icon={<RightCircleOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/admin/${mod.slug}/contents`);
                  }}
                >
                  Manage Contents
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
