"use client";;
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
  Divider,
  Badge,
  Tooltip
} from "antd";
import { 
  PlusOutlined, 
  DatabaseOutlined, 
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  FilterOutlined,
  ExportOutlined
} from "@ant-design/icons";
import { useState } from "react";

const { Title, Text } = Typography;
const { Search } = Input;

export default function CollectionsView({
  params
}: {
  params: { slug: string }
}) {
  const user = useSelector((state: RootState) => state.user);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  if (user.role == IRoleType.User) {
    columns?.splice(2, 1);
  }

  return (
    <div style={{ padding: '0' }}>
      {/* Header Section */}
      <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={0}>
              <Title level={2} style={{ margin: 0, color: 'white' }}>
                <DatabaseOutlined style={{ marginRight: '12px' }} />
                Collections Management
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                Manage your content collections and data structures
              </Text>
            </Space>
          </Col>
          <Col>
            <Space size="middle">
              {/* <Tooltip title="Export Collections">
                <Button 
                  icon={<ExportOutlined />} 
                  style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white'
                  }}
                >
                  Export
                </Button>
              </Tooltip> */}
              <Link href={`${route_paths.collections}/${enumCreateUpdate.create}`}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  size="large"
                  style={{ 
                    background: 'white', 
                    color: '#667eea',
                    border: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Create Collection
                </Button>
              </Link>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Collections"
              value={0}
              prefix={<DatabaseOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
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

      {/* Filters and Search */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Search
              placeholder="Search collections..."
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
                { label: 'All Collections', value: 'all' },
                { label: 'Published Only', value: 'published' },
                { label: 'Draft Only', value: 'draft' }
              ]}
            />
          </Col>
        </Row>
      </Card>

      {/* Collections Table */}
      <ECard 
        title={
          <Space>
            <DatabaseOutlined />
            <span>Collections</span>
            <Badge count={0} showZero style={{ backgroundColor: '#52c41a' }} />
          </Space>
        }
      >
        <ETable 
          columns={columns}
          url={api_points.collection.getAll}
        />
      </ECard>
    </div>
  );
}