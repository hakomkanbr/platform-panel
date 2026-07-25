"use client";
import api_points from "@/api/points";
import ECard from "@/components/elements/card";
import ETable from "@/components/elements/table";
import route_paths from "@/helper/route_paths";
import EButton from "@/components/elements/button";
import Link from "next/link";
import enumCreateUpdate from "@/abstracts/create-update";
import { RootState } from "@/lib/redux-toolkit/store";
import { IRoleType } from "@/abstracts/user/user";
import { useSelector } from "react-redux";
import columns from "./columns";
import api from "@/api/api-context";
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Typography,
  Input,
  Select,
  Badge,
  Tooltip,
  message
} from "antd";
import {
  PlusOutlined,
  LayoutOutlined,
  SearchOutlined,
  FilterOutlined,
  ThunderboltOutlined
} from "@ant-design/icons";
import { useState } from "react";

const { Title, Text } = Typography;
const { Search } = Input;

export default function ThemesView({
  params
}: {
  params: { slug: string }
}) {
  const user = useSelector((state: RootState) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft'>('all');
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const resp = await api.post('/api/v1/management/seed/themes');
      message.success(`Seeded ${resp.data?.data?.length || 0} themes`);
    } catch {
      message.error('Failed to seed themes');
    } finally {
      setSeeding(false);
    }
  };

  if (user.role == IRoleType.User) {
    columns?.splice(4, 1);
  }

  return (
    <div style={{ padding: '0' }}>
      <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={0}>
              <Title level={2} style={{ margin: 0, color: 'white' }}>
                <LayoutOutlined style={{ marginRight: '12px' }} />
                Themes Management
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                Manage your site themes and visual styles
              </Text>
            </Space>
          </Col>
          <Col>
            <Space size="middle">
              <Button
                icon={<ThunderboltOutlined />}
                size="large"
                loading={seeding}
                onClick={handleSeed}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: 'white'
                }}
              >
                Seed Themes
              </Button>
              <Link href={`${route_paths.themes}/${enumCreateUpdate.create}`}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  Create Theme
                </Button>
              </Link>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Themes"
              value={0}
              prefix={<LayoutOutlined style={{ color: '#10b981' }} />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active"
              value={0}
              prefix={<Badge status="success" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Draft"
              value={0}
              prefix={<Badge status="warning" />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Search
              placeholder="Search themes..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Filter by status"
              size="large"
              style={{ width: '100%' }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: 'All Themes', value: 'all' },
                { label: 'Active Only', value: 'active' },
                { label: 'Draft Only', value: 'draft' }
              ]}
            />
          </Col>
        </Row>
      </Card>

      <ECard
        title={
          <Space>
            <LayoutOutlined />
            <span>Themes</span>
            <Badge count={0} showZero style={{ backgroundColor: '#10b981' }} />
          </Space>
        }
      >
        <ETable
          columns={columns}
          url={api_points.theme.getAll}
        />
      </ECard>
    </div>
  );
}
