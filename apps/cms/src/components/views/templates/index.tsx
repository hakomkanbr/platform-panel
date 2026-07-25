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

export default function TemplatesView({
  params
}: {
  params: { slug: string }
}) {
  const user = useSelector((state: RootState) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  const [seeding, setSeeding] = useState(false);
  const [seedingRestaurant, setSeedingRestaurant] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const resp = await api.post('/api/v1/management/seed/templates');
      message.success(`Seeded ${resp.data?.data?.length || 0} templates`);
    } catch {
      message.error('Failed to seed templates');
    } finally {
      setSeeding(false);
    }
  };

  const handleSeedRestaurant = async () => {
    setSeedingRestaurant(true);
    try {
      await api.post('/api/v1/management/seed/restaurant');
      message.success('Restaurant demo data seeded successfully!');
    } catch {
      message.error('Failed to seed restaurant data');
    } finally {
      setSeedingRestaurant(false);
    }
  };

  if (user.role == IRoleType.User) {
    columns?.splice(3, 1);
  }

  return (
    <div style={{ padding: '0' }}>
      <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={0}>
              <Title level={2} style={{ margin: 0 }}>
                <LayoutOutlined style={{ marginRight: '12px' }} />
                Templates Management
              </Title>
              <Text style={{ fontSize: '16px' }}>
                Manage your design templates and layouts
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
                Seed Templates
              </Button>
              <Button
                icon={<ThunderboltOutlined />}
                size="large"
                loading={seedingRestaurant}
                onClick={handleSeedRestaurant}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: 'white'
                }}
              >
                Seed Restaurant Demo
              </Button>
              <Link href={`${route_paths.templates}/${enumCreateUpdate.create}`}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                >
                  Create Template
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
              title="Total Templates"
              value={0}
              prefix={<LayoutOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Published"
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
              placeholder="Search templates..."
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
                { label: 'All Templates', value: 'all' },
                { label: 'Published Only', value: 'published' },
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
            <span>Templates</span>
            <Badge count={0} showZero style={{ backgroundColor: '#722ed1' }} />
          </Space>
        }
      >
        <ETable
          columns={columns}
          url={api_points.template.getAll}
        />
      </ECard>
    </div>
  );
}
