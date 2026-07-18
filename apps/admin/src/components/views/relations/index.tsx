"use client";
import api_points from "@/api/points";
import ECard from "@/components/elements/card";
import ETable from "@/components/elements/table";
import EButton from "@/components/elements/button";
import Link from "next/link";
import enumCreateUpdate from "@/abstracts/create-update";
import route_paths from "@/helper/route_paths";
import { RootState } from "@/lib/redux-toolkit/store";
import { IRoleType } from "@/abstracts/user/user";
import { useSelector } from "react-redux";
import relationsColumns from "./columns";
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
  Tooltip,
  Alert
} from "antd";
import { 
  PlusOutlined, 
  ShareAltOutlined, 
  SearchOutlined,
  NodeIndexOutlined,
  UnorderedListOutlined,
  FilterOutlined,
  ExportOutlined,
  ApiOutlined,
  GlobalOutlined,
  RocketOutlined,
  LinkOutlined
} from "@ant-design/icons";
import { useState } from "react";

const { Title, Text } = Typography;
const { Search } = Input;

export default function RelationsView({
  params
}: {
  params: { slug: string }
}) {
  const user = useSelector((state: RootState) => state.user);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'one-to-one' | 'one-to-many' | 'many-to-many'>('all');

  if (user.role == IRoleType.User) {
    relationsColumns?.splice(2, 1);
  }

  return (
    <div style={{ padding: '0' }}>
      {/* Header Section */}
      <Card style={{ 
        marginBottom: '24px', 
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        border: 'none'
      }}>
        <Row justify="space-between" align="middle">
          <Col xs={24} lg={16}>
            <Space direction="vertical" size="large">
              <div>
                <Space align="center" size="middle">
                  <Badge.Ribbon text="Headless CMS" color="gold">
                    <div style={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      padding: '12px', 
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <ShareAltOutlined style={{ fontSize: '32px', color: 'white' }} />
                    </div>
                  </Badge.Ribbon>
                </Space>
                <div style={{ marginTop: '16px' }}>
                  <Title level={2} style={{ margin: 0, color: 'white' }}>
                    Relations Management
                  </Title>
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                    Define and manage relationships between collections in your headless CMS
                  </Text>
                </div>
              </div>
              
              <Space size="large">
                <Space align="center">
                  <Badge color="#52c41a" />
                  <Text style={{ color: 'white' }}>One-to-One</Text>
                </Space>
                <Space align="center">
                  <Badge color="#1890ff" />
                  <Text style={{ color: 'white' }}>One-to-Many</Text>
                </Space>
                <Space align="center">
                  <Badge color="#722ed1" />
                  <Text style={{ color: 'white' }}>Many-to-Many</Text>
                </Space>
              </Space>
            </Space>
          </Col>
          
          <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {/* <Tooltip title="View API Documentation">
                <Button 
                  icon={<ApiOutlined />} 
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white'
                  }}
                  block
                >
                  API Docs
                </Button>
              </Tooltip> */}
              <Link href={`${route_paths.relations}/${enumCreateUpdate.create}`}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  size="large"
                  style={{ 
                    backgroundColor: 'white', 
                    borderColor: 'white',
                    color: '#ff6b6b',
                    fontWeight: 600
                  }}
                  block
                >
                  Create Relation
                </Button>
              </Link>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Info Alert */}
      <Alert
        message="Relations in Headless CMS"
        description="Relations define how collections are connected to each other. They enable complex data structures and are automatically handled in API responses with proper joins and nested data."
        type="info"
        icon={<RocketOutlined />}
        style={{ marginBottom: '24px' }}
        showIcon
        // action={
        //   <Button size="small" type="link">
        //     Learn More
        //   </Button>
        // }
      />

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Relations"
              value={0}
              prefix={<ShareAltOutlined style={{ color: '#ff6b6b' }} />}
              valueStyle={{ color: '#ff6b6b' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Active relations
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="One-to-One"
              value={0}
              prefix={<LinkOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Direct relations
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="One-to-Many"
              value={0}
              prefix={<NodeIndexOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Parent-child relations
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Many-to-Many"
              value={0}
              prefix={<GlobalOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Complex relations
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Search
              placeholder="Search relations..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Filter by type"
              size="large"
              style={{ width: '100%' }}
              value={filterType}
              onChange={setFilterType}
              options={[
                { label: 'All Relations', value: 'all' },
                { label: 'One-to-One', value: 'one-to-one' },
                { label: 'One-to-Many', value: 'one-to-many' },
                { label: 'Many-to-Many', value: 'many-to-many' }
              ]}
            />
          </Col>
        </Row>
      </Card>

      {/* Relations Table */}
      <ECard 
        title={
          <Space>
            <ShareAltOutlined />
            <span>Relations</span>
            {/* <Badge count={0} showZero style={{ backgroundColor: '#ff6b6b' }} />
            <Badge.Ribbon text="API Ready" color="blue" style={{ right: -10 }} /> */}
          </Space>
        }
        // extra={
        //   <Space>
        //     <EButton 
        //       type="primary" 
        //       href={`${route_paths.relations}/${enumCreateUpdate.create}`}
        //     >
        //       <PlusOutlined /> Create Relation
        //     </EButton>
        //   </Space>
        // }
      >
        <ETable 
          columns={relationsColumns}
          url={api_points.relation.getAll}
        />
      </ECard>
    </div>
  );
}